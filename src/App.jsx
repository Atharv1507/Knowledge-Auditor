import "./App.css";
import Bookmark from "./Bookmark.jsx";
import Task from "./Task.jsx";
import { useState, useEffect } from "react";
import AuthPage from "./Auth/Authpage.jsx";
import { supabase } from "./supaBaseClient";
import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

async function GeminiCall(projs, urls, setLoading, setRelevantLinks,getTitleByUrl) {
  if (!projs?.length || !urls?.length) return;

  setLoading(true);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      systemInstruction: {
        role: "system",
        parts: [
          {
            text: `OUTPUT ONLY RAW JSON. NO MARKDOWN. NO BACKTICKS.
            
            
You are a JSON Data Processing Engine.

TASK:
  MAP PROJECT NAMES  against URLS based on the context match of title and descriptions of projects and url objects RETURN ONLY the mapped object and NO PREAMBLE NO MARKDOWN.

RULES:
  1.REUSE OF LINKS: You may reuse a link IF relevant to more than one project. 
  - Judge relevance in this order project_details -> project name. with url DESCRIPTION -> url title
  2.STRICT MATCHING: Rejects unrelated content that do not relate to the current project(e.g. Music videos or Content videos for Coding projects).
  3.If UNSURE of the relevance REJECT the url for the current project.
  4.STRICTLY RETURN ONLY OBJECT NOTHING ELSE`,
          },
        ],
      },
      // CHANGE ONLY THE GENERATION CONFIG
generationConfig: {
  responseMimeType: "application/json",
  temperature: 0,
  responseSchema: {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        projectId: { type: "STRING" },
        relevantUrls: { 
          type: "ARRAY", 
          items: { type: "STRING" } 
        }
      },
      required: ["projectId", "relevantUrls"]
    }
  }
},
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `.Return ONLY the mapped OBJECT as follows. {project_id:[urls.url]}
              PROJECTS: ${JSON.stringify(projs)}
              CONTENT: ${JSON.stringify(urls)}`,
            },
          ],
        },
      ],
    });

    let responseText = "";

    if (response.response && typeof response.response.text === "function") {
      responseText = response.response.text();
    } else if (response.candidates && response.candidates.length > 0) {
      responseText = response.candidates[0].content?.parts?.[0]?.text || "";
    } else {
      throw new Error("Empty Response");
    }

    const cleanJson = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleanJson);
    await setRelevantLinks(result,getTitleByUrl)
    console.log(result)
  } catch (error) {
    console.error("Gemini Error:", error);
  } finally {
    setLoading(false);
  }


}

const listModels = async () => {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await response.json();
  console.log("Available models:", data.models.map(m => m.name));
};



async function setRelevantLinks(matches, getTitleByUrl) {
  const entries=Object.entries(matches)
  console.log(entries)
  for (const entry of entries) {
    const projectId=entry[0];
    const titleToUrlMap=getTitleByUrl(entry[1])
    
    
    console.log("Saving Mapped Object:",titleToUrlMap );
    
    const { error } = await supabase
    .from("Tasks")
    .update({links: titleToUrlMap })
    .eq("proj_id", projectId);
    
    if (error) {
      console.error("Supabase Error:", error.message);
    }
  }
}

function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [bookmarkLinks, setBookmarkLinks] = useState([]);
  const [projs, setProjs] = useState([]);
  
  function getTitleByUrl(urlsToFind) {
    const Titleobj={}
    for(let ur of urlsToFind){
      bookmarkLinks.find((obj)=>{
        if(obj.url===ur){
          Titleobj[obj.title]=ur;
        }
      })
    }
    return Titleobj
}
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading your workspace...</div>;
  }

  if (currentUser) {
    return (
      <>
        <div className="navBar">
          <div>
            <h1>Knowledge Auditor</h1>
            <h3>Welcome, {currentUser.user_metadata?.full_name || "User"}</h3>
          </div>

          <button
            className="primary-button"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div>

        <div className="app-root">
          <Task setProjs={setProjs} />
          <Bookmark setBookmarkLinks={setBookmarkLinks} />
        </div>

        <div className="btnContainer">
          <button
            id="callGemini"
            className="primary-button"
            onClick={() => {
              GeminiCall(projs, bookmarkLinks, setLoading, setRelevantLinks,getTitleByUrl);
            }}
          >
            Map Links
          </button>
        </div>
      </>
    );
  }

  return <AuthPage setLoading={setLoading} setCurrentUser={setCurrentUser} />;
}

export default App;
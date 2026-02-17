import { useEffect, useRef, useState } from "react";
import "./Bookmark.css";
import { supabase } from "./supaBaseClient";

async function getMetadata(url) {
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");

  try {
    if (isYouTube) {
      // STRATEGY A: Use YouTube's official oEmbed endpoint (via noembed wrapper)
      // This is 100% reliable for Titles and Thumbnails on YouTube.
      const response = await fetch(`https://noembed.com/embed?url=${url}`);
      const data = await response.json();

      // Note: YouTube oEmbed does NOT provide the full video description text
      return {
        url: url,
        title: data.title || "Unknown Video",
        description: `Video by ${data.author_name}`, // Fallback since description isn't available
        image: data.thumbnail_url || "",
      };
    } else {
      // STRATEGY B: Use Microlink for everything else (Blogs, Articles, etc.)
      const response = await fetch(
        `https://api.microlink.io?url=${encodeURIComponent(url)}`,
      );
      const { data } = await response.json();

      return {
        url: url,
        title: data.title || "No Title",
        description: data.description || "",
        image: data.image?.url || "",
      };
    }
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    return { url: url, title: url, description: "Metadata fetch failed" };
  }
}

async function saveData(url_) {
  const urlMetaData = await getMetadata(url_);
  console.log("Metadata received:", urlMetaData);

  const { data, error } = await supabase
    .from("Bookmarks")
    .insert([
      {
        url: urlMetaData.url,
        title: urlMetaData.title,
        description: urlMetaData.description,
      },
    ])
    .select();

  if (error) {
    console.error("Supabase Error:", error.message);
  }
}

function generateRandomId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
}

async function fetchData(setList, setBookmarkLinks) {
  const { data, error } = await supabase.from("Bookmarks").select();
  if (error) {
    console.error(error);
  } else {
    const listWithRandomKeys = data.map((item) => ({
      ...item,
      customKey: generateRandomId(),
    }));

    setList(listWithRandomKeys);
    setBookmarkLinks(listWithRandomKeys);
  }
}
async function deleteBookmark(urlId) {
  const { data, error } = await supabase
    .from("Bookmarks")
    .delete()
    .eq("url_id", urlId)
    .select();
  if (error) {
    console.error(error);
  } else {
    window.location.reload();
    //trigger confirm modal
  }
}
function Bookmark({ setBookmarkLinks }) {
  const [text, setText] = useState("");
  const [list, setList] = useState([]);
  const addBookmarkBtn = useRef();

  useEffect(() => {
    fetchData(setList, setBookmarkLinks);
  }, []);
  function handleDel(url_id) {
    deleteBookmark(url_id);
  }
  function handleChange(event) {
    setText(event.target.value);
  }

  async function addBookmark() {
    const trimmed = text.trim();
    addBookmarkBtn.disabled = true;
    if (trimmed === "") {
      return;
    }
    setText("");
    await saveData(trimmed);
    await fetchData(setList, setBookmarkLinks);
    addBookmarkBtn.disabled = false;
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  }

  return (
    <div className="bookmark-container">
      <div className="add-bookmark">
        <div className="add-bookmark-title">Add a new bookmark</div>
        <form
          action=""
          onSubmit={(e) => {
            e.preventDefault();
            addBookmark();
          }}
        >
          <input
            type="url"
            placeholder="https://google.com"
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />

          <button type="submit" className="primary-button" ref={addBookmarkBtn}>
            Add bookmark
          </button>
        </form>
      </div>

      <div className="existing-bookmark">
        <h3>Your bookmarks</h3>
        <ul className="existing-bookmark-list">
          {list.map((item) => (
            <div
              key={item.customKey}
              className="existing-bookmark-item"
              draggable // 1. Make it draggable
              onDragStart={(e) => {

                const dragData = JSON.stringify({
                  title: item.title,
                  url: item.url,
                });
                e.dataTransfer.setData("application/json", dragData);
                e.dataTransfer.effectAllowed = "copy";
              }}
              style={{ cursor: "grab" }}
            >
            
              <svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" className="trash_icon"  viewBox="0 0 15 15 "
              data-id={item.url_id}
                onClick={(e) => { 
                  handleDel(e.target.dataset.id); 
                }}
              >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
              <a href={item.url} target="_blank" rel="noreferrer">
                {item.title}{" "}
              </a>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Bookmark;

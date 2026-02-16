import { useEffect, useState } from 'react'
import './Bookmark.css'
import { supabase } from './supaBaseClient';

async function getMetadata(url) {
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');

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
        image: data.thumbnail_url || ""
      };
    } else {
      // STRATEGY B: Use Microlink for everything else (Blogs, Articles, etc.)
      const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
      const { data } = await response.json();
      
      return {
        url: url,
        title: data.title || "No Title",
        description: data.description || "",
        image: data.image?.url || ""
      };
    }
  } catch (error) {
    console.error("Metadata fetch failed:", error);
    return { url: url, title: url, description: "Metadata fetch failed" };
  }
}


async function saveData(url_) {
  const urlMetaData = await getMetadata(url_)
  console.log("Metadata received:", urlMetaData)

  const { data, error } = await supabase
    .from('Bookmarks')
    .insert([{
      url:  urlMetaData.url,
      title: urlMetaData.title,
      description: urlMetaData.description
    }]).select()
  
  if (error) {
    console.error("Supabase Error:", error.message);
  }
}

function generateRandomId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
}

async function fetchData(setList,setBookmarkLinks){
    const {data,error}= await supabase.from('Bookmarks').select();
    if(error){
      console.error(error)
    }

    else {
      const listWithRandomKeys = data.map(item => ({
        ...item,
        customKey: generateRandomId() 
      }));
      
      setList(listWithRandomKeys)
      setBookmarkLinks(listWithRandomKeys)
    }
    }
async function deleteBookmark(urlId) {
  const {data,error}= await supabase.from('Bookmarks').delete().eq("url_id",urlId).select();
    if(error){
      console.error(error)
    }

    else {
      //trigger confirm modal

    }
  }
function Bookmark({setBookmarkLinks}) {
  // text in the textarea
  const [text, setText] = useState('')
  // list of all bookmarks
  const [list, setList] = useState([])
  useEffect(()=>{
    fetchData(setList,setBookmarkLinks)
  },[])
  function handleDel(url_id){
    deleteBookmark(url_id)
  }
  function handleChange(event) {
    setText(event.target.value)
  }

  async function addBookmark() {
    const trimmed = text.trim()
    if (trimmed === '') {
      return
    }
    setText('')
    await saveData(trimmed);
    fetchData(setList,setBookmarkLinks)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }
 

  return (
    <div className="bookmark-container">
      <div className="add-bookmark">
        <div className="add-bookmark-title">Add a new bookmark</div>
        <form action="" onSubmit={(e)=>{e.preventDefault()
      addBookmark()

        }}>
        <input
          type='url'
          placeholder="https://google.com"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          />

        <button
          type="submit"
          className="primary-button"
          >
          Add bookmark
        </button>
        </form>
      </div>

      <div className="existing-bookmark">
        <h3>Your bookmarks</h3>
        <ul className="existing-bookmark-list">
          {list.map((item) => (
            <div key={item.customKey} className="existing-bookmark-item">
             <a href={item.url} target='_blank'>{item.title} </a>
             <p data-id={item.url_id} onClick={(e)=>{handleDel(e.target.dataset.id)}}>🗑️</p>
            </div>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Bookmark

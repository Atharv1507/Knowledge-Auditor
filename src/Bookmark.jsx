import { useEffect, useState } from 'react'
import './Bookmark.css'
import { supabase } from './supaBaseClient';

async function saveData(url_) {
  const { data, error } = await supabase
    .from('Bookmarks')
    .insert([{
      url: url_
    }]).select()
  
  if (error) {
    console.error("Supabase Error Details:", error.message, error.details, error.hint);
    return;
  }
}
async function fetchData(setList){
    const {data,error}= await supabase.from('Bookmarks').select();
    if(error){
      console.error(error)
    }
    else{
      setList(data)
    }
}

function Bookmark() {
  // text in the textarea
  const [text, setText] = useState('')
  // list of all bookmarks
  const [list, setList] = useState([])
  useEffect(()=>{
    fetchData(setList)
  },[])
  function handleChange(event) {
    setText(event.target.value)
  }

  async function addBookmark() {
    const trimmed = text.trim()
    if (trimmed === '') {
      return
    }

    await saveData(trimmed);
    fetchData(setList)
    setText('')
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      addBookmark()
    }
  }

  return (
    <div className="bookmark-container">
      <div className="add-bookmark">
        <div className="add-bookmark-title">Add a new bookmark</div>

        <textarea
          placeholder="Add your notes/links here"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <button
          type="button"
          className="primary-button"
          onClick={addBookmark}
        >
          Add bookmark
        </button>
      </div>

      <div className="existing-bookmark">
        <h3>Your bookmarks</h3>
        <ul className="existing-bookmark-list">
          {list.map((item) => (
            <li key={item.url_id} className="existing-bookmark-item">
              {item.url}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Bookmark

import { useState } from 'react'
import './Bookmark.css'

function Bookmark() {
  // text in the textarea
  const [text, setText] = useState('')
  // list of all bookmarks
  const [list, setList] = useState([])

  function handleChange(event) {
    setText(event.target.value)
  }

  function addBookmark() {
    const trimmed = text.trim()
    if (trimmed === '') {
      return
    }

    const newBookmark = {
      id: Date.now(),
      text: trimmed
    }

    setList([...list, newBookmark])
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
            <li key={item.id} className="existing-bookmark-item">
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Bookmark

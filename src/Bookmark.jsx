import { useState } from 'react'
import './Bookmark.css'

function Bookmark() {
  const [bookmarkInput, setBookmarkInput] = useState('')
  const [bookmarks, setBookmarks] = useState([])

  function handleBookmarkChange(e) {
    setBookmarkInput(e.target.value)
  }

  function handleBookmarkAdd() {
    const trimmed = bookmarkInput.trim()
    if (!trimmed) return

    setBookmarks(prev => [
      ...prev,
      { id: Date.now(), text: trimmed }
    ])
    setBookmarkInput('')
  }

  function handleBookmarkKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleBookmarkAdd()
    }
  }

  return (
    <div className="bookmark-container">
      <div className="add-bookmark">
        <div className="add-bookmark-title">Add a new bookmark</div>
        <textarea
          placeholder="Paste link or write notes... (Ctrl+Enter to add)"
          value={bookmarkInput}
          onChange={handleBookmarkChange}
          onKeyDown={handleBookmarkKeyDown}
        />
        <button type="button" className="primary-button" onClick={handleBookmarkAdd}>
          Add bookmark
        </button>
      </div>

      <div className="existing-bookmark">
        <h3>Your bookmarks</h3>
        <ul className="existing-bookmark-list">
          {bookmarks.map(b => (
            <li key={b.id} className="existing-bookmark-item">
              {b.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Bookmark

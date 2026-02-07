import './Bookmark.css'

// Bookmark.jsx
function Bookmark() {
  return (
    <div className="bookmark-container">
      <div className="add-bookmark">
        <div className="add-bookmark-title">Add a new bookmark</div>
        <textarea placeholder="Enter bookmarks..." />
      </div>

      <div className="existing-bookmark">
        <h3>Your bookmarks</h3>
        {/* list here */}
      </div>
    </div>
  )
}


export default Bookmark



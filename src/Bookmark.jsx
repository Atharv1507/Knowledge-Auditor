import './Bookmark.css'

function App() {
  return (
    <div className="bookmark-container">
      <div className="add-bookmark">
        <div className="add-bookmark-title">Add a new bookmark</div>
        <textarea placeholder="Enter bookmark..."></textarea>
      </div>

      <div className="existing-bookmark">
        <h3>Your bookmark</h3>
        {/* bookmark list here */}
      </div>
    </div>
  )
}

export default App



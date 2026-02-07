import './App.css'   // global + layout
import Bookmark from './Bookmark.jsx'
import Task from './Task.jsx'
import './Bookmark.css'
import './Task.css'

function App() {
  return (
    <div className="app-root">
      <Task />
      <Bookmark />
    </div>
  )
}

export default App

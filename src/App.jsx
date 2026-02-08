import './App.css'   // global + layout
import Bookmark from './Bookmark.jsx'
import Task from './Task.jsx'
import './Bookmark.css'
import './Task.css'
import { useState } from 'react'
import AuthPage from './Auth/Authpage.jsx'

function App() {
  const[loading,setLoading]=useState(false)
  const [currentUser,setCurrentUser]=useState(null)

  if(currentUser && !loading){
    console.log(currentUser)
      return(
      <div className="app-root">
      <Task />
      <Bookmark />
      </div>
      )
  }
  else{
    return (
      <AuthPage Loading={setLoading} setCurrentUser={setCurrentUser}/>
      
    )
  }
}

export default App

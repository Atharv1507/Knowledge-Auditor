import './App.css'
import Bookmark from './Bookmark.jsx'
import Task from './Task.jsx'
import { useState, useEffect } from 'react' 
import AuthPage from './Auth/Authpage.jsx'
import { supabase } from './supaBaseClient' 

function App() {
  const [loading, setLoading] = useState(true) 
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // 1. Check for existing session in LocalStorage
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setCurrentUser(session?.user ?? null)
      setLoading(false)
    }

    getSession()

    // 2. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe() // Cleanup
  }, [])

  if (loading) {
    return <div className="loading-spinner">Loading your workspace...</div>
  }

  if (currentUser) {
    return (<>
          <div className="navBar">
          <div>
          <h1>Knowledge Auditor</h1>
          <h3>Welcome, {currentUser.user_metadata?.full_name|| 'User'}</h3>
          </div>
          <button className="primary-button"onClick={() => supabase.auth.signOut()}>Sign Out</button>
        </div>
      <div className="app-root">
        <Task user={currentUser} />
        <Bookmark user={currentUser} />
      </div>
    </>
    )
  }

  return (
    <AuthPage setLoading={setLoading} setCurrentUser={setCurrentUser} />
  )
}

export default App
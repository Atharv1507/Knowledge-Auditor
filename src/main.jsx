import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import Task from './Task.jsx'
import './App.css'
import './Task.css'

createRoot(document.getElementById('root')).render(
  <div className="app-root">
    <App />
    <Task />
  </div>
)

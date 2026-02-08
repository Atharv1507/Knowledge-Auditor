import { useState } from 'react'
import './Task.css'
import {supabase} from './superbaseClient'

async function saveData(taskName) {
  const { data, error } = await supabase
    .from('Tasks')
    .insert([{
      task_ids: String(Date.now()),
      task: taskName,
    }])

  if (error) {
    console.error("Supabase Error Details:", error.message, error.details, error.hint);
    return;
  }
  console.log("Saved in db");
}

function Task() {
  const [taskInput, setTaskInput] = useState('')
  const [tasks, setTasks] = useState([])

  function handleTaskChange(e) {
    setTaskInput(e.target.value)
  }

  function handleTaskAdd() {
    const trimmed = taskInput.trim()
    if (!trimmed) return

    
    saveData(trimmed)

    setTasks(prev => [
      ...prev,
      {
        id:String(Date.now()),text:trimmed,
      }
    ])
    setTaskInput('')
  }

  function handleTaskKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleTaskAdd()
    }
  }

  return (
    <div className="task-container">
      <div className="add-task">
        <div className="add-task-title">Add a new task</div>
        <textarea
          placeholder="Type your task... (Ctrl+Enter to add)"
          value={taskInput}
          onChange={handleTaskChange}
          onKeyDown={handleTaskKeyDown}
        />
        <button type="button" className="primary-button" onClick={handleTaskAdd}>
          Add task
        </button>
      </div>

      <div className="existing-tasks">
        <h3>Your tasks</h3>
        <ul className="existing-tasks-list">
          {tasks.map(task => (
            <li key={task.id} className="existing-tasks-item">
              {task.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Task

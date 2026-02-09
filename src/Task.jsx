import { useEffect, useState } from 'react'
import './Task.css'
import {supabase} from './supaBaseClient'

async function saveData(taskName) {
  const { data, error } = await supabase
    .from('Tasks')
    .insert([{
      task_ids: String(Date.now()),
      task: taskName,
    }]).select()
  
  if (error) {
    console.error("Supabase Error Details:", error.message, error.details, error.hint);
    return;
  }
}

async function fetchdata(setTasks){
    const {data,error}= await supabase.from('Tasks').select();
    if(error){
      console.error(error)
    }
    else{
      setTasks(data)
    }
}
function Task() {
  const [taskInput, setTaskInput] = useState('')
  const [tasks, setTasks] = useState([])
  useEffect(()=>{
    fetchdata(setTasks)
  },[])

  function handleTaskChange(e) {
    setTaskInput(e.target.value)
  }

  async function handleTaskAdd() {
    const trimmed = taskInput.trim()
    if (!trimmed) return  
    await saveData(trimmed)
    fetchdata(setTasks)
    setTaskInput('')
  }
  
  function handleTaskKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleTaskAdd()
    }
  }

  return (
    <div className="task-container">
      <div className="add-task">
        <div className="add-task-title">Add a new task</div>

        <textarea
          placeholder="Type your task..."
          value={taskInput}
          onChange={handleTaskChange}
          onKeyDown={handleTaskKeyDown}
        />

        <button
          type="button"
          className="primary-button"
          onClick={handleTaskAdd}
        >
          Add task
        </button>
      </div>

      <div className="existing-tasks">
        <h3>Your tasks</h3>
        <ul className="existing-tasks-list">
          {tasks.map(task => (
            <li key={task.task_ids} className="existing-tasks-item">
              {task.task}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Task

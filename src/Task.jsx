import { useEffect, useState } from 'react'
import './Task.css'
import {supabase} from './supaBaseClient'
import TaskModal from './TaskModal'



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
  const [tasks, setTasks] = useState([])
  const [showTaskModal,setTaskModal]=useState(false);


  useEffect(()=>{
    fetchdata(setTasks)
    console.log("fetch data ran")
  },[showTaskModal])


  async function handleTaskAdd() {
    setTaskModal(true) ;
  }
  

  return (
    <div className="task-container">
      
      <button
          type="button"
          className="primary-button"
          id='add-task-btn'
          onClick={handleTaskAdd}
        >Add a new Task</button>

       {showTaskModal && (<TaskModal setTaskModal={setTaskModal}/>)}

      <div className="existing-tasks">
        <h3>Your tasks</h3>
        <ul className="existing-tasks-list">
          {tasks.map(task => (
            <li key={task.proj_id} className="existing-tasks-item">
              {task.task}
            </li>
          ))}
          <li className="existing-tasks-item">
              task.task
            </li>
        </ul>
      </div>
    </div>
  )
}

export default Task

import './Task.css'

// Task.jsx
function Task() {
  return (
    <div className="task-container">
      <div className="add-task">
        <div className="add-task-title">Add a new task</div>
        <textarea placeholder="Enter task..." />
      </div>

      <div className="existing-tasks">
        <h3>Your tasks</h3>
        {/* list here */}
      </div>
    </div>
  )
}


export default Task

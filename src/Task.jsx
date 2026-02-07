import './Task.css'

function Task() {
  return (
    <div className="task-container">
      <div className="add-task">
        <div className="add-task-title">Add a new task</div>
        <textarea placeholder="Enter task..."></textarea>
      </div>

      <div className="existing-tasks">
        <h3>Your tasks</h3>
        {/* task list here */}
      </div>
    </div>
  )
}

export default Task

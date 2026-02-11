import { useEffect, useState } from "react";
import "./Task.css";
import { supabase } from "./supaBaseClient";
import TaskModal from "./TaskModal";

async function fetchdata(setTasks) {
  const { data, error } = await supabase.from("Tasks").select();
  if (error) {
    console.error(error);
  } else {
    setTasks(data);
  }
}
function Task() {
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setTaskModal] = useState(false);
  const [expandId, setExpandId] = useState("");

  useEffect(() => {
    fetchdata(setTasks);
    console.log("fetch data ran");
  }, [showTaskModal]);

  async function handleTaskAdd() {
    setTaskModal(true);
  }
  function getPriority(pC){
    const pColors={"High":"H","Medium":"M","Low":"L"}
    return pColors[pC];
  }
  function getPriorityColor(pC){
    const pColors={"High":"#ff00004f","Medium":"#ffea0674","Low":"#00ff443c"}
    return pColors[pC];
  }
  return (
    <div className="task-container">
      <button
        type="button"
        className="primary-button"
        id="add-task-btn"
        onClick={handleTaskAdd}
      >
        Add a new Task
      </button>

      {showTaskModal && <TaskModal setTaskModal={setTaskModal} />}
      <div className="existing-tasks">
        <h3>Your tasks</h3>
        <ul className="existing-tasks-list">
          {tasks.map((task) => (
            <div
              key={task.proj_id}
              className="existing-tasks-item"
              onClick={() => {
                expandId !== task.proj_id
                  ? setExpandId(task.proj_id)
                  : setExpandId("");
              }}
              style={{
                backgroundColor : task.proj_id===expandId ? getPriorityColor(task.priority):'var(--card)'
              }}
            >
              <div className="task-item-header">
                <h3>{task.project_name}</h3>
                <p style={{color:getPriorityColor(task.priority)}}>{getPriority(task.priority)}</p>
                {expandId === task.proj_id ? <h3>v</h3> : <h3>&gt;</h3>}
              </div>

              {/* Change: Remove the ternary null check, use style instead */}
              <div
                className="task-item-values"
                style={{
                  maxHeight: expandId === task.proj_id ? "300px" : "0px",
                  opacity: expandId === task.proj_id ? 1 : 0,
                  overflow: "hidden",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <div className="task-item-date">
                  <p>{task.created_at}</p>
                </div>
                {task.project_details && (
                  <div className="task-item-details">
                    Description : {task.project_details}
                  </div>
                )}
                <div className="task-item-links">{/*map links here */}</div>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Task;

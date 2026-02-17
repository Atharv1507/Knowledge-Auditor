import { useEffect, useState } from "react";
import "./Task.css";
import { supabase } from "./supaBaseClient";
import TaskModal from "./TaskModal";

async function fetchdata(setTasks, setProjs) {
  const { data, error } = await supabase.from("Tasks").select();
  if (error) {
    console.error(error);
  } else {
    console.log(data)
    setTasks(data);
    setProjs(data);
  }
}
 
 async function handelDel(id, title) {
  const { data, error } = await supabase
    .from('Tasks')
    .select('links')
    .eq("proj_id", id)
    .single();

  if (error) {
    console.error("Fetch Error:", error);
    return;
  }


  let updatedLinks = { ...data.links }; 

  if (updatedLinks && updatedLinks[title]) {
    delete updatedLinks[title];
  }

  const finalValue = Object.keys(updatedLinks).length === 0 ? null : updatedLinks;

  const { error: updateError } = await supabase
    .from('Tasks')
    .update({ links: finalValue })
    .eq("proj_id", id);

  if (updateError) {
    console.error("Delete Error:", updateError);
  } else {
    window.location.reload()
  }
}
async function handleLinkDrop(taskId, rawData, existingLinks,setTasks,setProjs) {
  const { title, url } = JSON.parse(rawData);
  
  // Merge new link into existing links object
  const updatedLinks = { 
    ...(existingLinks || {}), 
    [title]: url 
  };

  const { error } = await supabase
    .from('Tasks')
    .update({ links: updatedLinks })
    .eq("proj_id", taskId);

  if (error) {
    console.error("Error updating links:", error);
  } else {
    await fetchdata(setTasks,setProjs)
  }
}

function Task({ setProjs }) {
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setTaskModal] = useState(false);
  const [expandId, setExpandId] = useState("");
  const [IsDrop,setIsDrop]=useState(false)
  useEffect(() => {
    fetchdata(setTasks, setProjs);
  }, [showTaskModal]);

  async function handleTaskAdd() {
    setTaskModal(true);
  }
  function getPriority(pC) {
    const pColors = { High: "H", Medium: "M", Low: "L" };
    return pColors[pC];
  }
  function getPriorityColor(pC) {
    const pColors = {
      High: "#ff00004f",
      Medium: "#ffea0674",
      Low: "#00ff443c",
    };
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
              // 1. Allow dropping
              onDragOver={(e) => e.preventDefault()} 
              // 2. Handle the drop
              onDrop={(e) => {
                e.preventDefault();
                const data = e.dataTransfer.getData("application/json");
                if (data) {
                  handleLinkDrop(task.proj_id, data, task.links,setTasks,setProjs);
                }
              }}
              onClick={() => {
                expandId !== task.proj_id
                  ? setExpandId(task.proj_id)
                  : setExpandId("");
              }}
              style={{border: '2px dashed transparent',
                backgroundColor:
                  task.proj_id === expandId
                    ? getPriorityColor(task.priority)
                    : "var(--card)",
              }}
            >
              <div className="task-item-header">
                <h3>{task.project_name}</h3>
                <p style={{ color: getPriorityColor(task.priority) }}>
                  {getPriority(task.priority)}
                </p>
                {expandId === task.proj_id ? <h3>v</h3> : <h3>&gt;</h3>}
              </div>

              <div
                className="task-item-values"
                style={{
                  maxHeight: expandId === task.proj_id ? "300px" : "0px",
                  opacity: expandId === task.proj_id ? 1 : 0,
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
                <div>
                  <ul className="task-item-links">
                    Relevant Links:
  { task.links ? Object.entries(task.links).map(([title, url]) => {if(title && url){
                        return (
                        <li className="existing-bookmark-item" key={url}>
                         <p data-id={task.proj_id} data-title={title} onClick={(e,setList)=>{
                          handelDel(e.target.dataset.id,e.target.dataset.title,setIsDeleting)
                         }}>🗑️</p>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {title}
                          </a>
                        </li>
                      )}else{
                        return(
                      <p>No links found</p>
                    )
                      }
                    })
                    :(
                      <p>No links found</p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Task;

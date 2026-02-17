import { useEffect, useState } from "react";
import "./Task.css";
import { supabase } from "./supaBaseClient";
import TaskModal from "./TaskModal";
import { AuthWeakPasswordError } from "@supabase/supabase-js";

async function fetchdata(setTasks, setProjs) {
  const { data, error } = await supabase.from("Tasks").select();
  if (error) {
    console.error(error);
  } else {
    console.log(data);
    setTasks(data);
    setProjs(data);
  }
}

async function handelDel(id, title, setTasks, setProjs) {
  const { data, error } = await supabase
    .from("Tasks")
    .select("links")
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

  const finalValue =
    Object.keys(updatedLinks).length === 0 ? null : updatedLinks;

  const { error: updateError } = await supabase
    .from("Tasks")
    .update({ links: finalValue })
    .eq("proj_id", id);

  if (updateError) {
    console.error("Delete Error:", updateError);
  } else {
    await fetchdata(setTasks, setProjs);
  }
}
async function handleLinkDrop(taskId,rawData,existingLinks,setTasks,setProjs){
  const { title, url } = JSON.parse(rawData);

  const updatedLinks = {
    ...(existingLinks || {}),
    [title]: url,
  };

  const { error } = await supabase
    .from("Tasks")
    .update({ links: updatedLinks })
    .eq("proj_id", taskId);

  if (error) {
    console.error("Error updating links:", error);
  } else {
    await fetchdata(setTasks, setProjs);
  }
}

function Task({ setProjs }) {
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setTaskModal] = useState(false);
  const [expandId, setExpandId] = useState("");

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
     High:   "#e0575734",
Medium: "#e3c24d59",
Low:    "#57b88b51",
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
        Add a new task
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
                  handleLinkDrop(
                    task.proj_id,
                    data,
                    task.links,
                    setTasks,
                    setProjs,
                  );
                }
              }}
              onClick={() => {
                expandId !== task.proj_id
                  ? setExpandId(task.proj_id)
                  : setExpandId("");
              }}
              style={{
                "--accent-bar": getPriorityColor(task.priority),
                border: "2px dashed transparent",
                backgroundColor:
                  task.proj_id === expandId
                    ? getPriorityColor(task.priority)
                    : "var(--card)",
              }}
            >
              <div className="task-item-header">
              <h3>{task.project_name}</h3>
              <div className="task-item-meta">
                <span className="priority-badge" style={{ color: getPriorityColor(task.priority) }}>
                  {getPriority(task.priority)}
                </span>
                <svg
                  className={`chevron-icon ${expandId === task.proj_id ? "chevron-open" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
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
                    {task.links ? (
                      Object.entries(task.links).map(([title, url]) => {
                        if (title && url) {
                          return (
                            <li className="existing-bookmark-item" key={url}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 15 15 "
                                fill="currentColor"
                                className="trash_icon"
                                data-id={task.proj_id}
                                data-title={title}
                                onClick={(e, setList) => {
                                  handelDel(
                                    e.target.dataset.id,
                                    e.target.dataset.title,
                                    setTasks,
                                    setProjs,
                                  );
                                }}
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                              </svg>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {title}
                              </a>
                            </li>
                          );
                        } else {
                          return <p>No links found</p>;
                        }
                      })
                    ) : (
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

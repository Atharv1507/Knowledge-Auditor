import { useEffect, useState, useRef, useCallback } from "react";
import "./Task.css";
import { supabase } from "./supaBaseClient";
import TaskModal from "./TaskModal";
import ShowPopup from "./PopUp";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const useLongPress = (callback, ms = 500) => {
  const timerRef = useRef();

  const start = useCallback((id) => {
    timerRef.current = setTimeout(() => {
      callback(id); 
    }, ms);
  }, [callback, ms]);

  const stop = useCallback(() => {
    clearTimeout(timerRef.current);
  }, []);

  return (id) => ({
    onMouseDown: () => start(id),
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: () => start(id),
    onTouchEnd: stop,
  });
};

function Task({ setProjs }) {
  const [tasks, setTasks] = useState([]);
  const [popUp, setPopUp] = useState(false);
  const [showTaskModal, setTaskModal] = useState(false);
  const [expandId, setExpandId] = useState("");
  const [sorterVal, setSorterVal] = useState({
    High: true,
    Medium: true,
    Low: true,
  });

  const [contentType, setContentType] = useState('');
  const [Popupcontent, setPopupContent] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // --- Functions shifted inside ---

  async function fetchdata() {
    const { data, error } = await supabase.from("Projects").select();
    if (error) {
      console.error(error);
      setPopUp(true);
      setContentType('Error');
      setPopupContent("Please verify your internet connection.");
    } else {
      console.log(data);
      setTasks(data);
      setProjs(data);
    }
  }

  async function handleProjDel(id) {
    console.log("deleting", id);
    const { data, error } = await supabase.from("Projects").delete().eq("proj_id", id);
    if (error) {
      console.error(error);
      setPopUp(true);
      setContentType('Error');
      setPopupContent("Please verify your internet connection.");
    } else {
      await fetchdata();
      setPopUp(true);
      setContentType('info');
      setPopupContent("The Project was removed");
    }
  }

  async function handleLinkDel(id, title) {
    if (!id) {
      console.warn("Operation aborted: ID is missing.");
      return;
    }

    const { data, error } = await supabase
      .from("Projects")
      .select("links")
      .eq("proj_id", id)
      .single();

    if (error || !data) {
      console.error("Fetch Error or No Data:", error);
      setPopUp(true);
      setContentType('Error');
      setPopupContent("There was an error.");
      return;
    }

    let updatedLinks = { ...(data?.links ?? {}) };

    if (updatedLinks[title]) {
      delete updatedLinks[title];
    }

    const finalValue = Object.keys(updatedLinks).length === 0 ? null : updatedLinks;

    const { error: updateError } = await supabase
      .from("Projects")
      .update({ links: finalValue })
      .eq("proj_id", id).select();

    if (updateError) {
      console.error("Delete Error:", updateError);
      setPopUp(true);
      setContentType('error');
      setPopupContent("There was an error");
    } else {
      await fetchdata();
      setPopUp(true);
      setContentType('info');
      setPopupContent("The Bookmark was removed");
    }
  }

  async function handleLinkDrop(taskId, rawData, existingLinks) {
    const { title, url } = JSON.parse(rawData);

    const updatedLinks = {
      ...(existingLinks || {}),
      [title]: url,
    };

    const { error } = await supabase
      .from("Projects")
      .update({ links: updatedLinks })
      .eq("proj_id", taskId);

    if (error) {
      console.error("Error updating links:", error);
      setPopUp(true);
      setContentType('Error');
      setPopupContent(error.message);
    } else {
      await fetchdata();
      setPopUp(true);
      setContentType('info');
      setPopupContent("The Bookmark was added");
    }
  }

  function handleLongPressDelete(id) {
    setConfirmDeleteId(id);
  }

  async function confirmProjDel() {
    if (!confirmDeleteId) return;
    await handleProjDel(confirmDeleteId);
    setConfirmDeleteId(null);
  }

  function cancelProjDel() {
    setConfirmDeleteId(null);
  }

  const deleteOnLongPress = useLongPress(handleLongPressDelete, 500);

  useEffect(() => {
    fetchdata();
  }, [showTaskModal, popUp]);

  async function handleTaskAdd() {
    setTaskModal(true);
  }

  function getPriority(pC) {
    const pColors = { High: "H", Medium: "M", Low: "L" };
    return pColors[pC];
  }

  function getPriorityColor(pC) {
    const pColors = {
      High: "#e0575734",
      Medium: "#e3c24d59",
      Low: "#57b88b51",
    };
    return pColors[pC];
  }

  const handleChange = (e) => {
    const { id, checked } = e.target;
    setSorterVal((prevState) => ({
      ...prevState,
      [id]: checked,
    }));
  };

  return (
    <div className="task-container">
      <div className="task-container-header">
        <div className="sorter">
          {Object.keys(sorterVal).map((val) => {
            return (
              <div key={val} className="sorter-item" >
                <label htmlFor={val}>
                  <span
                    className="priority-badge"
                    style={{ color: getPriorityColor(val) }}
                  >
                    {getPriority(val)}
                  </span>
                </label>
                <input
                  type="checkbox"
                  className="Sort-checkBox"
                  name="sorter"
                  onChange={handleChange}
                  id={val}
                  checked={sorterVal[val]}
                  value={val}
                />
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className="primary-button"
          id="add-task-btn"
          onClick={handleTaskAdd}
        >
          Add a new task
        </button>
      </div>

      {showTaskModal && <TaskModal setTaskModal={setTaskModal} />}
      {confirmDeleteId && (
        <ConfirmDeleteModal
          projectName={tasks.find((t) => t.proj_id === confirmDeleteId)?.project_name}
          onConfirm={confirmProjDel}
          onCancel={cancelProjDel}
        />
      )}
      <div className="existing-tasks">
        <h3>Your tasks</h3>
        <ul className="existing-tasks-list">
          {tasks.map((task) => {
            if (sorterVal[task.priority] == true)
              return (
                <div
                  key={task.proj_id}
                  {...deleteOnLongPress(task.proj_id)}
                  className="existing-tasks-item"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const data = e.dataTransfer.getData("application/json");
                    if (data) {
                      handleLinkDrop(task.proj_id, data, task.links);
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
                      <span
                        className="priority-badge"
                        style={{ color: getPriorityColor(task.priority) }}
                      >
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
                      <p>{task.due_by}</p>
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
                                <li
                                  className="existing-bookmark-item"
                                  key={url}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 15 15 "
                                    fill="currentColor"
                                    className="trash_icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLinkDel(task.proj_id, title);
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
                            }
                            return null;
                          })
                        ) : (
                          <p>Drag and Drop Links Here</p>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            return null;
          })}
        </ul>
      </div>

      {(() => {
        if (popUp) {
          setTimeout(() => {
            setPopUp(false);
          }, 3000);
          return <ShowPopup content={Popupcontent} contentType={contentType} />;
        }
        return null;
      })()}
    </div>
  );
}

export default Task;
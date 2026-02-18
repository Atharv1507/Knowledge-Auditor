import { useRef } from "react";
import "./Task.css";
import { supabase } from "./supaBaseClient";

const today = new Date().toISOString().split("T")[0];
function TaskModal({ setTaskModal }) {
  const nameRef = useRef();
  const dateRef = useRef();
  const detailsRef = useRef();
  const priorityRef = useRef();

  async function saveData(projName, date, detail, priorities) {
    const { data, error } = await supabase
      .from("Projects")
      .insert([
        {
          due_by: date,
          status: false,
          project_name: projName,
          project_details: detail,
          priority: priorities,
        },
      ])

    if (error) {
      console.error(
        "Supabase Error Details:",
        error.message,
        error.details,
        error.hint,
      );
      return;
    }
  }
  async function handleSubmit() {
    const projName = nameRef.current.value.trim();
    const date = dateRef.current.value;
    const details = detailsRef.current.value || "";
    const priority = priorityRef.current.value;
    if (!projName) return;
    await saveData(projName, date, details, priority);
    setTaskModal(false);
  }

  return (
    <div className="task-modal-container">
      <div className="taskHeader">
        <h1>Add a New Project </h1>
        <button id='exit' onClick={()=>{setTaskModal(false)}}>x</button>
      </div>

      <form
        className="taskForm"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="inputGroup">
          <label htmlFor="task_name">Task</label>
          <input
            type="text"
            id="task_name"
            ref={nameRef}
            placeholder="Make a ETL Pipeline"
            required
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="due_by">Due by</label>
          <input type="date" id="due_by" ref={dateRef} min={today} defaultValue={today} />
        </div>

        <div className="inputGroup">
          <label htmlFor="details">Project Details</label>
          <textarea
            type="textbox"
            id="details"
            ref={detailsRef}
            placeholder="This is going to organize incoming raw json data...."
          />
        </div>

        <div className="inputGroup">
          <label htmlFor="priority">Select Priority</label>
          <select name="priority" ref={priorityRef} id="priority">
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <button type="submit" className="taskSubmitBtn">
          List Project
        </button>
      </form>
    </div>
  );
}

export default TaskModal;

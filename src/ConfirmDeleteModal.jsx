import "./Task.css";

function ConfirmDeleteModal({ projectName, onConfirm, onCancel }) {
  return (
    <div
      className="task-modal-container confirm-delete-modal"
      role="dialog"
      aria-labelledby="confirm-delete-title"
      aria-modal="true"
    >
      <div className="confirm-delete-content">
        <h3 id="confirm-delete-title">Delete project?</h3>
        <p>
          Are you sure you want to delete{" "}
          <strong>{projectName || "this project"}</strong>? This cannot be undone.
        </p>
        <div className="confirm-delete-actions">
          <button
            type="button"
            className="confirm-delete-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="confirm-delete-confirm"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;

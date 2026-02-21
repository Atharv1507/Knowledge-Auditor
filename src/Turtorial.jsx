import React, { useState } from "react";
import "./TutorialModal.css";

const TutorialModal = ({ setTutorialActive }) => {
  const [step, setStep] = useState(0);

  const tips = [
    {
      title: "Drag & Drop Bookmarks",
      content: "Simply drag a URL or a link from another tab (or your bookmark bar) and drop it directly onto any Task card to save it instantly.",
      image: "🔗" 
    },
    {
      title: "Managing Tasks",
      content: "To delete a task, long-press (click and hold) on the task card for 0.5 seconds. To create a new one, use the 'Add a new task' button at the top.",
      image: "🗑️"
    },
    {
      title: "Adding Bookmarks Manually",
      content: "Inside the 'Add Task' modal, you can manually input bookmark titles and URLs to keep your project resources organized from the start.",
      image: "📝"
    }
  ];

  const handleNext = () => {
    if (step < tips.length - 1) {
      setStep(step + 1);
    } else {
      setTutorialActive(false);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-card">
        <div className="tutorial-progress">
          {tips.map((_, index) => (
            <div 
              key={index} 
              className={`progress-dot ${index === step ? "active" : ""}`}
            />
          ))}
        </div>

        <div className="tutorial-body">
          <div className="tutorial-icon">{tips[step].image}</div>
          <h2>{tips[step].title}</h2>
          <p>{tips[step].content}</p>
        </div>

        <div className="tutorial-footer">
          <button 
            className="primary-button" 
            onClick={handleBack}
            disabled={step === 0}
          >
            Back
          </button>
          <button className="primary-button" onClick={handleNext}>
            {step === tips.length - 1 ? "Got it!" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
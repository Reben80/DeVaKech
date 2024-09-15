import React, { useState } from 'react';
import './TutorialOverlay.css'; // You can keep this in a separate CSS file or inline styles

const TutorialOverlay = ({ onClose }) => {
  const [step, setStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to Polynomial Derivative Game!",
      content: "In this game, you'll learn about polynomial derivatives by drawing or connecting points to match the derivative of a given polynomial."
    },
    {
      title: "Step 1: Drawing the Path",
      content: "Use the freehand mode to draw the path of the derivative curve. Simply click and drag on the canvas to draw."
    },
    {
      title: "Step 2: Connecting Dots",
      content: "If you prefer precision, switch to dot-to-line mode. Click to place dots and then connect them to form a path."
    },
    {
      title: "Step 3: Scoring",
      content: "Your score is calculated based on how closely your path matches the actual derivative curve. Scores include Pointwise Comparison, Area Between Curves, and Slope Comparison."
    },
    {
      title: "Final Step: Show Derivative",
      content: "Once you've tried at least 3 times, you'll be able to reveal the actual derivative by clicking 'Show Derivative'."
    },
  ];

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-content">
        <h2>{tutorialSteps[step].title}</h2>
        <p>{tutorialSteps[step].content}</p>
        <div className="tutorial-controls">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="btn btn-secondary">
              Previous
            </button>
          )}
          {step < tutorialSteps.length - 1 ? (
            <button onClick={() => setStep(step + 1)} className="btn btn-primary">
              Next
            </button>
          ) : (
            <button onClick={onClose} className="btn btn-success">
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;

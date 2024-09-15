import React, { useState, useRef, useEffect } from 'react';
import * as ScoreSystem from './scoreSystem';
import { generateRandomFunction, generatePolynomialData, createDerivativeFunction } from './mathFunctions';
import './PolynomialDerivativeGame.css';
import TutorialOverlay from './components/TutorialOverlay';
import ScoringExplanation from './ScoringExplanation';

const PolynomialDerivativeGame = () => {
  const [currentFunction, setCurrentFunction] = useState('');
  const [userPath, setUserPath] = useState([]);
  const [dots, setDots] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [scores, setScores] = useState(null);
  const [drawMode, setDrawMode] = useState('freehand');
  const [showDerivative, setShowDerivative] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showScores, setShowScores] = useState(true);
  const [showScoringExplanation, setShowScoringExplanation] = useState(false);
  const canvasRef = useRef(null);

  const startDot = { x: -7, y: 0 }; // Drawing range -7 to 7
  const endDot = { x: 7, y: 0 };

  const derivativeFunction = createDerivativeFunction(currentFunction);

  useEffect(() => {
    const newFunction = generateRandomFunction();
    setCurrentFunction(newFunction);
  }, []);

  const polynomialData = generatePolynomialData(currentFunction, -8, 8, 100);

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const scaleX = canvas.width / 16; // For -8 to 8 x-range
    const scaleY = canvas.height / 9; // For -4.5 to 4.5 y-range

    const graphX = x / scaleX - 8;
    const graphY = 4.5 - y / scaleY; // Reverse y for canvas coordinates

    return { x: graphX, y: graphY };
  };

  const handleCanvasClick = (e) => {
    const newDot = getCanvasCoordinates(e);

    // Ensure drawing happens only within the -7 to 7 x-range and -4.5 to 4.5 y-range
    if (newDot.x >= -7 && newDot.x <= 7 && newDot.y >= -4.5 && newDot.y <= 4.5) {
      setDots([...dots, newDot]);
    }
  };

  const handleMouseDown = (e) => {
    if (drawMode === 'freehand') {
      const coords = getCanvasCoordinates(e);
      if (coords.x >= -7 && coords.x <= 7 && coords.y >= -4.5 && coords.y <= 4.5) {
        setIsDrawing(true);
        setUserPath([coords]);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (isDrawing && drawMode === 'freehand') {
      const newPoint = getCanvasCoordinates(e);
      if (newPoint.x >= -7 && newPoint.x <= 7 && newPoint.y >= -4.5 && newPoint.y <= 4.5) {
        setUserPath((prevPath) => [...prevPath, newPoint]);
      }
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && drawMode === 'freehand') {
      setIsDrawing(false);

      const filteredPath = userPath.filter(
        (point) => point.x >= -7 && point.x <= 7 && point.y >= -4.5 && point.y <= 4.5
      );
      setUserPath(filteredPath);

      const newScores = ScoreSystem.calculateAllScores(filteredPath, derivativeFunction, startDot, endDot);
      setScores(newScores);
      setAttempts((prevAttempts) => prevAttempts + 1);
    }
  };

  const handleReset = () => {
    setUserPath([]);
    setDots([]);
    setScores(null);
    setAttempts(0);
    setShowDerivative(false);
    const newFunction = generateRandomFunction();
    setCurrentFunction(newFunction);
  };

  const drawGrid = (ctx, width, height) => {
    const scaleX = width / 16; // Adjust scale for -8 to 8 x-range
    const scaleY = height / 9;  // Adjust scale for -4.5 to 4.5 y-range
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 16; i++) {
      const posX = i * scaleX;

      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(posX, 0);
      ctx.lineTo(posX, height);
      ctx.stroke();
    }

    for (let i = 0; i <= 9; i++) {
      const posY = i * scaleY;

      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, posY);
      ctx.lineTo(width, posY);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Draw ticks and labels
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 1;

    // X-axis labels
    for (let i = 0; i <= 16; i++) {
      const posX = i * scaleX;
      const valueX = i - 8;
      ctx.beginPath();
      ctx.moveTo(posX, height / 2 - 5);
      ctx.lineTo(posX, height / 2 + 5);
      ctx.stroke();
      ctx.fillText(valueX.toString(), posX, height / 2 + 15);
    }

    // Y-axis labels
    for (let i = 0; i <= 9; i++) {
      const posY = i * scaleY;
      const valueY = 4.5 - i;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 5, posY);
      ctx.lineTo(width / 2 + 5, posY);
      ctx.stroke();
      ctx.fillText(valueY.toString(), width / 2 - 15, posY);
    }
  };

  const toggleDerivative = () => {
    setShowDerivative(!showDerivative);
  };

  const handleConnectDots = () => {
    if (dots.length < 2) {
      alert("Please place at least two dots before connecting.");
      return;
    }

    // Sort dots based on x-value
    const sortedDots = [...dots].sort((a, b) => a.x - b.x);

    // Ensure dots are within the drawing range of -7 to 7
    const filteredDots = sortedDots.filter(
      (dot) => dot.x >= -7 && dot.x <= 7
    );

    // Set the userPath to the filtered dots
    setUserPath(filteredDots);

    // Calculate the scores based on the filtered dots
    const newScores = ScoreSystem.calculateAllScores(filteredDots, derivativeFunction, startDot, endDot);
    setScores(newScores);

    // Increment attempts count
    setAttempts((prevAttempts) => prevAttempts + 1);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#00ff00'; // Bright Green
    if (score >= 80) return '#66ff66'; // Light Green
    if (score >= 70) return '#cccc00'; // Darker Yellow
    if (score >= 60) return '#ffaa00'; // Orange
    if (score >= 50) return '#ff5500'; // Dark Orange
    return '#ff0000'; // Red
  };

  const ScoreDisplay = ({ label, score, description }) => (
    <div 
      className="score-item" 
      style={{ color: getScoreColor(score) }}
      title={description}
    >
      <span className="score-label">{label}:</span>
      <span className="score-value">{score}</span>
    </div>
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    drawGrid(ctx, width, height);

    const scaleX = width / 16;
    const scaleY = height / 9;

    // Highlight the domain between -7 and 7
    ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
    ctx.fillRect((1 * scaleX), 0, 14 * scaleX, height);

    // Draw the function
    ctx.strokeStyle = '#8884d8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    polynomialData.forEach((point, index) => {
      const canvasX = (point.x + 8) * scaleX;
      const canvasY = (4.5 - point.y) * scaleY;
      if (index === 0) {
        ctx.moveTo(canvasX, canvasY);
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    });
    ctx.stroke();

    // Draw derivative function if showDerivative is true
    if (showDerivative) {
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < polynomialData.length; i++) {
        const point = polynomialData[i];
        const canvasX = (point.x + 8) * scaleX;
        const canvasY = (4.5 - derivativeFunction(point.x)) * scaleY;
        if (i === 0) {
          ctx.moveTo(canvasX, canvasY);
        } else {
          ctx.lineTo(canvasX, canvasY);
        }
      }
      ctx.stroke();
    }

    // Draw user path
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.beginPath();
    userPath.forEach((point, index) => {
      const canvasX = (point.x + 8) * scaleX;
      const canvasY = (4.5 - point.y) * scaleY;
      if (index === 0) {
        ctx.moveTo(canvasX, canvasY);
      } else {
        ctx.lineTo(canvasX, canvasY);
      }
    });
    ctx.stroke();

    // Draw dots
    ctx.fillStyle = 'red';
    dots.forEach((dot) => {
      const canvasX = (dot.x + 8) * scaleX;
      const canvasY = (4.5 - dot.y) * scaleY;
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Draw start and end dots as guidance
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc((startDot.x + 8) * scaleX, (4.5 - startDot.y) * scaleY, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc((endDot.x + 8) * scaleX, (4.5 - endDot.y) * scaleY, 5, 0, 2 * Math.PI);
    ctx.fill();
  }, [currentFunction, userPath, dots, polynomialData, showDerivative]);

  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const toggleExplanation = () => setIsExplanationOpen(!isExplanationOpen);
  const toggleAbout = () => setIsAboutOpen(!isAboutOpen);

  const AboutModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="about-modal">
        <div className="about-content">
          <h2>About DeVaKech</h2>
          <div>
            <p>Created by Rebin Muhammad</p>
            <p>
              <a href="https://twitter.com/rebin3" target="_blank" rel="noopener noreferrer">Twitter: @rebin3</a>
            </p>
            <p>
              <a href="mailto:reben80@gmail.com">Email: reben80@gmail.com</a>
            </p>
          </div>
          <button onClick={onClose} className="btn btn-secondary">Close</button>
        </div>
      </div>
    );
  };

  const openScoringExplanation = () => {
    window.open('/scoring-explanation', 'ScoringExplanation', 'width=800,height=600');
  };

  return (
    <div className="game-container">
      <header className="game-header">
        <div className="game-title">
          <h1>
            <span className="title-word title-word-1">De</span>
            <span className="title-word title-word-2">Va</span>
            <span className="title-word title-word-3">Kech</span>
          </h1>
          <p className="subtitle">
            <span className="subtitle-word subtitle-word-1">Derivative</span>
            <span className="subtitle-word subtitle-word-2">Sketching</span>
            <span className="subtitle-word subtitle-word-3">Challenge</span>
          </p>
        </div>
      </header>

      <div className="game-content">
        <div className="toolbar">
          <div className="toolbar-section">
            <button onClick={handleReset} className="btn btn-primary">
              New Function
            </button>

            {attempts >= 3 && (
              <button onClick={toggleDerivative} className="btn btn-accent">
                {showDerivative ? "Hide Derivative" : "Show Derivative"}
              </button>
            )}

            {/* Tutorial button */}
            <button onClick={() => setShowTutorial(true)} className="btn btn-info">
              Tutorial
            </button>
          </div>

          <div className="toolbar-section">
            <div className="select-container">
              <label htmlFor="drawMode">Draw Mode:</label>
              <select
                id="drawMode"
                value={drawMode}
                onChange={(e) => setDrawMode(e.target.value)}
                className="select"
              >
                <option value="freehand">Freehand</option>
                <option value="dot-to-line">Dot-to-Line</option>
              </select>
            </div>
            {drawMode === 'dot-to-line' && (
              <button onClick={handleConnectDots} className="btn btn-green">
                Connect Dots
              </button>
            )}
          </div>
        </div>

        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={800} // Width for 16:9 aspect ratio
            height={450} // Height for 16:9 aspect ratio
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="game-canvas"
          />
        </div>
      </div>

      {showScores && scores && (
        <div className="scores-container" aria-label="Score Summary">
          <h3 className="scores-title" id="scores-title">Scores</h3>
          <div className="scores-grid" aria-labelledby="scores-title">
            <ScoreDisplay 
              label="Area" 
              score={scores.area} 
              description="Measures how well your curve matches the area under the actual derivative"
            />
            <ScoreDisplay 
              label="Pointwise" 
              score={scores.pointwise} 
              description="Compares your curve to the actual derivative at specific points"
            />
            <ScoreDisplay 
              label="Slope" 
              score={scores.slope} 
              description="Evaluates how well your curve's slope matches the actual derivative's slope"
            />
          </div>
          <div 
            className="composite-score" 
            style={{ color: getScoreColor(scores.composite) }}
            aria-label={`Overall Score: ${scores.composite}`}
          >
            Overall: {scores.composite}
          </div>
        </div>
      )}

      {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}

      <button 
        onClick={openScoringExplanation}
        className="btn btn-info"
      >
        How is my score calculated?
      </button>

      {showScoringExplanation && (
        <ScoringExplanation onClose={() => setShowScoringExplanation(false)} />
      )}

      <footer className="game-footer">
        <p>DeVaKech v1.0 | <button onClick={toggleAbout} className="btn-link">About</button></p>
      </footer>

      <AboutModal isOpen={isAboutOpen} onClose={toggleAbout} />
    </div>
  );
};

export default PolynomialDerivativeGame;

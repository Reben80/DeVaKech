import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './ScoringExplanation.css';

const ScoringExplanation = ({ isStandalone = false, onClose }) => {
  const content = (
    <>
      <h2>How Your Score is Calculated</h2>
      
      <section>
        <h3>Area Score</h3>
        <p>This score measures how well the area under your curve matches the area under the actual derivative.</p>
        <div className="equation-container">
          <p>Formula: <InlineMath math={'\\text{AreaScore} = 100 \\times \\left(1 - \\frac{|\\text{UserArea} - \\text{ActualArea}|}{|\\text{ActualArea}|}\\right)'} /></p>
        </div>
        <p>Reasoning: A perfect match in area would result in a score of 100, while larger differences reduce the score.</p>
      </section>

      <section>
        <h3>Pointwise Score</h3>
        <p>This compares your curve to the actual derivative at specific points along the x-axis.</p>
        <div className="equation-container">
          <p>Formula: <InlineMath math={'\\text{PointwiseScore} = 100 - \\text{AverageVerticalDistance} \\times \\text{ScalingFactor}'} /></p>
        </div>
        <p>Reasoning: Smaller average distances between your curve and the actual derivative result in higher scores.</p>
      </section>

      <section>
        <h3>Slope Score</h3>
        <p>This evaluates how well the slope of your curve matches the slope of the actual derivative.</p>
        <div className="equation-container">
          <p>Formula: <InlineMath math={'\\text{SlopeScore} = 100 - \\text{AverageSlopeDifference} \\times \\text{ScalingFactor}'} /></p>
        </div>
        <p>Reasoning: Closer slope matches result in higher scores, capturing the rate of change accuracy.</p>
      </section>

      <section>
        <h3>Composite Score</h3>
        <p>The overall score is a weighted geometric mean of the three individual scores.</p>
        <div className="equation-container">
          <p>Formula: <InlineMath math={'\\text{CompositeScore} = \\left(\\text{AreaScore}^{0.4} \\times \\text{PointwiseScore}^{0.3} \\times \\text{SlopeScore}^{0.3}\\right)^{1}'} /></p>
        </div>
        <p>Reasoning: This method ensures that low scores in any category significantly impact the overall score, encouraging consistent performance across all aspects.</p>
      </section>
    </>
  );

  if (isStandalone) {
    return <div className="scoring-explanation-standalone">{content}</div>;
  }

  return (
    <div className="scoring-explanation-modal">
      <div className="scoring-explanation">
        {content}
        <button onClick={onClose} className="btn btn-primary">Close</button>
      </div>
    </div>
  );
};

export default ScoringExplanation;

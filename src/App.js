import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PolynomialDerivativeGame from './PolynomialDerivativeGame';
import ScoringExplanation from './ScoringExplanation';

function App() {
  return (
    <Router>
      <div>
        <h1></h1>
        <Routes>
          <Route path="/" element={<PolynomialDerivativeGame />} />
          <Route path="/scoring-explanation" element={<ScoringExplanation isStandalone={true} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
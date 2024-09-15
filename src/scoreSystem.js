export const calculateAllScores = (path, derivativeFunction, startDot, endDot) => {
  if (!startDot || !endDot || path.length === 0) {
    console.error("Start or end dot is not defined, or path is empty");
    return {
      pointwise: 0,
      area: 0,
      slope: 0,
      composite: 0
    };
  }

  // Filter the path to only include points between startDot.x and endDot.x
  const filteredPath = path.filter(point => point.x >= startDot.x && point.x <= endDot.x);

  if (filteredPath.length < 2) {
    console.error("Not enough points in the filtered path to calculate scores");
    return {
      pointwise: 0,
      area: 0,
      slope: 0,
      composite: 0
    };
  }

  const pointwiseScore = calculatePointwiseScore(filteredPath, derivativeFunction);
  const areaScore = calculateAreaScore(filteredPath, derivativeFunction);
  const slopeScore = calculateSlopeScore(filteredPath, derivativeFunction); // Make sure this line is correct

  // Assign weights to each score (adjust these as needed)
  const weights = {
    pointwise: 0.3,
    area: 0.4,
    slope: 0.3
  };

  // Calculate the weighted geometric mean
  const compositeScore = Math.pow(
    Math.pow(pointwiseScore, weights.pointwise) *
    Math.pow(areaScore, weights.area) *
    Math.pow(slopeScore, weights.slope),
    1 / (weights.pointwise + weights.area + weights.slope)
  );

  return {
    pointwise: pointwiseScore,
    area: areaScore,
    slope: slopeScore,
    composite: Math.round(compositeScore)
  };
};

// Pointwise comparison score
const calculatePointwiseScore = (path, derivativeFunction) => {
  let totalError = 0;
  path.forEach(point => {
    const actualY = derivativeFunction(point.x);
    totalError += Math.abs(point.y - actualY);
  });
  const averageError = totalError / path.length;
  return Math.max(0, 100 - Math.round(averageError * 20)); // Adjust multiplier as needed
};

// Area comparison score
const calculateAreaScore = (path, derivativeFunction) => {
  let totalError = 0;
  let totalArea = 0;

  for (let i = 1; i < path.length; i++) {
    const x1 = path[i - 1].x;
    const x2 = path[i].x;
    const y1 = path[i - 1].y;
    const y2 = path[i].y;
    const actualY1 = derivativeFunction(x1);
    const actualY2 = derivativeFunction(x2);

    // Calculate area of trapezoid between user's curve and x-axis
    const userArea = (x2 - x1) * (y1 + y2) / 2;

    // Calculate area of trapezoid between actual derivative and x-axis
    const actualArea = (x2 - x1) * (actualY1 + actualY2) / 2;

    // Calculate the difference in areas
    const areaError = Math.abs(userArea - actualArea);

    totalError += areaError;
    totalArea += Math.abs(actualArea);
  }

  // Normalize the error
  const normalizedError = totalError / totalArea;

  // Convert to a score (0-100)
  const score = Math.max(0, Math.min(100, Math.round(100 * (1 - normalizedError))));

  console.log("Area score details:", { totalError, totalArea, normalizedError, score });

  return score;
};

// Slope comparison score
const calculateSlopeScore = (path, derivativeFunction) => {
  let totalSlopeDifference = 0;
  for (let i = 1; i < path.length; i++) {
    const x1 = path[i - 1].x;
    const x2 = path[i].x;
    const y1 = path[i - 1].y;
    const y2 = path[i].y;
    const userSlope = (y2 - y1) / (x2 - x1);
    const actualSlope = (derivativeFunction(x2) - derivativeFunction(x1)) / (x2 - x1);
    totalSlopeDifference += Math.abs(userSlope - actualSlope);
  }
  const averageSlopeDifference = totalSlopeDifference / (path.length - 1);
  return Math.max(0, 100 - Math.round(averageSlopeDifference * 20)); // Adjust multiplier as needed
};

// Export the functions
export { calculatePointwiseScore, calculateAreaScore, calculateSlopeScore };

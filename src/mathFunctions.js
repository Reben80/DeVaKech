export const generateRandomFunction = () => {
  const functionTypes = ['polynomial', 'trigonometric'];
  const type = functionTypes[Math.floor(Math.random() * functionTypes.length)];

  if (type === 'polynomial') {
    const degree = Math.floor(Math.random() * 3) + 1; // 1 to 3
    let func = '';
    for (let i = degree; i >= 0; i--) {
      const coefficient = Math.floor(Math.random() * 5) - 2; // -2 to 2
      if (coefficient !== 0) {
        func += `${coefficient > 0 ? '+' : ''}${coefficient}${i > 0 ? '*x' : ''}${i > 1 ? '**' + i : ''}`;
      }
    }
    return func.charAt(0) === '+' ? func.slice(1) : func;
  } else {
    const funcs = ['Math.sin', 'Math.cos'];
    const func = funcs[Math.floor(Math.random() * funcs.length)];
    const coefficient = Math.floor(Math.random() * 3) + 1; // 1 to 3
    return `${coefficient}*${func}(x)`;
  }
};

export const generatePolynomialData = (func, start, end, steps) => {
  const data = [];
  const step = (end - start) / steps;
  for (let x = start; x <= end; x += step) {
    data.push({ x, y: evaluateFunction(func, x) });
  }
  return data;
};

export const evaluateFunction = (func, x) => {
  try {
    // Create a new function from the string
    const safeFunction = new Function('x', `return ${func}`);
    return safeFunction(x);
  } catch (error) {
    console.error('Invalid function:', error);
    return 0;
  }
};

export const createDerivativeFunction = (func) => {
  return (x) => {
    const h = 0.0001;
    return (evaluateFunction(func, x + h) - evaluateFunction(func, x)) / h;
  };
};

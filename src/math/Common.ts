/**
 * Clamps a parameter between a low and high bound.
 * @param {number} x The number to be clamped
 * @param {number} low The lowest value that could be returned
 * @param {number} high The highest value that could be returned
 */
export const clamp = (x: number, low: number, high: number): number => {
  return Math.min(high, Math.max(x, low));
};

export const sign = (x: number): number => {
  if (x > 0) {
    return 1;
  } else if (x === 0) {
    return 0;
  } else {
    return -1;
  }
};

export const roundTo = (x: number, fidelity: number): number => {
  return fidelity * Math.floor(x / fidelity);
};

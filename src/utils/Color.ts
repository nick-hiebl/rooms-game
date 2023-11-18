const HEX = 16;
const ZERO = "0";

/**
 * A function to convert a number to a zero-padded hex string.
 * @param {number} number The number to be converted
 * @param {number} digits The expected length (for zero-padding purposes)
 */
export const toHex = (number: number, digits: number) => {
  return number.toString(HEX).padStart(digits, ZERO);
};

export const rgbaColor = (
  red: number,
  green: number,
  blue: number,
  alpha = 255,
) => {
  return `#${toHex(red, 2)}${toHex(green, 2)}${toHex(blue, 2)}${toHex(
    alpha,
    2,
  )}`;
};

export const hslaColor = (
  hue: number,
  saturation: number,
  lightness: number,
  alpha = 1,
) => {
  return `hsla(${hue},${Math.floor(saturation * 100)}%,${Math.floor(
    lightness * 100,
  )}%,${alpha})`;
};

const rgbToHue = (r: number, g: number, b: number): number => {
  let h = 0;

  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);

  if (max === r) {
    h = (g - b) / (max - min);
  }
  if (max === g) {
    h = 2 + (b - r) / (max - min);
  }
  if (max === b) {
    h = 4 + (r - g) / (max - min);
  }
  if (isNaN(h)) {
    h = 0;
  }
  h = h * 60;
  if (h < 0) {
    h = h + 360;
  }
  return h;
};

const fromHex = (hexColor: string): [number, number, number] => {
  return [
    parseInt(hexColor.slice(1, 3), 16),
    parseInt(hexColor.slice(3, 5), 16),
    parseInt(hexColor.slice(5, 7), 16),
  ];
};

export const hexToHue = (hexColor: string) => {
  const [r, g, b] = fromHex(hexColor);
  return rgbToHue(r, g, b);
};

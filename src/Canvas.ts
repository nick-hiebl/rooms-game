import { sign } from "./math/Common";
import { hslaColor, rgbaColor } from "./utils/Color";

const CTX = Symbol("ctx");
const CANVAS = Symbol("canvas");

export class Canvas {
  [CANVAS]: HTMLCanvasElement;
  [CTX]: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(canvas: HTMLCanvasElement) {
    this[CANVAS] = canvas;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw Error("Unable to get 2d context");
    }

    ctx.imageSmoothingEnabled = false;

    this[CTX] = ctx;

    this[CTX].fillStyle = "black";
    this[CTX].strokeStyle = "black";

    this.width = this[CANVAS].width;
    this.height = this[CANVAS].height;
  }

  /**
   * Fill a rectangle on the canvas.
   * @param {number} x The horizontal position of the top-left corner.
   * @param {number} y The vertical position of the top-left corner.
   * @param {number} width The width of the rectangle.
   * @param {number} height The height of the rectangle.
   */
  fillRect(x: number, y: number, width: number, height: number) {
    this[CTX].fillRect(x, y, width, height);
  }

  clear() {
    this[CTX].clearRect(0, 0, this.width, this.height);
  }

  /**
   * Draw the outline of a rectangle on the canvas.
   * @param {number} x The horizontal position of the top-left corner.
   * @param {number} y The vertical position of the top-left corner.
   * @param {number} width The width of the rectangle.
   * @param {number} height The height of the rectangle.
   */
  strokeRect(x: number, y: number, width: number, height: number) {
    this[CTX].strokeRect(x, y, width, height);
  }

  strokeRectInset(
    x: number,
    y: number,
    width: number,
    height: number,
    inset: number,
  ) {
    this.strokeRect(
      x + inset,
      y + inset,
      width - inset * 2,
      height - inset * 2,
    );
  }

  /**
   * Fill an ellipse on the canvas.
   * @param {number} x The horizontal position of the ellipse center.
   * @param {number} y The vertical position of the ellipse center.
   * @param {number} width The horizontal radius of the ellipse.
   * @param {number} height The vertical radius of the ellipse.
   */
  fillEllipse(x: number, y: number, width: number, height: number) {
    this[CTX].beginPath();
    this[CTX].ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
    this[CTX].fill();
  }

  fillTriangle(x: number, y: number, width: number, height: number) {
    this[CTX].beginPath();
    this[CTX].moveTo(x, y + height);
    this[CTX].lineTo(x + width, y + height);
    this[CTX].lineTo(x + width / 2, y);
    this[CTX].fill();
  }

  /**
   * Outline an ellipse on the canvas.
   * @param {number} x The horizontal position of the ellipse center.
   * @param {number} y The vertical position of the ellipse center.
   * @param {number} width The horizontal radius of the ellipse.
   * @param {number} height The vertical radius of the ellipse.
   */
  strokeEllipse(x: number, y: number, width: number, height: number) {
    this[CTX].beginPath();
    this[CTX].ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
    this[CTX].stroke();
  }

  fillDiamond(x: number, y: number, xRadius: number, yRadius: number) {
    this[CTX].beginPath();
    this[CTX].moveTo(x, y - yRadius);
    this[CTX].lineTo(x + xRadius, y);
    this[CTX].lineTo(x, y + yRadius);
    this[CTX].lineTo(x - xRadius, y);
    this[CTX].lineTo(x, y - yRadius);
    this[CTX].fill();
  }

  fillOctagon(x: number, y: number, radius: number, cornerCut: number) {
    const short = radius - cornerCut;
    this[CTX].beginPath();
    this[CTX].moveTo(x - short, y - radius);
    this[CTX].lineTo(x + short, y - radius);
    this[CTX].lineTo(x + radius, y - short);
    this[CTX].lineTo(x + radius, y + short);
    this[CTX].lineTo(x + short, y + radius);
    this[CTX].lineTo(x - short, y + radius);
    this[CTX].lineTo(x - radius, y + short);
    this[CTX].lineTo(x - radius, y - short);
    this[CTX].lineTo(x - short, y - radius);
    this[CTX].fill();
  }

  outerCircleCorner(x: number, y: number, radius: number, startAngle: number) {
    this[CTX].beginPath();
    this[CTX].arc(x, y, radius, startAngle, startAngle + Math.PI / 2);
    const toPoint = startAngle + Math.PI / 4;
    this[CTX].lineTo(
      x + sign(Math.cos(toPoint)) * radius,
      y + sign(Math.sin(toPoint)) * radius,
    );
    this[CTX].fill();
  }

  /**
   * Draw a line on the canvas.
   * @param {number} x0 The start x position
   * @param {number} y0 The start y position
   * @param {number} x1 The end x position
   * @param {number} y1 The start y position
   */
  drawLine(x0: number, y0: number, x1: number, y1: number) {
    this[CTX].beginPath();
    this[CTX].moveTo(x0, y0);
    this[CTX].lineTo(x1, y1);
    this[CTX].stroke();
  }

  /**
   * Draw a quadratic bezier curve on the canvas.
   * @param {*} x0 The starting x position
   * @param {*} y0 The starting y position
   * @param {*} x1 The ending x position
   * @param {*} y1 The ending y position
   * @param {*} xControl The control point x position
   * @param {*} yControl The control point y position
   */
  drawQuadratic(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    xControl: number,
    yControl: number,
  ) {
    this[CTX].beginPath();
    this[CTX].moveTo(x0, y0);
    this[CTX].quadraticCurveTo(xControl, yControl, x1, y1);
    this[CTX].stroke();
  }

  /**
   * Scale the canvas.
   * @param {number} xScale
   * @param {number} yScale
   */
  scale(xScale: number, yScale: number) {
    this[CTX].scale(xScale, yScale);
  }

  /**
   * Translate the canvas.
   * @param {number} xOffset
   * @param {number} yOffset
   */
  translate(xOffset: number, yOffset: number) {
    this[CTX].translate(xOffset, yOffset);
  }

  translateCenterTo(xOffset: number, yOffset: number) {
    this[CTX].translate(-xOffset + this.width / 2, -yOffset + this.height / 2);
  }

  setLineWidth(width: number) {
    this[CTX].lineWidth = width;
  }

  get lineWidth() {
    return this[CTX].lineWidth;
  }

  setLineDash(pattern: number[]) {
    this[CTX].setLineDash(pattern);
  }

  /**
   * Set the colour to be used for drawing on the canvas.
   * @param {string} colorString The name of the color to be used
   */
  setColor(colorString: CanvasRenderingContext2D["fillStyle"]) {
    if (colorString === this[CTX].fillStyle) {
      return;
    }

    this[CTX].fillStyle = colorString;
    this[CTX].strokeStyle = colorString;
  }

  /**
   * Set the current color via RGB.
   * @param {number} red Red value from 0-255
   * @param {number} green Green value from 0-255
   * @param {number} blue Blue value from 0-255
   * @param {number | undefined} alpha Alpha value from 0-255
   */
  setColorRGB(red: number, green: number, blue: number, alpha = 255) {
    this.setColor(rgbaColor(red, green, blue, alpha));
  }

  /**
   * Set the current color with hue, saturation, lightness and alpha.
   * @param {number} hue Hue value from 0-359
   * @param {number} saturation Saturation value from 0-1
   * @param {number} lightness Lightness value from 0-1
   * @param {number | undefined} alpha Alpha value from 0-1
   */
  setColorHSLA(hue: number, saturation: number, lightness: number, alpha = 1) {
    this.setColor(hslaColor(hue, saturation, lightness, alpha));
  }

  createGradient(x0: number, y0: number, x1: number, y1: number) {
    return this[CTX].createLinearGradient(x0, y0, x1, y1);
  }

  createRadialGradient(
    x0: number,
    y0: number,
    r0: number,
    x1: number,
    y1: number,
    r1: number,
  ) {
    return this[CTX].createRadialGradient(x0, y0, r0, x1, y1, r1);
  }

  saveTransform() {
    this[CTX].save();
  }

  restoreTransform() {
    this[CTX].restore();
  }

  /**
   * Draw another image to this canvas
   * @param {Canvas} imageSource
   * @param {number} sourceX
   * @param {number} sourceY
   * @param {number} sourceWidth
   * @param {number} sourceHeight
   * @param {number} destinationX
   * @param {number} destinationY
   * @param {number} destinationWidth
   * @param {nubmer} destinationHeight
   */
  drawImage(
    imageSource: Canvas | HTMLImageElement,
    sourceX: number,
    sourceY: number,
    sourceWidth: number,
    sourceHeight: number,
    destinationX: number,
    destinationY: number,
    destinationWidth: number,
    destinationHeight: number,
  ) {
    let image: CanvasImageSource;
    if (imageSource instanceof Canvas) {
      image = imageSource[CANVAS];
    } else if (imageSource instanceof Image) {
      if (!imageSource.complete) {
        return;
      }
      image = imageSource;
    } else {
      throw Error("Drawing something unmanageable");
    }

    this[CTX].drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      destinationX,
      destinationY,
      destinationWidth,
      destinationHeight,
    );
  }

  /**
   * Create a Canvas from an id.
   * @param {string} id The id attribute of the HTMLCanvasElement
   */
  static fromId(id: string) {
    const canvas = document.getElementById(id);

    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error(`Could not find canvas with id: "${id}"`);
    }

    return new Canvas(canvas);
  }

  /**
   * Create a new HTMLCanvasElement and use that as the basis for a Canvas.
   */
  static fromScratch(width: number, height: number) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    return new Canvas(canvas);
  }
}

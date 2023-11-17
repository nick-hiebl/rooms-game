import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  ON_SCREEN_CANVAS_HEIGHT,
  ON_SCREEN_CANVAS_WIDTH,
} from "./constants/ScreenConstants";
import { Vector } from "./math/Vector";

import { Canvas } from "./Canvas";

const REAL_CANVAS = Symbol("real-canvas");

function getRawCanvas(): HTMLCanvasElement {
  const rawCanvas = document.getElementById("canvas");

  if (!(rawCanvas instanceof HTMLCanvasElement)) {
    throw new Error("Could not find canvas");
  }

  rawCanvas.width = ON_SCREEN_CANVAS_WIDTH;
  rawCanvas.height = ON_SCREEN_CANVAS_HEIGHT;

  return rawCanvas;
}

export class ScreenManager {
  [REAL_CANVAS]: Canvas;
  // background: Canvas;
  // behindGroundCanvas: Canvas;
  staticWorldCanvas: Canvas;
  dynamicWorldCanvas: Canvas;
  uiCanvas: Canvas;
  camera: Vector;

  constructor() {
    const screenCanvas = new Canvas(getRawCanvas());

    if (!(screenCanvas instanceof Canvas)) {
      throw Error("No canvas found!");
    }

    this[REAL_CANVAS] = screenCanvas;

    // this.background = Canvas.fromScratch(CANVAS_WIDTH * 3, CANVAS_HEIGHT * 4);

    // this.behindGroundCanvas = Canvas.fromScratch(
    //   CANVAS_WIDTH * 3,
    //   CANVAS_HEIGHT * 4
    // );
    this.staticWorldCanvas = Canvas.fromScratch(
      CANVAS_WIDTH * 3,
      CANVAS_HEIGHT * 4
    );
    this.dynamicWorldCanvas = Canvas.fromScratch(
      CANVAS_WIDTH * 3,
      CANVAS_HEIGHT * 4
    );
    this.uiCanvas = Canvas.fromScratch(
      ON_SCREEN_CANVAS_WIDTH,
      ON_SCREEN_CANVAS_HEIGHT
    );

    // Stores the top-left position of the camera
    this.camera = new Vector(0, 0);
  }

  setCamera(cameraPosition: Vector) {
    this.camera = Vector.diff(cameraPosition, new Vector(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2));
  }

  drawCanvas(
    canvas: Canvas,
    camera: Vector,
    width = CANVAS_WIDTH,
    height = CANVAS_HEIGHT
  ) {
    this[REAL_CANVAS].drawImage(
      canvas,
      camera.x,
      camera.y,
      width,
      height,
      0,
      0,
      this[REAL_CANVAS].width,
      this[REAL_CANVAS].height
    );
  }

  drawToScreen() {
    this[REAL_CANVAS].clear();
    // this.drawCanvas(this.background, this.camera);
    // this.drawCanvas(this.behindGroundCanvas, this.camera);
    this.drawCanvas(this.staticWorldCanvas, this.camera);
    this.drawCanvas(this.dynamicWorldCanvas, this.camera);
    this.drawCanvas(
      this.uiCanvas,
      new Vector(0, 0),
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
    );
  }

  static instance = null;
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    return new ScreenManager();
  }
}

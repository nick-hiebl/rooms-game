import { GameModeManager } from "./GameModeManager";
import { InputEvent, InputManager } from "./InputManager";
import { ScreenManager } from "./ScreenManager";

const MAX_FRAME_TIME = 1 / 20;

export class App {
  gameModeManager: GameModeManager;
  inputManager: InputManager;
  screenManager: ScreenManager;

  lastFrameTime = 0;

  constructor() {
    this.gameModeManager = new GameModeManager();
    this.inputManager = new InputManager((input) => this.onInput(input));
    this.screenManager = new ScreenManager();

    this.lastFrameTime = performance.now();
  }

  start() {
    this.inputManager.init();
    requestAnimationFrame(() => this.mainLoop());
  }

  /**
   * Function for when an interaction input occurs from the InputManager
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input: InputEvent) {
    this.gameModeManager.onInput(input);
  }

  mainLoop() {
    const now = performance.now();

    const deltaTime = Math.min(
      (now - this.lastFrameTime) / 1000,
      MAX_FRAME_TIME,
    );

    this.gameModeManager.update(deltaTime, this.inputManager.getInputState());
    this.gameModeManager.draw(this.screenManager);
    this.screenManager.drawToScreen();

    requestAnimationFrame(() => this.mainLoop());
    this.lastFrameTime = now;
  }
}

const main = () => {
  const app = new App();

  app.start();
};

window.onload = () => {
  main();
};

// import { LevelManager } from "../level/LevelManager";
import { Room } from "../room/Room";
// import { ExitEvent, LevelEvent } from "../level/LevelEvent";
import { InputEvent, InputState } from "../InputManager";
import { ScreenManager } from "../ScreenManager";
import { GameModeManager } from "../GameModeManager";
import { Vector } from "../math/Vector";

export class PlayMode {
  gameModeManager: GameModeManager;
  // levelManager: LevelManager;

  currentRoom: Room;

  constructor(gameModeManager: GameModeManager) {
    this.gameModeManager = gameModeManager;
    // this.levelManager = new LevelManager();

    this.currentRoom = new Room("abc", 900, 600);
    this.startLevel(this.currentRoom);
  }

  startLevel(room: Room) {
    this.currentRoom = room;
    room.start(/* this */);
  }

  onStart() {
    this.currentRoom.start();
  }

  // onLevelEvent(event: LevelEvent) {
  //   if (event.isExitEvent()) {
  //     const exitTrigger = (event as ExitEvent).exitTrigger;
  //     this.startLevel(this.levelManager.getLevel(exitTrigger.key, exitTrigger));
  //   } else if (event.isOpenMapEvent()) {
  //     // this.gameModeManager.switchToMode(this.gameModeManager.mapMode);
  //   }
  // }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   * @param {object} inputState The current state of inputs.
   */
  update(deltaTime: number, inputState: InputState) {
    this.currentRoom?.update(deltaTime, inputState);
  }

  /**
   * Function for when an interaction input occurs from the InputManager
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input: InputEvent) {
    this.currentRoom?.onInput(input);
  }

  /**
   * Draw.
   * @param {ScreenManager} screenManager The screenManager to draw upon.
   */
  draw(screenManager: ScreenManager) {
    this.currentRoom?.draw(screenManager);
  }
}

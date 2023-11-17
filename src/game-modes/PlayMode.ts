// import { LevelManager } from "../level/LevelManager";
import { Room } from "../room/Room";
// import { ExitEvent, LevelEvent } from "../level/LevelEvent";
import { InputEvent, InputState } from "../InputManager";
import { ScreenManager } from "../ScreenManager";
import { GameModeManager } from "../GameModeManager";
import { GRID_SIZE } from "../constants/WorldConstants";
import { floorTo } from "../math/Common";
import { RoomWeb } from "../room/RoomWeb";
import { ExitEvent, GameEvent } from "./GameEvent";

export class PlayMode {
  gameModeManager: GameModeManager;

  roomWeb: RoomWeb;

  constructor(gameModeManager: GameModeManager) {
    this.gameModeManager = gameModeManager;

    this.roomWeb = new RoomWeb();
    this.startLevel(this.roomWeb.currentRoom);
  }

  startLevel(room: Room) {
    room.start(/* this */);
  }

  onStart() {
    this.roomWeb.currentRoom.start();
  }

  onLevelEvent(event: GameEvent) {
    if (event.isExitEvent()) {
      const exit = (event as ExitEvent);
      this.roomWeb.navigate(exit);
    } else if (event.isOpenMapEvent()) {
      // this.gameModeManager.switchToMode(this.gameModeManager.mapMode);
    }
  }

  /**
   * Update.
   * @param {number} deltaTime The time elapsed since the last update.
   * @param {object} inputState The current state of inputs.
   */
  update(deltaTime: number, inputState: InputState) {
    this.roomWeb.currentRoom.update(deltaTime, inputState, this);
  }

  /**
   * Function for when an interaction input occurs from the InputManager
   * @param {InputEvent} input The input event to be processed
   */
  onInput(input: InputEvent) {
    this.roomWeb.currentRoom.onInput(input);
  }

  /**
   * Draw.
   * @param {ScreenManager} screenManager The screenManager to draw upon.
   */
  draw(screenManager: ScreenManager) {
    this.roomWeb.currentRoom.draw(screenManager);
  }
}

import { Canvas } from "../Canvas";
import { GameModeManager } from "../GameModeManager";
import {
  ClickEvent,
  InputEvent,
  InputState,
  ScrollEvent,
} from "../InputManager";
import { Room } from "../room/Room";
import { clamp, floorTo } from "../math/Common";
import { Vector } from "../math/Vector";
import { ScreenManager } from "../ScreenManager";
import { PlayMode } from "./PlayMode";
import { parseKey, RoomWeb } from "../room/RoomWeb";
import {
  GRID_SIZE,
  WORLD_GRID_HEIGHT,
  WORLD_GRID_WIDTH,
} from "../constants/WorldConstants";

const DEBUG_SHOW_ALL_ROOMS = document.location.toString().includes("localhost");

const MAX_ZOOM = 0.5;
const MIN_ZOOM = 0.05;
const ZOOM_SPEED = 0.001;

const ZOOM_LEVELS = [0.05, 0.1, 0.15, 0.2, 0.3, 0.5];
const ZOOMS_REVERSED = ZOOM_LEVELS.slice();
ZOOMS_REVERSED.reverse();

const MAP_PLAYER_SCALE = 60;

const MAP_CANVAS_SCALE = 10;

interface MapInteractible {
  room: Room;
  interactible: unknown;
  isHovered: boolean;
  position: Vector;
}

export class MapMode {
  gameModeManager: GameModeManager;
  playMode: PlayMode;
  cameraPosition: Vector;
  zoom: number;

  mousePosition: Vector;
  isClicked: boolean;
  hoverPosition: Vector;

  canvasW: number;
  canvasH: number;

  roomCanvasMap: Map<string, Canvas>;
  drawIcons: MapInteractible[];

  constructor(gameModeManager: GameModeManager) {
    this.gameModeManager = gameModeManager;
    this.playMode = gameModeManager.playMode;
    this.cameraPosition = new Vector(0, 0);
    this.setCameraPos();
    this.zoom = MAX_ZOOM;

    this.mousePosition = new Vector(0, 0);
    this.isClicked = false;
    this.hoverPosition = new Vector(0, 0);

    this.canvasW = 0;
    this.canvasH = 0;

    this.roomCanvasMap = new Map<string, Canvas>();
    this.drawIcons = [];
  }

  setCameraPos() {
    const currentRoom = this.playMode.roomWeb.currentRoom;
    this.cameraPosition = Vector.add(
      this.getRoomPosition(currentRoom),
      new Vector(currentRoom.width / 2, currentRoom.height / 2),
    );
  }

  onStart() {
    this.setCameraPos();
    this.mousePosition = new Vector(0, 0);
    this.isClicked = false;
    this.hoverPosition = new Vector(0, 0);

    this.predrawRooms();
    this.drawIcons = this.getIconsToShow();
  }

  getIconsToShow(): MapInteractible[] {
    const icons: MapInteractible[] = [];
    // for (const room of this.playMode.roomWeb.rooms) {
    //   for (const entity of room.entities) {
    //     if (interactible.showAsMapIcon) {
    //       icons.push({
    //         room,
    //         entity,
    //         position: Vector.add(level.worldPosition, interactible.position),
    //         isHovered: false,
    //       });
    //     }
    //   }
    // }

    return icons;
  }

  predrawRooms() {
    for (const room of this.playMode.roomWeb.rooms) {
      if (!DEBUG_SHOW_ALL_ROOMS && !room.visited) {
        continue;
      }

      const canvas =
        this.roomCanvasMap.get(room.key) ||
        Canvas.fromScratch(
          ((room.width * 1) / GRID_SIZE) * MAP_CANVAS_SCALE,
          ((room.height * 1) / GRID_SIZE) * MAP_CANVAS_SCALE,
        );

      // canvas.saveTransform();
      // canvas.scale(, );
      room.drawForMap(canvas);
      // canvas.restoreTransform();

      this.roomCanvasMap.set(room.key, canvas);
    }
  }

  toWorldPosition(position: Vector) {
    return Vector.add(
      Vector.scale(position, 1 / this.zoom),
      this.cameraPosition,
    );
  }

  update(_deltaTime: number, inputState: InputState) {
    const currentWorldPos = this.toWorldPosition(inputState.mousePosition);

    this.hoverPosition = this.toWorldPosition(inputState.mousePosition);

    let found: MapInteractible | undefined = undefined;
    for (const icon of this.drawIcons) {
      // Only allow one icon to be hovered
      if (found) {
        icon.isHovered = false;
        continue;
      }

      if (Vector.sqrDist(icon.position, currentWorldPos) < 32) {
        icon.isHovered = true;
        found = icon;
      } else {
        icon.isHovered = false;
      }
    }

    if (inputState.isLeftClicking() && this.isClicked) {
      this.cameraPosition.subtract(
        Vector.diff(currentWorldPos, this.mousePosition),
      );
    } else {
      this.isClicked = false;
    }
  }

  onInput(inputEvent: InputEvent) {
    // Do nothing
    if (inputEvent.isClick()) {
      const mousePosition = this.toWorldPosition(
        (inputEvent as ClickEvent).position,
      );

      const room = this.positionToRoomIndex(mousePosition);

      const newRoom = this.playMode.roomWeb.createRoom(room, 2, 2);

      if (newRoom && !this.roomCanvasMap.get(newRoom.key)) {
        this.predrawRooms();
      }
      // const hoveredIcon = this.drawIcons.find((icon) => icon.isHovered);

      // const isAPortalActive = this.playMode.currentLevel.interactingWith instanceof PortalInteractible;

      // if (hoveredIcon && isAPortalActive) {
      //   const event = hoveredIcon.interactible.clickedOnMap();

      //   if (event) {
      //     event.process(this.playMode);
      //     this.gameModeManager.switchToMode(this.playMode);
      //   }
      // }

      const event = inputEvent as ClickEvent;
      if (!event.isRightClick()) {
        this.mousePosition = this.toWorldPosition(event.position);
        this.isClicked = true;
      }
    } else if (inputEvent.isScroll()) {
      const scroll = inputEvent as ScrollEvent;
      if (scroll.discrete) {
        if (scroll.delta > 0) {
          this.zoom = ZOOM_LEVELS.find((x) => x > this.zoom) || MAX_ZOOM;
        } else {
          this.zoom = ZOOMS_REVERSED.find((x) => x < this.zoom) || MIN_ZOOM;
        }
      } else {
        this.zoom = clamp(
          this.zoom + scroll.delta * -ZOOM_SPEED,
          MIN_ZOOM,
          MAX_ZOOM,
        );
      }
    }
  }

  getRoomPosition(room: Room) {
    const { x, y } = room.position;

    return new Vector(x * WORLD_GRID_WIDTH, y * WORLD_GRID_HEIGHT);
  }

  positionToRoomIndex(position: Vector) {
    const hoveredRoomPosition = new Vector(
      floorTo(position.x, WORLD_GRID_WIDTH),
      floorTo(position.y, WORLD_GRID_HEIGHT),
    );

    return new Vector(
      hoveredRoomPosition.x / WORLD_GRID_WIDTH,
      hoveredRoomPosition.y / WORLD_GRID_HEIGHT,
    );
  }

  draw(screenManager: ScreenManager) {
    const currentRoom = this.playMode.roomWeb.currentRoom;

    const canvas = screenManager.uiCanvas;
    this.canvasW = canvas.width;
    this.canvasH = canvas.height;

    canvas.setColor("black");
    canvas.fillRect(0, 0, canvas.width, canvas.height);

    canvas.saveTransform();
    canvas.translate(canvas.width / 2, canvas.height / 2);

    canvas.scale(this.zoom, this.zoom);

    canvas.translate(-this.cameraPosition.x, -this.cameraPosition.y);

    const currentPlayer = currentRoom.player;

    for (const room of this.playMode.roomWeb.rooms) {
      const roomCanvas = this.roomCanvasMap.get(room.key);
      if ((!DEBUG_SHOW_ALL_ROOMS && !room.visited) || !roomCanvas) {
        continue;
      }

      const position = this.getRoomPosition(room);

      // const hoverPositionInRoom = Vector.diff(this.hoverPosition, position);

      // const isHovered = hoverPositionInRoom.x >= 0 && hoverPositionInRoom.x < room.width &&
      //   hoverPositionInRoom.y >= 0 && hoverPositionInRoom.y < room.height;

      canvas.drawImage(
        roomCanvas,
        0,
        0,
        roomCanvas.width,
        roomCanvas.height,
        position.x,
        position.y,
        room.width,
        room.height,
      );
    }

    const hoveredRoom = new Vector(
      floorTo(this.hoverPosition.x, WORLD_GRID_WIDTH),
      floorTo(this.hoverPosition.y, WORLD_GRID_HEIGHT),
    );

    canvas.setColor("#fff6");
    canvas.setLineWidth(4);
    canvas.strokeRect(
      hoveredRoom.x,
      hoveredRoom.y,
      WORLD_GRID_WIDTH,
      WORLD_GRID_HEIGHT,
    );

    if (currentPlayer) {
      const worldPosition = this.getRoomPosition(currentRoom);
      const offset = Vector.add(
        worldPosition,
        new Vector(currentRoom.width / 2, currentRoom.height / 2),
      );
      canvas.translate(offset.x, offset.y);

      canvas.setLineWidth(8);
      canvas.setLineDash([]);

      canvas.setColor("white");
      canvas.fillEllipse(0, 0, MAP_PLAYER_SCALE, MAP_PLAYER_SCALE);
      canvas.setColor("black");
      canvas.strokeEllipse(0, 0, MAP_PLAYER_SCALE, MAP_PLAYER_SCALE);

      canvas.translate(-offset.x, -offset.y);
    }

    canvas.setColor("pink");
    canvas.fillEllipse(this.hoverPosition.x, this.hoverPosition.y, 5, 5);

    // const zoom = this.zoom / 2;

    // for (const { room, interactible, isHovered } of this.drawIcons) {
    //   const worldPosition = this.getRoomPosition(room);
    //   const offset = Vector.add(worldPosition, interactible.position);
    //   canvas.translate(offset.x, offset.y);
    //   const innerZoom = isHovered ? zoom * 0.8 : zoom;
    //   canvas.scale(1 / innerZoom, 1 / innerZoom);

    //   interactible.drawAsMapIcon(canvas, room);

    //   canvas.scale(innerZoom, innerZoom);
    //   canvas.translate(-offset.x, -offset.y);
    // }

    canvas.restoreTransform();
  }
}

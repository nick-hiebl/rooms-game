import { Canvas } from "../Canvas";
import {
  GRID_SIZE,
  WORLD_GRID_HEIGHT,
  WORLD_GRID_WIDTH,
} from "../constants/WorldConstants";
import { ExitEvent } from "../game-modes/GameEvent";
import { PlayMode } from "../game-modes/PlayMode";
import { InputEvent, InputState } from "../InputManager";
import { clamp, floorTo } from "../math/Common";
import { Rectangle } from "../math/Shapes";
import { Vector } from "../math/Vector";
import { ScreenManager } from "../ScreenManager";
import { Player } from "./Player";
import { encodeKey } from "./RoomWeb";

const DOORWAY_SIZE = GRID_SIZE * 2;

const BOUNDARY = 50;

const randint = (max: number) => Math.floor(Math.random() * max);

export class Room {
  key: string;
  width: number;
  height: number;
  collider: Rectangle;

  position: Vector;

  player: Player;
  camera: Vector;

  visited = false;
  backgroundDirty = true;

  blocks: Rectangle[];
  exits: [Rectangle, ExitEvent][];

  color: string;

  constructor(position: Vector, width: number, height: number) {
    this.color = `hsl(${randint(360)}, ${randint(20) + 50}%, ${
      randint(30) + 60
    }%)`;

    this.key = encodeKey(position);
    this.width = floorTo(width, WORLD_GRID_WIDTH);
    this.height = floorTo(height, WORLD_GRID_HEIGHT);

    this.position = position;

    this.collider = Rectangle.widthForm(0, 0, this.width, this.height);

    this.camera = new Vector(this.width / 2, this.height / 2);
    this.player = new Player(this.camera.copy());

    this.blocks = [];
    for (let i = GRID_SIZE; i < this.width - GRID_SIZE; i += GRID_SIZE) {
      for (let j = GRID_SIZE; j < this.height - GRID_SIZE; j += GRID_SIZE) {
        if (Math.random() < 0.02) {
          this.blocks.push(new Rectangle(i, j, i + GRID_SIZE, j + GRID_SIZE));
        }
      }
    }

    const widthUnits = this.width / WORLD_GRID_WIDTH;
    const heightUnits = this.height / WORLD_GRID_HEIGHT;

    const B = BOUNDARY,
      D = DOORWAY_SIZE,
      GW = WORLD_GRID_WIDTH,
      GH = WORLD_GRID_HEIGHT;

    this.exits = [];

    for (let x = 0; x < widthUnits; x++) {
      this.blocks.push(
        // Top
        Rectangle.widthForm(-B + x * GW, -B, GW / 2 - D + B, B),
        Rectangle.widthForm((x + 1 / 2) * GW + D, -B, GW / 2 - D + B, B),
        // Bottom
        Rectangle.widthForm(-B + x * GW, heightUnits * GH, GW / 2 - D + B, B),
        Rectangle.widthForm(
          (x + 1 / 2) * GW + D,
          heightUnits * GH,
          GW / 2 - D + B,
          B,
        ),
      );

      this.exits.push(
        // Top
        [
          Rectangle.widthForm((x + 1 / 2) * GW - D, -B, D * 2, B),
          new ExitEvent(
            this.position,
            new Vector(this.position.x + x, this.position.y - 1),
            "up",
          ),
        ],
        // Bottom
        [
          Rectangle.widthForm((x + 1 / 2) * GW - D, heightUnits * GH, D * 2, B),
          new ExitEvent(
            this.position,
            new Vector(this.position.x + x, this.position.y + heightUnits),
            "down",
          ),
        ],
      );
    }

    for (let y = 0; y < heightUnits; y++) {
      this.blocks.push(
        // Left
        Rectangle.widthForm(-B, -B + y * GH, B, GH / 2 - D + B),
        Rectangle.widthForm(-B, (y + 1 / 2) * GH + D, B, GH / 2 - D + B),
        // Right
        Rectangle.widthForm(widthUnits * GW, -B + y * GH, B, GH / 2 - D + B),
        Rectangle.widthForm(
          widthUnits * GW,
          (y + 1 / 2) * GH + D,
          B,
          GH / 2 - D + B,
        ),
      );

      this.exits.push(
        // Left
        [
          Rectangle.widthForm(-B, (y + 1 / 2) * GH - D, B, D * 2),
          new ExitEvent(
            this.position,
            new Vector(this.position.x - 1, this.position.y + y),
            "left",
          ),
        ],
        // Right
        [
          Rectangle.widthForm(widthUnits * GW, (y + 1 / 2) * GH - D, B, D * 2),
          new ExitEvent(
            this.position,
            new Vector(this.position.x + widthUnits, this.position.y + y),
            "right",
          ),
        ],
      );
    }
  }

  start() {
    this.visited = true;
    this.backgroundDirty = true;
  }

  update(deltaTime: number, inputState: InputState, mode: PlayMode) {
    // ...
    this.player.update(deltaTime, inputState, this);

    const exit = this.exits.find(([exit]) =>
      exit.intersectsPoint(this.player.collider.center),
    );

    if (exit) {
      mode.onLevelEvent(exit[1]);
    }

    this.camera = this.player.collider.center.copy();
    this.camera.x = clamp(
      this.camera.x,
      WORLD_GRID_WIDTH / 2,
      this.width - WORLD_GRID_WIDTH / 2,
    );
    this.camera.y = clamp(
      this.camera.y,
      WORLD_GRID_HEIGHT / 2,
      this.height - WORLD_GRID_HEIGHT / 2,
    );
  }

  onInput(input: InputEvent) {
    // waddap
    this.player.onInput(input, this);
  }

  interactOnCell(position: Vector) {
    let removedIndex = -1;
    for (let index = 0; index < this.blocks.length; index++) {
      const block = this.blocks[index];
      if (
        block.x1 === position.x &&
        block.y1 === position.y &&
        block.width === GRID_SIZE &&
        block.height === GRID_SIZE
      ) {
        removedIndex = index;
        break;
      }
    }

    if (removedIndex !== -1) {
      this.backgroundDirty = true;
      this.blocks.splice(removedIndex, 1);
      return;
    } else {
      const newRect = Rectangle.widthForm(
        position.x,
        position.y,
        GRID_SIZE,
        GRID_SIZE,
      );

      if (
        !this.collider.intersectsPoint(newRect.midpoint) ||
        this.exits.some(([exit]) => exit.intersectsRectangle(newRect))
      ) {
        return;
      }

      const overlap = this.player.collider.intersectsBy(newRect);

      if (overlap < 5) {
        this.backgroundDirty = true;
        this.blocks.push(newRect);
      } else {
        // Do nothing
      }
    }
  }

  draw(screenManager: ScreenManager) {
    screenManager.setCamera(
      this.camera.copy().add(new Vector(BOUNDARY, BOUNDARY)),
    );

    screenManager.uiCanvas.clear();

    if (this.backgroundDirty) {
      this.backgroundDirty = false;

      const canvas = screenManager.staticWorldCanvas;
      canvas.clear();

      canvas.translate(BOUNDARY, BOUNDARY);

      canvas.setColor("black");
      canvas.setLineWidth(5);
      canvas.strokeRect(0, 0, this.width, this.height);

      canvas.setColor(this.color);
      canvas.fillRect(0, 0, this.width, this.height);

      canvas.setColor("gray");
      this.blocks.forEach((block) => block.draw(canvas));

      canvas.translate(-BOUNDARY, -BOUNDARY);
    }

    const canvas = screenManager.dynamicWorldCanvas;
    canvas.clear();

    canvas.translate(BOUNDARY, BOUNDARY);

    this.player.draw(canvas);

    canvas.translate(-BOUNDARY, -BOUNDARY);
  }

  drawForMap(canvas: Canvas) {
    const INSET = 4;

    const insetRect = (insetBy: number) =>
      canvas.fillRect(
        insetBy * INSET,
        insetBy * INSET,
        canvas.width - insetBy * INSET * 2,
        canvas.height - insetBy * INSET * 2,
      );

    canvas.setColor("grey");
    insetRect(1);

    canvas.setColor(this.color);
    insetRect(2);
  }

  enterFrom(event: ExitEvent) {
    const BUFF = 10;
    const map = {
      up: new Vector(WORLD_GRID_WIDTH / 2, WORLD_GRID_HEIGHT - BUFF),
      right: new Vector(BUFF, WORLD_GRID_HEIGHT / 2),
      down: new Vector(WORLD_GRID_WIDTH / 2, BUFF),
      left: new Vector(WORLD_GRID_WIDTH - BUFF, WORLD_GRID_HEIGHT / 2),
    };

    const cellInRoom = Vector.diff(event.toKey, this.position);

    this.player.collider.center = Vector.add(
      new Vector(
        cellInRoom.x * WORLD_GRID_WIDTH,
        cellInRoom.y * WORLD_GRID_HEIGHT,
      ),
      map[event.direction],
    );

    this.start();
  }
}

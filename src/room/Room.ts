import { Canvas } from "../Canvas";
import { GRID_SIZE, WORLD_GRID_HEIGHT, WORLD_GRID_WIDTH } from "../constants/WorldConstants";
import { Direction, ExitEvent } from "../game-modes/GameEvent";
import { PlayMode } from "../game-modes/PlayMode";
import { InputEvent, InputState } from "../InputManager";
import { clamp, floorTo } from "../math/Common";
import { Rectangle } from "../math/Shapes";
import { Vector } from "../math/Vector";
import { ScreenManager } from "../ScreenManager";
import { Player } from "./Player";
import { encodeKey, parseKey } from "./RoomWeb";

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
  exits: [Rectangle, Direction][];

  color: string;

  constructor(position: Vector, width: number, height: number) {
    this.color = `hsl(${randint(360)}, ${randint(20) + 50}%, ${randint(30) + 60}%)`;

    this.key = encodeKey(position);
    this.width = floorTo(width, 2 * GRID_SIZE);
    this.height = floorTo(height, 2 * GRID_SIZE);

    this.position = position;

    this.collider = Rectangle.widthForm(0, 0, this.width, this.height);

    this.camera = new Vector(this.width / 2, this.height / 2);
    this.player = new Player(this.camera.copy());

    this.blocks = [];
    for (let i = GRID_SIZE; i < this.width - GRID_SIZE; i += GRID_SIZE) {
      for (let j = GRID_SIZE; j < this.height - GRID_SIZE; j += GRID_SIZE) {
        if (Math.random() < 0.06) {
          this.blocks.push(new Rectangle(i, j, i + GRID_SIZE, j + GRID_SIZE));
        }
      }
    }

    this.blocks.push(...[
      new Rectangle(-BOUNDARY, -BOUNDARY, this.width / 2 - DOORWAY_SIZE, 0),
      new Rectangle(this.width / 2 + DOORWAY_SIZE, -BOUNDARY, this.width + BOUNDARY, 0),
      new Rectangle(this.width, -BOUNDARY, this.width + BOUNDARY, this.height / 2 - DOORWAY_SIZE),
      new Rectangle(this.width, this.height / 2 + DOORWAY_SIZE, this.width + BOUNDARY, this.height + BOUNDARY),
      new Rectangle(this.width / 2 + DOORWAY_SIZE, this.height, this.width + BOUNDARY, this.height + BOUNDARY),
      new Rectangle(-BOUNDARY, this.height, this.width / 2 - DOORWAY_SIZE, this.height + BOUNDARY),
      new Rectangle(-BOUNDARY, this.height / 2 + DOORWAY_SIZE, 0, this.height + BOUNDARY),
      new Rectangle(-BOUNDARY, -BOUNDARY, 0, this.height / 2 - DOORWAY_SIZE),
    ]);

    this.exits = [
      [Rectangle.widthForm(this.width / 2 - DOORWAY_SIZE, -BOUNDARY, DOORWAY_SIZE * 2, BOUNDARY), 'up'],
      [Rectangle.widthForm(-BOUNDARY, this.height / 2 - DOORWAY_SIZE, BOUNDARY, DOORWAY_SIZE * 2), 'left'],
      [Rectangle.widthForm(this.width / 2 - DOORWAY_SIZE, this.height, DOORWAY_SIZE * 2, BOUNDARY), 'down'],
      [Rectangle.widthForm(this.width, this.height / 2 - DOORWAY_SIZE, BOUNDARY, DOORWAY_SIZE * 2), 'right'],
    ];
  }

  start() {
    this.visited = true;
    this.backgroundDirty = true;
  }

  update(deltaTime: number, inputState: InputState, mode: PlayMode) {
    // ...
    this.player.update(deltaTime, inputState, this);

    const exit = this.exits.find(([exit]) => exit.intersectsPoint(this.player.collider.center));

    if (exit) {
      mode.onLevelEvent(new ExitEvent(this.key, exit[1]));
    }

    this.camera = this.player.collider.center.copy();
    this.camera.x = clamp(this.camera.x, WORLD_GRID_WIDTH / 2, this.width - WORLD_GRID_WIDTH / 2);
    this.camera.y = clamp(this.camera.y, WORLD_GRID_HEIGHT / 2, this.height - WORLD_GRID_HEIGHT / 2);
  }

  onInput(input: InputEvent) {
    // waddap
    this.player.onInput(input, this);
  }

  interactOnCell(position: Vector) {
    let removedIndex = -1;
    for (let index = 0; index < this.blocks.length; index++) {
      const block = this.blocks[index];
      if (block.x1 === position.x && block.y1 === position.y && block.width === GRID_SIZE && block.height === GRID_SIZE) {
        removedIndex = index;
        break;
      }
    }

    if (removedIndex !== -1) {
      this.backgroundDirty = true;
      this.blocks.splice(removedIndex, 1);
      return;
    } else {
      const newRect = Rectangle.widthForm(position.x, position.y, GRID_SIZE, GRID_SIZE);

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
    screenManager.setCamera(this.camera.copy().add(new Vector(BOUNDARY, BOUNDARY)));

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

    // canvas.scale(1/GRID_SIZE, 1/GRID_SIZE);
    // canvas.setColor("grey");
    // this.blocks.forEach(block => block.draw(canvas));
    // canvas.scale(GRID_SIZE, GRID_SIZE);
  }

  enterFrom(event: ExitEvent) {
    const BUFF = 10;
    const map = {
      up: new Vector(this.width / 2, this.height - BUFF),
      right: new Vector(BUFF, this.height / 2),
      down: new Vector(this.width / 2, BUFF),
      left: new Vector(this.width - BUFF, this.height / 2),
    }

    this.player.collider.center = map[event.direction];

    this.start();
  }
}

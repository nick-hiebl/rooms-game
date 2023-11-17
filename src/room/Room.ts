import { Canvas } from "../Canvas";
import { GRID_SIZE } from "../constants/WorldConstants";
import { InputEvent, InputState } from "../InputManager";
import { Rectangle } from "../math/Shapes";
import { Vector } from "../math/Vector";
import { ScreenManager } from "../ScreenManager";
import { Player } from "./Player";

const DOORWAY_SIZE = GRID_SIZE * 2;

const BOUNDARY = 50;

export class Room {
  key: string;
  width: number;
  height: number;

  player: Player;

  camera: Vector;

  blocks: Rectangle[];

  visited = false;

  backgroundDirty = true;

  constructor(key: string, width: number, height: number) {
    this.key = key;
    this.width = width;
    this.height = height;

    this.camera = new Vector(this.width / 2, this.height / 2);
    this.player = new Player(this.camera.copy());

    this.blocks = [];
    for (let i = 0; i < this.width; i += GRID_SIZE) {
      for (let j = 0; j < this.height; j += GRID_SIZE) {
        if (Math.random() < 0.2) {
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
  }

  start() {
    this.visited = true;
  }

  update(deltaTime: number, inputState: InputState) {
    // ...
    this.player.update(deltaTime, inputState, this);
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

    if (removedIndex === -1) {
      const newRect = Rectangle.widthForm(position.x, position.y, GRID_SIZE, GRID_SIZE);
      const overlap = this.player.collider.intersectsBy(newRect);

      if (overlap < 5) {
        this.backgroundDirty = true;
        this.blocks.push(newRect);
      } else {
        // Do nothing
      }
    } else {
      this.backgroundDirty = true;
      this.blocks.splice(removedIndex, 1);
    }
  }

  draw(screenManager: ScreenManager) {
    screenManager.setCamera(this.camera.copy().add(new Vector(BOUNDARY, BOUNDARY)));

    if (this.backgroundDirty) {
      this.backgroundDirty = false;

      const canvas = screenManager.staticWorldCanvas;
      canvas.clear();

      canvas.translate(BOUNDARY, BOUNDARY);

      canvas.setColor("black");
      canvas.setLineWidth(5);
      canvas.strokeRect(0, 0, this.width, this.height);

      canvas.setColor("white");
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
}

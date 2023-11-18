import { Canvas } from "../Canvas";
import { Input } from "../constants/Keys";
import {
  GRID_SIZE,
  PLAYER_CORNER,
  PLAYER_REACH,
  PLAYER_SIZE,
} from "../constants/WorldConstants";
import { InputEvent, InputState } from "../InputManager";
import { floorTo } from "../math/Common";
import { Octagon } from "../math/Shapes";
import { Vector } from "../math/Vector";
import { Room } from "./Room";

const PLAYER_MAX_SPEED = 500;
const PLAYER_ACCEL = PLAYER_MAX_SPEED / 1.2;

export class Player {
  velocity: Vector;
  collider: Octagon;
  direction: Vector | null;

  constructor(position: Vector) {
    this.collider = new Octagon(position, PLAYER_SIZE, PLAYER_CORNER);

    this.velocity = new Vector(0, 0);
    this.direction = new Vector(0, -1);
  }

  getCursorCell() {
    const cursor = this.direction;

    if (!cursor) {
      return null;
    }

    return new Vector(
      floorTo(cursor.x, GRID_SIZE),
      floorTo(cursor.y, GRID_SIZE),
    );
  }

  onInput(input: InputEvent, room: Room) {
    if (input.isForKey(Input.Interact) || input.isClick()) {
      const cursorCell = this.getCursorCell();
      if (cursorCell) {
        room.interactOnCell(cursorCell);
      }
    }
  }

  update(deltaTime: number, inputState: InputState, room: Room) {
    const inputX = inputState.getHorizontalAxis();
    const inputY = inputState.getVerticalAxis();
    let acceleration = new Vector(inputX, inputY).multiply(PLAYER_ACCEL);

    this.velocity.add(acceleration.multiply(1));
    const totalVel = this.velocity.magnitude;

    // this.direction = this.velocity.copy();
    // this.direction.setMagnitude(GRID_SIZE * 1.0);

    if (totalVel > PLAYER_MAX_SPEED) {
      this.velocity.multiply(PLAYER_MAX_SPEED / totalVel);
    }

    if (acceleration.x === 0 && acceleration.y === 0) {
      this.velocity.multiply(0.5);
    }

    const off = this.velocity.copy().multiply(deltaTime);

    this.collider.center.add(off);

    for (const block of room.blocks) {
      this.collider.collideRectangle(block);
    }

    // this.direction.add(this.collider.center);

    this.direction = Vector.add(inputState.mousePosition, room.camera);

    if (Vector.dist(this.direction, this.collider.center) > PLAYER_REACH) {
      this.direction = null;
    }
  }

  collideWithBlock() {}

  draw(canvas: Canvas) {
    const cursorCell = this.getCursorCell();

    if (cursorCell) {
      canvas.setColor("#0005");
      canvas.setLineWidth(2);

      canvas.strokeRect(cursorCell.x, cursorCell.y, GRID_SIZE, GRID_SIZE);
    }

    canvas.setColor("green");
    this.collider.draw(canvas);
  }
}

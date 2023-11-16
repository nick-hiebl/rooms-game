import { Canvas } from "../Canvas";
import { Input } from "../constants/Keys";
import { InputEvent, InputState } from "../InputManager";
import { roundTo } from "../math/Common";
import { Octagon } from "../math/Shapes";
import { Vector } from "../math/Vector";
import { Room } from "./Room";

const PLAYER_RADIUS = 18;
const CORNER_RADIUS = 8;

const PLAYER_MAX_SPEED = 130;
const PLAYER_ACCEL = PLAYER_MAX_SPEED / 1.2;

export class Player {
  velocity: Vector;
  collider: Octagon;
  direction: Vector;

  constructor(position: Vector) {
    this.collider = new Octagon(position, PLAYER_RADIUS, CORNER_RADIUS);

    this.velocity = new Vector(0, 0);
    this.direction = new Vector(0, -1);
  }

  getCursorCell() {
    const cursor = Vector.add(this.direction, this.collider.center);

    return new Vector(roundTo(cursor.x, 50), roundTo(cursor.y, 50));
  }

  onInput(input: InputEvent, room: Room) {
    if (input.isForKey(Input.Interact)) {
      room.interactOnCell(this.getCursorCell());
    }
  }

  update(deltaTime: number, inputState: InputState, room: Room) {
    const inputX = inputState.getHorizontalAxis();
    const inputY = inputState.getVerticalAxis();
    let acceleration = new Vector(inputX, inputY).multiply(PLAYER_ACCEL);

    this.velocity.add(acceleration.multiply(1));
    const totalVel = this.velocity.magnitude;

    this.direction = this.velocity.copy();
    this.direction.setMagnitude(50 * 0.9);

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
  }

  collideWithBlock() {

  }

  draw(canvas: Canvas) {
    canvas.setColor("#0008");
    canvas.setLineWidth(2);
    const cursorCell = this.getCursorCell();
    canvas.strokeRect(cursorCell.x, cursorCell.y, 50, 50);

    canvas.setColor("green");

    this.collider.draw(canvas);
  }
}

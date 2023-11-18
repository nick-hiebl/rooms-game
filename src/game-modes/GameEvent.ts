import { Vector } from "../math/Vector";

export interface GameEvent {
  isExitEvent(): boolean;
  isOpenMapEvent(): boolean;
}

export type Direction = 'up' | 'left' | 'down' | 'right';

export class ExitEvent implements GameEvent {
  fromKey: Vector;
  toKey: Vector;
  direction: Direction;

  constructor(fromKey: Vector, toKey: Vector, direction: Direction) {
    this.fromKey = fromKey;
    this.toKey = toKey;
    this.direction = direction;
  }

  isExitEvent(): boolean {
    return true;
  }

  isOpenMapEvent(): boolean {
    return false;
  }
}

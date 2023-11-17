export interface GameEvent {
  isExitEvent(): boolean;
  isOpenMapEvent(): boolean;
}

export type Direction = 'up' | 'left' | 'down' | 'right';

export class ExitEvent implements GameEvent {
  roomKey: string;
  direction: Direction;

  constructor(roomKey: string, direction: Direction) {
    this.roomKey = roomKey;
    this.direction = direction;
  }

  isExitEvent(): boolean {
    return true;
  }

  isOpenMapEvent(): boolean {
    return false;
  }
}

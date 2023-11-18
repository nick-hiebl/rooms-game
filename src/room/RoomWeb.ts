import {
  WORLD_GRID_HEIGHT,
  WORLD_GRID_WIDTH,
} from "../constants/WorldConstants";
import { Direction, ExitEvent } from "../game-modes/GameEvent";
import { shuffle } from "../math/Common";
import { Vector } from "../math/Vector";
import { Room } from "./Room";

export const parseKey = (s: string): Vector => {
  const [x, y] = s.split(",").map((x) => parseInt(x));

  return new Vector(x, y);
};

export const encodeKey = (v: Vector): string => {
  return `${v.x},${v.y}`;
};

const makeNewRoomOptions = (direction: Direction): [Vector, number, number][] => {
  const options: [Vector, number, number][] = [
    [new Vector(-2, 0), 3, 1],
    [new Vector(-1, 0), 3, 1],
    [new Vector(0, 0), 3, 1],
    [new Vector(0, -2), 1, 3],
    [new Vector(0, -1), 1, 3],
    [new Vector(0, 0), 1, 3],
    [new Vector(0, 0), 1, 1],
  ];

  switch (direction) {
    case 'up':
      options.push([new Vector(-1, -1), 2, 2], [new Vector(0, -1), 2, 2]);
      break;
    case 'left':
      options.push([new Vector(-1, -1), 2, 2], [new Vector(-1, 0), 2, 2]);
      break;
    case 'down':
      options.push([new Vector(-1, 0), 2, 2], [new Vector(0, 0), 2, 2]);
      break;
    case 'right':
      options.push([new Vector(0, -1), 2, 2], [new Vector(0, 0), 2, 2]);
      break;
  }

  return shuffle(options);
};

const directionMap: Record<Direction, Vector> = {
  up: new Vector(0, -1),
  down: new Vector(0, 1),
  left: new Vector(-1, 0),
  right: new Vector(1, 0),
};

export class RoomWeb {
  currentRoom: Room;

  map: Map<string, Room>;

  rooms: Room[];

  constructor() {
    this.map = new Map();
    this.rooms = [];

    this.currentRoom = this.createRoomWithoutCheckingNeighbors(
      new Vector(0, 0),
    );
  }

  getRoom(position: Vector) {
    return this.map.get(encodeKey(position));
  }

  createRoom(position: Vector, w: number = 1, h: number = 1): Room | undefined {
    let foundNeighbor = false;

    for (let x = 0; x < w; x++) {
      const upKey = encodeKey(new Vector(position.x + x, position.y - 1));
      const downKey = encodeKey(new Vector(position.x + x, position.y + h));
      if (this.map.has(upKey) || this.map.has(downKey)) {
        foundNeighbor = true;
        break;
      }
    }
    if (!foundNeighbor) {
      for (let y = 0; y < h; y++) {
        const leftKey = encodeKey(new Vector(position.x - 1, position.y + y));
        const rightKey = encodeKey(new Vector(position.x + w, position.y + y));
        if (this.map.has(leftKey) || this.map.has(rightKey)) {
          foundNeighbor = true;
          break;
        }
      }
    }

    if (!foundNeighbor) {
      return;
    }

    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const key = encodeKey(new Vector(position.x + x, position.y + y));

        const existingRoom = this.map.get(key);
        if (existingRoom) {
          return;
        }
      }
    }

    return this.createRoomWithoutCheckingNeighbors(position, w, h);
  }

  private createRoomWithoutCheckingNeighbors(
    position: Vector,
    w: number = 1,
    h: number = 1,
  ): Room {
    const keys = [];
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const key = encodeKey(new Vector(position.x + x, position.y + y));
        keys.push(key);

        const existingRoom = this.map.get(key);
        if (existingRoom) {
          console.error("Asked to create an overlapping room!");
          throw Error();
        }
      }
    }

    const newRoom = new Room(
      position,
      WORLD_GRID_WIDTH * w,
      WORLD_GRID_HEIGHT * h,
    );

    for (const key of keys) {
      this.map.set(key, newRoom);
    }
    // this.map.set(newRoom.key, newRoom);
    this.rooms.push(newRoom);

    return newRoom;
  }

  currentRoomPosition() {
    return parseKey(this.currentRoom.key);
  }

  navigate(event: ExitEvent) {
    const { direction, fromKey, toKey } = event;

    const nextKey = encodeKey(toKey);

    const currentRoom = this.map.get(encodeKey(fromKey));

    if (!currentRoom) {
      console.error(
        "Exited a room that does not exist!",
        fromKey,
        Array.from(this.map.keys()),
      );
      return;
    }

    const nextRoom = this.map.get(nextKey);
    if (nextRoom) {
      this.currentRoom = nextRoom;
    } else {
      let newRoom: Room | undefined;

      for (const [offset, w, h] of makeNewRoomOptions(direction)) {
        newRoom = this.createRoom(Vector.add(toKey, offset), w, h);

        if (newRoom) break;
      }

      if (!newRoom) {
        // This should succeed no matter what.
        newRoom = this.createRoom(toKey, 1, 1);
      }

      if (!newRoom) {
        console.error("Failed creating new room!", toKey);
      }

      this.currentRoom = newRoom!;
    }

    this.currentRoom.enterFrom(event);
  }
}

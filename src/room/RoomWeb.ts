import { WORLD_GRID_HEIGHT, WORLD_GRID_WIDTH } from "../constants/WorldConstants";
import { Direction, ExitEvent } from "../game-modes/GameEvent";
import { Vector } from "../math/Vector";
import { Room } from "./Room";

export const parseKey = (s: string): Vector => {
  const [x, y] = s.split(",").map(x => parseInt(x));

  return new Vector(x, y);
};

export const encodeKey = (v: Vector): string => {
  return `${v.x},${v.y}`;
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
    
    this.currentRoom = this.createRoom(new Vector(0, 0));
  }

  createRoom(position: Vector, w: number = 1, h: number = 1) {
    const keys = [];
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        const key = encodeKey(new Vector(position.x + x, position.y + y));
        keys.push(key);

        const existingRoom = this.map.get(key);
        if (existingRoom) {
          return existingRoom;
        }
      }
    }

    const newRoom = new Room(position, WORLD_GRID_WIDTH * w, WORLD_GRID_HEIGHT * h);

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
    const { roomKey, direction } = event;

    const nextPosition = Vector.add(parseKey(roomKey), directionMap[direction]);
    const nextKey = encodeKey(nextPosition)

    const currentRoom = this.map.get(roomKey);

    if (!currentRoom) {
      console.error("Exited a room that does not exist!", roomKey, Array.from(this.map.keys()));
      return;
    }

    const nextRoom = this.map.get(nextKey);
    if (nextRoom) {
      this.currentRoom = nextRoom;
    } else {
      this.currentRoom = this.createRoom(nextPosition);
    }

    this.currentRoom.enterFrom(event);
  }
}

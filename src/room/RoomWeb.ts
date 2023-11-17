import { Direction, ExitEvent } from "../game-modes/GameEvent";
import { Vector } from "../math/Vector";
import { Room } from "./Room";

const parseKey = (s: string): Vector => {
  const [x, y] = s.split(",").map(x => parseInt(x));

  return new Vector(x, y);
};

const encodeKey = (v: Vector): string => {
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

  constructor() {
    this.map = new Map();
    
    this.currentRoom = this.createRoom(new Vector(0, 0));
  }

  createRoom(position: Vector) {
    const newRoom = new Room(encodeKey(position), 900, 600);
    this.map.set(encodeKey(position), newRoom);

    return newRoom;
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

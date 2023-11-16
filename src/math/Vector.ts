export class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(vector: Vector) {
    this.x += vector.x;
    this.y += vector.y;

    return this;
  }

  subtract(vector: Vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  }

  multiply(factor: number) {
    this.x *= factor;
    this.y *= factor;

    return this;
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  setFrom(otherVector: Vector) {
    this.x = otherVector.x;
    this.y = otherVector.y;
  }

  get magnitude(): number {
    return Math.hypot(this.x, this.y);
  }

  setMagnitude(magnitude: number) {
    if (this.x === 0 && this.y == 0) {
      return;
    }

    this.multiply(magnitude / this.magnitude)
  }

  static add(a: Vector, b: Vector) {
    return new Vector(a.x + b.x, a.y + b.y);
  }

  static diff(a: Vector, b: Vector) {
    return new Vector(a.x - b.x, a.y - b.y);
  }

  static scale(vector: Vector, factor: number) {
    return new Vector(vector.x * factor, vector.y * factor);
  }

  static sqrDist(a: Vector, b: Vector): number {
    const xDiff = a.x - b.x;
    const yDiff = a.y - b.y;
    return xDiff * xDiff + yDiff * yDiff;
  }

  /**
   * This is not actually manhattan distance. Consider refactoring.
   */
  static manhattanDist(a: Vector, b: Vector) {
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  }

  static dist(a: Vector, b: Vector) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  static lerp(v1: Vector, v2: Vector, t: number) {
    return new Vector(v1.x * (1 - t) + v2.x * t, v1.y * (1 - t) + v2.y * t);
  }
}

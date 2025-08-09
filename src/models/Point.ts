export interface IPoint {
  x: number;
  y: number;

  id: string;
}

export interface IPointCreation {
  x?: number;
  y?: number;

  id?: string | number;
}

export class Point {
  static instanceIndex = 0;

  constructor(
    public x: number = 0,
    public y: number = 0,
    public id?: string | number,
  ) {
    let newId: string;
    if (typeof id === "string") {
      newId = id;
    } else {
      if (id) {
        newId = Point.createId(id);
      } else {
        newId = Point.createIdBasedOnInstanceIndex();
      }
    }
    this.id = newId;
  }

  static createId(id: number | string): string {
    const className = this.name;
    return `${className}-${id}`;
  }
  static createIdBasedOnInstanceIndex(): string {
    const className = this.name;
    return `${className}-${Point.instanceIndex++}`;
  }

  static create({ x, y }: IPointCreation): Point {
    return new this(x, y);
  }

  static clone(args: Point): Point {
    return this.create(args);
  }

  static getZeroPoint() {
    return new Point(0, 0);
  }

  add(point: Point) {
    const x = this.x + point.x;
    const y = this.y + point.y;

    return new Point(x, y);
  }

  subtract(point: Point) {
    const x = this.x - point.x;
    const y = this.y - point.y;

    return new Point(x, y);
  }

  cloneAndLimitToIntegerByMathFloorFunction() {
    const integerX = Math.floor(this.x);
    const integerY = Math.floor(this.y);

    return new Point(integerX, integerY);
  }

  toString() {
    const className = this.constructor.name;
    return `${className} {x: ${this.x}, y: ${this.y}}`;
  }
}

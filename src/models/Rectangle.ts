import type { MovementDelta } from "./MouseMovementDelta";

export interface IRectangle {
  x: number;
  y: number;
  width: number;
  height: number;

  id: string;
}

export interface IRectangleCreation {
  x: number;
  y: number;
  width: number;
  height: number;

  id?: string | number;
}

export class Rectangle {
  static instanceIndex = 0;
  id: string;

  constructor(
    public x: number = 0,
    public y: number = 0,
    public width: number = 1,
    public height: number = 1,
    id?: string | number,
  ) {
    let newId: string;
    if (typeof id === "string") {
      newId = id;
    } else {
      if (id) {
        newId = Rectangle.createId(id);
      } else {
        newId = Rectangle.createIdBasedOnInstanceIndex();
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
    return `${className}-${Rectangle.instanceIndex++}`;
  }

  static create({ x, y, width, height, id }: IRectangleCreation): Rectangle {
    return new this(x, y, width, height, id);
  }

  static clone(args: IRectangleCreation): Rectangle {
    return this.create(args);
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setSize(width: number, height: number) {
    if (width < 0 || height < 0) {
      throw new Error("Entity2D's width and height have to be greater or equal 0");
    }

    this.width = width;
    this.height = height;
  }

  addDelta(movementDelta: MovementDelta) {
    this.x = this.x + movementDelta.dx;
    this.y = this.y + movementDelta.dy;

    return this;
  }

  toString() {
    const className = this.constructor.name;
    const attributesString = (Object.keys(this) as Array<keyof typeof this>)
      .map((keyName) => `${String(keyName)}: ${this[keyName]}`)
      .join(", ");

    return `${className} {${attributesString}}`;
  }
}

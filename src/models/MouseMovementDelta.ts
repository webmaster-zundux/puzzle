export class MovementDelta {
  constructor(
    public dx: number,
    public dy: number,
  ) {}

  toString() {
    return `MovementDelta {dx: ${this.dx}, dy: ${this.dy}}`;
  }

  public static getZeroMovementDelta() {
    return new MovementDelta(0, 0);
  }

  public divide(value: number) {
    this.dx = this.dx / value;
    this.dy = this.dy / value;

    return this;
  }
}

export class MouseMovementDelta extends MovementDelta {
  toString() {
    return `MovementDelta {dx: ${this.dx}, dy: ${this.dy}}`;
  }

  public static getZeroMovementDelta() {
    return new MouseMovementDelta(0, 0);
  }
}

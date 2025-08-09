export class MouseWheelDelta {
  constructor(
    public dx: number,
    public dy: number,
  ) {}

  toString() {
    return `MouseWheelDelta {dx: ${this.dx}, dy: ${this.dy}}`;
  }

  public static getZeroWheelDelta() {
    return new MouseWheelDelta(0, 0);
  }
}

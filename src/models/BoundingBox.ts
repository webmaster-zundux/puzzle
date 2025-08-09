export class BoundingBox {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public width: number = 1,
    public height: number = 0,
  ) {}

  public static create({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
    return new BoundingBox(x, y, width, height);
  }
}

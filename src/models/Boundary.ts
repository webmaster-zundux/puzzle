export class Boundary {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
  ) {}

  public static getIntersectionBoundaryOfTwoBoundaries(a: Boundary, b: Boundary): Boundary | undefined {
    const x1 = a.x > b.x ? a.x : b.x;
    const y1 = a.y > b.y ? a.y : b.y;

    const aP2X = a.x + a.width;
    const aP2Y = a.y + a.height;

    const bP2X = b.x + b.width;
    const bP2Y = b.y + b.height;

    const x2 = aP2X < bP2X ? aP2X : bP2X;
    const y2 = aP2Y < bP2Y ? aP2Y : bP2Y;

    const width = x2 - x1;
    const height = y2 - y1;

    // checking if they are intersect
    if (width <= 0 || height <= 0) {
      return undefined;
    }

    return {
      x: x1,
      y: y1,
      width,
      height,
    };
  }
}

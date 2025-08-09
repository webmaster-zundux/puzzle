import { Point } from "./Point";

export class Area {
  constructor(
    public p0: Point,
    public p1: Point,
    public p2: Point,
    public p3: Point,
  ) {}

  public static create({
    p0 = Point.getZeroPoint(),
    p1 = Point.getZeroPoint(),
    p2 = Point.getZeroPoint(),
    p3 = Point.getZeroPoint(),
  }: {
    p0: Point;
    p1: Point;
    p2: Point;
    p3: Point;
  }) {
    return new Area(p0, p1, p2, p3);
  }

  public static isPointWithinArea(point: Point | { x: number; y: number }, area: Area): boolean {
    const { p0, p2 } = area;
    const { x: px, y: py } = point;

    if (px < p0.x || px > p2.x) {
      return false;
    }

    if (py < p0.y || py > p2.y) {
      return false;
    }

    return true;
  }

  public static isPointWithinAreaByCornerPoints(
    point: Point | { x: number; y: number },
    areaPointP0: Point | { x: number; y: number },
    areaPointP2: Point | { x: number; y: number },
  ): boolean {
    const tx = point.x;
    const ty = point.y;

    const p0 = areaPointP0;
    const p2 = areaPointP2;

    if (tx < p0.x || tx > p2.x) {
      return false;
    }

    if (ty < p0.y || ty > p2.y) {
      return false;
    }

    return true;
  }

  public static doTwoAreasIntersect(areaA: Area, areaB: Area): boolean {
    const aP0 = areaA.p0;
    const aP2 = areaA.p2;

    const bP0 = areaB.p0;
    const bP2 = areaB.p2;

    return Area.doTwoAreasIntersectByCornerPoints(aP0, aP2, bP0, bP2);
  }

  public static doTwoAreasIntersectByCornerPoints(
    areaAPointP0: Point | { x: number; y: number },
    areaAPointP2: Point | { x: number; y: number },
    areaBPointP0: Point | { x: number; y: number },
    areaBPointP2: Point | { x: number; y: number },
  ): boolean {
    const aP0 = areaAPointP0;
    const aP2 = areaAPointP2;

    const bP0 = areaBPointP0;
    const bP2 = areaBPointP2;

    let intersectionOnXAxis = true;
    let intersectionOnYAxis = true;

    if (aP2.x < bP0.x || aP0.x > bP2.x) {
      intersectionOnXAxis = false;
    }

    if (aP2.y < bP0.y || aP0.y > bP2.y) {
      intersectionOnYAxis = false;
    }

    return intersectionOnXAxis && intersectionOnYAxis;
  }

  public static getDefaultArea() {
    return new Area(new Point(0, 0), new Point(1, 0), new Point(1, 1), new Point(0, 1));
  }

  toString() {
    return `Area {p0: ${this.p0}, p1: ${this.p1}, p2: ${this.p2}, p3: ${this.p3}}`;
  }
}

import type { Id } from "./BaseEntity";
import { BaseEntity } from "./BaseEntity";
import type { PositionDelta } from "./PositionDelta";

export const generatePointIdFromPosition = (x = 0, y = 0): Id => {
  return `${x}:${y}`;
};

export type PositionString = Id;

export const generatePositionString = (x = 0, y = 0): PositionString => {
  return `${x}:${y}`;
};

interface PointCreation {
  x: number;
  y: number;
  id?: string;
}

export class Point extends BaseEntity {
  constructor(
    public x: number,
    public y: number,
    id?: string,
  ) {
    const pointId = id ? id : generatePointIdFromPosition(x, y);
    super({ id: pointId });
  }

  static create({ x, y, id }: PointCreation) {
    return new this(x, y, id);
  }

  static clone(point: Point): Point {
    return Point.create({ x: point.x, y: point.y });
  }

  static getPointAtZero() {
    return new Point(0, 0);
  }

  static isPointInAreaWithCenterPointAndAreaSideSize(point: Point, areaCenterPoint: Point, areaSideSize = 0): boolean {
    const cx = areaCenterPoint.x;
    const cy = areaCenterPoint.y;
    const areaHalfSideSize = areaSideSize / 2;

    const tx = point.x;
    const ty = point.y;

    const p0 = new Point(cx - areaHalfSideSize, cy - areaHalfSideSize);
    const p2 = new Point(cx + areaHalfSideSize, cy + areaHalfSideSize);

    if (tx < p0.x || tx > p2.x) {
      return false;
    }

    if (ty < p0.y || ty > p2.y) {
      return false;
    }

    return true;
  }

  static isPointInAreaByCornerPoints(point: Point, areaPointP0: Point, areaPointP2: Point): boolean {
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

  static addDelta(point: Point, positionDelta: PositionDelta): Point {
    return new Point(point.x + positionDelta.dx, point.y + positionDelta.dy);
  }
}

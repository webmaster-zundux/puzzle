import { Point } from "../models/Point";

export const screenToWorldCoordinates = (
  point: Point,
  scale: number,
  worldOriginPoint: Point = Point.getZeroPoint(),
): Point => {
  const xInWorldScale = point.x / scale;
  const yInWorldScale = point.y / scale;

  const x = -worldOriginPoint.x + xInWorldScale;
  const y = -worldOriginPoint.y + yInWorldScale;

  return new Point(x, y);
};

export const worldToScreenCoordinates = (
  point: Point,
  scale: number,
  worldOriginPoint: Point = Point.getZeroPoint(),
): Point => {
  const x = (point.x + worldOriginPoint.x) * scale;
  const y = (point.y + worldOriginPoint.y) * scale;

  return new Point(x, y);
};

export const screenToWorldSize = (size: number, scale: number): number => {
  return size / scale;
};

export const worldToScreenSize = (size: number, scale: number): number => {
  return size * scale;
};

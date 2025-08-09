import type { LineSegment } from "../models/LineSegment";
import { Point } from "../models/Point";

export const getIntersectionPointOfTwoLineSegments = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number,
): { x: number; y: number } | undefined => {
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return undefined;
  }

  const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

  if (denominator === 0) {
    return undefined;
  }

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return undefined;
  }

  const x = x1 + ua * (x2 - x1);
  const y = y1 + ua * (y2 - y1);

  return { x, y };
};

export const getIntersectionPointOfTwoLineSegmentsByPoins = (
  a: Point,
  b: Point,
  c: Point,
  d: Point,
): Point | undefined => {
  const resultPoint = getIntersectionPointOfTwoLineSegments(a.x, a.y, b.x, b.y, c.x, c.y, d.x, d.y);
  if (!resultPoint) {
    return undefined;
  }

  return Point.create(resultPoint);
};

export const getIntersectionPointOfTwoLineSegmentsBySegments = (
  s1: LineSegment,
  s2: LineSegment,
): Point | undefined => {
  const resultPoint = getIntersectionPointOfTwoLineSegmentsByPoins(s1[0], s1[1], s2[0], s2[1]);
  if (!resultPoint) {
    return undefined;
  }

  return Point.create(resultPoint);
};

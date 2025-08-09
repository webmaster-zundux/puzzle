import { Point } from "../models/Point";
import { screenToWorldCoordinates } from "./screenToWorldCoordinates";

export type ScalePointARelativeToPointB = (pointA: Point, pointB: Point, scale: number, newScale: number) => Point;

export const scalePointARelativeToPointB: ScalePointARelativeToPointB = (
  pointA = Point.getZeroPoint(),
  pointB = Point.getZeroPoint(),
  scale = 1,
  newScale = 1,
) => {
  if (newScale === scale) {
    return pointA;
  }

  const scaleDifference = newScale - scale;
  const scaleDirection = scaleDifference > 0 ? +1 : scaleDifference < 0 ? -1 : 0;

  if (scaleDirection === 0) {
    return pointA;
  }

  const pointAInOldScale = screenToWorldCoordinates(pointB, scale, pointA);
  const pointAInNewScale = screenToWorldCoordinates(pointB, newScale, pointA);
  const deltaOfNextAndPrevPositions = pointAInOldScale.subtract(pointAInNewScale);
  const newCameraPosition = pointA.subtract(deltaOfNextAndPrevPositions);

  return newCameraPosition;
};

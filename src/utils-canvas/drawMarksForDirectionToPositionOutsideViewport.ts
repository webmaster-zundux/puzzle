import type { CacheableRenderablePuzzle } from "../models/CacheableRenderablePuzzle";
import type { LineSegment } from "../models/LineSegment";
import { Point } from "../models/Point";
import { worldToScreenCoordinates, worldToScreenSize } from "../utils-camera/screenToWorldCoordinates";
import { getIntersectionPointOfTwoLineSegmentsBySegments } from "../utils-path/getIntersectionPointOfTwoLineSegmentsByPoins";
import { drawCircle } from "./drawCircle";
import { drawDashedLine } from "./drawDashedLine";
import { drawRectangle } from "./drawRectangle";

export const getRectangeLineSegments = (
  x: number,
  y: number,
  width: number,
  height: number,
): readonly [LineSegment, LineSegment, LineSegment, LineSegment] => {
  const topLeftPoint = Point.create({
    x,
    y,
  });
  const topRightPoint = Point.create({
    x: x + width,
    y: y,
  });
  const bottomRightPoint = Point.create({
    x: x + width,
    y: y + height,
  });
  const bottomLeftPoint = Point.create({
    x: x,
    y: y + height,
  });

  const viewportTopSegment = [topLeftPoint, topRightPoint] as LineSegment;
  const viewportRightSegment = [topRightPoint, bottomRightPoint] as LineSegment;
  const viewportBottomSegment = [bottomRightPoint, bottomLeftPoint] as LineSegment;
  const viewportLeftSegment = [bottomLeftPoint, topLeftPoint] as LineSegment;

  const viewportBoundaryLineSegments = [
    viewportTopSegment,
    viewportRightSegment,
    viewportBottomSegment,
    viewportLeftSegment,
  ] as const;

  return viewportBoundaryLineSegments;
};

export interface DrawMarksForDirectionToPositionOutsideCameraViewport {
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  puzzle: CacheableRenderablePuzzle;
  cameraPosition: Point;
  cameraScale: number;
  cameraWidth: number;
  cameraHeight: number;
  hightContrastVersion: boolean;
  shoulShowDebugInfo: boolean;
}
export const drawMarksForDirectionToPositionOutsideCameraViewport = ({
  context,
  puzzle,
  cameraPosition,
  cameraScale,
  cameraWidth,
  cameraHeight,
  hightContrastVersion = false,
  shoulShowDebugInfo = false,
}: DrawMarksForDirectionToPositionOutsideCameraViewport): void => {
  if (!context) {
    return;
  }

  if (!puzzle) {
    return;
  }

  const cameraPositionInScreenCoordinates = Point.getZeroPoint();

  if (shoulShowDebugInfo) {
    drawCircle(context, cameraPositionInScreenCoordinates.x, cameraPositionInScreenCoordinates.y, "Tomato", 32);
  }

  const extendingRange = worldToScreenSize((puzzle.pieceSideSize / 2) * 1.2, cameraScale);
  const cameraViewportPositionForDetectionNotVisiblePieces = Point.create({
    x: cameraPositionInScreenCoordinates.x - extendingRange,
    y: cameraPositionInScreenCoordinates.y - extendingRange,
  });
  const widthOfCameraViewportForDetectionNotVisiblePieces = cameraWidth + extendingRange * 2;
  const heightOfCameraViewportForDetectionNotVisiblePieces = cameraHeight + extendingRange * 2;

  const viewportBoundaryLineSegmentsForDetectionNotVisiblePieces = getRectangeLineSegments(
    cameraViewportPositionForDetectionNotVisiblePieces.x,
    cameraViewportPositionForDetectionNotVisiblePieces.y,
    widthOfCameraViewportForDetectionNotVisiblePieces,
    heightOfCameraViewportForDetectionNotVisiblePieces,
  );

  const viewportBoundaryLineSegments = getRectangeLineSegments(
    cameraPositionInScreenCoordinates.x,
    cameraPositionInScreenCoordinates.y,
    cameraWidth,
    cameraHeight,
  );

  const cameraViewportCenterPointInScreenCoordinates = Point.create({
    x: cameraPositionInScreenCoordinates.x + cameraWidth / 2,
    y: cameraPositionInScreenCoordinates.y + cameraHeight / 2,
  });

  if (shoulShowDebugInfo) {
    drawCircle(
      context,
      cameraViewportCenterPointInScreenCoordinates.x,
      cameraViewportCenterPointInScreenCoordinates.y,
      "DodgerBlue",
      10,
    );
  }

  puzzle.pieces.forEach((piece) => {
    const { x, y } = piece.getCenterPointPosition();
    const pieceCenterPointInScreenCoordinates = worldToScreenCoordinates(
      Point.create({ x, y }),
      cameraScale,
      cameraPosition,
    );

    for (let i = 0; i < viewportBoundaryLineSegmentsForDetectionNotVisiblePieces.length; i++) {
      if (shoulShowDebugInfo) {
        drawDashedLine(
          context,
          cameraViewportCenterPointInScreenCoordinates.x,
          cameraViewportCenterPointInScreenCoordinates.y,
          pieceCenterPointInScreenCoordinates.x,
          pieceCenterPointInScreenCoordinates.y,
          "white",
          2,
          2,
          2,
        );
      }

      const intersectionPoint = getIntersectionPointOfTwoLineSegmentsBySegments(
        [pieceCenterPointInScreenCoordinates, cameraViewportCenterPointInScreenCoordinates],
        viewportBoundaryLineSegmentsForDetectionNotVisiblePieces[i],
      );

      if (intersectionPoint) {
        const intersectionPointWithViewport = getIntersectionPointOfTwoLineSegmentsBySegments(
          [pieceCenterPointInScreenCoordinates, cameraViewportCenterPointInScreenCoordinates],
          viewportBoundaryLineSegments[i],
        );
        if (!intersectionPointWithViewport) {
          return;
        }

        if (shoulShowDebugInfo) {
          drawCircle(context, intersectionPoint.x, intersectionPoint.y, "#e5e8", 150, true, 3);
          drawCircle(context, intersectionPointWithViewport.x, intersectionPointWithViewport.y, "#e568", 120, true, 3);
        }

        if (hightContrastVersion) {
          drawCircle(context, intersectionPointWithViewport.x, intersectionPointWithViewport.y, "#eee", 10, false);
          drawCircle(context, intersectionPointWithViewport.x, intersectionPointWithViewport.y, "#444", 8, false);
        } else {
          drawCircle(context, intersectionPointWithViewport.x, intersectionPointWithViewport.y, "#fff6", 10, false);
        }

        return;
      }
    }
  });

  if (shoulShowDebugInfo) {
    drawRectangle(
      context,
      cameraPositionInScreenCoordinates.x,
      cameraPositionInScreenCoordinates.y,
      cameraWidth,
      cameraHeight,
      "yellow",
      true,
      2,
      false,
    );
  }
};

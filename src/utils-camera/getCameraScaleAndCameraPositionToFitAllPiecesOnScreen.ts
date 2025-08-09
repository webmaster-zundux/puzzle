import type { CacheableByCameraScaleCacheableRenderablePuzzle } from "../models/CacheableByCameraScaleCacheableRenderablePuzzle";
import { Point } from "../models/Point";
import { CANVAS_SCALE_MAX, CANVAS_SCALE_MIN, limitScaleByRange } from "./getNextZoomValue";

const FIT_TO_SCREEN_PADDING_TO_PUZZLE_HORIZONTAL_IN_PX = 50;
const FIT_TO_SCREEN_PADDING_TO_PUZZLE_VERTICAL_IN_PX = 50;

export const getCameraScaleAndCameraPositionToFitAllPiecesOnScreen = ({
  canvasWidth,
  canvasHeight,
  puzzle,
}: {
  canvasWidth: number;
  canvasHeight: number;
  puzzle: CacheableByCameraScaleCacheableRenderablePuzzle;
}): {
  scale: number;
  position: Point;
} => {
  const availableCanvasWidth = canvasWidth - FIT_TO_SCREEN_PADDING_TO_PUZZLE_HORIZONTAL_IN_PX * 2;

  const availableCanvasHeight = canvasHeight - FIT_TO_SCREEN_PADDING_TO_PUZZLE_VERTICAL_IN_PX * 2;

  const { p0, p2 } = puzzle.getBoundaryCornerPointsOfPiecesSpreadArea();
  const puzzleAreaTopLeftCorner = new Point(p0.x, p0.y);
  const puzzleAreaBottomRightCorner = new Point(p2.x, p2.y);

  const puzzleAreaWidth = puzzleAreaBottomRightCorner.x - puzzleAreaTopLeftCorner.x;
  const puzzleAreaHeight = puzzleAreaBottomRightCorner.y - puzzleAreaTopLeftCorner.y;

  let fitToScreenCoefficient = availableCanvasWidth / puzzleAreaWidth;
  const puzzleAreaHeightAfterScale = puzzleAreaHeight * fitToScreenCoefficient;
  if (puzzleAreaHeightAfterScale > availableCanvasHeight) {
    fitToScreenCoefficient = availableCanvasHeight / puzzleAreaHeight;
  }

  let newCameraScale = fitToScreenCoefficient;
  newCameraScale = limitScaleByRange(newCameraScale, CANVAS_SCALE_MIN, CANVAS_SCALE_MAX);

  const newAvailableCanvasWidth = (canvasWidth - FIT_TO_SCREEN_PADDING_TO_PUZZLE_HORIZONTAL_IN_PX * 2) / newCameraScale;

  const newAvailableCanvasHeight = (canvasHeight - FIT_TO_SCREEN_PADDING_TO_PUZZLE_VERTICAL_IN_PX * 2) / newCameraScale;

  const worldPaddingToPuzzleHorizontal = FIT_TO_SCREEN_PADDING_TO_PUZZLE_HORIZONTAL_IN_PX / newCameraScale;
  const worldPaddingToPuzzleVertical = FIT_TO_SCREEN_PADDING_TO_PUZZLE_VERTICAL_IN_PX / newCameraScale;

  const x =
    worldPaddingToPuzzleHorizontal + (newAvailableCanvasWidth - puzzleAreaWidth) / 2 - puzzleAreaTopLeftCorner.x;

  const y =
    worldPaddingToPuzzleVertical + (newAvailableCanvasHeight - puzzleAreaHeight) / 2 - puzzleAreaTopLeftCorner.y;

  const newCameraPosition = new Point(x, y);

  return {
    scale: newCameraScale,
    position: newCameraPosition,
  };
};

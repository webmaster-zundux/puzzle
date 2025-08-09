import { Point as PointInPuzzleWorld } from "../core/puzzle/Point";
import type { CacheableByCameraScaleCacheableRenderablePuzzle } from "../models/CacheableByCameraScaleCacheableRenderablePuzzle";
import type { Point } from "../models/Point";
import type { RenderablePiece } from "../models/RenderablePiece";
import { screenToWorldCoordinates } from "../utils-camera/screenToWorldCoordinates";

export function getPieceAtPoint(
  puzzle: CacheableByCameraScaleCacheableRenderablePuzzle | undefined,
  mousePosition: Point | undefined,
  cameraScale: number,
  cameraPosition: Point,
): RenderablePiece | undefined {
  if (!puzzle) {
    return undefined;
  }

  if (!mousePosition) {
    return undefined;
  }

  const mousePositionInWorldCoordinates = screenToWorldCoordinates(mousePosition, cameraScale, cameraPosition);

  const pointInPuzzleWorld = new PointInPuzzleWorld(
    mousePositionInWorldCoordinates.x,
    mousePositionInWorldCoordinates.y,
  );
  const piece = puzzle.findPieceByPointingInsidePieceBoundaries(pointInPuzzleWorld);
  if (piece) {
    puzzle.selectActivePiece(piece);
  }

  return piece;
}

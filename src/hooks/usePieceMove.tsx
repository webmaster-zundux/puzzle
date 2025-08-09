import type { MutableRefObject } from "react";
import { useEffect, useState } from "react";
import { PositionDelta } from "../core/puzzle/PositionDelta";
import type { CacheableByCameraScaleCacheableRenderablePuzzle } from "../models/CacheableByCameraScaleCacheableRenderablePuzzle";
import { MouseMovementDelta } from "../models/MouseMovementDelta";
import { Point } from "../models/Point";
import type { RenderablePiece } from "../models/RenderablePiece";
import { worldToScreenCoordinates } from "../utils-camera/screenToWorldCoordinates";

export interface UsePieceMoveProps {
  puzzleRef: MutableRefObject<CacheableByCameraScaleCacheableRenderablePuzzle | undefined>;
  activePiece?: RenderablePiece;
  mousePosition?: Point;
  cameraScale: number;
  cameraPosition: Point;
}
export const usePieceMove = ({
  puzzleRef,
  activePiece,
  mousePosition,
  cameraScale,
  cameraPosition,
}: UsePieceMoveProps) => {
  const [prevMousePosition, setPrevMousePosition] = useState<Point>();
  const [piecePositionInScreenCoordinates, setPiecePositionInScreenCoordinates] = useState<Point>();

  useEffect(() => {
    const puzzle = puzzleRef?.current;
    if (!puzzle) {
      return;
    }

    if (!activePiece) {
      setPrevMousePosition(undefined);
      setPiecePositionInScreenCoordinates(undefined);
      return;
    }

    const newMousePosition = mousePosition;
    setPrevMousePosition(newMousePosition);

    if (!newMousePosition) {
      return;
    }

    if (!prevMousePosition) {
      return;
    }

    if (cameraScale <= 0) {
      return;
    }

    const dx = newMousePosition.x - prevMousePosition.x;
    const dy = newMousePosition.y - prevMousePosition.y;
    if (dx === 0 && dy === 0) {
      return;
    }

    const mouseMovementDelta = new MouseMovementDelta(dx, dy);
    const movementDeltaInWorldScale = mouseMovementDelta.divide(cameraScale);
    const positionDelta: PositionDelta = new PositionDelta(movementDeltaInWorldScale.dx, movementDeltaInWorldScale.dy);

    puzzle.moveActivePiece(positionDelta);

    let updatedActivePiecePosition = Point.create({ x: activePiece.position.x, y: activePiece.position.y });
    if (activePiece.parentPieceId) {
      const activePieceGroup = puzzle.pieces.getItemById(activePiece.parentPieceId);
      if (activePieceGroup) {
        updatedActivePiecePosition = Point.create({ x: activePieceGroup.position.x, y: activePieceGroup.position.y });
      }
    }

    updatedActivePiecePosition = worldToScreenCoordinates(updatedActivePiecePosition, cameraScale, cameraPosition);
    setPiecePositionInScreenCoordinates(updatedActivePiecePosition);
  }, [puzzleRef, activePiece, prevMousePosition, mousePosition, cameraScale, cameraPosition]);

  return piecePositionInScreenCoordinates;
};

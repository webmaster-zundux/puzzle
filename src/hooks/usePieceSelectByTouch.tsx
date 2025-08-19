import type { MutableRefObject, RefObject } from "react";
import { useCallback, useEffect, useState } from "react";
import { Point as PointInPuzzleWorld } from "../core/puzzle/Point";
import type { CacheableByCameraScaleCacheableRenderablePuzzle } from "../models/CacheableByCameraScaleCacheableRenderablePuzzle";
import type { Point } from "../models/Point";
import type { RenderablePiece } from "../models/RenderablePiece";
import { screenToWorldCoordinates } from "../utils-camera/screenToWorldCoordinates";
import { getTouchPositionOnScreen } from "../utils/touchScreen/getTouchPositionOnScreen";

export interface usePieceSelectByTouchProps {
  elementRef: RefObject<HTMLElement> | null;
  puzzleRef: MutableRefObject<CacheableByCameraScaleCacheableRenderablePuzzle | undefined>;
  cameraScale: number;
  cameraPosition: Point;
}

export const usePieceSelectByTouch = ({
  elementRef,
  puzzleRef,
  cameraScale,
  cameraPosition,
}: usePieceSelectByTouchProps): RenderablePiece | undefined => {
  const [selectedPiece, setSelectedPiece] = useState<RenderablePiece>();

  const handleTouchStart = useCallback(
    (event: TouchEvent): void => {
      event.preventDefault()
      const element = elementRef?.current;
      if (!element) {
        return;
      }

      const puzzle = puzzleRef?.current;
      if (!puzzle) {
        return;
      }

      const mousePosition = getTouchPositionOnScreen(event, element);
      const mousePositionInWorldCoordinates = screenToWorldCoordinates(mousePosition, cameraScale, cameraPosition);

      const pointInPuzzleWorld = new PointInPuzzleWorld(
        mousePositionInWorldCoordinates.x,
        mousePositionInWorldCoordinates.y,
      );
      const piece = puzzle.findPieceByPointingInsidePieceBoundaries(pointInPuzzleWorld);
      if (piece) {
        puzzle.selectActivePiece(piece);
      }

      setSelectedPiece(piece);
    },
    [setSelectedPiece, elementRef, cameraScale, cameraPosition, puzzleRef],
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent): void => {
      event.preventDefault()
      setSelectedPiece(undefined);

      const puzzle = puzzleRef?.current;
      if (!puzzle) {
        return;
      }

      puzzle.unselectActivePiece();
    },
    [setSelectedPiece, puzzleRef],
  );

  const handleTouchCancel = useCallback(
    (event: TouchEvent) => {
      event.preventDefault()
      setSelectedPiece(undefined);

      const puzzle = puzzleRef?.current;
      if (!puzzle) {
        return;
      }

      puzzle.unselectActivePiece();
    },
    [puzzleRef, setSelectedPiece],
  );

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) {
      return;
    }

    const touchEventListenerOptions: Parameters<typeof addEventListener>[2] = { passive: false };
    element.addEventListener("touchstart", handleTouchStart, touchEventListenerOptions);
    element.addEventListener("touchend", handleTouchEnd, touchEventListenerOptions);
    element.addEventListener("touchcancel", handleTouchCancel, touchEventListenerOptions);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart, touchEventListenerOptions);
      element.removeEventListener("touchend", handleTouchEnd, touchEventListenerOptions);
      element.removeEventListener("touchcancel", handleTouchCancel, touchEventListenerOptions);
    };
  }, [elementRef, handleTouchStart, handleTouchEnd, handleTouchCancel]);

  return selectedPiece;
};

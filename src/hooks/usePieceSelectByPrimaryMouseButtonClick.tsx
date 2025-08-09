import type { MutableRefObject, RefObject } from "react";
import { useCallback, useEffect, useState } from "react";
import { MOUSE_BUTTON_CODE_PRESSED_PRIMARY_BUTTON } from "../constants/MouseButtons";
import { Point as PointInPuzzleWorld } from "../core/puzzle/Point";
import type { CacheableByCameraScaleCacheableRenderablePuzzle } from "../models/CacheableByCameraScaleCacheableRenderablePuzzle";
import type { Point } from "../models/Point";
import type { RenderablePiece } from "../models/RenderablePiece";
import { screenToWorldCoordinates } from "../utils-camera/screenToWorldCoordinates";
import { getMousePositionOnScreen } from "../utils/mouse/getMousePositionOnScreen";

export interface usePieceSelectByPrimaryMouseButtonClickProps {
  elementRef: RefObject<HTMLElement> | null;
  puzzleRef: MutableRefObject<CacheableByCameraScaleCacheableRenderablePuzzle | undefined>;
  cameraScale: number;
  cameraPosition: Point;
}

export const usePieceSelectByPrimaryMouseButtonClick = ({
  elementRef,
  puzzleRef,
  cameraScale,
  cameraPosition,
}: usePieceSelectByPrimaryMouseButtonClickProps): RenderablePiece | undefined => {
  const [selectedPiece, setSelectedPiece] = useState<RenderablePiece>();

  const handlePrimaryMouseDown = useCallback(
    (event: MouseEvent): void => {
      if (event?.button !== MOUSE_BUTTON_CODE_PRESSED_PRIMARY_BUTTON) {
        return;
      }

      const element = elementRef?.current;
      if (!element) {
        return;
      }

      const puzzle = puzzleRef?.current;
      if (!puzzle) {
        return;
      }

      const mousePosition = getMousePositionOnScreen(event, element);
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

  const handlePrimaryMouseUp = useCallback(
    (event: MouseEvent): void => {
      if (event?.button !== MOUSE_BUTTON_CODE_PRESSED_PRIMARY_BUTTON) {
        return;
      }

      setSelectedPiece(undefined);

      const puzzle = puzzleRef?.current;
      if (!puzzle) {
        return;
      }

      puzzle.unselectActivePiece();
    },
    [setSelectedPiece, puzzleRef],
  );

  const handleMouseLeave = useCallback(
    (_event: MouseEvent) => {
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

    const mouseEventListenerOptions: Parameters<typeof addEventListener>[2] = { passive: true };
    element.addEventListener("mousedown", handlePrimaryMouseDown, mouseEventListenerOptions);
    element.addEventListener("mouseup", handlePrimaryMouseUp, mouseEventListenerOptions);
    element.addEventListener("mouseleave", handleMouseLeave, mouseEventListenerOptions);

    return () => {
      element.removeEventListener("mousedown", handlePrimaryMouseDown, mouseEventListenerOptions);
      element.removeEventListener("mouseup", handlePrimaryMouseUp, mouseEventListenerOptions);
      element.removeEventListener("mouseleave", handleMouseLeave, mouseEventListenerOptions);
    };
  }, [elementRef, handlePrimaryMouseDown, handlePrimaryMouseUp, handleMouseLeave]);

  return selectedPiece;
};

import type { MutableRefObject, RefObject } from "react";
import type { CacheableByCameraScaleCacheableRenderablePuzzle } from "../models/CacheableByCameraScaleCacheableRenderablePuzzle";
import type { Point } from "../models/Point";
import type { RenderablePiece } from "../models/RenderablePiece";
import { usePieceSelectByPrimaryMouseButtonClick } from "./usePieceSelectByPrimaryMouseButtonClick";
import { usePieceSelectByTouch } from "./usePieceSelectByTouch";

export interface usePieceSelectByTouchOrPrimaryMouseButtonClickProps {
  elementRef: RefObject<HTMLElement> | null;
  puzzleRef: MutableRefObject<CacheableByCameraScaleCacheableRenderablePuzzle | undefined>;
  cameraScale: number;
  cameraPosition: Point;
}

export const usePieceSelectByTouchOrPrimaryMouseButtonClick = ({
  elementRef,
  puzzleRef,
  cameraScale,
  cameraPosition,
}: usePieceSelectByTouchOrPrimaryMouseButtonClickProps): RenderablePiece | undefined => {
  const selectedPieceByTouch = usePieceSelectByTouch({ elementRef, puzzleRef, cameraScale, cameraPosition });
  const selectedPieceByPrimaryMouseButtonClick = usePieceSelectByPrimaryMouseButtonClick({
    elementRef,
    puzzleRef,
    cameraScale,
    cameraPosition,
  });

  return selectedPieceByTouch || selectedPieceByPrimaryMouseButtonClick;
};

import type { Dispatch, MutableRefObject, RefObject, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Boundary } from "../models/Boundary";
import type { CacheableByCameraScaleCacheableRenderablePuzzle } from "../models/CacheableByCameraScaleCacheableRenderablePuzzle";
import type { Point } from "../models/Point";
import { screenToWorldSize, worldToScreenSize } from "../utils-camera/screenToWorldCoordinates";
import { drawCircle } from "../utils-canvas/drawCircle";
import { drawRectangle } from "../utils-canvas/drawRectangle";
import { performanceEndMark, performancePrintPassedTime, performanceStartMark } from "../utils/performanceTracker";
import { useCameraMove, useCameraScale, useCameraState } from "./useCameraState";
import { useCanvasResize } from "./useCanvasResize";
import { useDebugSettingsState } from "./useDebugSettings";
import { useMouseOrTouchPosition } from "./useMouseOrTouchPosition";
import { usePerfomanceMonitor } from "./usePerfomanceMonitor";
import { usePieceMove } from "./usePieceMove";
import { usePieceSelectByTouchOrPrimaryMouseButtonClick } from "./usePieceSelectByTouchOrPrimaryMouseButtonClick";
import { usePuzzleInformationDispatch } from "./usePuzzleInformation";

export const PERFOMANCE_TIMEMARK_CANVAS_RENDER = "canvas-render";

const renderInWorldCoordinates = ({
  context,
  puzzle,
  cameraPosition,
  cameraScale,
  isFirstRenderOfPuzzle,
  setIsFirstRenderOfPuzzle,
  debugSettingsShouldPrintPuzzleRenderTime,
  debugSettingsShouldDrawCenterOfWorld,
  debugSettingsShouldDrawPuzzleBoundaryPoints,
  debugSettingsShouldDrawPuzzlePiecesBoundaries,
  debugSettingsShouldDrawCachedTexturesBoundaries,
  debugSettingsShouldDrawCameraPosition,
}: {
  context: CanvasRenderingContext2D;
  puzzle: CacheableByCameraScaleCacheableRenderablePuzzle;
  cameraPosition: Point;
  cameraScale: number;
  isFirstRenderOfPuzzle: boolean;
  setIsFirstRenderOfPuzzle: Dispatch<SetStateAction<boolean>>;
  debugSettingsShouldPrintPuzzleRenderTime: boolean;
  debugSettingsShouldDrawCenterOfWorld: boolean;
  debugSettingsShouldDrawPuzzleBoundaryPoints: boolean;
  debugSettingsShouldDrawPuzzlePiecesBoundaries: boolean;
  debugSettingsShouldDrawCachedTexturesBoundaries: boolean;
  debugSettingsShouldDrawCameraPosition: boolean;
}) => {
  context.save();

  context.translate(worldToScreenSize(cameraPosition.x, cameraScale), worldToScreenSize(cameraPosition.y, cameraScale));

  const cameraWidth = Math.floor(screenToWorldSize(context.canvas.width, cameraScale));
  const cameraHeight = Math.floor(screenToWorldSize(context.canvas.height, cameraScale));

  const cameraViewportCullingMargin = debugSettingsShouldDrawCameraPosition ? 2 : 0; // 150 : 0 // px
  const cameraBoundary = new Boundary(
    -(cameraPosition.x - cameraViewportCullingMargin),
    -(cameraPosition.y - cameraViewportCullingMargin),
    cameraWidth - cameraViewportCullingMargin * 2,
    cameraHeight - cameraViewportCullingMargin * 2,
  );

  puzzle.renderByTilesTextures(context, cameraScale, cameraBoundary, {
    debugSettingsShouldDrawCachedTexturesBoundaries,
  });

  if (isFirstRenderOfPuzzle || debugSettingsShouldPrintPuzzleRenderTime) {
    performanceEndMark(PERFOMANCE_TIMEMARK_CANVAS_RENDER);
    performancePrintPassedTime(PERFOMANCE_TIMEMARK_CANVAS_RENDER, (timeMs) => `render ${timeMs} ms`);

    if (isFirstRenderOfPuzzle) {
      setIsFirstRenderOfPuzzle(false);
    }
  }

  if (debugSettingsShouldDrawCenterOfWorld) {
    drawCircle(context, worldToScreenSize(0, cameraScale), worldToScreenSize(0, cameraScale), "yellow");
  }

  if (debugSettingsShouldDrawPuzzleBoundaryPoints) {
    const { p0, p2 } = puzzle.getBoundaryCornerPointsOfPiecesSpreadArea();
    drawCircle(context, worldToScreenSize(p0.x, cameraScale), worldToScreenSize(p0.y, cameraScale), "white", 10);
    drawCircle(context, worldToScreenSize(p2.x, cameraScale), worldToScreenSize(p2.y, cameraScale), "white", 10);
  }

  if (debugSettingsShouldDrawPuzzlePiecesBoundaries) {
    puzzle.pieces.forEach((piece) => {
      const piecePosition = piece.getWorldPosition();
      drawRectangle(
        context,
        worldToScreenSize(piecePosition.x, cameraScale),
        worldToScreenSize(piecePosition.y, cameraScale),
        worldToScreenSize(piece.width, cameraScale),
        worldToScreenSize(piece.height, cameraScale),
        "white",
        true,
        1,
      );

      const textureAttributes = piece.getPieceImageTargetSizeAndPosition();

      drawRectangle(
        context,
        worldToScreenSize(textureAttributes.x, cameraScale),
        worldToScreenSize(textureAttributes.y, cameraScale),
        worldToScreenSize(textureAttributes.width, cameraScale),
        worldToScreenSize(textureAttributes.height, cameraScale),
        "white",
        true,
        1,
        true,
        [2, 2, 5, 5],
      );
    });
  }

  if (debugSettingsShouldDrawCameraPosition) {
    const cameraX = worldToScreenSize(cameraBoundary.x, cameraScale);
    const cameraY = worldToScreenSize(cameraBoundary.y, cameraScale);

    drawCircle(context, cameraX, cameraY, "aqua", 18);

    const renderingCameraMargin = 0;
    const cameraWidth = worldToScreenSize(cameraBoundary.width, cameraScale);
    const cameraHeight = worldToScreenSize(cameraBoundary.height, cameraScale);

    // draw camera viewport that is used for camera viewport culling
    drawRectangle(
      context,
      cameraX + renderingCameraMargin,
      cameraY + renderingCameraMargin,
      cameraWidth - renderingCameraMargin * 2,
      cameraHeight - renderingCameraMargin * 2,
      "aqua",
    );
  }

  context.restore();
};

const renderInScreenCoordinates = ({
  context,
  puzzle,
  canvasWidth,
  canvasHeight,
  cameraScale,
  cameraPosition,
  mousePosition,
  piecePositionInScreenCoordinates,
  showMarksForDirectionToPositionOutsideCameraViewport,
  debugSettingsShouldDrawCameraPosition,
  debugSettingsShouldDrawCameraViewportCenterPosition,
  debugSettingsShouldDrawDebugInfoForMarksForDirectionToPositionOutsideCameraViewport,
  debugSettingsShouldDrawMousePosition,
  debugSettingsShouldDrawActivePiecePosition,
  debugSettingsShouldDrawCachedTexturesBoundaries,
}: {
  context: CanvasRenderingContext2D;
  puzzle: CacheableByCameraScaleCacheableRenderablePuzzle;
  canvasWidth: number;
  canvasHeight: number;
  cameraPosition: Point;
  cameraScale: number;
  mousePosition: Point | undefined;
  piecePositionInScreenCoordinates: Point | undefined;
  showMarksForDirectionToPositionOutsideCameraViewport: boolean;
  debugSettingsShouldDrawCameraPosition: boolean;
  debugSettingsShouldDrawCameraViewportCenterPosition: boolean;
  debugSettingsShouldDrawDebugInfoForMarksForDirectionToPositionOutsideCameraViewport: boolean;
  debugSettingsShouldDrawMousePosition: boolean;
  debugSettingsShouldDrawActivePiecePosition: boolean;
  debugSettingsShouldDrawCachedTexturesBoundaries: boolean;
}) => {
  if (debugSettingsShouldDrawCameraPosition) {
    drawCircle(context, 0, 0, "MediumSeaGreen");
  }

  if (debugSettingsShouldDrawCameraViewportCenterPosition) {
    if (canvasWidth > 0 && canvasHeight > 0) {
      drawCircle(context, canvasWidth / 2, canvasHeight / 2, "MediumSeaGreen", 30);
    }
  }

  if (showMarksForDirectionToPositionOutsideCameraViewport) {
    if (canvasWidth > 0 && canvasHeight > 0) {
      puzzle.drawMarksForDirectionToPositionOutsideCameraViewport({
        context,
        puzzle,
        cameraPosition,
        cameraScale,
        cameraWidth: canvasWidth,
        cameraHeight: canvasHeight,
        isHighContrastVersion: false,
        shoulShowDebugInfo: debugSettingsShouldDrawDebugInfoForMarksForDirectionToPositionOutsideCameraViewport,
        debugSettingsShouldDrawCachedTexturesBoundaries,
      });
    }
  }

  if (debugSettingsShouldDrawMousePosition) {
    if (mousePosition) {
      drawCircle(context, mousePosition?.x, mousePosition?.y, "pink", 25);
    }
  }

  if (debugSettingsShouldDrawActivePiecePosition) {
    if (piecePositionInScreenCoordinates) {
      drawCircle(context, piecePositionInScreenCoordinates?.x, piecePositionInScreenCoordinates?.y, "black", 15);
    }
  }
};

interface UseRenderFrameProps {
  canvasRef: RefObject<HTMLCanvasElement> | null;
  puzzleRef: MutableRefObject<CacheableByCameraScaleCacheableRenderablePuzzle | undefined>;
  showMarksForDirectionToPositionOutsideCameraViewport?: boolean;
}

export const useRenderFrame = ({
  canvasRef,
  puzzleRef,
  showMarksForDirectionToPositionOutsideCameraViewport = true,
}: UseRenderFrameProps) => {
  const perfomanceMonitor = usePerfomanceMonitor();
  const debugSettings = useDebugSettingsState();
  const {
    debugSettingsShouldDrawCenterOfWorld,
    debugSettingsShouldDrawPuzzleBoundaryPoints,
    debugSettingsShouldDrawPuzzlePiecesBoundaries,
    debugSettingsShouldDrawCachedTexturesBoundaries,
    debugSettingsShouldDrawCameraPosition,
    debugSettingsShouldDrawMousePosition,
    debugSettingsShouldDrawActivePiecePosition,
    debugSettingsShouldDrawCameraViewportCenterPosition,
    debugSettingsShouldDrawDebugInfoForMarksForDirectionToPositionOutsideCameraViewport,
    debugSettingsShouldPrintPuzzleRenderTime,
    debugSettingsShouldPrintPuzzleRenderTimeForFirstRender,
    experimentalUseNativeSmoothingQualityMethod,
  } = debugSettings;

  const [isFirstRenderOfPuzzle, setIsFirstRenderOfPuzzle] = useState(
    debugSettingsShouldPrintPuzzleRenderTimeForFirstRender,
  );

  const { position: cameraPosition, scale: cameraScale } = useCameraState();
  const activePiece = usePieceSelectByTouchOrPrimaryMouseButtonClick({
    elementRef: canvasRef,
    puzzleRef,
    cameraScale,
    cameraPosition,
  });
  const { isPressed: isPrimaryMouseButtonPressed, position: mousePosition } = useMouseOrTouchPosition({
    elementRef: canvasRef,
  });
  const isCameraMoving = useMemo(
    () => isPrimaryMouseButtonPressed && !activePiece,
    [isPrimaryMouseButtonPressed, activePiece],
  );

  const puzzleInformationDispatch = usePuzzleInformationDispatch();
  const handlePuzzleWasTouched = useCallback(() => {
    puzzleInformationDispatch({ type: "set-puzzle-was-touched" });
  }, [puzzleInformationDispatch]);

  useEffect(() => {
    if (!isCameraMoving) {
      return;
    }

    handlePuzzleWasTouched();
  }, [isCameraMoving, handlePuzzleWasTouched]);

  useCameraScale({ elementRef: canvasRef });
  useCameraMove({ isCameraMoving, mousePosition });
  const piecePositionInScreenCoordinates = usePieceMove({
    puzzleRef,
    activePiece,
    mousePosition,
    cameraScale,
    cameraPosition,
  });

  useEffect(() => {
    if (!activePiece) {
      puzzleInformationDispatch({
        type: "set-active-piece-id",
        pieceId: undefined,
      });
    } else {
      puzzleInformationDispatch({
        type: "set-active-piece-id",
        pieceId: activePiece.id,
      });
    }
  }, [activePiece, puzzleInformationDispatch]);

  let canvasWidth: number = 0;
  let canvasHeight: number = 0;

  const renderFrame = useCallback(() => {
    perfomanceMonitor && perfomanceMonitor.begin();

    const canvasElement = canvasRef?.current;
    if (!canvasElement) {
      return;
    }

    const context = canvasElement.getContext("2d", {
      willReadFrequently: true,
    });
    if (!context) {
      return;
    }

    if (experimentalUseNativeSmoothingQualityMethod) {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "medium";
    }

    const puzzle = puzzleRef.current;
    if (!puzzle) {
      return;
    }

    if (isFirstRenderOfPuzzle || debugSettingsShouldPrintPuzzleRenderTime) {
      performanceStartMark(PERFOMANCE_TIMEMARK_CANVAS_RENDER);
    }

    context.clearRect(0, 0, canvasElement.width, canvasElement.height);

    renderInWorldCoordinates({
      context,
      puzzle,
      cameraPosition,
      cameraScale,
      isFirstRenderOfPuzzle,
      setIsFirstRenderOfPuzzle,
      debugSettingsShouldPrintPuzzleRenderTime,
      debugSettingsShouldDrawCenterOfWorld,
      debugSettingsShouldDrawPuzzleBoundaryPoints,
      debugSettingsShouldDrawPuzzlePiecesBoundaries,
      debugSettingsShouldDrawCachedTexturesBoundaries,
      debugSettingsShouldDrawCameraPosition,
    });

    renderInScreenCoordinates({
      context,
      puzzle,
      canvasWidth,
      canvasHeight,
      cameraScale,
      cameraPosition,
      mousePosition,
      piecePositionInScreenCoordinates,
      showMarksForDirectionToPositionOutsideCameraViewport,
      debugSettingsShouldDrawCameraPosition,
      debugSettingsShouldDrawCameraViewportCenterPosition,
      debugSettingsShouldDrawDebugInfoForMarksForDirectionToPositionOutsideCameraViewport,
      debugSettingsShouldDrawMousePosition,
      debugSettingsShouldDrawActivePiecePosition,
      debugSettingsShouldDrawCachedTexturesBoundaries,
    });

    perfomanceMonitor && perfomanceMonitor.end();
  }, [
    perfomanceMonitor,
    canvasRef,
    experimentalUseNativeSmoothingQualityMethod,
    puzzleRef,
    isFirstRenderOfPuzzle,
    debugSettingsShouldPrintPuzzleRenderTime,
    cameraPosition,
    mousePosition,
    piecePositionInScreenCoordinates,
    cameraScale,
    debugSettingsShouldDrawCenterOfWorld,
    debugSettingsShouldDrawPuzzleBoundaryPoints,
    debugSettingsShouldDrawPuzzlePiecesBoundaries,
    debugSettingsShouldDrawCachedTexturesBoundaries,
    debugSettingsShouldDrawCameraPosition,
    debugSettingsShouldDrawCameraViewportCenterPosition,
    showMarksForDirectionToPositionOutsideCameraViewport,
    canvasWidth,
    canvasHeight,
    debugSettingsShouldDrawDebugInfoForMarksForDirectionToPositionOutsideCameraViewport,
    debugSettingsShouldDrawMousePosition,
    debugSettingsShouldDrawActivePiecePosition,
  ]);

  useEffect(() => {
    const puzzle = puzzleRef.current;
    if (puzzle) {
      return;
    }

    if (debugSettingsShouldPrintPuzzleRenderTimeForFirstRender) {
      setIsFirstRenderOfPuzzle(true);
    }
  }, [debugSettingsShouldPrintPuzzleRenderTimeForFirstRender, puzzleRef]);

  const [isImageLoaded] = useState(false);

  useEffect(() => {
    window?.requestAnimationFrame(renderFrame);
  }, [renderFrame, isImageLoaded]);

  const { canvasWidth: newCanvasWidth, canvasHeight: newCanvasHeight } = useCanvasResize(canvasRef, renderFrame);
  [canvasWidth, canvasHeight] = [newCanvasWidth, newCanvasHeight];

  return { canvasWidth, canvasHeight, activePiece };
};

import type { PropsWithChildren } from "react";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "../components/Canvas";
import { CanvasControlButtons } from "../components/CanvasControlButtons";
import { Area } from "../core/puzzle/Area";
import type { PiecePositionData } from "../core/puzzle/Puzzle";
import { getScatteredPieceInitialPositionAsPositionMultipliedOn2 } from "../core/puzzle/Puzzle";
import { clearCacheHitCounterPieceMaskPath } from "../hooks/useCacheHitCounterPieceMaskPath";
import { clearCacheHitCounterForPieceShapePath } from "../hooks/useCacheHitCounterPieceShapePath";
import { useCameraStateDispatch } from "../hooks/useCameraState";
import { useDebugSettingsState } from "../hooks/useDebugSettings";
import { usePuzzleInformation, usePuzzleInformationDispatch } from "../hooks/usePuzzleInformation";
import { useRenderFrame } from "../hooks/useRenderFrame";
import { CacheableByCameraScaleCacheableRenderablePiece } from "../models/CacheableByCameraScaleCacheableRenderablePiece";
import { CacheableByCameraScaleCacheableRenderablePuzzle } from "../models/CacheableByCameraScaleCacheableRenderablePuzzle";
import { CanvasCache } from "../models/CanvasCache";
import { MouseWheelDelta } from "../models/MouseWheelDelta";
import { Point } from "../models/Point";
import type { ScaleDirection } from "../models/ScaleDirection";
import { CANVAS_SCALE_DECREASING_DIRECTION, CANVAS_SCALE_INCREASING_DIRECTION } from "../models/ScaleDirection";
import { PERFOMANCE_TIMEMARK_PUZZLE_CREATION } from "../models/Timemark";
import { getCameraScaleAndCameraPositionToFitAllPiecesOnScreen } from "../utils-camera/getCameraScaleAndCameraPositionToFitAllPiecesOnScreen";
import { ConnectedSideShapesCache } from "../utils-path/ConnectedSideShapesCache";
import { CookedPath2DCache } from "../utils-path/CookedPath2DCache";
import { CookedPathCache } from "../utils-path/CookedPathCache";
import { CookedPieceBevelImagesCache } from "../utils-path/CookedPieceBevelImageCache";
import { CookedSideShapeAsPlugCache } from "../utils-path/CookedSideShapeAsPlugCache";
import { getPieceSideShapeAsSocketByShapeName } from "../utils-path/getSideShapes";
import { loadImageFromUrlOnTheSameDomain } from "../utils/loadImageFromUrlOnTheSameDomain";
import { performanceEndMark, performancePrintPassedTime, performanceStartMark } from "../utils/performanceTracker";

interface PuzzleViewProps {
  isFullscreenModeActive?: boolean;
  toggleFullscreenMode: () => void;
}

export const PuzzleView = forwardRef<HTMLCanvasElement, PropsWithChildren<PuzzleViewProps>>(function PuzzleView(
  { isFullscreenModeActive = false, toggleFullscreenMode, children },
  canvasRef,
) {
  const {
    challengeId,
    imageSrc,
    boundaryPoints,
    piecesPositions,
    numberOfPiecesPerWidth,
    numberOfPiecesPerHeight,
    pieceWidth,
    connectionActivationAreaSideSizeFractionFromPieceSideSize,
    pieceSideShapeName,
    isSidebarOpen,
  } = usePuzzleInformation();

  const debugSettingsState = useDebugSettingsState();
  const {
    debugSettingsShouldPrintPuzzleCreationTime,
    debugSettingsUseSolvedPuzzlePiecesPositionsMultipliedBy2AsInitialPiecesPositions,
  } = debugSettingsState;

  const puzzleInformationDispatch = usePuzzleInformationDispatch();
  const dispatchCameraStateChange = useCameraStateDispatch();

  const puzzleRef = useRef<CacheableByCameraScaleCacheableRenderablePuzzle>();

  const fitAllPiecesOnScreen = useCallback(
    (puzzle: CacheableByCameraScaleCacheableRenderablePuzzle, canvasWidth: number, canvasHeight: number) => {
      const { scale: newCameraScale, position: newCameraPosition } =
        getCameraScaleAndCameraPositionToFitAllPiecesOnScreen({
          canvasWidth,
          canvasHeight,
          puzzle,
        });

      dispatchCameraStateChange({
        type: "set-scale-and-set-position",
        scale: newCameraScale,
        position: newCameraPosition,
      });
    },
    [dispatchCameraStateChange],
  );

  const handlePuzzleWasTouched = useCallback(() => {
    puzzleInformationDispatch({ type: "set-puzzle-was-touched" });
  }, [puzzleInformationDispatch]);

  const handlePieceRelease = useCallback(
    (piecePositionData: PiecePositionData) => {
      puzzleInformationDispatch({
        type: "set-puzzle-piece-was-released",
        piecePositionData,
      });
    },
    [puzzleInformationDispatch],
  );

  const handleGroupOfPiecesRelease = useCallback(
    (groupOfPiecesPositionData: PiecePositionData[]) => {
      puzzleInformationDispatch({
        type: "set-puzzle-group-of-pieces-were-released",
        groupOfPiecesPositionData,
      });
    },
    [puzzleInformationDispatch],
  );

  const handleChangeChallengeCompletenessProgress = useCallback(
    (completenessProgress: number) => {
      puzzleInformationDispatch({
        type: "set-challenge-completeness-progress",
        completenessProgress: completenessProgress,
      });
    },
    [puzzleInformationDispatch],
  );

  const [initialPiecesPositionsData, setInitialPiecesPositionsData] = useState(piecesPositions);

  useEffect(() => {
    if (initialPiecesPositionsData.length && !piecesPositions.length) {
      setInitialPiecesPositionsData([]);
    }
  }, [piecesPositions, initialPiecesPositionsData]);

  const initPuzzle = useCallback(async () => {
    if (typeof canvasRef === "function") {
      return;
    }
    const canvasElement = canvasRef?.current;
    if (!canvasElement) {
      return;
    }

    if (!imageSrc) {
      return;
    }

    const image = await loadImageFromUrlOnTheSameDomain(imageSrc);
    if (!image || !image.width || !image.height) {
      return;
    }

    if (
      !boundaryPoints ||
      !boundaryPoints.tl ||
      !boundaryPoints.br ||
      boundaryPoints.br.x <= 1 ||
      boundaryPoints.br.y <= 1
    ) {
      puzzleInformationDispatch({
        type: "init-new-challenge-id",
        params: {
          boundaryPoints: {
            tl: new Point(0, 0),
            br: new Point(image.width, image.height),
          },
        },
      });
      return;
    }

    ConnectedSideShapesCache.clear();
    CookedPath2DCache.clear();
    CookedPathCache.clear();
    CookedPieceBevelImagesCache.clear();
    CookedSideShapeAsPlugCache.clear();
    CanvasCache.clear();

    clearCacheHitCounterPieceMaskPath();
    clearCacheHitCounterForPieceShapePath();

    const pieceSideSize = pieceWidth;

    const x = boundaryPoints.tl.x;
    const y = boundaryPoints.tl.y;
    const width = boundaryPoints.br.x - boundaryPoints.tl.x;
    const height = boundaryPoints.br.y - boundaryPoints.tl.y;
    const textureArea = new Area(x, y, width, height);

    const sideShapeAsSocket = getPieceSideShapeAsSocketByShapeName(pieceSideShapeName);

    if (debugSettingsShouldPrintPuzzleCreationTime) {
      performanceStartMark(PERFOMANCE_TIMEMARK_PUZZLE_CREATION);
    }

    let getCustomInitialPiecePosition: typeof getScatteredPieceInitialPositionAsPositionMultipliedOn2 | undefined;

    if (debugSettingsUseSolvedPuzzlePiecesPositionsMultipliedBy2AsInitialPiecesPositions) {
      getCustomInitialPiecePosition = getScatteredPieceInitialPositionAsPositionMultipliedOn2;
    }

    const puzzleInstance = new CacheableByCameraScaleCacheableRenderablePuzzle({
      id: challengeId,
      numberOfPiecesPerWidth,
      numberOfPiecesPerHeight,
      pieceSideSize,
      connectionActivationAreaSideSizeFractionFromPieceSideSize,
      pieceClass: CacheableByCameraScaleCacheableRenderablePiece,
      pieceClassDebugOptions: debugSettingsState,
      image,
      textureArea,
      sideShapeAsSocket,
      getCustomInitialPiecePosition: getCustomInitialPiecePosition,
      onDirty: handlePuzzleWasTouched,
      onPieceRelease: handlePieceRelease,
      onGroupOfPiecesRelease: handleGroupOfPiecesRelease,
      onChangeProgress: handleChangeChallengeCompletenessProgress,
    });

    if (initialPiecesPositionsData.length) {
      puzzleInstance.movePiecesToManualInitialPositions(initialPiecesPositionsData);
    }

    if (debugSettingsShouldPrintPuzzleCreationTime) {
      performanceEndMark(PERFOMANCE_TIMEMARK_PUZZLE_CREATION);
      performancePrintPassedTime(PERFOMANCE_TIMEMARK_PUZZLE_CREATION, (timeMs) => `puzzle created in ${timeMs} ms`);
    }

    puzzleRef.current = puzzleInstance;

    const canvasWidth = canvasElement.width;
    const canvasHeight = canvasElement.height;

    setTimeout(() => {
      fitAllPiecesOnScreen(puzzleInstance, canvasWidth, canvasHeight);
    }, 0);
  }, [
    canvasRef,
    imageSrc,
    boundaryPoints,
    pieceWidth,
    pieceSideShapeName,
    debugSettingsShouldPrintPuzzleCreationTime,
    debugSettingsUseSolvedPuzzlePiecesPositionsMultipliedBy2AsInitialPiecesPositions,
    challengeId,
    numberOfPiecesPerWidth,
    numberOfPiecesPerHeight,
    connectionActivationAreaSideSizeFractionFromPieceSideSize,
    debugSettingsState,
    handlePuzzleWasTouched,
    handlePieceRelease,
    handleGroupOfPiecesRelease,
    handleChangeChallengeCompletenessProgress,
    initialPiecesPositionsData,
    fitAllPiecesOnScreen,
    puzzleInformationDispatch,
  ]);

  const handleToggleSidePanelVisibilityState = useCallback(() => {
    puzzleInformationDispatch({ type: "toggle-sidebar-visibility-state" });
  }, [puzzleInformationDispatch]);

  const canvasRefObject = useMemo(() => (typeof canvasRef === "function" ? null : canvasRef), [canvasRef]);

  const { canvasWidth, canvasHeight } = useRenderFrame({
    canvasRef: canvasRefObject,
    puzzleRef,
  });

  const handleClickOnZoomButton = useCallback(
    (scaleDirection: ScaleDirection) => {
      const centerOfCameraScreenInScreenCoordinates: Point = Point.create({
        x: canvasWidth / 2,
        y: canvasHeight / 2,
      });

      const centerOfScale = centerOfCameraScreenInScreenCoordinates;
      const mouseWheelDelta = new MouseWheelDelta(0, -1 * scaleDirection);

      dispatchCameraStateChange({
        type: "add-mouse-wheel-delta-in-screen-coordinates-to-scale",
        centerOfScale,
        mouseWheelDelta,
      });
    },
    [canvasHeight, canvasWidth, dispatchCameraStateChange],
  );

  const handleClickOnResetZoomButton = useCallback(() => {
    const centerOfCameraScreenInScreenCoordinates: Point = Point.create({
      x: canvasWidth / 2,
      y: canvasHeight / 2,
    });

    const centerOfScale = centerOfCameraScreenInScreenCoordinates;

    dispatchCameraStateChange({
      type: "reset-scale-with-center-of-scale",
      centerOfScale,
    });
  }, [canvasWidth, canvasHeight, dispatchCameraStateChange]);

  const handleClickOnZoomOutToShowAllPiecesOnScreenButton = useCallback(() => {
    const puzzle = puzzleRef.current;
    if (!puzzle) {
      return;
    }
    fitAllPiecesOnScreen(puzzle, canvasWidth, canvasHeight);
  }, [fitAllPiecesOnScreen, canvasWidth, canvasHeight, puzzleRef]);

  const handleClickOnZoomInButton = useCallback(
    () => handleClickOnZoomButton(CANVAS_SCALE_INCREASING_DIRECTION),
    [handleClickOnZoomButton],
  );

  const handleClickOnZoomOutButton = useCallback(
    () => handleClickOnZoomButton(CANVAS_SCALE_DECREASING_DIRECTION),
    [handleClickOnZoomButton],
  );

  useEffect(() => {
    initPuzzle();
  }, [initPuzzle]);

  useEffect(() => {
    const puzzleInstance = puzzleRef.current;
    if (!puzzleInstance) {
      return;
    }

    setTimeout(() => {
      fitAllPiecesOnScreen(puzzleInstance, canvasWidth, canvasHeight);
    }, 0);
  }, [canvasWidth, canvasHeight, fitAllPiecesOnScreen]);

  return (
    <>
      <Canvas ref={canvasRef} />

      <CanvasControlButtons
        isVisibleSidePanel={isSidebarOpen}
        isFullscreenModeActive={isFullscreenModeActive}
        onToggleFullscreenMode={toggleFullscreenMode}
        onToggleSidePanel={handleToggleSidePanelVisibilityState}
        onZoomIn={handleClickOnZoomInButton}
        onZoomOut={handleClickOnZoomOutButton}
        onResetZoom={handleClickOnResetZoomButton}
        onShowAllPieces={handleClickOnZoomOutToShowAllPiecesOnScreenButton}
      />

      {children}
    </>
  );
});

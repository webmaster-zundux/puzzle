import { memo, useCallback, useRef, useState } from "react";
import { PuzzleView } from "../components/PuzzleView";
import { Sidebar } from "../components/Sidebar";
import { useCacheHitCounterPieceMaskPath } from "../hooks/useCacheHitCounterPieceMaskPath";
import { useCacheHitCounterPieceShapePath } from "../hooks/useCacheHitCounterPieceShapePath";
import { useFullscreenMode } from "../hooks/useFullscreenMode";
import { usePuzzleInformation, usePuzzleInformationDispatch } from "../hooks/usePuzzleInformation";
import { useToggleVisibility } from "../hooks/useToggleVisibility";
import { ChooseMethodToCreatePuzzleModal } from "../modals/ChangeImageModal/ChooseMethodToCreatePuzzleModal";
import { DebugSettingsModal } from "../modals/DebugSettingsModal";
import { HelpModal } from "../modals/HelpModal";
import { PuzzleRestartConfirmationModal } from "../modals/PuzzleRestartConfirmationModal";
import { getCssColorNameForCanvasBackgroundColor, type CanvasBackgroundColor } from "../models/CanvasBackgroundColor";
import s from "./PuzzlePage.module.css";
import { useChallengeTimer } from "../hooks/useChallengeTimer";

export const PuzzlePage = memo(function PuzzlePage() {
  const {
    isVisible: isVisibleIntroduction,
    show: handleShowHelpDialog,
    hide: handleHideHelpDialog,
  } = useToggleVisibility(false);

  const { imageSrc: initialImageSrc } = usePuzzleInformation();
  const [shouldUseCurrentImage, setShouldUseCurrentImage] = useState(false);

  const {
    isVisible: isVisibleChooseMethodToCreatePuzzleDialog,
    show: handleShowChooseMethodToCreatePuzzleDialog,
    hide: handleHideChooseMethodToCreatePuzzleDialog,
  } = useToggleVisibility(false);

  const showPuzzleModificationDialog = useCallback(() => {
    setShouldUseCurrentImage(true);
    handleShowChooseMethodToCreatePuzzleDialog();
  }, [handleShowChooseMethodToCreatePuzzleDialog, setShouldUseCurrentImage]);

  const hidePuzzleModificationDialog = useCallback(() => {
    handleHideChooseMethodToCreatePuzzleDialog();
    setShouldUseCurrentImage(false);
  }, [handleHideChooseMethodToCreatePuzzleDialog, setShouldUseCurrentImage]);

  const {
    isVisible: isVisibleDebugSettingsDialog,
    show: handleShowDebugSettingsDialog,
    hide: handleHideDebugSettingsDialog,
  } = useToggleVisibility(false);

  const {
    isVisible: isVisiblePuzzleRestartConfirmationDialog,
    show: handleShowPuzzleRestartConfirmationDialog,
    hide: handleHidePuzzleRestartConfirmationDialog,
  } = useToggleVisibility(false);

  const { toggleFullscreenMode, FullScreen, fullScreenModeHandle, isFullscreenModeActive } = useFullscreenMode();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { challengeId, isSidebarOpen, canvasBackgroundColor } = usePuzzleInformation();

  const puzzleInformationDispatch = usePuzzleInformationDispatch();

  const handleRestartPuzzle = useCallback(() => {
    handleHidePuzzleRestartConfirmationDialog();
    puzzleInformationDispatch({ type: "init-new-challenge-id" });
  }, [handleHidePuzzleRestartConfirmationDialog, puzzleInformationDispatch]);

  const handleSetCanvasBackgroundColorName = useCallback(
    (color: CanvasBackgroundColor) => {
      puzzleInformationDispatch({ type: "set-canvas-background-color", color });
    },
    [puzzleInformationDispatch],
  );

  useCacheHitCounterPieceShapePath();
  useCacheHitCounterPieceMaskPath();

  useChallengeTimer();

  const cssBackgroundColor = getCssColorNameForCanvasBackgroundColor(canvasBackgroundColor);

  return (
    <FullScreen handle={fullScreenModeHandle} className={s.AppContainer}>
      <main className={s.App} style={{ backgroundColor: cssBackgroundColor }}>
        <PuzzleView
          key={challengeId}
          ref={canvasRef}
          toggleFullscreenMode={toggleFullscreenMode}
          isFullscreenModeActive={isFullscreenModeActive}
        >
          <Sidebar
            isVisible={isSidebarOpen}
            canvasBackgroundColor={canvasBackgroundColor}
            onRestartPuzzleChallenge={handleShowPuzzleRestartConfirmationDialog}
            onShowChangeNumberOfPiecesDialog={showPuzzleModificationDialog}
            onShowChooseMethodToCreatePuzzleDialog={handleShowChooseMethodToCreatePuzzleDialog}
            onShowChangePieceShapeDialog={showPuzzleModificationDialog}
            onChangeCanvasBackgroundColor={handleSetCanvasBackgroundColorName}
            onShowHelpDialog={handleShowHelpDialog}
            onShowDebugSettingsDialog={handleShowDebugSettingsDialog}
          />
        </PuzzleView>

        {isVisiblePuzzleRestartConfirmationDialog && (
          <PuzzleRestartConfirmationModal
            onHide={handleHidePuzzleRestartConfirmationDialog}
            onReject={handleHidePuzzleRestartConfirmationDialog}
            onConfirm={handleRestartPuzzle}
          />
        )}

        {isVisibleChooseMethodToCreatePuzzleDialog && (
          <ChooseMethodToCreatePuzzleModal
            initialImageSrc={shouldUseCurrentImage ? initialImageSrc : undefined}
            onHide={hidePuzzleModificationDialog}
          />
        )}

        {isVisibleIntroduction && <HelpModal onHide={handleHideHelpDialog} />}

        {isVisibleDebugSettingsDialog && <DebugSettingsModal onHide={handleHideDebugSettingsDialog} />}
      </main>
    </FullScreen>
  );
});

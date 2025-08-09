import { memo, useLayoutEffect, useState } from "react";
import type { CanvasBackgroundColor } from "../models/CanvasBackgroundColor";
import { DEFAULT_BACKGROUND_COLOR_NAME_FOR_SCENE_CANVAS } from "../models/CanvasBackgroundColor";
import { cn } from "../utils/cssClassNames";
import { ActionButton } from "./ActionButton";
import { CanvasBackgroundColorSelector } from "./SidePanelComponents/CanvasBackgroundColorSelector";
import { ChallengeSeed } from "./SidePanelComponents/ChallengeSeed";
import { ChallengeStats } from "./SidePanelComponents/ChallengeStats";
import { PuzzleInformation } from "./SidePanelComponents/PuzzleInformation";
import { ShowDebugSettingsDialogButton } from "./SidePanelComponents/ShowDebugSettingsDialogButton";
import { Spacer } from "./SidePanelComponents/Spacer";
import s from "./Sidebar.module.css";

export interface SidebarProps {
  canvasBackgroundColor?: CanvasBackgroundColor;
  isVisible?: boolean;
  onChangeCanvasBackgroundColor?: (color: CanvasBackgroundColor) => void;
  onShowHelpDialog?: () => void;
  onShowChangeNumberOfPiecesDialog?: () => void;
  onShowChooseMethodToCreatePuzzleDialog?: () => void;
  onShowDebugSettingsDialog?: () => void;
  onShowChangePieceShapeDialog?: () => void;
  onRestartPuzzleChallenge?: () => void;
}

export const Sidebar = memo(function Sidebar({
  canvasBackgroundColor = DEFAULT_BACKGROUND_COLOR_NAME_FOR_SCENE_CANVAS,
  isVisible = true,
  onChangeCanvasBackgroundColor,
  onShowHelpDialog,
  onShowChangeNumberOfPiecesDialog,
  onShowChooseMethodToCreatePuzzleDialog,
  onShowDebugSettingsDialog,
  onShowChangePieceShapeDialog,
  onRestartPuzzleChallenge,
}: SidebarProps) {
  const [usingSpaceUnderPanel, setUsingSpaceUnderPanel] = useState(true);

  useLayoutEffect(() => {
    window?.requestAnimationFrame(() => {
      window?.requestAnimationFrame(() => {
        setUsingSpaceUnderPanel(isVisible);
      });
    });
  }, [isVisible]);

  if (!usingSpaceUnderPanel) {
    return undefined;
  }

  return (
    <aside
      className={cn([s.SidePanel, isVisible ? "" : s.PreHide, usingSpaceUnderPanel ? s.Visible : ""])}
      aria-label="sidebar"
    >
      <PuzzleInformation />

      <ChallengeStats onRestartPuzzleChallenge={onRestartPuzzleChallenge} />

      <CanvasBackgroundColorSelector
        canvasBackgroundColor={canvasBackgroundColor}
        onChangeCanvasBackgroundColor={onChangeCanvasBackgroundColor}
      />

      <Spacer />

      <ActionButton onClick={onRestartPuzzleChallenge} isSidebarButton>
        Solve puzzle again
      </ActionButton>
      <ActionButton onClick={onShowChangeNumberOfPiecesDialog} isSidebarButton>
        Change number of pieces
      </ActionButton>
      <ActionButton onClick={onShowChooseMethodToCreatePuzzleDialog} isSidebarButton>
        Change image
      </ActionButton>
      <ActionButton onClick={onShowChangePieceShapeDialog} isSidebarButton>
        Change piece shape
      </ActionButton>
      <ActionButton onClick={onShowHelpDialog} isSidebarButton>
        Help
      </ActionButton>

      <ShowDebugSettingsDialogButton onClick={onShowDebugSettingsDialog} />

      <ChallengeSeed />
    </aside>
  );
});

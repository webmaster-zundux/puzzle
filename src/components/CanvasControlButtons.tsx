import { memo, useCallback } from "react";
import { ActionButton } from "./ActionButton";
import s from "./CanvasControlButtons.module.css";

export interface CanvasControlButtonsProps {
  isVisibleSidePanel: boolean;
  isFullscreenModeActive: boolean;
  onToggleSidePanel?: () => void;
  onToggleFullscreenMode?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  onShowAllPieces?: () => void;
}

export const CanvasControlButtons = memo(function CanvasControlButtons({
  isVisibleSidePanel = false,
  isFullscreenModeActive = false,
  onToggleSidePanel,
  onToggleFullscreenMode,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onShowAllPieces,
}: CanvasControlButtonsProps) {
  const sidePanelToggleIconName = isVisibleSidePanel ? "xmark" : "bars";
  const toggleSidePanelButtonText = isVisibleSidePanel ? "hide side panel" : "show side panel";

  const handleToogleFullScreenMode = useCallback(
    () => onToggleFullscreenMode && onToggleFullscreenMode(),
    [onToggleFullscreenMode],
  );
  const toggleFullscreenModeButtonIcon = isFullscreenModeActive ? "compress" : "expand";
  const toggleFullscreenModeButtonText = isFullscreenModeActive ? "exit full screen" : "enter full screen";

  return (
    <div className={s.CanvasControlButtons} role="toolbar" aria-label="puzzle controls">
      <ul className={s.List}>
        <li>
          <ActionButton
            doubleSized
            iconName="globe"
            iconSize="double"
            onlyIcon
            text="show all pieces"
            onClick={onShowAllPieces}
          />
        </li>
        <li>
          <ActionButton doubleSized title="reset zoom" name="reset-zoom" text="1:1" onClick={onResetZoom} />
        </li>

        <li>
          <ActionButton doubleSized iconName="minus" iconSize="double" onlyIcon text="zoom out" onClick={onZoomOut} />
        </li>
        <li>
          <ActionButton doubleSized iconName="plus" iconSize="double" onlyIcon text="zoom in" onClick={onZoomIn} />
        </li>

        <li>
          <ActionButton
            doubleSized
            iconName={toggleFullscreenModeButtonIcon}
            iconSize="double"
            onlyIcon
            text={toggleFullscreenModeButtonText}
            onClick={handleToogleFullScreenMode}
          />
        </li>
        <li>
          <ActionButton
            doubleSized
            iconName={sidePanelToggleIconName}
            iconSize="double"
            onlyIcon
            text={toggleSidePanelButtonText}
            onClick={onToggleSidePanel}
          />
        </li>
      </ul>
    </div>
  );
});

import { forwardRef, useEffect } from "react";
import { useDebugSettingsState } from "../hooks/useDebugSettings";
import { usePuzzleInformation } from "../hooks/usePuzzleInformation";
import { useToggleVisibility } from "../hooks/useToggleVisibility";
import s from "./Canvas.module.css";
import { PointerInformation } from "./MousePositionInformation";
import { CongratulationNotification } from "./notifications/CongratulationNotification";
import { ZoomInformation } from "./ZoomInformation";

export interface CanvasProps {}

export const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(function Canvas(_, canvasRef) {
  const {
    isVisible: isVisibleCongratulationMessage,
    show: handleShowCongratulationMessage,
    hide: handleHideCongratulationMessage,
  } = useToggleVisibility(false);

  const { puzzleCompleted } = usePuzzleInformation();
  const { debugSettingsShouldDisplayPointerInformation } = useDebugSettingsState();

  useEffect(() => {
    if (puzzleCompleted) {
      handleShowCongratulationMessage();
    } else {
      handleHideCongratulationMessage();
    }
  }, [handleHideCongratulationMessage, handleShowCongratulationMessage, puzzleCompleted]);

  return (
    <div className={s.CanvasContainer}>
      <canvas ref={canvasRef} id="canvas" className={s.Canvas} role="application" aria-label="puzzle view"></canvas>

      {isVisibleCongratulationMessage && <CongratulationNotification onHide={handleHideCongratulationMessage} />}

      <div className={s.FloatingInfoLabel}>
        {debugSettingsShouldDisplayPointerInformation && <PointerInformation ref={canvasRef} />}

        <ZoomInformation />
      </div>
    </div>
  );
});

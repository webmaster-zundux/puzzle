import { useCameraState } from "../hooks/useCameraState";
import { usePuzzleInformation } from "../hooks/usePuzzleInformation";
import { HIGHLIGHT_COLORS_FOR_CANVAS_BACKGROUND_COLOR } from "../models/CanvasBackgroundColor";
import { cn } from "../utils/cssClassNames";
import s from "./ZoomInformation.module.css";

export const ZoomInformation = () => {
  const { scale } = useCameraState();
  const { canvasBackgroundColor } = usePuzzleInformation();

  const humanizeScale = scale.toFixed(2);

  const isLightBackground = HIGHLIGHT_COLORS_FOR_CANVAS_BACKGROUND_COLOR[canvasBackgroundColor] === "black";

  return (
    <div className={cn([s.ZoomLabel, isLightBackground && s.TextForLightBackground])}>
      <label id="zoom-label">zoom: </label>
      <span role="note" aria-labelledby="zoom-label">
        {humanizeScale}x
      </span>
    </div>
  );
};

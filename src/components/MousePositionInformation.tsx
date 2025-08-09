import { forwardRef, useMemo } from "react";
import { usePrimaryMouseButton } from "../hooks/usePrimaryMouseButton";
import { useMousePosition } from "../hooks/useMouseMove";
import { usePuzzleInformation } from "../hooks/usePuzzleInformation";
import { HIGHLIGHT_COLORS_FOR_CANVAS_BACKGROUND_COLOR } from "../models/CanvasBackgroundColor";
import { cn } from "../utils/cssClassNames";
import s from "./MousePositionInformation.module.css";

export interface PointerInformationProps {}

export const PointerInformation = forwardRef<HTMLCanvasElement, PointerInformationProps>(
  function MousePositionInformation(_, canvasRef) {
    const canvasRefObject = useMemo(() => (typeof canvasRef === "function" ? null : canvasRef), [canvasRef]);
    const isPrimaryMouseButtonPressed = usePrimaryMouseButton({ elementRef: canvasRefObject });
    const mousePosition = useMousePosition({ elementRef: canvasRefObject });
    const { canvasBackgroundColor } = usePuzzleInformation();
    const isLightBackground = HIGHLIGHT_COLORS_FOR_CANVAS_BACKGROUND_COLOR[canvasBackgroundColor] === "black";

    return (
      <div className={cn([s.MousePositionLabel, isLightBackground && s.TextForLightBackground])}>
        <label className={s.MousePositionLabelHeader} id="pointer-left-button-state-label">
          primary mouse button:{" "}
        </label>
        <span role="note" aria-labelledby="pointer-left-button-state-label">
          {isPrimaryMouseButtonPressed ? "pressed" : "free"}
        </span>

        <label className={s.MousePositionLabelHeader} id="pointer-position-label">
          mouse position:{" "}
        </label>
        <span role="note" aria-labelledby="pointer-position-label">
          x: {mousePosition?.x || 0}px y: {mousePosition?.y || 0}px
        </span>
      </div>
    );
  },
);

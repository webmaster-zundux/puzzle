import type { FC } from "react";
import { memo } from "react";
import type { CanvasBackgroundColor } from "../../models/CanvasBackgroundColor";
import {
  CANVAS_BACKGROUND_COLORS,
  CANVAS_BACKGROUND_COLOR_NAMES_FOR_SCENE_CANVAS,
  DEFAULT_BACKGROUND_COLOR_NAME_FOR_SCENE_CANVAS,
  getCssColorNameForCanvasBackgroundColor,
} from "../../models/CanvasBackgroundColor";
import { cn } from "../../utils/cssClassNames";
import s from "./CanvasBackgroundColorSelector.module.css";
import { ColoredRadioButton } from "./ColoredRadioButton";

export interface CanvasBackgroundColorSelectorProps {
  canvasBackgroundColor?: CanvasBackgroundColor;
  asRowOfSquares?: boolean;
  onChangeCanvasBackgroundColor?: (color: CanvasBackgroundColor) => void;
}

export const CanvasBackgroundColorSelector: FC<CanvasBackgroundColorSelectorProps> = memo(
  function CanvasBackgroundColorSelector({
    canvasBackgroundColor = DEFAULT_BACKGROUND_COLOR_NAME_FOR_SCENE_CANVAS,
    asRowOfSquares = true,
    onChangeCanvasBackgroundColor,
  }: CanvasBackgroundColorSelectorProps) {
    return (
      <div className={s.CanvasBackgroundColor}>
        <div className={s.CanvasBackgroundColorTitle} id="background-color-label">
          Background color
        </div>
        <ul className={cn([s.ColorList, asRowOfSquares && s.ColorListAsRow])} aria-labelledby="background-color-label">
          {CANVAS_BACKGROUND_COLOR_NAMES_FOR_SCENE_CANVAS.map((colorName) => {
            const isChecked = colorName === canvasBackgroundColor;
            const cssColorName = getCssColorNameForCanvasBackgroundColor(colorName);
            const humanColorName = CANVAS_BACKGROUND_COLORS[colorName];

            return (
              <li key={colorName} className={s.ColorListItem}>
                <ColoredRadioButton
                  name="canvas-background-color"
                  value={colorName}
                  cssColorName={cssColorName}
                  title={humanColorName}
                  checked={isChecked}
                  onChange={onChangeCanvasBackgroundColor}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
);

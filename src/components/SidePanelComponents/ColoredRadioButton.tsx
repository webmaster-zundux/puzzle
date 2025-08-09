import { memo, useCallback } from "react";
import type { CanvasBackgroundColor } from "../../models/CanvasBackgroundColor";
import { cn } from "../../utils/cssClassNames";
import s from "./ColoredRadioButton.module.css";

export interface ColoredRadioButtonProps {
  name: string;
  value: CanvasBackgroundColor;
  cssColorName: string;
  title: string;
  checked: boolean;
  onChange?: (value: CanvasBackgroundColor) => void;
}

export const ColoredRadioButton = memo(function ColoredRadioButton({
  name,
  value,
  cssColorName,
  title,
  checked = false,
  onChange,
}: ColoredRadioButtonProps) {
  const inputId = `${value}`;
  const additionalHtmlAttributes = { checked };

  const handleChange = useCallback(() => onChange && onChange(value), [onChange, value]);

  return (
    <div className={s.ColoredRadioButton}>
      <input
        className={cn([s.ColoredRadioButtonInput])}
        type="radio"
        id={inputId}
        name={name}
        value={value}
        aria-label={title}
        onChange={handleChange}
        {...additionalHtmlAttributes}
      />

      <label
        className={s.ColoredRadioButtonLabel}
        htmlFor={inputId}
        title={title}
        style={{ backgroundColor: cssColorName }}
      ></label>
    </div>
  );
});

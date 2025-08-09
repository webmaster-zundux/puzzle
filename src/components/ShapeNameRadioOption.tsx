import { memo, useCallback } from "react";
import type { PieceShapeName } from "../utils-path/getSideShapes";
import { cn } from "../utils/cssClassNames";
import { ShapeIcon } from "./ShapeIcon";
import s from "./ShapeNameRadioOption.module.css";

const humanizeShapeName = (shapeName: string) => {
  return shapeName.replace(/_/g, " ");
};

interface ShapeNameOptionProps {
  checked: boolean;
  value: PieceShapeName;
  onChange: (pieceShapeName: PieceShapeName) => void;
}

export const ShapeNameRadioOption = memo(function ShapeNameRadioOption({
  value,
  checked = false,
  onChange,
}: ShapeNameOptionProps) {
  const handleChange = useCallback(() => {
    onChange(value);
  }, [onChange, value]);

  const optionId = `${value.toLowerCase()}`;
  const humanizedShapeName = humanizeShapeName(optionId);

  const wrapperClassNames = cn([s.Field, checked && s.FieldActive]);

  return (
    <li className={s.Container}>
      <label htmlFor={optionId} className={wrapperClassNames} title={humanizedShapeName}>
        <i className={s.RadioOptionIcon} role="img" aria-label={humanizedShapeName}>
          <ShapeIcon shapeName={value} />
        </i>

        <input
          id={optionId}
          type="radio"
          className={s.RadioOption}
          checked={checked}
          value={value.toLowerCase()}
          onChange={handleChange}
        />
      </label>
    </li>
  );
});

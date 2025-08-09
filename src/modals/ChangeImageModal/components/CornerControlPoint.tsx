import type { FC, MouseEventHandler, TouchEventHandler } from "react";
import type { Point } from "../../../models/Point";
import { cn } from "../../../utils/cssClassNames";
import s from "./CornerControlPoint.module.css";

type CornerName = "TL" | "TR" | "BL" | "BR";

interface CornerControlPointProps {
  id: string;
  point: Point;
  active?: boolean;
  onMouseDown: MouseEventHandler<SVGElement>;
  onTouchStart: TouchEventHandler<SVGElement>;
}

export const CornerControlPoint: FC<CornerControlPointProps> = ({
  id,
  point,
  active = false,
  onMouseDown,
  onTouchStart,
}) => {
  const cornerSymbol: CornerName | undefined = /^(tl)|(tr)|(bl)|(br)$/i.test(id)
    ? (`${id}`.toUpperCase() as CornerName)
    : undefined;

  const cornerClass =
    cornerSymbol === "TL"
      ? s.TL
      : cornerSymbol === "TR"
        ? s.TR
        : cornerSymbol === "BL"
          ? s.BL
          : cornerSymbol === "BR"
            ? s.BR
            : undefined;

  const humanizedCornerName =
    cornerSymbol === "TL"
      ? "top left"
      : cornerSymbol === "TR"
        ? "top right"
        : cornerSymbol === "BL"
          ? "bottom left"
          : cornerSymbol === "BR"
            ? "bottom right"
            : "";

  const title = `${humanizedCornerName} corner control point`;

  return (
    <g className={cn([s.CornerControlContainer, cornerClass, active && s.Active])}>
      <circle
        id={id}
        cx={point.x}
        cy={point.y}
        r={1}
        className={s.CornerControlVisualMarker}
        style={{ filter: "url(#shadow)" }}
      />
      <circle
        id={id}
        cx={point.x}
        cy={point.y}
        r={1}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        className={s.CornerControlHandle}
        role="button"
        aria-label={title}
      >
        <title>{title}</title>
      </circle>
    </g>
  );
};

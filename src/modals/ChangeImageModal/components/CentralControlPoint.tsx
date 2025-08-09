import type { FC, MouseEventHandler, TouchEventHandler } from "react";
import type { Point } from "../../../models/Point";
import { cn } from "../../../utils/cssClassNames";
import s from "./CentralControlPoint.module.css";

interface CentralControlPointProps {
  id: string;
  point: Point;
  active?: boolean;
  onMouseDown: MouseEventHandler<SVGElement>;
  onTouchStart: TouchEventHandler<SVGElement>;
}

export const CentralControlPoint: FC<CentralControlPointProps> = ({
  id,
  point,
  active = false,
  onMouseDown,
  onTouchStart,
}) => {
  const title = `center control point`;

  return (
    <g className={cn([s.CentralControlContainer, s.Central, active && s.Active])}>
      <rect
        id={id}
        x={point.x}
        y={point.y}
        width={1}
        height={1}
        className={s.CentralControlVisualMarker}
        style={{ filter: "url(#shadow)" }}
      />
      <rect
        id={id}
        x={point.x}
        y={point.y}
        width={1}
        height={1}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        className={s.CentralControlHandle}
        role="button"
        aria-label={title}
      >
        <title>{title}</title>
      </rect>
    </g>
  );
};

import type { FC, MouseEventHandler, TouchEventHandler } from "react";
import type { Point } from "../../../models/Point";
import { cn } from "../../../utils/cssClassNames";
import s from "./SideControlPoint.module.css";

type SideName = "T" | "R" | "B" | "L";

interface SideControlPointProps {
  id: string;
  point: Point;
  vertical?: boolean;
  active?: boolean;
  onMouseDown: MouseEventHandler<SVGElement>;
  onTouchStart: TouchEventHandler<SVGElement>;
}

export const SideControlPoint: FC<SideControlPointProps> = ({
  id,
  point,
  vertical = false,
  active = false,
  onMouseDown,
  onTouchStart,
}) => {
  const sideSymbol: SideName | undefined = /^[trbl]{1}$/i.test(id) ? (`${id}`.toUpperCase() as SideName) : undefined;

  const sideClass =
    sideSymbol === "T"
      ? s.T
      : sideSymbol === "R"
        ? s.R
        : sideSymbol === "B"
          ? s.B
          : sideSymbol === "L"
            ? s.L
            : undefined;

  const humanizedSideName =
    sideSymbol === "T"
      ? "top"
      : sideSymbol === "R"
        ? "right"
        : sideSymbol === "B"
          ? "bottom"
          : sideSymbol === "L"
            ? "left"
            : "";

  const title = `${humanizedSideName} side control point`;

  return (
    <g className={cn([s.SideControlContainer, sideClass, active && s.Active])}>
      <rect
        x={point.x}
        y={point.y}
        width={1}
        height={1}
        className={cn([s.SideControlVisualMarker, vertical && s.Vertical])}
        style={{ filter: "url(#shadow)" }}
      />
      <rect
        id={id}
        x={point.x}
        y={point.y}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        width={1}
        height={1}
        className={s.SideControlHandle}
        role="button"
        aria-label={title}
      >
        <title>{title}</title>
      </rect>
    </g>
  );
};

import { memo } from "react";
import { ReactSVG } from "react-svg";
import type { SideShapeNamePath2d } from "../utils-path/getSideShapes";
import { DEFAULT_PIECE_SHAPE_NAME, SIDE_SHAPE_NAMES } from "../utils-path/getSideShapes";
import s from "./ShapeIcon.module.css";

const SHAPE_NAME = SIDE_SHAPE_NAMES;

// eslint-disable-next-line react-refresh/only-export-components
export const ICON_PIECE_SHAPE_NAMES = {
  [SHAPE_NAME.DIKE]: "dike" as const,
  [SHAPE_NAME.DITCH_DOUBLE]: "ditch_double" as const,
  [SHAPE_NAME.DITCH_WITH_ROUNDED_ANGLES]: "ditch_with-rounded-angles" as const,
  [SHAPE_NAME.DITCH]: "ditch" as const,
  [SHAPE_NAME.STRAIGHT_LINE]: "straight-line" as const,
  [SHAPE_NAME.TWO_PINS_BIGGER]: "two-pins_bigger" as const,
  [SHAPE_NAME.TWO_PINS]: "two-pins" as const,
  [SHAPE_NAME.UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_ERODED_HILL]:
    "underground-river_circle-bottom_in-eroded-hill" as const,
  [SHAPE_NAME.UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_HILL]: "underground-river_circle-bottom_in-hill" as const,
  [SHAPE_NAME.UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_VULCAN]: "underground-river_circle-bottom_in-vulcan" as const,
  [SHAPE_NAME.UNDERGROUND_RIVER_CIRCLE_BOTTOM]: "underground-river_circle-bottom" as const,
  [SHAPE_NAME.UNDERGROUND_RIVER_WITH_ERODED_SHORES]: "underground-river_with-eroded-shores" as const,
  [SHAPE_NAME.UNDERGROUND_RIVER]: "underground-river" as const,
  [SHAPE_NAME.SAW]: "saw" as const,
};

export interface ShapeIconProps {
  shapeName?: SideShapeNamePath2d;
}

export const ShapeIcon = memo(function ShapeIcon({
  shapeName = DEFAULT_PIECE_SHAPE_NAME,
  ...restProps
}: ShapeIconProps) {
  const iconName = ICON_PIECE_SHAPE_NAMES[shapeName] ?? ICON_PIECE_SHAPE_NAMES.STRAIGHT_LINE;
  const shapeIconPath = `/assets/shape-icons/icon-shape-${iconName}.svg`;

  return <ReactSVG className={s.ShapeIcon} src={shapeIconPath} {...restProps} />;
});

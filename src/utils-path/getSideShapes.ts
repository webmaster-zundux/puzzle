import { edgeShapeDikePath2d } from "../core/shapes/paths/edge-shape-dike.path2d";
import { edgeShapeDitchPath2d } from "../core/shapes/paths/edge-shape-ditch.path2d";
import { edgeShapeDitchDoublePath2d } from "../core/shapes/paths/edge-shape-ditch_double.path2d";
import { edgeShapeDitchDoubleWithRoundedAnglesPath2d } from "../core/shapes/paths/edge-shape-ditch_with-rounded-angles.path2d";
import { edgeShapeSawPath2d } from "../core/shapes/paths/edge-shape-saw.path2d";
import { edgeShapeStraightLinePath2dString } from "../core/shapes/paths/edge-shape-straight-line";
import { edgeShapeTwoPinsPath2d } from "../core/shapes/paths/edge-shape-two-pins.path2d";
import { edgeShapeTwoPinsBiggerPath2d } from "../core/shapes/paths/edge-shape-two-pins_bigger.path2d";
import { edgeShapeUndergroundRiverPath2d } from "../core/shapes/paths/edge-shape-underground-river.path2d";
import { edgeShapeUndergroundRiverCircleBottomPath2d } from "../core/shapes/paths/edge-shape-underground-river_circle-bottom.path2d";
import { edgeShapeUndergroundRiverCircleBottomInErodedHillPath2d } from "../core/shapes/paths/edge-shape-underground-river_circle-bottom_in-eroded-hill.path2d";
import { edgeShapeUndergroundRiverCircleBottomInHillPath2d } from "../core/shapes/paths/edge-shape-underground-river_circle-bottom_in-hill.path2d";
import { edgeShapeUndergroundRiverCircleBottomInVulcanPath2d } from "../core/shapes/paths/edge-shape-underground-river_circle-bottom_in-vulcan.path2d";
import { edgeShapeUndergroundRiverWithErodedShoresPath2d } from "../core/shapes/paths/edge-shape-underground-river_with-eroded-shores.path2d";
import type { Path2dCommand } from "../models/path2d-commands/Path2dCommand";
import { parsePath2dCommandsFromString } from "../models/path2d-commands/Path2dCommand";

export const AXIS_X = "X" as const;
export const AXIS_Y = "Y" as const;

export const SIDE_SHAPE_NAMES = {
  DIKE: "DIKE" as const,
  DITCH_DOUBLE: "DITCH_DOUBLE" as const,
  DITCH_WITH_ROUNDED_ANGLES: "DITCH_WITH_ROUNDED_ANGLES" as const,
  DITCH: "DITCH" as const,
  STRAIGHT_LINE: "STRAIGHT_LINE" as const,
  TWO_PINS_BIGGER: "TWO_PINS_BIGGER" as const,
  TWO_PINS: "TWO_PINS" as const,
  UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_ERODED_HILL: "UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_ERODED_HILL" as const,
  UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_HILL: "UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_HILL" as const,
  UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_VULCAN: "UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_VULCAN" as const,
  UNDERGROUND_RIVER_CIRCLE_BOTTOM: "UNDERGROUND_RIVER_CIRCLE_BOTTOM" as const,
  UNDERGROUND_RIVER_WITH_ERODED_SHORES: "UNDERGROUND_RIVER_WITH_ERODED_SHORES" as const,
  UNDERGROUND_RIVER: "UNDERGROUND_RIVER" as const,
  SAW: "SAW" as const,
};

export const AVAILABLE_SIDE_SHAPE_NAMES = [
  SIDE_SHAPE_NAMES.DIKE,
  SIDE_SHAPE_NAMES.DITCH_DOUBLE,
  SIDE_SHAPE_NAMES.DITCH_WITH_ROUNDED_ANGLES,
  SIDE_SHAPE_NAMES.DITCH,
  SIDE_SHAPE_NAMES.STRAIGHT_LINE,
  SIDE_SHAPE_NAMES.TWO_PINS_BIGGER,
  SIDE_SHAPE_NAMES.TWO_PINS,
  SIDE_SHAPE_NAMES.UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_ERODED_HILL,
  SIDE_SHAPE_NAMES.UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_HILL,
  SIDE_SHAPE_NAMES.UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_VULCAN,
  SIDE_SHAPE_NAMES.UNDERGROUND_RIVER_CIRCLE_BOTTOM,
  SIDE_SHAPE_NAMES.UNDERGROUND_RIVER_WITH_ERODED_SHORES,
  SIDE_SHAPE_NAMES.UNDERGROUND_RIVER,
  SIDE_SHAPE_NAMES.SAW,
];

export const USER_AVAILABLE_SIDE_SHAPE_NAMES = [
  SIDE_SHAPE_NAMES.DITCH_DOUBLE,
  SIDE_SHAPE_NAMES.DITCH_WITH_ROUNDED_ANGLES,
  SIDE_SHAPE_NAMES.STRAIGHT_LINE,
  SIDE_SHAPE_NAMES.UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_ERODED_HILL,
  SIDE_SHAPE_NAMES.UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_HILL,
  SIDE_SHAPE_NAMES.UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_VULCAN,
  SIDE_SHAPE_NAMES.UNDERGROUND_RIVER_CIRCLE_BOTTOM,
  SIDE_SHAPE_NAMES.UNDERGROUND_RIVER_WITH_ERODED_SHORES,
  SIDE_SHAPE_NAMES.UNDERGROUND_RIVER,
];

export type PieceShapeName = SideShapeNamePath2d;

export const getPieceSideShapeAsSocketByShapeName = (
  pieceSideShapeNamePath2d: SideShapeNamePath2d,
): Path2dCommand[] => {
  const path2dCommandsString = getPieceSideShapeAsSocketByShapeNamePath2d(pieceSideShapeNamePath2d);

  const path2dCommands: Path2dCommand[] = parsePath2dCommandsFromString(path2dCommandsString);

  return path2dCommands;
};

export type SideShapeNamePath2d = keyof typeof SIDE_SHAPE_NAMES;

export const DEFAULT_PIECE_SHAPE_NAME: SideShapeNamePath2d =
  SIDE_SHAPE_NAMES.UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_ERODED_HILL;

export type Path2dString = string;

export const getPieceSideShapeAsSocketByShapeNamePath2d = (
  pieceSideShapeNamePath2d: SideShapeNamePath2d,
): Path2dString => {
  if (!pieceSideShapeNamePath2d || !(AVAILABLE_SIDE_SHAPE_NAMES as string[]).includes(pieceSideShapeNamePath2d)) {
    console.error(`Warning. Unsupported shape name. Unknown piece side shape name`);
  }

  switch (pieceSideShapeNamePath2d) {
    case SIDE_SHAPE_NAMES.DIKE: {
      return edgeShapeDikePath2d;
    }
    case SIDE_SHAPE_NAMES.DITCH_DOUBLE: {
      return edgeShapeDitchDoublePath2d;
    }
    case SIDE_SHAPE_NAMES.DITCH_WITH_ROUNDED_ANGLES: {
      return edgeShapeDitchDoubleWithRoundedAnglesPath2d;
    }
    case SIDE_SHAPE_NAMES.DITCH: {
      return edgeShapeDitchPath2d;
    }
    case SIDE_SHAPE_NAMES.STRAIGHT_LINE: {
      return edgeShapeStraightLinePath2dString;
    }
    case SIDE_SHAPE_NAMES.TWO_PINS_BIGGER: {
      return edgeShapeTwoPinsBiggerPath2d;
    }
    case SIDE_SHAPE_NAMES.TWO_PINS: {
      return edgeShapeTwoPinsPath2d;
    }
    case SIDE_SHAPE_NAMES.UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_ERODED_HILL: {
      return edgeShapeUndergroundRiverCircleBottomInErodedHillPath2d;
    }
    case SIDE_SHAPE_NAMES.UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_HILL: {
      return edgeShapeUndergroundRiverCircleBottomInHillPath2d;
    }
    case SIDE_SHAPE_NAMES.UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_VULCAN: {
      return edgeShapeUndergroundRiverCircleBottomInVulcanPath2d;
    }
    case SIDE_SHAPE_NAMES.UNDERGROUND_RIVER_CIRCLE_BOTTOM: {
      return edgeShapeUndergroundRiverCircleBottomPath2d;
    }
    case SIDE_SHAPE_NAMES.UNDERGROUND_RIVER_WITH_ERODED_SHORES: {
      return edgeShapeUndergroundRiverWithErodedShoresPath2d;
    }
    case SIDE_SHAPE_NAMES.UNDERGROUND_RIVER: {
      return edgeShapeUndergroundRiverPath2d;
    }
    case SIDE_SHAPE_NAMES.SAW: {
      return edgeShapeSawPath2d;
    }
    default: {
      console.error(
        `Unknown piece side shape Path2d ${pieceSideShapeNamePath2d}. Fallback to use straight line for piece side shape`,
      );
    }
  }

  return edgeShapeStraightLinePath2dString;
};

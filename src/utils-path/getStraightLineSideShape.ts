import { createEdgeShapeStraightLinePath2d } from "../core/shapes/paths/edge-shape-straight-line";
import type { Path2dCommand } from "../models/path2d-commands/Path2dCommand";
import { assertIsRotationAngle } from "../models/path2d-commands/Path2dCommand";

export const getStraightLineSideShape = (angleInDegree: number = 0): Path2dCommand[] => {
  let path = createEdgeShapeStraightLinePath2d();

  assertIsRotationAngle(angleInDegree);
  path = path.map((command) => command.rotate(angleInDegree));

  return path;
};

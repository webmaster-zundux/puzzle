import type { Path2dCommand } from "../../../models/path2d-commands/Path2dCommand";
import { parsePath2dCommandsFromString } from "../../../models/path2d-commands/Path2dCommand";

export const edgeShapeStraightLinePath2dString = `m0 0l1 0`;

export const createEdgeShapeStraightLinePath2d = (): Path2dCommand[] =>
  parsePath2dCommandsFromString(edgeShapeStraightLinePath2dString);

import type { Path2dCommand } from "../models/path2d-commands/Path2dCommand";
import { testIsRotationAngle } from "../models/path2d-commands/Path2dCommand";

export const path2dCommandsToString = (path: Path2dCommand[]) => path.map((c) => c.toString()).join(" ");
export const p2s = path2dCommandsToString;

/**
 * @param angleInDegree {number} - 0, 90, 180, 270
 * @param sideShapeAsSocket {Path2dCommand[]}
 * @returns Path2dCommand[]
 */
export const getSocketSideShape = (angleInDegree: number = 0, sideShapeAsSocket: Path2dCommand[]): Path2dCommand[] => {
  const path = sideShapeAsSocket;

  if (!testIsRotationAngle(angleInDegree)) {
    throw new Error("Error. Unsupported angle for side shape");
  }

  return path.map((command) => command.rotate(angleInDegree));
};

import type { Path2dCommand } from "../models/path2d-commands/Path2dCommand";
import { testIsRotationAngle } from "../models/path2d-commands/Path2dCommand";
import { CookedSideShapeAsPlugCache } from "./CookedSideShapeAsPlugCache";
import { AXIS_X } from "./getSideShapes";

export const _convertSideShapeAsSocketToShapeAsPlug = (sideShapeAsSocket: Path2dCommand[]): Path2dCommand[] =>
  sideShapeAsSocket.map((pathPart) => pathPart.mirror(AXIS_X));

export const convertSideShapeAsSocketToShapeAsPlug = (sideShapeAsSocket: Path2dCommand[]): Path2dCommand[] => {
  let sideShapeAsPlug = CookedSideShapeAsPlugCache.get(sideShapeAsSocket);

  if (sideShapeAsPlug) {
    return sideShapeAsPlug;
  }

  sideShapeAsPlug = _convertSideShapeAsSocketToShapeAsPlug(sideShapeAsSocket);

  CookedSideShapeAsPlugCache.set(sideShapeAsSocket, sideShapeAsPlug);

  return sideShapeAsPlug;
};

export const getPlugSideShape = (angleInDegree: number = 0, sideShapeAsSocket: Path2dCommand[]): Path2dCommand[] => {
  const path = convertSideShapeAsSocketToShapeAsPlug(sideShapeAsSocket);
  if (!testIsRotationAngle(angleInDegree)) {
    throw new Error("Error. Unsupported angle for side shape");
  }

  return path.map((command) => command.rotate(angleInDegree));
};

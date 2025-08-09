import type { NEIGHBOR_SIDE } from "../core/puzzle/Piece";
import { getSideNameBySideIndex } from "../core/puzzle/Piece";
import type { Path2dCommand } from "../models/path2d-commands/Path2dCommand";
import type { ConnectionType } from "./SideIndex";
import { CONNECTION_TYPE_NONE } from "./SideIndex";
import { getSideShapePathBasedOnConnectionType } from "./getSideShapePathBasedOnConnectionType";

export const getSideShapePathParts = (
  sideIndex: number,
  totalNumberOfSides: number,
  sidesConnectionTypes = new Map<NEIGHBOR_SIDE, ConnectionType>(),
  isCounterclockwise = false,
  sideShapeAsSocket: Path2dCommand[],
): Path2dCommand[] => {
  const angleInDegreeBetweenSides = 360 / totalNumberOfSides;
  const sideName = getSideNameBySideIndex(sideIndex, totalNumberOfSides, isCounterclockwise);
  const connectionType = sidesConnectionTypes.get(sideName) || CONNECTION_TYPE_NONE;

  let angleInDegree = sideIndex * angleInDegreeBetweenSides;
  if (isCounterclockwise) {
    angleInDegree = -angleInDegree;
  }

  const sectionPathParts = getSideShapePathBasedOnConnectionType(connectionType, angleInDegree, sideShapeAsSocket);
  return sectionPathParts;
};

import type { NEIGHBOR_SIDE, SidesConnectionTypesAsString } from "../core/puzzle/Piece";
import { updateCacheHitCounterForPieceShapePath } from "../hooks/useCacheHitCounterPieceShapePath";
import type { Path2dCommand } from "../models/path2d-commands/Path2dCommand";
import { ConnectedSideShapesCache } from "./ConnectedSideShapesCache";
import type { ConnectionType } from "./SideIndex";
import { getSideShapePathParts } from "./getSideShapePathParts";

export const connectSideShapesToPathShape = (
  totalNumberOfSides: number,
  sidesConnectionTypes: Map<NEIGHBOR_SIDE, ConnectionType>,
  sidesConnectionTypesAsString: SidesConnectionTypesAsString,
  sideShapeAsSocket: Path2dCommand[],
  isCounterclockwise = false,
): Path2dCommand[] => {
  const cachedPathParts = ConnectedSideShapesCache.get(sidesConnectionTypesAsString, isCounterclockwise);

  if (cachedPathParts) {
    updateCacheHitCounterForPieceShapePath(sidesConnectionTypesAsString);

    return cachedPathParts;
  }

  let pathParts: Path2dCommand[] = [];

  for (let sideIndex = 0; sideIndex < totalNumberOfSides; sideIndex++) {
    const sideParts = getSideShapePathParts(
      sideIndex,
      totalNumberOfSides,
      sidesConnectionTypes,
      isCounterclockwise,
      sideShapeAsSocket,
    );

    if (sideIndex > 0) {
      // remove `m0 0` from 2nd, 3nd, 4th sideShape: Path2dCommand[]
      sideParts.shift();
    }

    pathParts = pathParts.concat(sideParts);
  }

  // pathParts.concat('z') -  // not needed

  ConnectedSideShapesCache.set(sidesConnectionTypesAsString, pathParts, isCounterclockwise);

  return pathParts;
};

export const connectSideShapesToPathShapeInClockwiseOrderOfSides = (
  totalNumberOfSides: number,
  sidesConnectionTypes: Map<NEIGHBOR_SIDE, ConnectionType>,
  sidesConnectionTypesAsString: SidesConnectionTypesAsString,
  sideShapeAsSocket: Path2dCommand[],
): Path2dCommand[] => {
  return connectSideShapesToPathShape(
    totalNumberOfSides,
    sidesConnectionTypes,
    sidesConnectionTypesAsString,
    sideShapeAsSocket,
    false,
  );
};

import type { SidesConnectionTypesAsString } from "../core/puzzle/Piece";
import type { Path2dCommand } from "../models/path2d-commands/Path2dCommand";

export const PATH_DIRECTION_COUNTERCLOCKWISE = "L" as const;
export const PATH_DIRECTION_CLOCKWISE = `R` as const;

export type PathDirection = typeof PATH_DIRECTION_COUNTERCLOCKWISE | typeof PATH_DIRECTION_CLOCKWISE;

export type ConnectedSideShapesCachedByPathDirection = {
  [key in PathDirection]: Path2dCommand[];
};

export class ConnectedSideShapesCache {
  private constructor() {}

  private static _instances = new Map<SidesConnectionTypesAsString, ConnectedSideShapesCachedByPathDirection>();

  static get(
    sidesConnectionTypesAsString: SidesConnectionTypesAsString,
    isCounterclockwise = false,
  ): Path2dCommand[] | undefined {
    const directionKey: PathDirection = isCounterclockwise ? PATH_DIRECTION_COUNTERCLOCKWISE : PATH_DIRECTION_CLOCKWISE;

    const cachedConnectedSideShapes = this._instances.get(sidesConnectionTypesAsString);

    return cachedConnectedSideShapes?.[directionKey];
  }

  static set(
    sidesConnectionTypesAsString: SidesConnectionTypesAsString,
    pathParts: Path2dCommand[],
    isCounterclockwise: boolean,
  ): void {
    const directionKey: PathDirection = isCounterclockwise ? PATH_DIRECTION_COUNTERCLOCKWISE : PATH_DIRECTION_CLOCKWISE;

    let value = this._instances.get(sidesConnectionTypesAsString);

    if (value === undefined) {
      value = {
        [directionKey]: pathParts,
      } as ConnectedSideShapesCachedByPathDirection;
    } else {
      value[directionKey] = pathParts;
    }

    this._instances.set(sidesConnectionTypesAsString, value);
  }

  static clear() {
    this._instances.clear();
  }
}

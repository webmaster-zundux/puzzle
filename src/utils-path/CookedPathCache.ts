import type { Path2dCommand } from "../models/path2d-commands/Path2dCommand";

export type CacheKey = string;

export class CookedPathCache {
  private constructor() {}

  private static _instances = new Map<CacheKey, Path2dCommand[]>();

  static getCookedConnectedSideShapesFromCache(cacheKey: CacheKey): Path2dCommand[] | undefined {
    return this._instances.get(cacheKey);
  }

  static setCookedConnectedSideShapesToCache(sidesConnectionTypesAsString: CacheKey, pathParts: Path2dCommand[]): void {
    this._instances.set(sidesConnectionTypesAsString, pathParts);
  }

  static clear() {
    this._instances.clear();
  }
}

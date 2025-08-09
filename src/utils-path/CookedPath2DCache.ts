type CacheKey = string;

export class CookedPath2DCache {
  private constructor() {}

  private static _instances = new Map<CacheKey, Path2D>();

  static getCookedConnectedSideShapesPath2dFromCache(cacheKey: CacheKey): Path2D | undefined {
    return this._instances.get(cacheKey);
  }

  static setCookedConnectedSideShapesPath2dToCache(cacheKey: CacheKey, path2d: Path2D): void {
    this._instances.set(cacheKey, path2d);
  }

  static clear() {
    this._instances.clear();
  }
}

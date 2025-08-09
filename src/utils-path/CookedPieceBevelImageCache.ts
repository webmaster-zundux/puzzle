import type { RenderingCanvas } from "../models/RenderingCanvas";

export type CacheIdForPieceBevelImage = string;

export class CookedPieceBevelImagesCache {
  private constructor() {}

  private static _instances = new Map<CacheIdForPieceBevelImage, RenderingCanvas>();

  static get(cacheKey: CacheIdForPieceBevelImage): RenderingCanvas | undefined {
    return this._instances.get(cacheKey);
  }

  static set(cacheKey: CacheIdForPieceBevelImage, value: RenderingCanvas): void {
    this._instances.set(cacheKey, value);
  }

  static clear() {
    this._instances.clear();
  }
}

import type { Path2dCommand } from "../models/path2d-commands/Path2dCommand";

export class CookedSideShapeAsPlugCache {
  private constructor() {}

  private static _instances = new Map<Path2dCommand[], Path2dCommand[]>();

  static get(sideShapeAsSocket: Path2dCommand[]): Path2dCommand[] | undefined {
    return this._instances.get(sideShapeAsSocket);
  }

  static set(sideShapeAsSocket: Path2dCommand[], sideShapeAsPlug: Path2dCommand[]): void {
    this._instances.set(sideShapeAsSocket, sideShapeAsPlug);
  }

  static clear() {
    this._instances.clear();
  }
}

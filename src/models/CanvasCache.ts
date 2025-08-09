export type CanvasInstance = HTMLCanvasElement;
export type CanvasInstanceContext = CanvasRenderingContext2D; // todo add support for | OffscreenRenderingContext;

export interface CanvasCacheParams {
  type?: string;

  width: number;
  height: number;

  alpha?: boolean;
  willReadFrequently?: boolean;
}

export class CanvasCache {
  private constructor() {}

  private static _instances = new Map<unknown, CanvasInstance>();

  static getCanvasAndContext(params: CanvasCacheParams): {
    canvas: CanvasInstance;
    context: CanvasInstanceContext;
  } {
    const canvasInstance = this._getCanvasOrCreateNewOne(params);

    const { alpha = false, willReadFrequently = false } = params;
    const canvasContext =
      canvasInstance.getContext("2d", {
        alpha,
        willReadFrequently,
      }) || undefined;

    if (!canvasContext) {
      throw new Error("Error. Impossible to get CanvasRenderingContext2D");
    }

    return {
      canvas: canvasInstance,
      context: canvasContext,
    };
  }

  private static _getCanvasOrCreateNewOne(params: CanvasCacheParams): CanvasInstance {
    const canvasInstance = this._instances.get(params);
    if (canvasInstance) {
      return canvasInstance;
    }

    const newCanvasInstance = this._createCanvasInstance(params);

    this._instances.set(params, newCanvasInstance);
    return newCanvasInstance;
  }

  private static _createCanvasInstance(params: CanvasCacheParams): CanvasInstance {
    const { width, height } = params;

    const canvas = document.createElement("canvas");

    if (!canvas) {
      throw new Error("Error. Impossible create HTMLCanvasElement");
    }

    canvas.width = width;
    canvas.height = height;

    return canvas;
  }

  static clear() {
    this._instances.clear();
  }
}

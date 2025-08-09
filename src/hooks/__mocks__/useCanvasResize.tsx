import type { RefObject } from "react";
import type * as originalModule from "../useCanvasResize";

export const useCanvasResize: typeof originalModule.useCanvasResize = (
  _canvasRef: RefObject<HTMLCanvasElement> | null,
  _renderFrame: () => void,
) => {
  return {
    canvasWidth: 1920,
    canvasHeight: 1080,
  };
};

import type { RefObject } from "react";
import { useCallback, useEffect, useState } from "react";

const CANVAS_DEFAULT_SIDE_SIZE = 15;

export const useCanvasResize = (
  canvasRef: RefObject<HTMLCanvasElement> | null,
  renderFrame: () => void,
): { canvasWidth: number; canvasHeight: number } => {
  const [canvasWidth, setCanvasWidth] = useState(CANVAS_DEFAULT_SIDE_SIZE);
  const [canvasHeight, setCanvasHeight] = useState(CANVAS_DEFAULT_SIDE_SIZE);

  const setCanvasSizes = useCallback(
    (newWidth: number = CANVAS_DEFAULT_SIDE_SIZE, newHeight: number = CANVAS_DEFAULT_SIDE_SIZE) => {
      setCanvasWidth(newWidth);
      setCanvasHeight(newHeight);
    },
    [setCanvasWidth, setCanvasHeight],
  );

  const handleSizeChange = useCallback(() => {
    const canvasElement = canvasRef?.current;
    if (!canvasElement) {
      return;
    }

    const newWidth = canvasElement.clientWidth;
    const newHeight = canvasElement.clientHeight;

    if (canvasElement.width === newWidth && canvasElement.height === newHeight) {
      return;
    }

    canvasElement.width = newWidth;
    canvasElement.height = newHeight;
    renderFrame();
    setCanvasSizes(newWidth, newHeight);
  }, [canvasRef, setCanvasSizes, renderFrame]);

  useEffect(() => {
    const canvasElement = canvasRef?.current;
    if (!canvasElement) {
      return;
    }

    const resizeObserver = new ResizeObserver(handleSizeChange);
    resizeObserver.observe(canvasElement);

    return () => {
      resizeObserver.unobserve(canvasElement);
      resizeObserver.disconnect();
    };
  }, [canvasRef, handleSizeChange]);

  useEffect(() => {
    document.addEventListener("load", handleSizeChange);

    return () => {
      document.removeEventListener("load", handleSizeChange);
    };
  }, [handleSizeChange]);

  return { canvasWidth, canvasHeight };
};

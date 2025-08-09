export const createCanvasContextWithoutImage = (
  width: number = 10,
  height: number = 10,
): { canvasElement: HTMLCanvasElement; context: CanvasRenderingContext2D } => {
  const canvasElement = document.createElement("canvas");
  canvasElement.width = width;
  canvasElement.height = height;
  const context = canvasElement.getContext("2d");

  if (!context) {
    throw new Error("Puzzle render error. Canvas 2d context does not exist");
  }

  return { canvasElement, context };
};

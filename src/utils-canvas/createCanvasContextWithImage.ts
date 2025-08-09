export const createCanvasContextWithImage = (
  image: HTMLImageElement,
): { canvasElement: HTMLCanvasElement; context: CanvasRenderingContext2D } => {
  const canvasElement = document.createElement("canvas");
  canvasElement.width = image.width;
  canvasElement.height = image.height;
  const context = canvasElement.getContext("2d");

  if (!context) {
    throw new Error("Puzzle render error. Canvas 2d context does not exist");
  }

  context.drawImage(image, 0, 0);

  return { canvasElement, context };
};

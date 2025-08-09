export const create2dContext = (width: number, height: number) => {
  if (!width || !height) {
    throw new Error("Error. Parameters width and height should be defined");
  }

  const canvas = document.createElement("canvas");
  if (!canvas) {
    throw new Error("Error. Impossible create HTMLCanvasElement");
  }

  if (width > 0) {
    canvas.width = width;
  }

  if (height > 0) {
    canvas.height = height;
  }

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Error. Imposible get 2d context of canvas");
  }

  return { canvas, context };
};

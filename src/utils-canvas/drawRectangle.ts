export const drawRectangle = (
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string = "gray",
  isStroked = true,
  lineWidth = 1,
  isDashed = false,
  dashPattern: number[] = [5, 5],
) => {
  if (!context) {
    return;
  }

  context.save();

  if (isDashed) {
    context.setLineDash(dashPattern);
  }

  if (isStroked) {
    context.lineWidth = lineWidth;
    context.strokeStyle = color;
    context.strokeRect(x, y, width, height);
  } else {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
  }

  context.restore();
};

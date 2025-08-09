export const drawCircle = (
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  color: string = "pink",
  radius: number = 15,
  isStroked = true,
  lineWidth = 1,
  isDashed = false,
  dashPattern: number[] = [5, 5],
) => {
  if (!context) {
    return;
  }

  context.save();

  context.beginPath();

  if (isDashed) {
    context.setLineDash(dashPattern);
  }

  context.arc(x, y, radius, 0, 2 * Math.PI);

  if (isStroked) {
    context.lineWidth = lineWidth;
    context.strokeStyle = color;
    context.stroke();
  } else {
    context.fillStyle = color;
    context.fill();
  }

  context.restore();
};

export const drawDashedLine = (
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  color: string = "gray",
  lineWidth = 1,
  dashLength = 1,
  gapLength = 1,
) => {
  if (!context) {
    return;
  }

  context.save();

  context.beginPath();
  context.setLineDash([dashLength, gapLength]);
  context.moveTo(sourceX, sourceY);
  context.lineTo(targetX, targetY);

  context.lineWidth = lineWidth;
  context.strokeStyle = color;
  context.stroke();

  context.restore();
};

import type { Path2dCommand } from "../models/path2d-commands/Path2dCommand";

export const scaleMaskPathOfPiece = (
  path: Path2dCommand[],
  pieceWidth: number = 0,
  pieceHeight: number = 0,
): Path2dCommand[] => {
  const sideWidth = 1.0;

  const scaleX = pieceWidth / sideWidth;
  const scaleY = pieceHeight / sideWidth;

  const updatedPath = path.map((pathPart) => pathPart.scale(scaleX, scaleY));

  return updatedPath;
};

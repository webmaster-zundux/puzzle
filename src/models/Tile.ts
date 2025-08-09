import type { Point } from "./Point";
import type { Size } from "./Size";

export class Tile {
  private piecesIds: string[] = [];

  constructor(
    public id: string,
    public position: Point,
    public size: Size,
    piecesIds: string[] = [],
  ) {
    this.piecesIds = piecesIds;
  }

  addPieceId(pieceId: string) {
    this.piecesIds.push(pieceId);
  }

  getPiecesIds() {
    return this.piecesIds;
  }
}

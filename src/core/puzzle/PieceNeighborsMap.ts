import type { Id } from "./BaseEntity";
import type { Piece } from "./Piece";

export type NeighborMapId = Id;
export type NeighborMapValue<TPiece extends Piece = Piece> = {
  i: number;
  j: number;
  piece: TPiece;
};

export const generateNeighborMapId = (i: number, j: number): NeighborMapId => {
  return `neighbor_${i}:${j}`;
};

export class PieceNeighborsMap<TPiece extends Piece = Piece> extends Map<NeighborMapId, NeighborMapValue<TPiece>> {}

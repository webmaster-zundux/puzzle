export type PuzzleSize = [number, number];
export const AVAILABLE_SIZES_OF_PUZZLE_IN_PIECES_PER_SIDES: PuzzleSize[] = [
  [2, 1],
  [3, 1],
  [3, 2],
  [4, 3],
  [6, 4],
  [6, 5],
  [8, 6],
  [10, 8],
  [12, 10],
  [17, 15],
  [25, 20],
  [25, 40],
];

export const DEFAULT_SIZE_OF_PUZZLE_IN_PIECES_PER_SIDES = AVAILABLE_SIZES_OF_PUZZLE_IN_PIECES_PER_SIDES[5];

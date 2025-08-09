export const PIECE_SIDE_NAME_TOP = "top" as const;
export const PIECE_SIDE_NAME_RIGHT = "right" as const;
export const PIECE_SIDE_NAME_BOTTOM = "bottom" as const;
export const PIECE_SIDE_NAME_LEFT = "left" as const;

export const PIECE_SIDE_NAMES = {
  [PIECE_SIDE_NAME_TOP]: PIECE_SIDE_NAME_TOP,
  [PIECE_SIDE_NAME_RIGHT]: PIECE_SIDE_NAME_RIGHT,
  [PIECE_SIDE_NAME_BOTTOM]: PIECE_SIDE_NAME_BOTTOM,
  [PIECE_SIDE_NAME_LEFT]: PIECE_SIDE_NAME_LEFT,
} as const;

export const PIECE_SIDE_NAMES_FROM_OPPOSITE_SIDE = {
  [PIECE_SIDE_NAME_TOP]: PIECE_SIDE_NAME_BOTTOM,
  [PIECE_SIDE_NAME_RIGHT]: PIECE_SIDE_NAME_LEFT,
  [PIECE_SIDE_NAME_BOTTOM]: PIECE_SIDE_NAME_TOP,
  [PIECE_SIDE_NAME_LEFT]: PIECE_SIDE_NAME_RIGHT,
} as const;

export type CustomPieceSideName = string;

export type PieceSideName =
  | typeof PIECE_SIDE_NAME_TOP
  | typeof PIECE_SIDE_NAME_RIGHT
  | typeof PIECE_SIDE_NAME_BOTTOM
  | typeof PIECE_SIDE_NAME_LEFT;

export const getOppositeSideName = (pieceSideName: PieceSideName): PieceSideName => {
  const oppositeSideName = PIECE_SIDE_NAMES_FROM_OPPOSITE_SIDE[pieceSideName];

  if (!oppositeSideName) {
    throw new Error(`Error. Opposite pieceSideName does not defined for ${pieceSideName}`);
  }

  return oppositeSideName;
};

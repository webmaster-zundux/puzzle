import { DEFAULT_MINIMAL_PIECE_SIDE_SIZE_IN_PX } from "../components/PuzzleCreationForm";

export const isAreaEqualOrGreaterThanMinimalAreaSize = (tl: { x: number; y: number }, br: { x: number; y: number }) => {
  const width = br.x - tl.x;
  if (width < DEFAULT_MINIMAL_PIECE_SIDE_SIZE_IN_PX) {
    return false;
  }

  const height = br.y - tl.y;
  if (height < DEFAULT_MINIMAL_PIECE_SIDE_SIZE_IN_PX) {
    return false;
  }

  return true;
};

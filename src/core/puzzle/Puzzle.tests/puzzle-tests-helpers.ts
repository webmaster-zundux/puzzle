import type { Id } from "../BaseEntity";
import { Piece } from "../Piece";
import { Point } from "../Point";
import { PositionDelta } from "../PositionDelta";
import { Puzzle } from "../Puzzle";

export const getGroupIdFromPiecesInIt = (pieceIds: Id[]): string => {
  return ["group_", "(", pieceIds[0], "__", pieceIds[1], ")"].join("");
};

export const movePieceFromPointToPointForPuzzle = (puzzle: Puzzle, from: Point, to: Point) => {
  const piece = puzzle.findPieceByPointingInsidePieceBoundaries(from);
  if (!piece) {
    throw new Error("Error. Piece not found");
  }

  puzzle.selectActivePiece(piece);

  const positionDelta: PositionDelta = new PositionDelta(to.x - from.x, to.y - from.y);

  puzzle.moveActivePiece(positionDelta);
  puzzle.unselectActivePiece();
};

const initialPuzzle2x3Params = {
  pieceSideSize: 50,
  connectionActivationAreaSideSizeFractionFromPieceSideSize: 0.1,
};
export const initPuzzle2x3WithScatteredPieces = ({
  pieceSideSize,
  connectionActivationAreaSideSizeFractionFromPieceSideSize,
} = initialPuzzle2x3Params) => {
  const getCustomInitialPositionExpandedBy2 = (point: Point) => {
    const x = point.x * 2;
    const y = point.y * 2;

    return new Point(x, y);
  };

  const puzzle = new Puzzle<Piece>({
    id: "puzzle-2x3-with-scattered-pieces",
    numberOfPiecesPerWidth: 2,
    numberOfPiecesPerHeight: 3,
    pieceSideSize,
    connectionActivationAreaSideSizeFractionFromPieceSideSize,
    pieceClass: Piece,
    getCustomInitialPiecePosition: getCustomInitialPositionExpandedBy2,
  });

  return puzzle;
};

const initialPuzzle6x5Params = {
  pieceSideSize: 50,
  connectionActivationAreaSideSizeFractionFromPieceSideSize: 0.1,
};
export const initPuzzle6x5WithScatteredPieces = ({
  pieceSideSize,
  connectionActivationAreaSideSizeFractionFromPieceSideSize,
} = initialPuzzle6x5Params) => {
  const getCustomInitialPositionExpandedBy2 = (point: Point) => {
    const x = point.x * 2;
    const y = point.y * 2;

    return new Point(x, y);
  };

  const puzzle = new Puzzle<Piece>({
    id: "puzzle-6x5-with-scattered-pieces",
    numberOfPiecesPerWidth: 6,
    numberOfPiecesPerHeight: 5,
    pieceSideSize,
    connectionActivationAreaSideSizeFractionFromPieceSideSize,
    pieceClass: Piece,
    getCustomInitialPiecePosition: getCustomInitialPositionExpandedBy2,
  });

  return puzzle;
};

export const getMovements = (
  puzzle: Puzzle,
  startedLocation: Point = new Point(0, 0),
  stepSize = 50,
): {
  up: () => void;
  right: () => void;
  down: () => void;
  left: () => void;
} => {
  const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

  let latestPoint = startedLocation;

  const right = () => {
    const from = latestPoint;
    const to = new Point(latestPoint.x + stepSize, latestPoint.y);
    movePieceFromTo(from, to);
    latestPoint = to;
  };

  const down = () => {
    const from = latestPoint;
    const to = new Point(latestPoint.x, latestPoint.y + stepSize);
    movePieceFromTo(from, to);
    latestPoint = to;
  };

  const left = () => {
    const from = latestPoint;
    const to = new Point(latestPoint.x - stepSize, latestPoint.y);
    movePieceFromTo(from, to);
    latestPoint = to;
  };

  const up = () => {
    const from = latestPoint;
    const to = new Point(latestPoint.x, latestPoint.y - stepSize);
    movePieceFromTo(from, to);
    latestPoint = to;
  };

  return { up, right, down, left };
};

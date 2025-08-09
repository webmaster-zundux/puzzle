import { Piece } from "../Piece";
import { Point } from "../Point";
import { Puzzle } from "../Puzzle";

it("create a puzzle with 2 pieces (50px on 50px) and connection activation", () => {
  const getCustomInitialPosition = (point: Point) => {
    const x = point.x;
    const y = point.y;

    return new Point(x, y);
  };
  const puzzle = new Puzzle<Piece>({
    id: "test-puzzle:2x1__piece-side-size:50__connection-activation-area-as-fraction-from-side-size:0.1",
    numberOfPiecesPerWidth: 2,
    numberOfPiecesPerHeight: 1,
    pieceSideSize: 50,
    connectionActivationAreaSideSizeFractionFromPieceSideSize: 0.1,
    pieceClass: Piece,
    getCustomInitialPiecePosition: getCustomInitialPosition,
  });

  expect(puzzle.activePiece).not.toBeDefined();

  expect(puzzle.pieces.length).toBe(2);

  expect(puzzle.pieces.itemIdOnTop).toBe("piece_50:0");
  expect(puzzle.pieces.itemIdAtBottom).toBe("piece_0:0");

  const expectingPieceIdsInRootPile = ["piece_0:0", "piece_50:0"];
  expect(puzzle.pieces.itemIdsInOrder).toIncludeAllMembers(expectingPieceIdsInRootPile);

  {
    const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(0, 0))!;
    expect(piece).toBeDefined();

    expect(piece.position.x).toBe(0);
    expect(piece.position.y).toBe(0);

    expect(piece.width).toBe(50);
    expect(piece.height).toBe(50);

    const boundaryPoints = piece.getBoundaryCornerPoints();
    expect(boundaryPoints.p0).toMatchObject({ x: 0, y: 0 });
    expect(boundaryPoints.p2).toMatchObject({ x: 49, y: 49 });

    expect(piece.parentPieceId).toBe(undefined);
  }

  {
    const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(50, 0))!;
    expect(piece).toBeDefined();

    expect(piece.position.x).toBe(50);
    expect(piece.position.y).toBe(0);

    expect(piece.width).toBe(50);
    expect(piece.height).toBe(50);

    const boundaryPoints = piece.getBoundaryCornerPoints();
    expect(boundaryPoints.p0).toMatchObject({ x: 50, y: 0 });
    expect(boundaryPoints.p2).toMatchObject({ x: 99, y: 49 });

    expect(piece.parentPieceId).toBe(undefined);
  }
});

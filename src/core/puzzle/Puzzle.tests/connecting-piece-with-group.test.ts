import { Point } from "../Point";
import { PositionDelta } from "../PositionDelta";
import { initPuzzle6x5WithScatteredPieces, movePieceFromPointToPointForPuzzle } from "./puzzle-tests-helpers";

describe("by one side at once", () => {
  it("connection piece by 4 sides: top, right, bottom, left at once", () => {
    const puzzle = initPuzzle6x5WithScatteredPieces();

    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    movePieceFromTo(new Point(100, 100), new Point(100, -200));

    movePieceFromTo(new Point(100, 0), new Point(100, 50));
    movePieceFromTo(new Point(200, 100), new Point(150, 100));
    movePieceFromTo(new Point(100, 200), new Point(100, 150));
    movePieceFromTo(new Point(0, 100), new Point(50, 100));

    movePieceFromTo(new Point(100, -200), new Point(100, 100));

    const expectedTotalNumberOfPieces = 30;
    const expectedNumberOfPiecesInNewGroup = 5;
    const expectedNumberOfNewGroup = 1;
    expect(puzzle.pieces.length).toBe(
      expectedTotalNumberOfPieces - expectedNumberOfPiecesInNewGroup + expectedNumberOfNewGroup,
    );

    const movedPiece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(100, 100))!;
    expect(movedPiece).toBeDefined();
    expect(movedPiece.id).not.toBe(puzzle.pieces.itemIdOnTop);
    expect(movedPiece.parentPieceId).toBe(puzzle.pieces.itemIdAtBottom);

    const expectedGroupPosition = { x: 50, y: 50 };
    const expectedGroupSize = { width: 150, height: 150 };
    const group = puzzle.pieces.getItemById(movedPiece.parentPieceId!)!;
    expect(group.position).toMatchObject(expectedGroupPosition);
    expect(group).toMatchObject(expectedGroupSize);
    expect(group.hasNestedPile()).toBe(true);
    expect(group.nestedPile!.length).toBe(expectedNumberOfPiecesInNewGroup);

    const expectingPieceIdsInGroup = ["piece_100:100", "piece_0:100", "piece_200:100", "piece_100:200", "piece_0:100"];
    expect(group.nestedPile!.itemIdsInOrder).toIncludeAllMembers(expectingPieceIdsInGroup);

    const piecesIdsInGroup = expectingPieceIdsInGroup.slice(0, 2);
    const expectedPiecesIdsInRootPile = [`group_(${piecesIdsInGroup.join("__")})`];
    expect(puzzle.pieces.itemIdsInOrder).toIncludeAllMembers(expectedPiecesIdsInRootPile);

    const notExpectedPiecesIdsInRootPile = expectingPieceIdsInGroup;
    expect(puzzle.pieces.itemIdsInOrder).not.toIncludeAnyMembers(notExpectedPiecesIdsInRootPile);
  });
});

describe.each([
  { caseName: "on the edge of connection activation area", marginFromEdge: 0 },
  {
    caseName: "somewhere in the middle of connection activation area",
    marginFromEdge: 0.5,
  },
  {
    caseName: "in the center of connection activation area",
    marginFromEdge: 1,
  },
])("with attracting not connected neighbor piece", ({ caseName, marginFromEdge }) => {
  it(caseName, () => {
    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    const pieceSideSize = 50;
    const connectionActivationAreaSideSizeFractionFromPieceSideSize = 0.2;
    const puzzle = initPuzzle6x5WithScatteredPieces({
      pieceSideSize,
      connectionActivationAreaSideSizeFractionFromPieceSideSize,
    });

    movePieceFromTo(new Point(100, 100), new Point(150, 100));

    movePieceFromTo(new Point(150, 100), new Point(100, 100));

    const targetPiece = puzzle.findPieceByPointingInsidePieceBoundaries(Point.create({ x: 100, y: 100 }))!;
    const attactedPiece = puzzle.findPieceByPointingInsidePieceBoundaries(Point.create({ x: 0, y: 100 }))!;

    puzzle.selectActivePiece(targetPiece);

    const connectionActivationAreaSideSide = pieceSideSize * connectionActivationAreaSideSizeFractionFromPieceSideSize;
    const halfOfConnectionActivationAreaSideSide = connectionActivationAreaSideSide / 2;
    const deltaInsideConnectionActivationArea = (1 - marginFromEdge) * halfOfConnectionActivationAreaSideSide;
    const dx = -(pieceSideSize - deltaInsideConnectionActivationArea);
    puzzle.moveActivePiece(PositionDelta.create({ dx, dy: 0 }));
    puzzle.unselectActivePiece();

    const expectedTotalNumberOfPieces = 30;
    const expectedNumberOfPiecesInNewGroup = 3;
    const expectedNumberOfNewGroup = 1;
    expect(puzzle.pieces.length).toBe(
      expectedTotalNumberOfPieces - expectedNumberOfPiecesInNewGroup + expectedNumberOfNewGroup,
    );

    const pieceGroup = puzzle.findPieceOrGroupOfPiecesByPointingInsidePieceBoundaries(
      Point.create({ x: deltaInsideConnectionActivationArea, y: 100 }),
    )!;

    expect(pieceGroup.position).toMatchObject({
      x: deltaInsideConnectionActivationArea,
      y: 100,
    });
    expect(targetPiece.position).toMatchObject({ x: pieceSideSize, y: 0 });
    expect(attactedPiece.position).toMatchObject({ x: 0, y: 0 });
  });
});

describe("by multiple sides at once", () => {
  describe("connect a piece with a group of pieces when the group that has a suitable piece inside connection activation area of the piece by one side", () => {
    it("connect a piece with a group of pieces (donut shape) when the group has a suitable pieces inside connection activation areas by each of 4 sides of the piece", () => {
      const puzzle = initPuzzle6x5WithScatteredPieces();

      const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

      movePieceFromTo(new Point(100, 100), new Point(-100, -100));

      movePieceFromTo(new Point(0, 0), new Point(50, 50));
      movePieceFromTo(new Point(100, 0), new Point(100, 50));
      movePieceFromTo(new Point(200, 0), new Point(150, 50));

      movePieceFromTo(new Point(200, 100), new Point(150, 100));

      movePieceFromTo(new Point(200, 200), new Point(150, 150));
      movePieceFromTo(new Point(100, 200), new Point(100, 150));
      movePieceFromTo(new Point(0, 200), new Point(50, 150));

      movePieceFromTo(new Point(0, 100), new Point(50, 100));

      movePieceFromTo(new Point(-100, -100), new Point(100, 100));

      const expectedTotalNumberOfPieces = 30;
      const expectedNumberOfPiecesInNewGroup = 9;
      const expectedNumberOfNewGroup = 1;
      expect(puzzle.pieces.length).toBe(
        expectedTotalNumberOfPieces - expectedNumberOfPiecesInNewGroup + expectedNumberOfNewGroup,
      );

      const pieceAt100x100 = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(100, 100))!;
      expect(pieceAt100x100).toBeDefined();
      expect(pieceAt100x100.id).not.toBe(puzzle.pieces.itemIdOnTop);
      expect(pieceAt100x100.parentPieceId).toBe(puzzle.pieces.itemIdAtBottom);

      const group = puzzle.pieces.getItemById(pieceAt100x100.parentPieceId!)!;
      expect(group.nestedPile).toBeDefined();
      expect(group.nestedPile!.length).toBe(expectedNumberOfPiecesInNewGroup);

      const expectingPieceIdsInGroup = [
        "piece_100:0",
        "piece_0:0",
        "piece_200:0",

        "piece_200:100",

        "piece_200:200",
        "piece_100:200",
        "piece_0:200",

        "piece_0:100",

        "piece_100:100",
      ];
      expect(group.nestedPile!.itemIdsInOrder).toIncludeAllMembers(expectingPieceIdsInGroup);

      const piecesIdsInGroup = expectingPieceIdsInGroup.slice(0, 2);
      const expectedPiecesIdsInRootPile = [`group_(${piecesIdsInGroup.join("__")})`];
      expect(puzzle.pieces.itemIdsInOrder).toIncludeAllMembers(expectedPiecesIdsInRootPile);

      const notExpectedPiecesIdsInRootPile = expectingPieceIdsInGroup;
      expect(puzzle.pieces.itemIdsInOrder).not.toIncludeAnyMembers(notExpectedPiecesIdsInRootPile);
    });
  });

  it("don't connect a piece with a group of pieces when suitable pieces of a group are outside connection activation areas of the piece", () => {
    const puzzle = initPuzzle6x5WithScatteredPieces();

    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    movePieceFromTo(new Point(100, 100), new Point(-100, -100));

    movePieceFromTo(new Point(100, 0), new Point(50, 0));

    movePieceFromTo(new Point(-100, -100), new Point(100, 100));

    const expectedTotalNumberOfPieces = 30;
    const expectedNumberOfPiecesInNewGroup = 2;
    const expectedNumberOfNewGroup = 1;
    expect(puzzle.pieces.length).toBe(
      expectedTotalNumberOfPieces - expectedNumberOfPiecesInNewGroup + expectedNumberOfNewGroup,
    );

    const pieceAt100x100 = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(100, 100))!;
    expect(pieceAt100x100).toBeDefined();
    expect(pieceAt100x100.id).toBe(puzzle.pieces.itemIdOnTop);
    expect(pieceAt100x100.parentPieceId).toBe(undefined);

    const expectedPiecesIdsInRootPile = ["piece_100:100"];
    expect(puzzle.pieces.itemIdsInOrder).toIncludeAllMembers(expectedPiecesIdsInRootPile);
  });
});

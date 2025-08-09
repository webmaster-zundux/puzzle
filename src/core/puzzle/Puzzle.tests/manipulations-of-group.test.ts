import { Point } from "../Point";
import { PositionDelta } from "../PositionDelta";
import { initPuzzle6x5WithScatteredPieces, movePieceFromPointToPointForPuzzle } from "./puzzle-tests-helpers";

describe("moving a group of pieces", () => {
  it("move a group of pieces by moving a one of pieces in group as selected piece", () => {
    const puzzle = initPuzzle6x5WithScatteredPieces();

    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    movePieceFromTo(new Point(100, 0), new Point(50, 0));
    movePieceFromTo(new Point(200, 0), new Point(100, 0));
    movePieceFromTo(new Point(300, 0), new Point(150, 0));

    const expectedTotalNumberOfPieces = 30;
    const expectedNumberOfPiecesInNewGroup = 4;
    const expectedNumberOfGroups = 1;
    expect(puzzle.pieces.length).toBe(
      expectedTotalNumberOfPieces - expectedNumberOfPiecesInNewGroup + expectedNumberOfGroups,
    );

    const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(0, 0))!;
    expect(piece).toBeDefined();

    puzzle.selectActivePiece(piece);

    expect(puzzle.activePiece).toBeDefined();
    expect(puzzle.activePiece!.id).toBe(piece.id);
    expect(puzzle.activePiece).toBe(piece);

    const positionDelta = new PositionDelta(-200, -200);
    puzzle.moveActivePiece(positionDelta);

    expect(puzzle.pieces.length).toBe(
      expectedTotalNumberOfPieces - expectedNumberOfPiecesInNewGroup + expectedNumberOfGroups,
    );

    expect(puzzle.activePiece).toBeDefined();
    expect(puzzle.activePiece!.id).toBe(piece.id);
    expect(puzzle.activePiece).toBe(piece);

    expect(puzzle.activePiece!.position.x).toBe(0);
    expect(puzzle.activePiece!.position.y).toBe(0);
    expect(puzzle.activePiece!.getWorldPosition().x).toBe(-200);
    expect(puzzle.activePiece!.getWorldPosition().y).toBe(-200);

    expect(piece.id).not.toBe(puzzle.pieces.itemIdOnTop);
    expect(piece.parentPieceId).toBe(puzzle.pieces.itemIdOnTop);

    const expectedGroupSize = { width: 200, height: 50 };
    const expectedGroupPosition = { x: -200, y: -200 };
    const expectingPieceIdsInGroup = ["piece_100:0", "piece_0:0", "piece_200:0", "piece_300:0"];
    const group = puzzle.pieces.getItemById(piece.parentPieceId!)!;

    expect(group.position).toMatchObject(expectedGroupPosition);
    expect(group).toMatchObject(expectedGroupSize);
    expect(group.hasNestedPile()).toBe(true);
    expect(group.nestedPile!.length).toBe(expectedNumberOfPiecesInNewGroup);
    expect(group.nestedPile!.itemIdsInOrder).toIncludeAllMembers(expectingPieceIdsInGroup);

    const piecesIdsInGroup = expectingPieceIdsInGroup.slice(0, 2);
    const expectedPiecesIdsInRootPile = [`group_(${piecesIdsInGroup.join("__")})`];
    expect(puzzle.pieces.itemIdsInOrder).toIncludeAllMembers(expectedPiecesIdsInRootPile);

    const notExpectedPiecesIdsInRootPile = expectingPieceIdsInGroup;
    expect(puzzle.pieces.itemIdsInOrder).not.toIncludeAnyMembers(notExpectedPiecesIdsInRootPile);
  });
});

describe("recompute sizes of a group of pieces and positions of nested pieces", () => {
  describe("group of 2 pieces", () => {
    it("as horizontal line (from left to right) ->", () => {
      const puzzle = initPuzzle6x5WithScatteredPieces();

      const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

      movePieceFromTo(new Point(0, 0), new Point(0, -200));
      movePieceFromTo(new Point(100, 0), new Point(50, -200));

      const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(0, -200))!;
      expect(piece).toBeDefined();

      const group = puzzle.pieces.getItemById(piece.parentPieceId!)!;
      expect(group).toBeDefined();

      const expectedGroupPosition = { x: 0, y: -200 };
      const expectedGroupSize = { width: 100, height: 50 };
      expect(group.position).toMatchObject(expectedGroupPosition);
      expect(group).toMatchObject(expectedGroupSize);

      const expectedNumberOfPiecesInNewGroup = 2;
      expect(group.hasNestedPile()).toBe(true);
      expect(group.nestedPile!.length).toBe(expectedNumberOfPiecesInNewGroup);

      const pieceIdsInOrder = group.nestedPile!.itemIdsInOrder;
      expect(pieceIdsInOrder.length).toBe(expectedNumberOfPiecesInNewGroup);

      const groupPile = group.nestedPile;
      const pieceOne = groupPile!.getItemById(pieceIdsInOrder[0]);
      const pieceTwo = groupPile!.getItemById(pieceIdsInOrder[1]);

      const expectedPiecesInNestedPilePositions = [
        { x: 50, y: 0 },
        { x: 0, y: 0 },
      ];
      expect(pieceOne!.position).toMatchObject(expectedPiecesInNestedPilePositions[0]);
      expect(pieceTwo!.position).toMatchObject(expectedPiecesInNestedPilePositions[1]);
    });

    it("as horizontal line (from right to left) <-", () => {
      const puzzle = initPuzzle6x5WithScatteredPieces();

      const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

      movePieceFromTo(new Point(100, 0), new Point(50, -200));
      movePieceFromTo(new Point(0, 0), new Point(0, -200));

      const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(0, -200))!;
      expect(piece).toBeDefined();

      const group = puzzle.pieces.getItemById(piece.parentPieceId!)!;
      expect(group).toBeDefined();

      const expectedGroupPosition = { x: 0, y: -200 };
      const expectedGroupSize = { width: 100, height: 50 };
      expect(group.position).toMatchObject(expectedGroupPosition);
      expect(group).toMatchObject(expectedGroupSize);

      const expectedNumberOfPiecesInNewGroup = 2;
      expect(group.hasNestedPile()).toBe(true);
      expect(group.nestedPile!.length).toBe(expectedNumberOfPiecesInNewGroup);

      const pieceIdsInOrder = group.nestedPile!.itemIdsInOrder;
      expect(pieceIdsInOrder.length).toBe(expectedNumberOfPiecesInNewGroup);

      const groupPile = group.nestedPile;
      const pieceOne = groupPile!.getItemById(pieceIdsInOrder[0]);
      const pieceTwo = groupPile!.getItemById(pieceIdsInOrder[1]);

      const expectedPiecesInNestedPilePositions = [
        { x: 0, y: 0 },
        { x: 50, y: 0 },
      ];
      expect(pieceOne!.position).toMatchObject(expectedPiecesInNestedPilePositions[0]);
      expect(pieceTwo!.position).toMatchObject(expectedPiecesInNestedPilePositions[1]);
    });

    it("as vertical line (from top to bottom) v", () => {
      const puzzle = initPuzzle6x5WithScatteredPieces();

      const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

      movePieceFromTo(new Point(0, 0), new Point(0, -200));
      movePieceFromTo(new Point(0, 100), new Point(0, -150));

      const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(0, -200))!;
      expect(piece).toBeDefined();

      const group = puzzle.pieces.getItemById(piece.parentPieceId!)!;
      expect(group).toBeDefined();

      const expectedGroupPosition = { x: 0, y: -200 };
      const expectedGroupSize = { width: 50, height: 100 };
      expect(group.position).toMatchObject(expectedGroupPosition);
      expect(group).toMatchObject(expectedGroupSize);

      const expectedNumberOfPiecesInNewGroup = 2;
      expect(group.hasNestedPile()).toBe(true);
      expect(group.nestedPile!.length).toBe(expectedNumberOfPiecesInNewGroup);

      const pieceIdsInOrder = group.nestedPile!.itemIdsInOrder;
      expect(pieceIdsInOrder.length).toBe(expectedNumberOfPiecesInNewGroup);

      const groupPile = group.nestedPile;
      const pieceOne = groupPile!.getItemById(pieceIdsInOrder[0]);
      const pieceTwo = groupPile!.getItemById(pieceIdsInOrder[1]);

      const expectedPiecesInNestedPilePositions = [
        { x: 0, y: 50 },
        { x: 0, y: 0 },
      ];
      expect(pieceOne!.position).toMatchObject(expectedPiecesInNestedPilePositions[0]);
      expect(pieceTwo!.position).toMatchObject(expectedPiecesInNestedPilePositions[1]);
    });

    it("as vertical line (from bottom to top) ^", () => {
      const puzzle = initPuzzle6x5WithScatteredPieces();

      const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

      movePieceFromTo(new Point(0, 100), new Point(0, -150));
      movePieceFromTo(new Point(0, 0), new Point(0, -200));

      const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(0, -200))!;
      expect(piece).toBeDefined();

      const group = puzzle.pieces.getItemById(piece.parentPieceId!)!;
      expect(group).toBeDefined();

      const expectedGroupPosition = { x: 0, y: -200 };
      const expectedGroupSize = { width: 50, height: 100 };
      expect(group.position).toMatchObject(expectedGroupPosition);
      expect(group).toMatchObject(expectedGroupSize);

      const expectedNumberOfPiecesInNewGroup = 2;
      expect(group.hasNestedPile()).toBe(true);
      expect(group.nestedPile!.length).toBe(expectedNumberOfPiecesInNewGroup);

      const pieceIdsInOrder = group.nestedPile!.itemIdsInOrder;
      expect(pieceIdsInOrder.length).toBe(expectedNumberOfPiecesInNewGroup);

      const groupPile = group.nestedPile;
      const pieceOne = groupPile!.getItemById(pieceIdsInOrder[0]);
      const pieceTwo = groupPile!.getItemById(pieceIdsInOrder[1]);

      const expectedPiecesInNestedPilePositions = [
        { x: 0, y: 0 },
        { x: 0, y: 50 },
      ];
      expect(pieceOne!.position).toMatchObject(expectedPiecesInNestedPilePositions[0]);
      expect(pieceTwo!.position).toMatchObject(expectedPiecesInNestedPilePositions[1]);
    });
  });

  describe("group of 3 pieces", () => {
    it("as horizontal line (from left to right) ->", () => {
      const puzzle = initPuzzle6x5WithScatteredPieces();

      const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

      movePieceFromTo(new Point(0, 0), new Point(0, -200));
      movePieceFromTo(new Point(100, 0), new Point(50, -200));
      movePieceFromTo(new Point(200, 0), new Point(100, -200));

      const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(0, -200))!;
      expect(piece).toBeDefined();

      const group = puzzle.pieces.getItemById(piece.parentPieceId!)!;
      expect(group).toBeDefined();

      const expectedGroupPosition = { x: 0, y: -200 };
      const expectedGroupSize = { width: 150, height: 50 };
      expect(group.position).toMatchObject(expectedGroupPosition);
      expect(group).toMatchObject(expectedGroupSize);

      const expectedNumberOfPiecesInNewGroup = 3;
      expect(group.hasNestedPile()).toBe(true);
      expect(group.nestedPile!.length).toBe(expectedNumberOfPiecesInNewGroup);

      const pieceIdsInOrder = group.nestedPile!.itemIdsInOrder;
      expect(pieceIdsInOrder.length).toBe(expectedNumberOfPiecesInNewGroup);

      const groupPile = group.nestedPile;
      const piece1 = groupPile!.getItemById(pieceIdsInOrder[0]);
      const piece2 = groupPile!.getItemById(pieceIdsInOrder[1]);
      const piece3 = groupPile!.getItemById(pieceIdsInOrder[2]);

      const expectedPiecesInNestedPilePositions = [
        { x: 50, y: 0 },
        { x: 0, y: 0 },
        { x: 100, y: 0 },
      ];
      expect(piece1!.position).toMatchObject(expectedPiecesInNestedPilePositions[0]);
      expect(piece2!.position).toMatchObject(expectedPiecesInNestedPilePositions[1]);
      expect(piece3!.position).toMatchObject(expectedPiecesInNestedPilePositions[2]);
    });

    it("as horizontal line (from right to left) <-", () => {
      const puzzle = initPuzzle6x5WithScatteredPieces();

      const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

      movePieceFromTo(new Point(200, 0), new Point(100, -200));
      movePieceFromTo(new Point(100, 0), new Point(50, -200));
      movePieceFromTo(new Point(0, 0), new Point(0, -200));

      const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(0, -200))!;
      expect(piece).toBeDefined();

      const group = puzzle.pieces.getItemById(piece.parentPieceId!)!;
      expect(group).toBeDefined();

      const expectedGroupPosition = { x: 0, y: -200 };
      const expectedGroupSize = { width: 150, height: 50 };
      expect(group.position).toMatchObject(expectedGroupPosition);
      expect(group).toMatchObject(expectedGroupSize);

      const expectedNumberOfPiecesInNewGroup = 3;
      expect(group.hasNestedPile()).toBe(true);
      expect(group.nestedPile!.length).toBe(expectedNumberOfPiecesInNewGroup);

      const pieceIdsInOrder = group.nestedPile!.itemIdsInOrder;
      expect(pieceIdsInOrder.length).toBe(expectedNumberOfPiecesInNewGroup);

      const groupPile = group.nestedPile;
      const piece1 = groupPile!.getItemById(pieceIdsInOrder[0]);
      const piece2 = groupPile!.getItemById(pieceIdsInOrder[1]);
      const piece3 = groupPile!.getItemById(pieceIdsInOrder[2]);

      const expectedPiecesInNestedPilePositions = [
        { x: 50, y: 0 },
        { x: 100, y: 0 },
        { x: 0, y: 0 },
      ];
      expect(piece1!.position).toMatchObject(expectedPiecesInNestedPilePositions[0]);
      expect(piece2!.position).toMatchObject(expectedPiecesInNestedPilePositions[1]);
      expect(piece3!.position).toMatchObject(expectedPiecesInNestedPilePositions[2]);
    });

    it("as vertical line (from top to bottom) v", () => {
      const puzzle = initPuzzle6x5WithScatteredPieces();

      const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

      movePieceFromTo(new Point(0, 0), new Point(0, -200));
      movePieceFromTo(new Point(0, 100), new Point(0, -150));
      movePieceFromTo(new Point(0, 200), new Point(0, -100));

      const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(0, -200))!;
      expect(piece).toBeDefined();

      const group = puzzle.pieces.getItemById(piece.parentPieceId!)!;
      expect(group).toBeDefined();

      const expectedGroupPosition = { x: 0, y: -200 };
      const expectedGroupSize = { width: 50, height: 150 };
      expect(group.position).toMatchObject(expectedGroupPosition);
      expect(group).toMatchObject(expectedGroupSize);

      const expectedNumberOfPiecesInNewGroup = 3;
      expect(group.hasNestedPile()).toBe(true);
      expect(group.nestedPile!.length).toBe(expectedNumberOfPiecesInNewGroup);

      const pieceIdsInOrder = group.nestedPile!.itemIdsInOrder;
      expect(pieceIdsInOrder.length).toBe(expectedNumberOfPiecesInNewGroup);

      const groupPile = group.nestedPile;
      const piece1 = groupPile!.getItemById(pieceIdsInOrder[0]);
      const piece2 = groupPile!.getItemById(pieceIdsInOrder[1]);
      const piece3 = groupPile!.getItemById(pieceIdsInOrder[2]);

      const expectedPiecesInNestedPilePositions = [
        { x: 0, y: 50 },
        { x: 0, y: 0 },
        { x: 0, y: 100 },
      ];
      expect(piece1!.position).toMatchObject(expectedPiecesInNestedPilePositions[0]);
      expect(piece2!.position).toMatchObject(expectedPiecesInNestedPilePositions[1]);
      expect(piece3!.position).toMatchObject(expectedPiecesInNestedPilePositions[2]);
    });

    it("as vertical line (from bottom to top) ^", () => {
      const puzzle = initPuzzle6x5WithScatteredPieces();

      const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

      movePieceFromTo(new Point(0, 200), new Point(0, -100));
      movePieceFromTo(new Point(0, 100), new Point(0, -150));
      movePieceFromTo(new Point(0, 0), new Point(0, -200));

      const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(0, -200))!;
      expect(piece).toBeDefined();

      const group = puzzle.pieces.getItemById(piece.parentPieceId!)!;
      expect(group).toBeDefined();

      const expectedGroupPosition = { x: 0, y: -200 };
      const expectedGroupSize = { width: 50, height: 150 };
      expect(group.position).toMatchObject(expectedGroupPosition);
      expect(group).toMatchObject(expectedGroupSize);

      const expectedNumberOfPiecesInNewGroup = 3;
      expect(group.hasNestedPile()).toBe(true);
      expect(group.nestedPile!.length).toBe(expectedNumberOfPiecesInNewGroup);

      const pieceIdsInOrder = group.nestedPile!.itemIdsInOrder;
      expect(pieceIdsInOrder.length).toBe(expectedNumberOfPiecesInNewGroup);

      const groupPile = group.nestedPile;
      const piece1 = groupPile!.getItemById(pieceIdsInOrder[0]);
      const piece2 = groupPile!.getItemById(pieceIdsInOrder[1]);
      const piece3 = groupPile!.getItemById(pieceIdsInOrder[2]);

      const expectedPiecesInNestedPilePositions = [
        { x: 0, y: 50 },
        { x: 0, y: 100 },
        { x: 0, y: 0 },
      ];
      expect(piece1!.position).toMatchObject(expectedPiecesInNestedPilePositions[0]);
      expect(piece2!.position).toMatchObject(expectedPiecesInNestedPilePositions[1]);
      expect(piece3!.position).toMatchObject(expectedPiecesInNestedPilePositions[2]);
    });
  });

  describe("group of multiple pieces", () => {
    it("as T shape from left to right and from top to bottom", () => {
      const puzzle = initPuzzle6x5WithScatteredPieces();

      const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

      movePieceFromTo(new Point(0, 0), new Point(0, -200));
      movePieceFromTo(new Point(100, 0), new Point(50, -200));
      movePieceFromTo(new Point(200, 0), new Point(100, -200));

      movePieceFromTo(new Point(100, 100), new Point(50, -150));
      movePieceFromTo(new Point(100, 200), new Point(50, -100));

      const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(0, -200))!;
      expect(piece).toBeDefined();

      const group = puzzle.pieces.getItemById(piece.parentPieceId!)!;
      expect(group).toBeDefined();

      const expectedGroupPosition = { x: 0, y: -200 };
      const expectedGroupSize = { width: 150, height: 150 };
      expect(group.position).toMatchObject(expectedGroupPosition);
      expect(group).toMatchObject(expectedGroupSize);

      const expectedNumberOfPiecesInNewGroup = 5;
      expect(group.hasNestedPile()).toBe(true);
      expect(group.nestedPile!.length).toBe(expectedNumberOfPiecesInNewGroup);

      const pieceIdsInOrder = group.nestedPile!.itemIdsInOrder;
      expect(pieceIdsInOrder.length).toBe(expectedNumberOfPiecesInNewGroup);

      const groupPile = group.nestedPile;
      const piece1 = groupPile!.getItemById(pieceIdsInOrder[0]);
      const piece2 = groupPile!.getItemById(pieceIdsInOrder[1]);
      const piece3 = groupPile!.getItemById(pieceIdsInOrder[2]);
      const piece4 = groupPile!.getItemById(pieceIdsInOrder[3]);
      const piece5 = groupPile!.getItemById(pieceIdsInOrder[4]);

      const expectedPiecesInNestedPilePositions = [
        { x: 50, y: 0 },
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 50, y: 50 },
        { x: 50, y: 100 },
      ];
      expect(piece1!.position).toMatchObject(expectedPiecesInNestedPilePositions[0]);
      expect(piece2!.position).toMatchObject(expectedPiecesInNestedPilePositions[1]);
      expect(piece3!.position).toMatchObject(expectedPiecesInNestedPilePositions[2]);
      expect(piece4!.position).toMatchObject(expectedPiecesInNestedPilePositions[3]);
      expect(piece5!.position).toMatchObject(expectedPiecesInNestedPilePositions[4]);
    });

    it.skip("as ] shape");
    it.skip("as J shape");
  });
});

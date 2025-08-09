import { Point } from "../Point";
import {
  getGroupIdFromPiecesInIt,
  initPuzzle2x3WithScatteredPieces,
  initPuzzle6x5WithScatteredPieces,
  movePieceFromPointToPointForPuzzle,
} from "./puzzle-tests-helpers";

describe("select and then unselect", () => {
  it("1=1, a piece will always left it on the top", () => {
    const puzzle = initPuzzle2x3WithScatteredPieces();

    const point = new Point(100, 100);
    const piece = puzzle.findPieceByPointingInsidePieceBoundaries(point)!;

    const expectingOrderedPieceIdsBeforeSelectingPiece = [
      "piece_0:0",
      "piece_100:0",
      "piece_0:100",
      "piece_100:100",
      "piece_0:200",
      "piece_100:200",
    ];
    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIdsBeforeSelectingPiece);

    puzzle.selectActivePiece(piece);
    puzzle.unselectActivePiece();

    const expectingOrderedPieceIdsAfterUnselectingActivePiece = [
      "piece_0:0",
      "piece_100:0",
      "piece_0:100",
      "piece_0:200",
      "piece_100:200",
      "piece_100:100",
    ];
    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIdsAfterUnselectingActivePiece);
  });

  it("2>1, a group of two when there are no another groups will move the group under all of single pieces after creation a new one", () => {
    const puzzle = initPuzzle2x3WithScatteredPieces();

    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    movePieceFromTo(new Point(100, 100), new Point(50, 100));

    const expectingOrderedPieceIds = [
      getGroupIdFromPiecesInIt(["piece_100:100", "piece_0:100"]),
      "piece_0:0",
      "piece_100:0",
      "piece_0:200",
      "piece_100:200",
    ];
    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIds);

    const point = new Point(0, 100);
    const piece = puzzle.findPieceByPointingInsidePieceBoundaries(point)!;

    puzzle.selectActivePiece(piece);
    puzzle.unselectActivePiece();

    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIds);
  });

  it("2=2, a group of 2 when there is another group of 2 will move the group of 2 over all existing groups of two", () => {
    const puzzle = initPuzzle2x3WithScatteredPieces();

    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    movePieceFromTo(new Point(100, 200), new Point(50, 200));

    movePieceFromTo(new Point(0, 200), new Point(0, 125));

    movePieceFromTo(new Point(100, 100), new Point(50, 100));

    const expectingOrderedPieceIds = [
      getGroupIdFromPiecesInIt(["piece_100:200", "piece_0:200"]),
      getGroupIdFromPiecesInIt(["piece_100:100", "piece_0:100"]),
      "piece_0:0",
      "piece_100:0",
    ];
    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIds);

    const point = new Point(0, 100);
    const piece = puzzle.findPieceByPointingInsidePieceBoundaries(point)!;

    puzzle.selectActivePiece(piece);
    puzzle.unselectActivePiece();

    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIds);
  });

  it("4>2, a group of 4 when there is a group of 2 will move the group of 4 under all existing groups of two", () => {
    const puzzle = initPuzzle2x3WithScatteredPieces();

    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    movePieceFromTo(new Point(100, 0), new Point(50, 0));

    movePieceFromTo(new Point(100, 100), new Point(50, 100));
    movePieceFromTo(new Point(100, 200), new Point(50, 200));
    movePieceFromTo(new Point(0, 200), new Point(0, 150));

    const expectingOrderedPieceIds = [
      getGroupIdFromPiecesInIt(["piece_100:200", "piece_0:200"]),
      getGroupIdFromPiecesInIt(["piece_100:0", "piece_0:0"]),
    ];
    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIds);

    const point = new Point(0, 100);
    const piece = puzzle.findPieceByPointingInsidePieceBoundaries(point)!;

    puzzle.selectActivePiece(piece);
    puzzle.unselectActivePiece();

    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIds);
  });

  it("6>4>2, a group of 4 when there are a group of 2 and a group of 6 will move the group of 2 under all existing groups of 2 but over all existing group of 6", () => {
    const puzzle = initPuzzle6x5WithScatteredPieces();

    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    movePieceFromTo(new Point(100, 0), new Point(50, 0));

    movePieceFromTo(new Point(200, 0), new Point(250, 0));
    movePieceFromTo(new Point(300, 0), new Point(350, 0));
    movePieceFromTo(new Point(200, 100), new Point(250, 100));
    movePieceFromTo(new Point(300, 100), new Point(350, 100));
    movePieceFromTo(new Point(400, 100), new Point(400, 50));

    movePieceFromTo(new Point(400, 50), new Point(25, 0));

    movePieceFromTo(new Point(100, 100), new Point(50, 100));
    movePieceFromTo(new Point(100, 200), new Point(50, 200));
    movePieceFromTo(new Point(0, 200), new Point(0, 150));

    movePieceFromTo(new Point(0, 150), new Point(15, 0));

    const expectingOrderedPieceIds = [
      getGroupIdFromPiecesInIt(["piece_200:100", "piece_300:100"]),
      getGroupIdFromPiecesInIt(["piece_100:200", "piece_0:200"]),
      getGroupIdFromPiecesInIt(["piece_100:0", "piece_0:0"]),
      "piece_500:0",
      "piece_500:100",
      "piece_200:200",
      "piece_300:200",
      "piece_400:200",
      "piece_500:200",
      "piece_0:300",
      "piece_100:300",
      "piece_200:300",
      "piece_300:300",
      "piece_400:300",
      "piece_500:300",
      "piece_0:400",
      "piece_100:400",
      "piece_200:400",
      "piece_300:400",
      "piece_400:400",
      "piece_500:400",
    ];
    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIds);

    const point = new Point(15, 0);
    const piece = puzzle.findPieceByPointingInsidePieceBoundaries(point)!;

    puzzle.selectActivePiece(piece);
    puzzle.unselectActivePiece();

    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIds);
  });

  it("4>2>0, a group of 2 when there is no single pieces and a group of 4 will move a new one over all existing group of 4", () => {
    const puzzle = initPuzzle2x3WithScatteredPieces();

    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    movePieceFromTo(new Point(100, 100), new Point(50, 100));
    movePieceFromTo(new Point(100, 200), new Point(50, 200));
    movePieceFromTo(new Point(0, 200), new Point(0, 150));

    movePieceFromTo(new Point(100, 0), new Point(50, 0));

    const expectingOrderedPieceIds = [
      getGroupIdFromPiecesInIt(["piece_100:200", "piece_0:200"]),
      getGroupIdFromPiecesInIt(["piece_100:0", "piece_0:0"]),
    ];
    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIds);

    const point = new Point(0, 100);
    const piece = puzzle.findPieceByPointingInsidePieceBoundaries(point)!;

    puzzle.selectActivePiece(piece);
    puzzle.unselectActivePiece();

    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIds);
  });

  it("6>0, a group of 6 when there is no single pieces and no another groups will move a new one on the top", () => {
    const puzzle = initPuzzle2x3WithScatteredPieces();

    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    movePieceFromTo(new Point(100, 0), new Point(50, 0));
    movePieceFromTo(new Point(100, 100), new Point(50, 100));
    movePieceFromTo(new Point(100, 200), new Point(50, 200));
    movePieceFromTo(new Point(0, 0), new Point(0, 50));
    movePieceFromTo(new Point(0, 50), new Point(0, 100));

    const expectingOrderedPieceIds = [getGroupIdFromPiecesInIt(["piece_100:0", "piece_0:0"])];
    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIds);

    const point = new Point(0, 100);
    const piece = puzzle.findPieceByPointingInsidePieceBoundaries(point)!;

    puzzle.selectActivePiece(piece);
    puzzle.unselectActivePiece();

    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIds);
  });
});

describe("creating", () => {
  it("2>1, a group of 2 when there are no another groups will move a new one under all of single pieces after creation a new one", () => {
    const puzzle = initPuzzle2x3WithScatteredPieces();

    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    movePieceFromTo(new Point(100, 100), new Point(50, 100));

    const expectingOrderedPieceIds = [
      getGroupIdFromPiecesInIt(["piece_100:100", "piece_0:100"]),
      "piece_0:0",
      "piece_100:0",
      "piece_0:200",
      "piece_100:200",
    ];
    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIds);
  });

  it("2=2, a group of 2 when there is another group of 2 will move a new one over all existing groups of 2", () => {
    const puzzle = initPuzzle2x3WithScatteredPieces();

    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    movePieceFromTo(new Point(100, 200), new Point(50, 200));

    movePieceFromTo(new Point(0, 200), new Point(0, 125));

    movePieceFromTo(new Point(100, 100), new Point(50, 100));

    const expectingOrderedPieceIds = [
      getGroupIdFromPiecesInIt(["piece_100:200", "piece_0:200"]),
      getGroupIdFromPiecesInIt(["piece_100:100", "piece_0:100"]),
      "piece_0:0",
      "piece_100:0",
    ];
    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIds);
  });

  it("4>2, a group of 4 when there is a group of 2 will move a new one under all existing groups of 2", () => {
    const puzzle = initPuzzle2x3WithScatteredPieces();

    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    movePieceFromTo(new Point(100, 0), new Point(50, 0));

    movePieceFromTo(new Point(100, 100), new Point(50, 100));
    movePieceFromTo(new Point(100, 200), new Point(50, 200));
    movePieceFromTo(new Point(0, 200), new Point(0, 150));

    const expectingOrderedPieceIds = [
      getGroupIdFromPiecesInIt(["piece_100:200", "piece_0:200"]),
      getGroupIdFromPiecesInIt(["piece_100:0", "piece_0:0"]),
    ];
    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIds);
  });

  it("6>4>2, a group of 4 when there are a group of 2 and a group of 6 will move a new one group of 2 under all existing groups of 2 but over all existing group of 6", () => {
    const puzzle = initPuzzle6x5WithScatteredPieces();

    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    movePieceFromTo(new Point(100, 0), new Point(50, 0));

    movePieceFromTo(new Point(200, 0), new Point(250, 0));
    movePieceFromTo(new Point(300, 0), new Point(350, 0));
    movePieceFromTo(new Point(200, 100), new Point(250, 100));
    movePieceFromTo(new Point(300, 100), new Point(350, 100));
    movePieceFromTo(new Point(400, 100), new Point(400, 50));

    movePieceFromTo(new Point(400, 50), new Point(25, 0));

    movePieceFromTo(new Point(100, 100), new Point(50, 100));
    movePieceFromTo(new Point(100, 200), new Point(50, 200));
    movePieceFromTo(new Point(0, 200), new Point(0, 150));

    movePieceFromTo(new Point(0, 150), new Point(35, 0));

    const expectingOrderedPieceIds = [
      getGroupIdFromPiecesInIt(["piece_200:100", "piece_300:100"]),
      getGroupIdFromPiecesInIt(["piece_100:200", "piece_0:200"]),
      getGroupIdFromPiecesInIt(["piece_100:0", "piece_0:0"]),
      "piece_500:0",
      "piece_500:100",
      "piece_200:200",
      "piece_300:200",
      "piece_400:200",
      "piece_500:200",
      "piece_0:300",
      "piece_100:300",
      "piece_200:300",
      "piece_300:300",
      "piece_400:300",
      "piece_500:300",
      "piece_0:400",
      "piece_100:400",
      "piece_200:400",
      "piece_300:400",
      "piece_400:400",
      "piece_500:400",
    ];
    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIds);
  });

  it("4>2>0, a group of 2 when there is no single pieces and a group of 4 will move a new one over all existing group of 4", () => {
    const puzzle = initPuzzle2x3WithScatteredPieces();

    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    movePieceFromTo(new Point(100, 100), new Point(50, 100));
    movePieceFromTo(new Point(100, 200), new Point(50, 200));
    movePieceFromTo(new Point(0, 200), new Point(0, 150));

    movePieceFromTo(new Point(100, 0), new Point(50, 0));

    const expectingOrderedPieceIds = [
      getGroupIdFromPiecesInIt(["piece_100:200", "piece_0:200"]),
      getGroupIdFromPiecesInIt(["piece_100:0", "piece_0:0"]),
    ];
    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIds);
  });

  it("6>0, a group of 6 when there is no single pieces and no another groups will move a new one on the top", () => {
    const puzzle = initPuzzle2x3WithScatteredPieces();

    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    movePieceFromTo(new Point(100, 0), new Point(50, 0));
    movePieceFromTo(new Point(100, 100), new Point(50, 100));
    movePieceFromTo(new Point(100, 200), new Point(50, 200));
    movePieceFromTo(new Point(0, 0), new Point(0, 50));
    movePieceFromTo(new Point(0, 50), new Point(0, 100));

    const expectingOrderedPieceIds = [getGroupIdFromPiecesInIt(["piece_100:0", "piece_0:0"])];
    expect(puzzle.pieces!.itemIdsInOrder).toEqual(expectingOrderedPieceIds);
  });
});

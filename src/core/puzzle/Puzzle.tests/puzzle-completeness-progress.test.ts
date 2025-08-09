import { Point } from "../Point";
import {
  getMovements,
  initPuzzle6x5WithScatteredPieces,
  movePieceFromPointToPointForPuzzle,
} from "./puzzle-tests-helpers";

describe("completeness progress attribute of puzzle", () => {
  it("should has value equal to 0 by default", () => {
    const puzzle = initPuzzle6x5WithScatteredPieces();

    const expectedTotalNumberOfPieces = 30;
    expect(puzzle.pieces.length).toBe(expectedTotalNumberOfPieces);

    expect(puzzle.completenessProgress).toBe(0);
  });

  it("should be updated after connecting of pieces", () => {
    const puzzle = initPuzzle6x5WithScatteredPieces();

    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    expect(puzzle.completenessProgress).toBe(0);

    movePieceFromTo(new Point(100, 0), new Point(50, 0));

    const expectedTotalNumberOfPieces = 30;
    const expectedNumberOfPiecesInGroup = 2;
    const expectedNumberOfNewGroup = 1;
    expect(puzzle.pieces.length).toBe(
      expectedTotalNumberOfPieces - expectedNumberOfPiecesInGroup + expectedNumberOfNewGroup,
    );

    const totalNumberOfPossibleConnectionsPerRow = 5;
    const totalNumberOfPossibleConnectionsPerColumn = 4;
    const totalNumberOfPossibleConnections =
      5 * totalNumberOfPossibleConnectionsPerRow + totalNumberOfPossibleConnectionsPerColumn * 6;

    const numberOfUsedConnections = 1;
    const expectedProgress = Math.round((numberOfUsedConnections / totalNumberOfPossibleConnections) * 100);

    expect(puzzle.completenessProgress).toBe(expectedProgress);
  });

  it("should be equal 100 for a fully completed puzzle", () => {
    const puzzle = initPuzzle6x5WithScatteredPieces();

    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    expect(puzzle.completenessProgress).toBe(0);

    movePieceFromTo(new Point(100, 0), new Point(50, 0));
    movePieceFromTo(new Point(200, 0), new Point(100, 0));
    movePieceFromTo(new Point(300, 0), new Point(150, 0));
    movePieceFromTo(new Point(400, 0), new Point(200, 0));
    movePieceFromTo(new Point(500, 0), new Point(250, 0));

    movePieceFromTo(new Point(0, 100), new Point(0, 50));
    movePieceFromTo(new Point(100, 100), new Point(50, 50));
    movePieceFromTo(new Point(200, 100), new Point(100, 50));
    movePieceFromTo(new Point(300, 100), new Point(150, 50));
    movePieceFromTo(new Point(400, 100), new Point(200, 50));
    movePieceFromTo(new Point(500, 100), new Point(250, 50));

    movePieceFromTo(new Point(0, 200), new Point(0, 100));
    movePieceFromTo(new Point(100, 200), new Point(50, 100));
    movePieceFromTo(new Point(200, 200), new Point(100, 100));
    movePieceFromTo(new Point(300, 200), new Point(150, 100));
    movePieceFromTo(new Point(400, 200), new Point(200, 100));
    movePieceFromTo(new Point(500, 200), new Point(250, 100));

    movePieceFromTo(new Point(0, 300), new Point(0, 150));
    movePieceFromTo(new Point(100, 300), new Point(50, 150));
    movePieceFromTo(new Point(200, 300), new Point(100, 150));
    movePieceFromTo(new Point(300, 300), new Point(150, 150));
    movePieceFromTo(new Point(400, 300), new Point(200, 150));
    movePieceFromTo(new Point(500, 300), new Point(250, 150));

    movePieceFromTo(new Point(0, 400), new Point(0, 200));
    movePieceFromTo(new Point(100, 400), new Point(50, 200));
    movePieceFromTo(new Point(200, 400), new Point(100, 200));
    movePieceFromTo(new Point(300, 400), new Point(150, 200));
    movePieceFromTo(new Point(400, 400), new Point(200, 200));
    movePieceFromTo(new Point(500, 400), new Point(250, 200));

    const expectedTotalNumberOfPieces = 30;
    const expectedNumberOfPiecesInGroup = 30;
    const expectedNumberOfNewGroup = 1;
    expect(puzzle.pieces.length).toBe(
      expectedTotalNumberOfPieces - expectedNumberOfPiecesInGroup + expectedNumberOfNewGroup,
    );

    expect(puzzle.completenessProgress).toBe(100);
  });

  it("should be equal 100 for a fully completed puzzle (assembling the puzzle by moving only one piece)", () => {
    const puzzle = initPuzzle6x5WithScatteredPieces();

    expect(puzzle.completenessProgress).toBe(0);

    const stepSize = 50;
    const { right, down, left } = getMovements(puzzle, new Point(0, 0), stepSize);

    right();
    right();
    right();
    right();

    right();

    down();
    left();
    left();
    left();

    left();
    left();

    down();
    right();
    right();
    right();

    right();
    right();

    down();
    left();
    left();
    left();

    left();
    left();

    down();
    right();
    right();
    right();

    right();
    right();

    const expectedTotalNumberOfPieces = 30;
    const expectedNumberOfPiecesInGroup = 30;
    const expectedNumberOfNewGroup = 1;
    expect(puzzle.pieces.length).toBe(
      expectedTotalNumberOfPieces - expectedNumberOfPiecesInGroup + expectedNumberOfNewGroup,
    );

    expect(puzzle.completenessProgress).toBe(100);
  });
});

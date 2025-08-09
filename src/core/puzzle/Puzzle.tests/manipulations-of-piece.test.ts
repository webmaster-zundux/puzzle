import { Point } from "../Point";
import { PositionDelta } from "../PositionDelta";
import { initPuzzle6x5WithScatteredPieces } from "./puzzle-tests-helpers";
import { describe, it, expect, vi } from "vitest";

describe("selecting/unselecting a piece", () => {
  it("set active piece by point inside of the piece's touch area", () => {
    const puzzle = initPuzzle6x5WithScatteredPieces();
    const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(100, 100))!;

    expect(piece).toBeDefined();
    expect(piece!.position.x).toBe(100);
    expect(piece!.position.y).toBe(100);

    puzzle.selectActivePiece(piece);

    expect(puzzle.activePiece).toBeDefined();
    expect(puzzle.activePiece).toBe(piece);
    expect(puzzle.activePiece!.id).toBe(piece.id);
    expect(puzzle.pieces.itemIdOnTop).toBe(piece.id);
    expect(puzzle.pieces.itemOnTop).toBe(piece);
  });

  it("a try to set active piece by point outside of the piece's touch area will throw error", () => {
    const puzzle = initPuzzle6x5WithScatteredPieces();
    const notExistingPiece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(-100, -100))!;
    expect(() => puzzle.selectActivePiece(notExistingPiece)).toThrow("Error. Parameter piece is not defined");

    expect(notExistingPiece).not.toBeDefined();
    expect(puzzle.activePiece).not.toBeDefined();
  });

  it("unselect active piece in puzzle by puzzle method unselectPiece", () => {
    const puzzle = initPuzzle6x5WithScatteredPieces();

    const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(0, 0))!;
    puzzle.selectActivePiece(piece);

    expect(piece).toBeDefined();
    expect(puzzle.activePiece).toBeDefined();
    expect(puzzle.activePiece!.id).toBe(piece.id);
    expect(puzzle.activePiece).toBe(piece);
    expect(puzzle.pieces.itemIdOnTop).toBe(piece.id);
    expect(puzzle.pieces.itemOnTop).toBe(piece);
    expect(piece.position.x).toBe(0);
    expect(piece.position.y).toBe(0);

    puzzle.unselectActivePiece();

    expect(puzzle.activePiece).toBe(undefined);

    expect(puzzle.pieces.itemIdOnTop).toBe(piece.id);
    expect(puzzle.pieces.itemOnTop).toBe(piece);
  });

  it("change active piece in puzzle by point inside of another piece's touch area", () => {
    const puzzle = initPuzzle6x5WithScatteredPieces();

    const pieceA = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(0, 0))!;
    expect(pieceA).toBeDefined();

    puzzle.selectActivePiece(pieceA);

    expect(puzzle.activePiece).toBeDefined();
    expect(puzzle.activePiece!.id).toBe(pieceA.id);
    expect(puzzle.activePiece).toBe(pieceA);
    expect(puzzle.pieces.itemIdOnTop).toBe(pieceA.id);
    expect(puzzle.pieces.itemOnTop).toBe(pieceA);
    expect(pieceA.position.x).toBe(0);
    expect(pieceA.position.y).toBe(0);

    const pieceB = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(100, 100))!;
    expect(pieceB).toBeDefined();

    puzzle.selectActivePiece(pieceB);

    expect(puzzle.activePiece).toBeDefined();
    expect(puzzle.activePiece!.id).toBe(pieceB.id);
    expect(puzzle.activePiece).toBe(pieceB);
    expect(puzzle.pieces.itemIdOnTop).toBe(pieceB.id);
    expect(puzzle.pieces.itemOnTop).toBe(pieceB);
    expect(pieceB.position.x).toBe(100);
    expect(pieceB.position.y).toBe(100);
  });
});

describe("moving a piece", () => {
  it("move selected piece", () => {
    const puzzle = initPuzzle6x5WithScatteredPieces();
    const pieceAt100x100 = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(100, 100))!;
    expect(pieceAt100x100).toBeDefined();

    puzzle.selectActivePiece(pieceAt100x100);

    expect(puzzle.activePiece).toBeDefined();
    expect(puzzle.activePiece!.id).toBe(pieceAt100x100.id);
    expect(puzzle.activePiece).toBe(pieceAt100x100);

    const positionDelta = new PositionDelta(-200, -200);
    puzzle.moveActivePiece(positionDelta);

    expect(puzzle.activePiece).toBeDefined();
    expect(puzzle.activePiece!.id).toBe(pieceAt100x100.id);
    expect(puzzle.activePiece).toBe(pieceAt100x100);

    expect(puzzle.activePiece!.position.x).toBe(-100);
    expect(puzzle.activePiece!.position.y).toBe(-100);

    expect(puzzle.pieces.itemIdOnTop).toBe(pieceAt100x100.id);
    expect(puzzle.pieces.itemOnTop).toBe(pieceAt100x100);
  });

  it("calls console.error() with a message when tries to move a active piece when puzzle has not an active piece", () => {
    const puzzle = initPuzzle6x5WithScatteredPieces();

    expect(puzzle.activePiece).toBe(undefined);
    const spyConsoleError = vi.spyOn(console, "error").mockImplementationOnce(() => undefined);

    puzzle.moveActivePiece(new PositionDelta(200, 200));

    expect(spyConsoleError).toHaveBeenCalledWith(
      "Warning. Puzzle core has no activePiece. Are you trying move piece that is not active any more",
    );
  });
});

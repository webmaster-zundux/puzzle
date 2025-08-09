import { Piece } from "./Piece";
import { Pile } from "./Pile";

const initPileOfThreePieces = (): Pile => {
  const pile = new Pile({ id: "pile-of-three-pieces" });

  const first = Piece.create({
    id: "1",
    x: 1,
    y: 1,
    width: 1,
    height: 1,
    connectionActivationAreaSideSizeScaleFromPieceSideSize: 0.1,
  });
  const second = Piece.create({
    id: "2",
    x: 2,
    y: 2,
    width: 1,
    height: 1,
    connectionActivationAreaSideSizeScaleFromPieceSideSize: 0.1,
  });
  const third = Piece.create({
    id: "3",
    x: 3,
    y: 3,
    width: 1,
    height: 1,
    connectionActivationAreaSideSizeScaleFromPieceSideSize: 0.1,
  });

  pile.addPieceOnTheTop(first);
  pile.addPieceOnTheTop(second);
  pile.addPieceOnTheTop(third);

  return pile;
};

describe("add a new piece", () => {
  it("on the top of the pile", () => {
    const pile = initPileOfThreePieces();
    const originalAtTheBottom = pile.itemAtBottom;
    const originalOnTheTop = pile.itemOnTop;

    const forth = Piece.create({
      id: "4",
      x: 4,
      y: 4,
      width: 1,
      height: 1,
      connectionActivationAreaSideSizeScaleFromPieceSideSize: 0.1,
    });
    pile.addPieceOnTheTop(forth);

    expect(pile.itemAtBottom!.id).toBe("1");
    expect(pile.itemOnTop!.id).toBe("4");

    expect(pile.getNextItem(forth)).toBe(undefined);
    expect(pile.getPreviousItem(forth)!.id).toBe("3");

    const previousPiece = pile.getPreviousItem(forth)!;
    expect(pile.getNextItem(previousPiece)!.id).toBe("4");

    expect(pile.itemIdsInOrder).toStrictEqual(["1", "2", "3", "4"]);

    expect(pile.itemAtBottom).toBe(originalAtTheBottom);
    expect(pile.itemOnTop).toBe(forth);
    expect(pile.itemOnTop).not.toBe(originalOnTheTop);
  });
});

describe('move a piece by "z-axis"', () => {
  it("from the bottom to the top", () => {
    const pile = initPileOfThreePieces();
    const originalAtTheBottom = pile.itemAtBottom!;
    const originalOnTheTop = pile.itemOnTop;

    pile.moveToTop(originalAtTheBottom);

    expect(pile.itemAtBottom!.id).toBe("2");
    expect(pile.itemOnTop!.id).toBe("1");

    expect(pile.getNextItem(originalAtTheBottom)).toBe(undefined);
    expect(pile.getPreviousItem(originalAtTheBottom)!.id).toBe("3");

    const previousPiece = pile.getPreviousItem(originalAtTheBottom)!;
    expect(pile.getNextItem(previousPiece)!.id).toBe("1");

    expect(pile.itemIdsInOrder).toStrictEqual(["2", "3", "1"]);

    expect(pile.itemAtBottom).not.toBe(originalAtTheBottom);
    expect(pile.itemOnTop).toBe(originalAtTheBottom);
    expect(pile.itemOnTop).not.toBe(originalOnTheTop);
  });

  it("from the top to the top", () => {
    const pile = initPileOfThreePieces();
    const originalAtTheBottom = pile.itemAtBottom;
    const originalOnTheTop = pile.itemOnTop!;

    pile.moveToTop(originalOnTheTop);

    expect(pile.itemAtBottom!.id).toBe("1");
    expect(pile.itemOnTop!.id).toBe("3");

    expect(pile.getNextItem(originalOnTheTop)).toBe(undefined);
    expect(pile.getPreviousItem(originalOnTheTop)!.id).toBe("2");

    const previousPiece = pile.getPreviousItem(originalOnTheTop)!;
    expect(pile.getNextItem(previousPiece)!.id).toBe("3");

    expect(pile.itemIdsInOrder).toStrictEqual(["1", "2", "3"]);

    expect(pile.itemAtBottom).toBe(originalAtTheBottom);
    expect(pile.itemOnTop).toBe(originalOnTheTop);
  });

  it("from somewhere of the middle of the pile to the top", () => {
    const pile = initPileOfThreePieces();
    const originalAtTheBottom = pile.itemAtBottom;
    const originalOnTheTop = pile.itemOnTop;
    const originalAtTheMiddle = pile.getNextItem(pile.itemAtBottom!)!;

    pile.moveToTop(originalAtTheMiddle);

    expect(pile.itemAtBottom!.id).toBe("1");
    expect(pile.itemOnTop!.id).toBe("2");

    expect(pile.getNextItem(originalAtTheMiddle)).toBe(undefined);
    expect(pile.getPreviousItem(originalAtTheMiddle)!.id).toBe("3");

    const previousPiece = pile.getPreviousItem(originalAtTheMiddle)!;
    expect(pile.getNextItem(previousPiece)!.id).toBe("2");

    expect(pile.itemIdsInOrder).toStrictEqual(["1", "3", "2"]);

    expect(pile.itemAtBottom).toBe(originalAtTheBottom);
    expect(pile.itemOnTop).not.toBe(originalOnTheTop);
    expect(pile.itemOnTop).toBe(originalAtTheMiddle);
  });
});

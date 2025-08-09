import type { NEIGHBOR_SIDE } from "../Piece";
import { Point } from "../Point";
import { PositionDelta } from "../PositionDelta";
import { initPuzzle6x5WithScatteredPieces } from "./puzzle-tests-helpers";

describe("connecting two pieces", () => {
  describe("connecting a piece with a suitable piece inside connection activation area and positioned next to it's connection edge", () => {
    describe.each([
      {
        caseName: "over top side",
        movingPiecePosition: { x: 100, y: 100 },
        positionDelta: { dx: 0, dy: -50 },
        expectedPieceGroupPosition: { x: 100, y: 0 },
        expectedPieceGroupSize: { width: 50, height: 100 },
        expectedMovedPiecePosition: { x: 100, y: 50 },
        expectingPieceIdsInGroup: ["piece_100:100", "piece_100:0"],
        expectingNotConnectedNeighborsForMovedPiece: new Map([
          ["right", "piece_200:100"],
          ["bottom", "piece_100:200"],
          ["left", "piece_0:100"],
        ]),
        expectingConnectedNeighborsForMovedPiece: new Map([["top", "piece_100:0"]]),
        expectingNotConnectedNeighborsForConnectedPiece: new Map([
          ["right", "piece_200:0"],
          ["left", "piece_0:0"],
        ]),
        expectingConnectedNeighborsForConnectedPiece: new Map([["bottom", "piece_100:100"]]),
        targetPieceConnectionSide: "top" as NEIGHBOR_SIDE,
        connectedPieceConnectionSide: "bottom" as NEIGHBOR_SIDE,
      },

      {
        caseName: "over right side",
        movingPiecePosition: { x: 100, y: 100 },
        positionDelta: { dx: +50, dy: 0 },
        expectedPieceGroupPosition: { x: 150, y: 100 },
        expectedPieceGroupSize: { width: 100, height: 50 },
        expectedMovedPiecePosition: { x: 150, y: 100 },
        expectingPieceIdsInGroup: ["piece_100:100", "piece_200:100"],
        expectingNotConnectedNeighborsForMovedPiece: new Map([
          ["top", "piece_100:0"],
          ["bottom", "piece_100:200"],
          ["left", "piece_0:100"],
        ]),
        expectingConnectedNeighborsForMovedPiece: new Map([["right", "piece_200:100"]]),
        expectingNotConnectedNeighborsForConnectedPiece: new Map([
          ["top", "piece_200:0"],
          ["right", "piece_300:100"],
          ["bottom", "piece_200:200"],
        ]),
        expectingConnectedNeighborsForConnectedPiece: new Map([["left", "piece_100:100"]]),
        targetPieceConnectionSide: "right" as NEIGHBOR_SIDE,
        connectedPieceConnectionSide: "left" as NEIGHBOR_SIDE,
      },

      {
        caseName: "over bottom side",
        movingPiecePosition: { x: 100, y: 100 },
        positionDelta: { dx: 0, dy: +50 },
        expectedPieceGroupPosition: { x: 100, y: 150 },
        expectedPieceGroupSize: { width: 50, height: 100 },
        expectedMovedPiecePosition: { x: 100, y: 150 },
        expectingPieceIdsInGroup: ["piece_100:100", "piece_100:200"],
        expectingNotConnectedNeighborsForMovedPiece: new Map([
          ["top", "piece_100:0"],
          ["right", "piece_200:100"],
          ["left", "piece_0:100"],
        ]),
        expectingConnectedNeighborsForMovedPiece: new Map([["bottom", "piece_100:200"]]),
        expectingNotConnectedNeighborsForConnectedPiece: new Map([
          ["right", "piece_200:200"],
          ["bottom", "piece_100:300"],
          ["left", "piece_0:200"],
        ]),
        expectingConnectedNeighborsForConnectedPiece: new Map([["top", "piece_100:100"]]),
        targetPieceConnectionSide: "bottom" as NEIGHBOR_SIDE,
        connectedPieceConnectionSide: "top" as NEIGHBOR_SIDE,
      },

      {
        caseName: "over left side",
        movingPiecePosition: { x: 100, y: 100 },
        positionDelta: { dx: -50, dy: 0 },
        expectedPieceGroupPosition: { x: 0, y: 100 },
        expectedPieceGroupSize: { width: 100, height: 50 },
        expectedMovedPiecePosition: { x: 50, y: 100 },
        expectingPieceIdsInGroup: ["piece_100:100", "piece_0:100"],
        expectingNotConnectedNeighborsForMovedPiece: new Map([
          ["top", "piece_100:0"],
          ["right", "piece_200:100"],
          ["bottom", "piece_100:200"],
        ]),
        expectingConnectedNeighborsForMovedPiece: new Map([["left", "piece_0:100"]]),
        expectingNotConnectedNeighborsForConnectedPiece: new Map([
          ["top", "piece_0:0"],
          ["bottom", "piece_0:200"],
        ]),
        expectingConnectedNeighborsForConnectedPiece: new Map([["right", "piece_100:100"]]),
        targetPieceConnectionSide: "left" as NEIGHBOR_SIDE,
        connectedPieceConnectionSide: "right" as NEIGHBOR_SIDE,
      },
    ])(
      "connecting by one side",
      ({
        caseName,
        movingPiecePosition,
        positionDelta,
        expectedPieceGroupPosition,
        expectedPieceGroupSize,
        expectingPieceIdsInGroup,
        expectingNotConnectedNeighborsForMovedPiece,
        expectingConnectedNeighborsForMovedPiece,
        expectingNotConnectedNeighborsForConnectedPiece,
        expectingConnectedNeighborsForConnectedPiece,
        targetPieceConnectionSide,
        expectedMovedPiecePosition,
      }) => {
        it(caseName, () => {
          const puzzle = initPuzzle6x5WithScatteredPieces();
          const pieceAt100x100 = puzzle.findPieceByPointingInsidePieceBoundaries(Point.create(movingPiecePosition))!;
          puzzle.selectActivePiece(pieceAt100x100);
          puzzle.moveActivePiece(PositionDelta.create(positionDelta));
          puzzle.unselectActivePiece();

          const expectedTotalNumberOfPieces = 30;
          const expectedNumberOfPiecesInNewGroup = 2;
          const expectedNumberOfNewGroup = 1;
          expect(puzzle.pieces.length).toBe(
            expectedTotalNumberOfPieces - expectedNumberOfPiecesInNewGroup + expectedNumberOfNewGroup,
          );

          const movedPiece = puzzle.findPieceByPointingInsidePieceBoundaries(Point.create(expectedMovedPiecePosition))!;
          expect(movedPiece).toBeDefined();
          expect(movedPiece.id).not.toBe(puzzle.pieces.itemIdOnTop);
          expect(movedPiece.parentPieceId).toBe(puzzle.pieces.itemIdAtBottom);

          expect(movedPiece.notConnectedNeighborsIds.size).toBe(expectingNotConnectedNeighborsForMovedPiece.size);
          expect(movedPiece.notConnectedNeighborsIds).toEqual(expectingNotConnectedNeighborsForMovedPiece);
          expect(movedPiece.connectedNeighborsIds.size).toBe(expectingConnectedNeighborsForMovedPiece.size);
          expect(movedPiece.connectedNeighborsIds).toEqual(expectingConnectedNeighborsForMovedPiece);

          const connectedPieceId = movedPiece.connectedNeighborsIds.get(targetPieceConnectionSide)!;
          const connectedPiece = puzzle.pieces.getItemById(connectedPieceId)!;
          expect(connectedPiece.notConnectedNeighborsIds.size).toBe(
            expectingNotConnectedNeighborsForConnectedPiece.size,
          );
          expect(connectedPiece.notConnectedNeighborsIds).toEqual(expectingNotConnectedNeighborsForConnectedPiece);
          expect(connectedPiece.connectedNeighborsIds.size).toBe(expectingConnectedNeighborsForConnectedPiece.size);
          expect(connectedPiece.connectedNeighborsIds).toEqual(expectingConnectedNeighborsForConnectedPiece);

          const group = puzzle.pieces.getItemById(pieceAt100x100.parentPieceId!)!;
          expect(group.position).toMatchObject(expectedPieceGroupPosition);
          expect(group).toMatchObject(expectedPieceGroupSize);

          expect(group.nestedPile).toBeDefined();
          expect(group.nestedPile!.length).toBe(expectedNumberOfPiecesInNewGroup);

          expect(group.nestedPile!.itemIdsInOrder).toIncludeAllMembers(expectingPieceIdsInGroup);

          const notExpectedPiecesIdsInRootPile = expectingPieceIdsInGroup;
          const expectedPiecesIdsInRootPile = [`group_(${expectingPieceIdsInGroup.join("__")})`];
          expect(puzzle.pieces.itemIdsInOrder).toIncludeAllMembers(expectedPiecesIdsInRootPile);
          expect(puzzle.pieces.itemIdsInOrder).not.toIncludeAnyMembers(notExpectedPiecesIdsInRootPile);
        });
      },
    );
  });

  describe.each([
    {
      caseName: "on the edge of connection activation area",
      marginFromEdge: 0,
    },
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
      const pieceSideSize = 50;
      const connectionActivationAreaSideSizeFractionFromPieceSideSize = 0.2;
      const puzzle = initPuzzle6x5WithScatteredPieces({
        pieceSideSize,
        connectionActivationAreaSideSizeFractionFromPieceSideSize,
      });
      const targetPiece = puzzle.findPieceByPointingInsidePieceBoundaries(Point.create({ x: 100, y: 100 }))!;
      const attactedPiece = puzzle.findPieceByPointingInsidePieceBoundaries(Point.create({ x: 0, y: 100 }))!;

      puzzle.selectActivePiece(targetPiece);

      const connectionActivationAreaSideSide =
        pieceSideSize * connectionActivationAreaSideSizeFractionFromPieceSideSize;
      const halfOfConnectionActivationAreaSideSide = connectionActivationAreaSideSide / 2;
      const deltaInsideConnectionActivationArea = (1 - marginFromEdge) * halfOfConnectionActivationAreaSideSide;
      const dx = -(pieceSideSize - deltaInsideConnectionActivationArea);
      puzzle.moveActivePiece(PositionDelta.create({ dx, dy: 0 }));
      puzzle.unselectActivePiece();

      const expectedTotalNumberOfPieces = 30;
      const expectedNumberOfPiecesInNewGroup = 2;
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

  it("don't connect a piece with a suitable piece outside of connection activation area", () => {
    const puzzle = initPuzzle6x5WithScatteredPieces();

    const originalPieceIdsInPuzzle = new Array<(typeof puzzle.pieces.itemIdsInOrder)[number]>().concat(
      puzzle.pieces.itemIdsInOrder,
    );

    const pieceAt100x100 = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(100, 100))!;
    puzzle.selectActivePiece(pieceAt100x100);
    puzzle.moveActivePiece(new PositionDelta(100, 110));
    puzzle.unselectActivePiece();

    const expectedTotalNumberOfPieces = 30;
    expect(puzzle.pieces.length).toBe(expectedTotalNumberOfPieces);
    expect(puzzle.pieces.itemIdsInOrder).toIncludeAllMembers(originalPieceIdsInPuzzle);
  });

  describe("don't connect a piece with a not suitable piece inside of connection activation area", () => {
    it("over top side", () => {
      const puzzle = initPuzzle6x5WithScatteredPieces();

      const originalPieceIdsInPuzzle = new Array<(typeof puzzle.pieces.itemIdsInOrder)[number]>().concat(
        puzzle.pieces.itemIdsInOrder,
      );

      const pieceAt100x100 = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(100, 100))!;
      puzzle.selectActivePiece(pieceAt100x100);
      puzzle.moveActivePiece(new PositionDelta(-100, -50));
      puzzle.unselectActivePiece();

      const expectedTotalNumberOfPieces = 30;
      expect(puzzle.pieces.length).toBe(expectedTotalNumberOfPieces);
      expect(puzzle.pieces.itemIdsInOrder).toIncludeAllMembers(originalPieceIdsInPuzzle);
    });

    it("over right side", () => {
      const puzzle = initPuzzle6x5WithScatteredPieces();

      const originalPieceIdsInPuzzle = new Array<(typeof puzzle.pieces.itemIdsInOrder)[number]>().concat(
        puzzle.pieces.itemIdsInOrder,
      );

      const pieceAt100x100 = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(100, 100))!;
      puzzle.selectActivePiece(pieceAt100x100);
      puzzle.moveActivePiece(new PositionDelta(-50, -100));
      puzzle.unselectActivePiece();

      const expectedTotalNumberOfPieces = 30;
      expect(puzzle.pieces.length).toBe(expectedTotalNumberOfPieces);
      expect(puzzle.pieces.itemIdsInOrder).toIncludeAllMembers(originalPieceIdsInPuzzle);
    });

    it("over bottom side", () => {
      const puzzle = initPuzzle6x5WithScatteredPieces();

      const originalPieceIdsInPuzzle = new Array<(typeof puzzle.pieces.itemIdsInOrder)[number]>().concat(
        puzzle.pieces.itemIdsInOrder,
      );

      const pieceAt100x100 = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(100, 100))!;
      puzzle.selectActivePiece(pieceAt100x100);
      puzzle.moveActivePiece(new PositionDelta(-100, -50));
      puzzle.unselectActivePiece();

      const expectedTotalNumberOfPieces = 30;
      expect(puzzle.pieces.length).toBe(expectedTotalNumberOfPieces);
      expect(puzzle.pieces.itemIdsInOrder).toIncludeAllMembers(originalPieceIdsInPuzzle);
    });

    it("over left side", () => {
      const puzzle = initPuzzle6x5WithScatteredPieces();

      const originalPieceIdsInPuzzle = new Array<(typeof puzzle.pieces.itemIdsInOrder)[number]>().concat(
        puzzle.pieces.itemIdsInOrder,
      );

      const pieceAt100x100 = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(100, 100))!;
      puzzle.selectActivePiece(pieceAt100x100);
      puzzle.moveActivePiece(new PositionDelta(-50, -100));
      puzzle.unselectActivePiece();

      const expectedTotalNumberOfPieces = 30;
      expect(puzzle.pieces.length).toBe(expectedTotalNumberOfPieces);
      expect(puzzle.pieces.itemIdsInOrder).toIncludeAllMembers(originalPieceIdsInPuzzle);
    });
  });
});

import { Point } from "../Point";
import { PositionDelta } from "../PositionDelta";
import { initPuzzle6x5WithScatteredPieces, movePieceFromPointToPointForPuzzle } from "./puzzle-tests-helpers";

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
])("with attracting another group with not connected neighbor piece", ({ caseName, marginFromEdge }) => {
  it(caseName, () => {
    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    const pieceSideSize = 50;
    const connectionActivationAreaSideSizeFractionFromPieceSideSize = 0.2;
    const puzzle = initPuzzle6x5WithScatteredPieces({
      pieceSideSize,
      connectionActivationAreaSideSizeFractionFromPieceSideSize,
    });

    movePieceFromTo(new Point(100, 100), new Point(100, 50));

    movePieceFromTo(new Point(100, 50), new Point(100, 100));

    movePieceFromTo(new Point(0, 100), new Point(0, 50));

    movePieceFromTo(new Point(0, 50), new Point(0, 100));

    const targetGroup = puzzle.findPieceByPointingInsidePieceBoundaries(Point.create({ x: 100, y: 50 }))!;
    const attactedGroup = puzzle.findPieceByPointingInsidePieceBoundaries(Point.create({ x: 0, y: 50 }))!;

    puzzle.selectActivePiece(targetGroup);

    const connectionActivationAreaSideSide = pieceSideSize * connectionActivationAreaSideSizeFractionFromPieceSideSize;
    const halfOfConnectionActivationAreaSideSide = connectionActivationAreaSideSide / 2;
    const deltaInsideConnectionActivationArea = (1 - marginFromEdge) * halfOfConnectionActivationAreaSideSide;
    const dx = -(pieceSideSize - deltaInsideConnectionActivationArea);
    puzzle.moveActivePiece(PositionDelta.create({ dx, dy: 0 }));
    puzzle.unselectActivePiece();

    const expectedTotalNumberOfPieces = 30;
    const expectedNumberOfPiecesInNewGroup = 4;
    const expectedNumberOfNewGroup = 1;
    expect(puzzle.pieces.length).toBe(
      expectedTotalNumberOfPieces - expectedNumberOfPiecesInNewGroup + expectedNumberOfNewGroup,
    );

    const resultingGroup = puzzle.findPieceOrGroupOfPiecesByPointingInsidePieceBoundaries(
      Point.create({ x: deltaInsideConnectionActivationArea, y: 50 }),
    )!;

    expect(resultingGroup.position).toMatchObject({
      x: deltaInsideConnectionActivationArea,
      y: 50,
    });

    expect(targetGroup.position).toMatchObject({ x: pieceSideSize, y: 0 });
    expect(attactedGroup.position).toMatchObject({ x: 0, y: 0 });
  });
});

describe("(by one side) at once", () => {
  describe("(connect) group A of pieces with group B of pieces when group A has a SINGLE suitable piece inside connection activation areas of group B", () => {
    describe.each([
      {
        caseName: "(by move a group from top to bottom) v",
        moveFrom: new Point(0, -300),
        moveTo: new Point(0, -200),
        isMovingTopRow: true,
        expectedGroupPosition: { x: 0, y: -200 },
      },
      {
        caseName: "(by move a group from bottom to top) ^",
        moveFrom: new Point(0, -100),
        moveTo: new Point(0, -200),
        expectedGroupPosition: { x: 0, y: -300 },
      },
    ])(
      "group A (row) merge with group B (row) by 1 side of a piece that is a bridge between groups (1 contact side)",
      ({ caseName, moveFrom, moveTo, isMovingTopRow, expectedGroupPosition }) => {
        it(caseName, () => {
          const puzzle = initPuzzle6x5WithScatteredPieces();

          const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

          movePieceFromTo(new Point(0, 0), new Point(0, -300));
          movePieceFromTo(new Point(100, 0), new Point(50, -300));
          movePieceFromTo(new Point(200, 0), new Point(100, -300));

          movePieceFromTo(new Point(100, 100), new Point(50, -250));

          movePieceFromTo(new Point(0, 200), new Point(0, -100));
          movePieceFromTo(new Point(100, 200), new Point(50, -100));
          movePieceFromTo(new Point(200, 200), new Point(100, -100));

          const expectedTotalNumberOfPieces = 30;
          const expectedNumberOfPiecesInGroups = 7;
          const expectedNumberOfGroups = 2;
          expect(puzzle.pieces.length).toBe(
            expectedTotalNumberOfPieces - expectedNumberOfPiecesInGroups + expectedNumberOfGroups,
          );

          movePieceFromTo(moveFrom, moveTo);

          const expectedNumberOfPiecesInNewGroup = 7;
          const expectedNumberOfNewGroup = 1;
          expect(puzzle.pieces.length).toBe(
            expectedTotalNumberOfPieces - expectedNumberOfPiecesInNewGroup + expectedNumberOfNewGroup,
          );

          const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(0, -200))!;
          expect(piece).toBeDefined();
          expect(piece.id).not.toBe(puzzle.pieces.itemIdOnTop);
          expect(piece.parentPieceId).toBe(puzzle.pieces.itemIdAtBottom);

          const expectedGroupSize = { width: 150, height: 150 };
          const group = puzzle.pieces.getItemById(piece.parentPieceId!)!;
          expect(group.position).toMatchObject(expectedGroupPosition);
          expect(group).toMatchObject(expectedGroupSize);
          expect(group.hasNestedPile()).toBe(true);
          expect(group.nestedPile!.length).toBe(expectedNumberOfPiecesInNewGroup);

          const expectingPieceIdsInGroupA = ["piece_100:0", "piece_0:0", "piece_200:0", "piece_100:100"];
          const expectingPieceIdsInGroupB = ["piece_100:200", "piece_0:200", "piece_200:200"];
          const expectingPieceIdsInGroup = isMovingTopRow
            ? expectingPieceIdsInGroupA.concat(expectingPieceIdsInGroupB.sort())
            : expectingPieceIdsInGroupB.concat(expectingPieceIdsInGroupA.sort());
          expect(group.nestedPile!.itemIdsInOrder).toIncludeAllMembers(expectingPieceIdsInGroup);

          const piecesIdsInGroup = expectingPieceIdsInGroup.slice(0, 2);
          const expectedPiecesIdsInRootPile = [`group_(${piecesIdsInGroup.join("__")})`];
          expect(puzzle.pieces.itemIdsInOrder).toIncludeAllMembers(expectedPiecesIdsInRootPile);

          const notExpectedPiecesIdsInRootPile = expectingPieceIdsInGroup;
          expect(puzzle.pieces.itemIdsInOrder).not.toIncludeAnyMembers(notExpectedPiecesIdsInRootPile);
        });
      },
    );

    describe.each([
      {
        caseName: "(by move a group from left to right) ->",
        moveFrom: new Point(-300, 0),
        moveTo: new Point(-200, 0),
        isMovingTopRow: true,
        expectedGroupPosition: { x: -200, y: 0 },
      },
      {
        caseName: "(by move a group from right to left) <-",
        moveFrom: new Point(-100, 0),
        moveTo: new Point(-200, 0),
        expectedGroupPosition: { x: -300, y: 0 },
      },
    ])(
      "group A (column) merge with group B (column) by 1 side of a piece that is a bridge between groups (1 contact side)",
      ({ caseName, moveFrom, moveTo, isMovingTopRow, expectedGroupPosition }) => {
        it(caseName, () => {
          const puzzle = initPuzzle6x5WithScatteredPieces();

          const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

          movePieceFromTo(new Point(0, 0), new Point(-300, 0));
          movePieceFromTo(new Point(0, 100), new Point(-300, 50));
          movePieceFromTo(new Point(0, 200), new Point(-300, 100));

          movePieceFromTo(new Point(100, 100), new Point(-250, 50));

          movePieceFromTo(new Point(200, 0), new Point(-100, 0));
          movePieceFromTo(new Point(200, 100), new Point(-100, 50));
          movePieceFromTo(new Point(200, 200), new Point(-100, 100));

          const expectedTotalNumberOfPieces = 30;
          const expectedNumberOfPiecesInGroups = 7;
          const expectedNumberOfGroups = 2;
          expect(puzzle.pieces.length).toBe(
            expectedTotalNumberOfPieces - expectedNumberOfPiecesInGroups + expectedNumberOfGroups,
          );

          movePieceFromTo(moveFrom, moveTo);

          const expectedNumberOfPiecesInNewGroup = 7;
          const expectedNumberOfNewGroup = 1;
          expect(puzzle.pieces.length).toBe(
            expectedTotalNumberOfPieces - expectedNumberOfPiecesInNewGroup + expectedNumberOfNewGroup,
          );

          const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(-200, 0))!;
          expect(piece).toBeDefined();
          expect(piece.id).not.toBe(puzzle.pieces.itemIdOnTop);
          expect(piece.parentPieceId).toBe(puzzle.pieces.itemIdAtBottom);

          const expectedGroupSize = { width: 150, height: 150 };
          const group = puzzle.pieces.getItemById(piece.parentPieceId!)!;
          expect(group.position).toMatchObject(expectedGroupPosition);
          expect(group).toMatchObject(expectedGroupSize);
          expect(group.hasNestedPile()).toBe(true);
          expect(group.nestedPile!.length).toBe(expectedNumberOfPiecesInNewGroup);

          const expectingPieceIdsInGroupA = ["piece_0:100", "piece_0:0", "piece_0:200", "piece_100:100"];
          const expectingPieceIdsInGroupB = ["piece_200:100", "piece_200:0", "piece_200:200"];
          const expectingPieceIdsInGroup = isMovingTopRow
            ? expectingPieceIdsInGroupA.concat(expectingPieceIdsInGroupB.sort())
            : expectingPieceIdsInGroupB.concat(expectingPieceIdsInGroupA.sort());
          expect(group.nestedPile!.itemIdsInOrder).toIncludeAllMembers(expectingPieceIdsInGroup);

          const piecesIdsInGroup = expectingPieceIdsInGroup.slice(0, 2);
          const expectedPiecesIdsInRootPile = [`group_(${piecesIdsInGroup.join("__")})`];
          expect(puzzle.pieces.itemIdsInOrder).toIncludeAllMembers(expectedPiecesIdsInRootPile);

          const notExpectedPiecesIdsInRootPile = expectingPieceIdsInGroup;
          expect(puzzle.pieces.itemIdsInOrder).not.toIncludeAnyMembers(notExpectedPiecesIdsInRootPile);
        });
      },
    );
  });
});

describe("(by multiple sides) at once", () => {
  describe("(connect) group A of pieces with group B of pieces when group A has MULTIPLE suitable pieces inside connection activation areas of group B", () => {
    describe.each([
      {
        caseName: "(by move a group from top to bottom) v",
        moveFrom: new Point(0, -200),
        moveTo: new Point(0, -150),
        isMovingTopRow: true,
        expectedGroupPosition: { x: 0, y: -150 },
      },
      {
        caseName: "(by move a group from bottom to top) ^",
        moveFrom: new Point(0, -100),
        moveTo: new Point(0, -150),
        expectedGroupPosition: { x: 0, y: -200 },
      },
    ])(
      "group A (row) merge with group B (row) by 3 sides (3 contact sides)",
      ({ caseName, moveFrom, moveTo, isMovingTopRow, expectedGroupPosition }) => {
        it(caseName, () => {
          const puzzle = initPuzzle6x5WithScatteredPieces();

          const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

          movePieceFromTo(new Point(0, 0), new Point(0, -200));
          movePieceFromTo(new Point(100, 0), new Point(50, -200));
          movePieceFromTo(new Point(200, 0), new Point(100, -200));

          movePieceFromTo(new Point(0, 100), new Point(0, -100));
          movePieceFromTo(new Point(100, 100), new Point(50, -100));
          movePieceFromTo(new Point(200, 100), new Point(100, -100));

          const expectedTotalNumberOfPieces = 30;
          const expectedNumberOfPiecesInGroups = 6;
          const expectedNumberOfGroups = 2;
          expect(puzzle.pieces.length).toBe(
            expectedTotalNumberOfPieces - expectedNumberOfPiecesInGroups + expectedNumberOfGroups,
          );

          movePieceFromTo(moveFrom, moveTo);

          const expectedNumberOfPiecesInNewGroup = 6;
          const expectedNumberOfNewGroup = 1;
          expect(puzzle.pieces.length).toBe(
            expectedTotalNumberOfPieces - expectedNumberOfPiecesInNewGroup + expectedNumberOfNewGroup,
          );

          const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(0, -150))!;
          expect(piece).toBeDefined();
          expect(piece.id).not.toBe(puzzle.pieces.itemIdOnTop);
          expect(piece.parentPieceId).toBe(puzzle.pieces.itemIdAtBottom);

          const expectedGroupSize = { width: 150, height: 100 };
          const group = puzzle.pieces.getItemById(piece.parentPieceId!)!;
          expect(group.position).toMatchObject(expectedGroupPosition);
          expect(group).toMatchObject(expectedGroupSize);
          expect(group.hasNestedPile()).toBe(true);
          expect(group.nestedPile!.length).toBe(expectedNumberOfPiecesInNewGroup);

          const expectingPieceIdsInGroupA = ["piece_100:0", "piece_0:0", "piece_200:0"];
          const expectingPieceIdsInGroupB = ["piece_100:100", "piece_0:100", "piece_200:100"];
          const expectingPieceIdsInGroup = isMovingTopRow
            ? expectingPieceIdsInGroupA.concat(expectingPieceIdsInGroupB.sort())
            : expectingPieceIdsInGroupB.concat(expectingPieceIdsInGroupA.sort());
          expect(group.nestedPile!.itemIdsInOrder).toIncludeAllMembers(expectingPieceIdsInGroup);

          const piecesIdsInGroup = expectingPieceIdsInGroup.slice(0, 2);
          const expectedPiecesIdsInRootPile = [`group_(${piecesIdsInGroup.join("__")})`];
          expect(puzzle.pieces.itemIdsInOrder).toIncludeAllMembers(expectedPiecesIdsInRootPile);

          const notExpectedPiecesIdsInRootPile = expectingPieceIdsInGroup;
          expect(puzzle.pieces.itemIdsInOrder).not.toIncludeAnyMembers(notExpectedPiecesIdsInRootPile);
        });
      },
    );

    describe.each([
      {
        caseName: "(by move a group from left to right) ->",
        moveFrom: new Point(-200, 0),
        moveTo: new Point(-150, 0),
        isMovingTopRow: true,
        expectedGroupPosition: { x: -150, y: 0 },
      },
      {
        caseName: "(by move a group from right to left) <-",
        moveFrom: new Point(-100, 0),
        moveTo: new Point(-150, 0),
        expectedGroupPosition: { x: -200, y: 0 },
      },
    ])(
      "group A (column) merge with group B (column) by 3 sides (3 contact sides)",
      ({ caseName, moveFrom, moveTo, isMovingTopRow, expectedGroupPosition }) => {
        it(caseName, () => {
          const puzzle = initPuzzle6x5WithScatteredPieces();

          const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

          movePieceFromTo(new Point(0, 0), new Point(-200, 0));
          movePieceFromTo(new Point(0, 100), new Point(-200, 50));
          movePieceFromTo(new Point(0, 200), new Point(-200, 100));

          movePieceFromTo(new Point(100, 0), new Point(-100, 0));
          movePieceFromTo(new Point(100, 100), new Point(-100, 50));
          movePieceFromTo(new Point(100, 200), new Point(-100, 100));

          const expectedTotalNumberOfPieces = 30;
          const expectedNumberOfPiecesInGroups = 6;
          const expectedNumberOfGroups = 2;
          expect(puzzle.pieces.length).toBe(
            expectedTotalNumberOfPieces - expectedNumberOfPiecesInGroups + expectedNumberOfGroups,
          );

          movePieceFromTo(moveFrom, moveTo);

          const expectedNumberOfPiecesInNewGroup = 6;
          const expectedNumberOfNewGroup = 1;
          expect(puzzle.pieces.length).toBe(
            expectedTotalNumberOfPieces - expectedNumberOfPiecesInNewGroup + expectedNumberOfNewGroup,
          );

          const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(-150, 0))!;
          expect(piece).toBeDefined();
          expect(piece.id).not.toBe(puzzle.pieces.itemIdOnTop);
          expect(piece.parentPieceId).toBe(puzzle.pieces.itemIdAtBottom);

          const expectedGroupSize = { width: 100, height: 150 };
          const group = puzzle.pieces.getItemById(piece.parentPieceId!)!;
          expect(group.position).toMatchObject(expectedGroupPosition);
          expect(group).toMatchObject(expectedGroupSize);
          expect(group.hasNestedPile()).toBe(true);
          expect(group.nestedPile!.length).toBe(expectedNumberOfPiecesInNewGroup);

          const expectingPieceIdsInGroupA = ["piece_0:100", "piece_0:0", "piece_0:200"];
          const expectingPieceIdsInGroupB = ["piece_100:100", "piece_100:0", "piece_100:200"];
          const expectingPieceIdsInGroup = isMovingTopRow
            ? expectingPieceIdsInGroupA.concat(expectingPieceIdsInGroupB.sort())
            : expectingPieceIdsInGroupB.concat(expectingPieceIdsInGroupA.sort());
          expect(group.nestedPile!.itemIdsInOrder).toIncludeAllMembers(expectingPieceIdsInGroup);

          const piecesIdsInGroup = expectingPieceIdsInGroup.slice(0, 2);
          const expectedPiecesIdsInRootPile = [`group_(${piecesIdsInGroup.join("__")})`];
          expect(puzzle.pieces.itemIdsInOrder).toIncludeAllMembers(expectedPiecesIdsInRootPile);

          const notExpectedPiecesIdsInRootPile = expectingPieceIdsInGroup;
          expect(puzzle.pieces.itemIdsInOrder).not.toIncludeAnyMembers(notExpectedPiecesIdsInRootPile);
        });
      },
    );
  });

  it("connect 3 groups at once", () => {
    const puzzle = initPuzzle6x5WithScatteredPieces();

    const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

    movePieceFromTo(new Point(0, 0), new Point(-500, 0));
    movePieceFromTo(new Point(0, 100), new Point(-500, 50));
    movePieceFromTo(new Point(0, 200), new Point(-500, 100));

    movePieceFromTo(new Point(100, 0), new Point(-100, 0));
    movePieceFromTo(new Point(100, 100), new Point(-100, 50));
    movePieceFromTo(new Point(100, 200), new Point(-100, 100));

    movePieceFromTo(new Point(200, 0), new Point(-400, 0));
    movePieceFromTo(new Point(200, 100), new Point(-400, 50));
    movePieceFromTo(new Point(200, 200), new Point(-400, 100));

    const expectedTotalNumberOfPieces = 30;
    const expectedNumberOfPiecesInGroups = 9;
    const expectedNumberOfGroups = 3;
    expect(puzzle.pieces.length).toBe(
      expectedTotalNumberOfPieces - expectedNumberOfPiecesInGroups + expectedNumberOfGroups,
    );

    movePieceFromTo(new Point(-100, 0), new Point(-450, 0));

    const expectedNumberOfPiecesInNewGroup = 9;
    const expectedNumberOfNewGroup = 1;
    expect(puzzle.pieces.length).toBe(
      expectedTotalNumberOfPieces - expectedNumberOfPiecesInNewGroup + expectedNumberOfNewGroup,
    );

    const piece = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(-500, 0))!;
    expect(piece).toBeDefined();
    expect(piece.id).not.toBe(puzzle.pieces.itemIdOnTop);
    expect(piece.parentPieceId).toBe(puzzle.pieces.itemIdAtBottom);

    const expectedGroupSize = { width: 150, height: 150 };
    const group = puzzle.pieces.getItemById(piece.parentPieceId!)!;
    expect(group.position).toMatchObject(new Point(-500, 0));
    expect(group).toMatchObject(expectedGroupSize);
    expect(group.hasNestedPile()).toBe(true);
    expect(group.nestedPile!.length).toBe(expectedNumberOfPiecesInNewGroup);

    const expectingPieceIdsInGroupA = ["piece_0:100", "piece_0:0", "piece_0:200"];
    const expectingPieceIdsInGroupB = ["piece_100:100", "piece_100:0", "piece_100:200"];
    const expectingPieceIdsInGroupC = ["piece_200:100", "piece_200:0", "piece_200:200"];
    const expectingPieceIdsInGroup = new Array<(typeof expectingPieceIdsInGroupA)[number]>().concat(
      expectingPieceIdsInGroupB,
      expectingPieceIdsInGroupA,
      expectingPieceIdsInGroupC,
    );
    expect(group.nestedPile!.itemIdsInOrder).toIncludeAllMembers(expectingPieceIdsInGroup);

    const piecesIdsInGroup = expectingPieceIdsInGroup.slice(0, 2);
    const expectedPiecesIdsInRootPile = [`group_(${piecesIdsInGroup.join("__")})`];
    expect(puzzle.pieces.itemIdsInOrder).toIncludeAllMembers(expectedPiecesIdsInRootPile);

    const notExpectedPiecesIdsInRootPile = expectingPieceIdsInGroup;
    expect(puzzle.pieces.itemIdsInOrder).not.toIncludeAnyMembers(notExpectedPiecesIdsInRootPile);
  });
});

it("(don't connecting) group A of pieces with group B of pieces when NO suitable pieces of group A are inside connection activation areas of group B (0 contact sides)", () => {
  const puzzle = initPuzzle6x5WithScatteredPieces();

  const movePieceFromTo = (from: Point, to: Point) => movePieceFromPointToPointForPuzzle(puzzle, from, to);

  movePieceFromTo(new Point(0, 0), new Point(-500, 0));
  movePieceFromTo(new Point(0, 100), new Point(-500, 50));
  movePieceFromTo(new Point(0, 200), new Point(-500, 100));

  movePieceFromTo(new Point(100, 0), new Point(-100, 0));
  movePieceFromTo(new Point(100, 100), new Point(-100, 50));
  movePieceFromTo(new Point(100, 200), new Point(-100, 100));

  const expectedTotalNumberOfPieces = 30;
  const expectedNumberOfPiecesInGroups = 6;
  const expectedNumberOfGroups = 2;
  expect(puzzle.pieces.length).toBe(
    expectedTotalNumberOfPieces - expectedNumberOfPiecesInGroups + expectedNumberOfGroups,
  );

  movePieceFromTo(new Point(-100, 0), new Point(-110, 0));

  expect(puzzle.pieces.length).toBe(
    expectedTotalNumberOfPieces - expectedNumberOfPiecesInGroups + expectedNumberOfGroups,
  );

  const pieceInGroupA = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(-500, 0))!;
  expect(pieceInGroupA).toBeDefined();
  expect(pieceInGroupA.id).not.toBe(puzzle.pieces.itemIdOnTop);
  expect(pieceInGroupA.parentPieceId).not.toBe(puzzle.pieces.itemIdOnTop);

  const pieceInGroupB = puzzle.findPieceByPointingInsidePieceBoundaries(new Point(-110, 0))!;
  expect(pieceInGroupB).toBeDefined();
  expect(pieceInGroupB.id).not.toBe(puzzle.pieces.itemIdOnTop);
  expect(pieceInGroupB.parentPieceId).toBe(puzzle.pieces.getNextItem(puzzle.pieces.itemAtBottom!)!.id);

  const expectedGroupASize = { width: 50, height: 150 };
  const expectedGroupBSize = { width: 50, height: 150 };

  const groupA = puzzle.pieces.getItemById(pieceInGroupA.parentPieceId!)!;
  const groupB = puzzle.pieces.getItemById(pieceInGroupB.parentPieceId!)!;

  expect(groupA.position).toMatchObject(new Point(-500, 0));
  expect(groupA).toMatchObject(expectedGroupASize);
  expect(groupA.hasNestedPile()).toBe(true);
  expect(groupA.nestedPile!.length).toBe(3);

  expect(groupB.position).toMatchObject(new Point(-110, 0));
  expect(groupB).toMatchObject(expectedGroupBSize);
  expect(groupB.hasNestedPile()).toBe(true);
  expect(groupB.nestedPile!.length).toBe(3);

  const expectingPieceIdsInGroupA = ["piece_0:100", "piece_0:0", "piece_0:200"];
  const expectingPieceIdsInGroupB = ["piece_100:100", "piece_100:0", "piece_100:200"];

  expect(groupA.nestedPile!.itemIdsInOrder).toIncludeAllMembers(expectingPieceIdsInGroupA);
  expect(groupB.nestedPile!.itemIdsInOrder).toIncludeAllMembers(expectingPieceIdsInGroupB);

  const piecesIdsInGroupA = expectingPieceIdsInGroupA.slice(0, 2);
  const piecesIdsInGroupB = expectingPieceIdsInGroupB.slice(0, 2);

  const expectedPiecesIdsInRootPile = [
    `group_(${piecesIdsInGroupA.join("__")})`,
    `group_(${piecesIdsInGroupB.join("__")})`,
  ];
  expect(puzzle.pieces.itemIdsInOrder).toIncludeAllMembers(expectedPiecesIdsInRootPile);

  const notExpectedPiecesIdsInRootPile = new Array<(typeof expectingPieceIdsInGroupA)[number]>().concat(
    expectingPieceIdsInGroupB,
    expectingPieceIdsInGroupA,
  );
  expect(puzzle.pieces.itemIdsInOrder).not.toIncludeAnyMembers(notExpectedPiecesIdsInRootPile);
});

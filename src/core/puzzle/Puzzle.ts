import { getRandomIntWithinRange } from "../../utils/getRandomIntWithinRange";
import { getPRNG } from "../../utils/prng";
import { Area, getRandomPointWithinArea } from "./Area";
import type { BaseEntityOptions, Id } from "./BaseEntity";
import { BaseEntity, createInstanceWithOptions } from "./BaseEntity";
import type { Connection, NEIGHBOR_SIDE, Piece, PieceId, PieceOptions } from "./Piece";
import {
  NEIGHBOR_SIDES_COUNTERCLOCKWISE_ORDER,
  NEIGHBOR_SIDE_BOTTOM,
  NEIGHBOR_SIDE_LEFT,
  NEIGHBOR_SIDE_RIGHT,
  NEIGHBOR_SIDE_TOP,
  generatePieceId,
} from "./Piece";
import { PieceNeighborsMap, generateNeighborMapId } from "./PieceNeighborsMap";
import { Pile } from "./Pile";
import { Point } from "./Point";
import type { PositionDelta } from "./PositionDelta";

export type PiecePositionData = {
  id: string;
  position: {
    x: number;
    y: number;
  };
};

export const getScatteredPieceInitialPositionAsPositionMultipliedOn2 = (point: Point): Point => {
  const x = point.x * 2;
  const y = point.y * 2;

  return new Point(x, y);
};

let nestedPileIndex = 0;
export const generateNestedPileId = (): Id => {
  nestedPileIndex++;
  return `nested-pile_${nestedPileIndex}`;
};

export const generatePieceIdWithNestedPile = <WPiece extends Piece = Piece>(pieceA: WPiece, pieceB: WPiece): Id =>
  `group_(${pieceA.id}__${pieceB.id})`;

export type GetNewPositionFunc<GPiece extends Piece = Piece> = (piece: GPiece) => Point;

let puzzleIndex = 0;
export const generatePuzzleId = (): Id => {
  puzzleIndex++;
  return `puzzle_${puzzleIndex}`;
};

export interface TAdditionalPieceOptions {
  [key: string]: unknown;
}

export interface PuzzleOptions<TTPiece, TTPieceOptions> extends BaseEntityOptions {
  numberOfPiecesPerWidth: number;
  numberOfPiecesPerHeight: number;
  pieceSideSize: number;
  connectionActivationAreaSideSizeFractionFromPieceSideSize: number;
  pieceClass: new (args: TTPieceOptions) => TTPiece;
  getCustomInitialPiecePosition?: (point: Point) => Point;
  onDirty?: () => void;
  onPieceRelease?: (piecePositionData: PiecePositionData) => void;
  onGroupOfPiecesRelease?: (piecesPositionData: PiecePositionData[]) => void;
  onChangeProgress?: (progress: number) => void;
}

export class Puzzle<
  TPiece extends Piece = Piece,
  TPieceOptions extends PieceOptions = PieceOptions,
> extends BaseEntity {
  private _piecesPile = new Pile<TPiece, TPieceOptions>({
    id: "puzzle-root-piece-pile",
  });

  protected _numberOfPiecesPerWidth: number;
  protected _numberOfPiecesPerHeight: number;
  protected _pieceSideSize: number;
  protected _pieceConnectionActivationAreaSideSizeScaleFromPieceSideSize: number;

  private _pieceClass: new (args: TPieceOptions) => TPiece;
  protected _additionalPieceOptions: TAdditionalPieceOptions;

  private _isManualMovingPieces = false;
  private _wasTouched = false;
  private _onDirty?: () => void = undefined;
  private _onPieceRelease?: (piecePositionData: PiecePositionData) => void;
  private _onOnGroupOfPiecesRelease?: (piecesPositionData: PiecePositionData[]) => void;
  private _onChangeProgress?: (progress: number) => void;

  private _pieceNeighborsMap = new PieceNeighborsMap<TPiece>();

  private _activePiece?: TPiece;
  get activePiece(): TPiece | undefined {
    return this._activePiece;
  }

  private _totalAvailableConnections: number = 0;

  private _completenessProgress: number = 0;
  get completenessProgress(): number {
    return this._completenessProgress;
  }

  get prng() {
    return getPRNG(this.id);
  }

  get wasTouched() {
    return this._wasTouched;
  }
  private _markPuzzleWasTouched(): void {
    if (this._isManualMovingPieces) {
      return;
    }

    if (this._wasTouched) {
      return;
    }

    this._wasTouched = true;
    if (typeof this._onDirty === "function") {
      this._onDirty();
    }
  }

  get pieces() {
    return this._piecesPile;
  }

  get numberOfPiecesPerWidth() {
    return this._numberOfPiecesPerWidth;
  }

  get numberOfPiecesPerHeight() {
    return this._numberOfPiecesPerHeight;
  }

  get pieceSideSize() {
    return this._pieceSideSize;
  }

  get pieceTouchAreaSideSizeScaleFromPieceSideSize() {
    return this._pieceConnectionActivationAreaSideSizeScaleFromPieceSideSize;
  }

  private _width?: number;
  get width() {
    if (!this._width) this._width = this._pieceSideSize * this._numberOfPiecesPerHeight;

    return this._width;
  }

  private _height?: number;
  get height() {
    if (!this._height) {
      this._height = this._pieceSideSize * this._numberOfPiecesPerHeight;
    }
    return this._height;
  }

  constructor({
    id,
    numberOfPiecesPerWidth,
    numberOfPiecesPerHeight,
    pieceSideSize,
    connectionActivationAreaSideSizeFractionFromPieceSideSize,
    pieceClass,
    getCustomInitialPiecePosition,
    onDirty,
    onPieceRelease,
    onGroupOfPiecesRelease,
    onChangeProgress,
    ...restOptions
  }: PuzzleOptions<TPiece, TPieceOptions>) {
    super({ id });

    this._numberOfPiecesPerWidth = numberOfPiecesPerWidth;
    this._numberOfPiecesPerHeight = numberOfPiecesPerHeight;
    this._pieceSideSize = pieceSideSize;
    this._pieceConnectionActivationAreaSideSizeScaleFromPieceSideSize =
      connectionActivationAreaSideSizeFractionFromPieceSideSize;

    this._pieceClass = pieceClass;
    this._additionalPieceOptions = restOptions;

    this.generatePiecePile({
      getCustomInitialPiecePosition,
    });

    if (typeof onDirty === "function") {
      this._onDirty = onDirty;
    }

    if (typeof onPieceRelease === "function") {
      this._onPieceRelease = onPieceRelease;
    }

    if (typeof onGroupOfPiecesRelease === "function") {
      this._onOnGroupOfPiecesRelease = onGroupOfPiecesRelease;
    }

    if (typeof onChangeProgress === "function") {
      this._onChangeProgress = onChangeProgress;
    }
  }

  private _getRandomInitialPiecePositionWithinAreaFunction = (piecesDistributionArea?: Area): (() => Point) => {
    let area = piecesDistributionArea;
    if (!area) {
      area = Area.create({
        x: 0,
        y: 0,
        width: this.pieceSideSize * this._numberOfPiecesPerWidth,
        height: this.pieceSideSize * this._numberOfPiecesPerHeight,
      });
    }

    const minX = area.x;
    const maxX = area.x + area.width - this._pieceSideSize - 1;

    const minY = area.y;
    const maxY = area.y + area.height - this._pieceSideSize - 1;

    return () => {
      const x = getRandomIntWithinRange(minX, maxX, this.prng);
      const y = getRandomIntWithinRange(minY, maxY, this.prng);

      return new Point(x, y);
    };
  };

  generatePiecePile({
    getCustomInitialPiecePosition,
  }: {
    getCustomInitialPiecePosition?: (point: Point) => Point;
  }): void {
    const numberOfItemsPerWidth = this._numberOfPiecesPerWidth;
    const numberOfItemsPerHeight = this._numberOfPiecesPerHeight;
    const pieceSideSize = this._pieceSideSize;

    let getInitialPiecePosition: (((point: Point) => Point) | (() => Point)) | undefined = undefined;

    if (typeof getCustomInitialPiecePosition === "function") {
      getInitialPiecePosition = getCustomInitialPiecePosition;
    } else {
      getInitialPiecePosition = this._getRandomInitialPiecePositionWithinAreaFunction();
    }

    for (let verticalIndex = 0; verticalIndex < numberOfItemsPerHeight; verticalIndex++) {
      for (let horizontalIndex = 0; horizontalIndex < numberOfItemsPerWidth; horizontalIndex++) {
        const originalX = horizontalIndex * pieceSideSize;
        const originalY = verticalIndex * pieceSideSize;

        let x = originalX;
        let y = originalY;

        const initialPosition = getInitialPiecePosition(new Point(x, y));
        x = initialPosition.x;
        y = initialPosition.y;

        const width = pieceSideSize;
        const height = pieceSideSize;

        const pieceId = generatePieceId(
          x,
          y,
          horizontalIndex,
          verticalIndex,
          typeof getCustomInitialPiecePosition === "function",
        );

        const piece = this._createPieceInstance({
          id: pieceId,
          x,
          y,
          width,
          height,
          horizontalIndex,
          verticalIndex,
        });

        this._piecesPile.addPieceOnTheTop(piece, true);

        const neighborMapId = generateNeighborMapId(horizontalIndex, verticalIndex);
        this._pieceNeighborsMap.set(neighborMapId, {
          i: horizontalIndex,
          j: verticalIndex,
          piece,
        });
      }
    }

    let totalAvailableConnections = 0;
    this._pieceNeighborsMap.forEach(({ i, j, piece }) => {
      NEIGHBOR_SIDES_COUNTERCLOCKWISE_ORDER.forEach((side) => {
        const neighborPiece = this._getNeighborOnSide(i, j, side);

        if (neighborPiece) {
          piece.addNotConnectedNeighborBySide(side, neighborPiece);
          totalAvailableConnections = totalAvailableConnections + 1;
        }
      });
    });

    this._piecesPile.forEach((piece) => {
      piece.prepareConnectionTypes(this.prng);
    });

    this._totalAvailableConnections = totalAvailableConnections;
  }

  protected getAdditionalPieceOptions(_horizontalIndex?: number, _verticalIndex?: number): TAdditionalPieceOptions {
    return {
      ...this._additionalPieceOptions,
    };
  }

  protected _createPieceInstance({
    id,
    x,
    y,
    width,
    height,
    horizontalIndex,
    verticalIndex,
  }: {
    id: PieceId;
    x: number;
    y: number;
    width: number;
    height: number;
    horizontalIndex?: number;
    verticalIndex?: number;
  }): TPiece {
    const pieceClass = this._pieceClass;

    const position = new Point(x, y);
    const connectionActivationAreaSideSizeScaleFromPieceSideSize =
      this._pieceConnectionActivationAreaSideSizeScaleFromPieceSideSize;

    const additionalPieceOptions = this.getAdditionalPieceOptions(horizontalIndex, verticalIndex);

    const pieceOptions: TPieceOptions = {
      ...additionalPieceOptions,
      id,
      position,
      width,
      height,
      connectionActivationAreaSideSizeScaleFromPieceSideSize,
    } satisfies PieceOptions as TPieceOptions;
    const piece = createInstanceWithOptions(pieceClass, pieceOptions);

    return piece;
  }

  protected _getNeighborOnSide(i: number, j: number, side: NEIGHBOR_SIDE): TPiece | undefined {
    return this._getNeighborOnSideOfPiece(i, j, side, this._pieceNeighborsMap, this._piecesPile);
  }

  private _getNeighborOnSideOfPiece(
    originalI: number,
    originalJ: number,
    side: NEIGHBOR_SIDE,
    pieceNeighborsMap: PieceNeighborsMap<TPiece>,
    rootPiecesPile: Pile<TPiece, TPieceOptions>,
  ): TPiece | undefined {
    let i: number | undefined = undefined;
    let j: number | undefined = undefined;

    if (side === NEIGHBOR_SIDE_TOP) {
      i = originalI;
      j = originalJ - 1;
    } else if (side === NEIGHBOR_SIDE_RIGHT) {
      i = originalI + 1;
      j = originalJ;
    } else if (side === NEIGHBOR_SIDE_BOTTOM) {
      i = originalI;
      j = originalJ + 1;
    } else if (side === NEIGHBOR_SIDE_LEFT) {
      i = originalI - 1;
      j = originalJ;
    }

    if (typeof i !== "number" || typeof j !== "number" || !Number.isFinite(i) || !Number.isFinite(j)) {
      return undefined;
    }

    const neighborMapId = generateNeighborMapId(i, j);
    const neighborPieceId = pieceNeighborsMap.get(neighborMapId)?.piece?.id;
    if (!neighborPieceId) {
      return undefined;
    }

    return rootPiecesPile.getItemById(neighborPieceId);
  }

  spreadPieces(
    borderWidthToOutsideFromCompletedPuzzleSize: number = 0,
    spreadFunction?: GetNewPositionFunc<TPiece>,
  ): void | never {
    if (this.wasTouched) {
      throw new Error("Error. Impossible to spread pieces because the puzzle was touched");
    }

    const completedPuzzleWidth = this.numberOfPiecesPerWidth * this.pieceSideSize;
    const completedPuzzleHeight = this.numberOfPiecesPerHeight * this.pieceSideSize;

    const spreadAreaWidth = completedPuzzleWidth + borderWidthToOutsideFromCompletedPuzzleSize;
    const spreadAreaHeight = completedPuzzleHeight + borderWidthToOutsideFromCompletedPuzzleSize;

    const spreadArea = new Area(0, 0, spreadAreaWidth, spreadAreaHeight, "puzzle-pieces-spread-area");

    this._setPositionForPiecesInArea(spreadArea, spreadFunction);
  }

  private _setPositionForPiecesInArea(spreadArea: Area, getNewPositionFunc?: GetNewPositionFunc<TPiece>) {
    const areaReducesByPieceSizeInTheRightestColumnAndBottomRow = new Area(
      spreadArea.x,
      spreadArea.y,
      spreadArea.width - this.pieceSideSize,
      spreadArea.height - this.pieceSideSize,
    );

    let getNewPosition: GetNewPositionFunc<TPiece> = () =>
      getRandomPointWithinArea(areaReducesByPieceSizeInTheRightestColumnAndBottomRow);

    if (typeof getNewPositionFunc === "function") {
      getNewPosition = getNewPositionFunc;
    }

    this._piecesPile.forEach((piece) => {
      const newPiecePosition = getNewPosition(piece);
      piece.setPosition(newPiecePosition);
    });
  }

  private isPointInsidePieceBoundaries(point: Point, piece: TPiece): boolean {
    const { p0: piecePointP0, p2: piecePointP2 } = piece.getBoundaryCornerPoints();

    return Point.isPointInAreaByCornerPoints(point, piecePointP0, piecePointP2);
  }

  /**
   * Return two points {p0, p2}, where
   *
   * p0 - position of the top left corner of the rectangle contains all pieces
   *
   * p2 - position of the bottom right corner of the rectangle contains all pieces
   *
   * @returns { p0: Point; p2: Point; }
   */
  getBoundaryCornerPointsOfPiecesSpreadArea(): { p0: Point; p2: Point } {
    const pieceOnTop = this._piecesPile.itemOnTop;
    if (!pieceOnTop) {
      throw new Error("Error. Puzzle should has at least one piece");
    }

    const { p0: pieceOnTopP0, p2: pieceOnTopP2 } = pieceOnTop.getBoundaryCornerPoints();

    const theMostTopLeftPointOfBoundary = pieceOnTopP0;
    const theMostBottomRightPointOfBoundary = pieceOnTopP2;

    this._piecesPile.forEach((piece) => {
      const { p0, p2 } = piece.getBoundaryCornerPoints();

      if (p0.x < theMostTopLeftPointOfBoundary.x) {
        theMostTopLeftPointOfBoundary.x = p0.x;
      }
      if (p0.y < theMostTopLeftPointOfBoundary.y) {
        theMostTopLeftPointOfBoundary.y = p0.y;
      }

      if (p2.x > theMostBottomRightPointOfBoundary.x) {
        theMostBottomRightPointOfBoundary.x = p2.x;
      }
      if (p2.y > theMostBottomRightPointOfBoundary.y) {
        theMostBottomRightPointOfBoundary.y = p2.y;
      }
    });

    return {
      p0: theMostTopLeftPointOfBoundary,
      p2: theMostBottomRightPointOfBoundary,
    };
  }

  findPieceOrGroupOfPiecesByPointingInsidePieceBoundaries(point: Point): TPiece | undefined {
    const pieceWithPointInside = this._piecesPile.findFromTopToBottom((pieceInRootPile) => {
      if (pieceInRootPile.nestedPile?.length) {
        const pieceInNestedPileWithPointInside = pieceInRootPile.nestedPile.findFromTopToBottom((pieceInNestedPile) =>
          this.isPointInsidePieceBoundaries(point, pieceInNestedPile),
        );

        return Boolean(pieceInNestedPileWithPointInside);
      }

      return this.isPointInsidePieceBoundaries(point, pieceInRootPile);
    });

    if (!pieceWithPointInside) {
      return undefined;
    }

    if (pieceWithPointInside.parentPieceId) {
      return this._piecesPile.getItemById(pieceWithPointInside.parentPieceId);
    }

    return pieceWithPointInside;
  }

  findPieceByPointingInsidePieceBoundaries(point: Point): TPiece | undefined {
    let pieceWithPointInside: TPiece | undefined = undefined;

    this._piecesPile.findFromTopToBottom((pieceInRootPile) => {
      if (pieceInRootPile.nestedPile?.length) {
        const pieceInNestedPileWithPointInside = pieceInRootPile.nestedPile.findFromTopToBottom((pieceInNestedPile) => {
          const result = this.isPointInsidePieceBoundaries(point, pieceInNestedPile);

          return result;
        });

        if (pieceInNestedPileWithPointInside) {
          pieceWithPointInside = pieceInNestedPileWithPointInside;

          return true;
        }

        return false;
      }

      if (this.isPointInsidePieceBoundaries(point, pieceInRootPile)) {
        pieceWithPointInside = pieceInRootPile;

        return true;
      }

      return false;
    });

    return pieceWithPointInside;
  }

  private _connectSuitablePieces(availableConnections: Connection<TPiece>[]) {
    availableConnections.forEach(({ piece, side, neighborPiece }) => {
      this._attractNotConnectedNeighborPieceByMovingItToActivePiece(piece, side, neighborPiece);
      this._groupItems(piece, neighborPiece);
    });
  }

  private _getAvailableToConnectPiecesForPiece(activePiece: TPiece): Connection<TPiece>[] {
    let availableConnections: Connection<TPiece>[] = [];

    if (!activePiece.parentPieceId) {
      availableConnections = activePiece.getAvailableToConnectNeighbors();
    } else {
      const parentPiece = this.pieces.getItemById(activePiece.parentPieceId);
      if (!parentPiece) {
        throw new Error("Error. Piece that was get by parentPieceId should in the root pile");
      }

      if (!parentPiece.nestedPile?.length) {
        throw new Error("Error. Piece that was get by parentPieceId should has nestedPile");
      }

      parentPiece.nestedPile.forEach((nestedPiece) => {
        const additionalAvailableToConnectNeighbors = nestedPiece.getAvailableToConnectNeighbors();

        availableConnections = availableConnections.concat(additionalAvailableToConnectNeighbors);
      });

      availableConnections = Array.from(new Set(availableConnections));
    }

    return availableConnections;
  }

  private _attractNotConnectedNeighborPieceByMovingItToActivePiece(
    activePiece: TPiece,
    side: NEIGHBOR_SIDE,
    notConnectedPiece: TPiece,
  ): void {
    const positionDelta = notConnectedPiece.getPositionDeltaToMoveOnConnectionPositionOfNeighborPiece(
      activePiece,
      side,
    );

    if (positionDelta.dx === 0 && positionDelta.dy === 0) {
      return;
    }

    notConnectedPiece.moveOnPositionDeltaOrMoveParentPieceIfItExists(positionDelta);
  }

  private _calculateCompletenessProgress() {
    let activeConnections = 0;

    this.pieces.forEach((piece) => {
      if (!piece.nestedPile?.length) {
        return;
      }

      piece.nestedPile.forEach((nestedPiece) => {
        activeConnections = activeConnections + nestedPiece.connectedNeighborsIds.size;
      });
    });

    this._completenessProgress = Math.round((activeConnections / this._totalAvailableConnections) * 100);
    if (this._onChangeProgress) {
      this._onChangeProgress(this._completenessProgress);
    }
  }

  selectActivePiece(piece: TPiece): void {
    if (!piece) {
      throw new Error("Error. Parameter piece is not defined");
    }

    if (!piece?.id) {
      throw new Error("Error. Piece should has id attribute to be able be added to the pile");
    }

    this.unselectActivePiece();

    this._markPuzzleWasTouched();
    this._activePiece = piece;
    if (!piece.parentPieceId) {
      this._piecesPile.moveToTop(this._activePiece);
      return;
    }

    const parentPiece = this.pieces.getItemById(piece.parentPieceId);
    if (!parentPiece) {
      throw new Error("Error. Parent piece not found in the root pile, but parameter piece has parentPieceId");
    }

    this._piecesPile.moveToTop(parentPiece);
  }

  unselectActivePiece() {
    if (!this._activePiece) {
      return;
    }

    const activePiece = this._activePiece;
    this._unselectPiece();
    this._tryToConnect(activePiece);
    this._calculateCompletenessProgress();
    this._afterPieceRelease(activePiece);
  }

  private _afterPieceRelease(activePiece: TPiece) {
    if (this._onPieceRelease) {
      if (activePiece.parentPieceId) {
        if (this._onOnGroupOfPiecesRelease) {
          const parentPiece = this._piecesPile.getItemById(activePiece.parentPieceId);
          if (!parentPiece) {
            throw new Error("Error. Active piece should has id of parent group in puzzle pile of pieces");
          }

          const piecesInGroup = parentPiece.nestedPile!;
          const piecesDataInGroup: PiecePositionData[] = [];
          piecesInGroup.forEach((pieceInGroup) => {
            const pieceWorldPosition = pieceInGroup.getWorldPosition();
            piecesDataInGroup.push({
              id: pieceInGroup.id,
              position: {
                x: pieceWorldPosition.x,
                y: pieceWorldPosition.y,
              },
            });
          });

          this._onOnGroupOfPiecesRelease(piecesDataInGroup);
        }
      } else {
        this._onPieceRelease({
          id: activePiece.id,
          position: {
            x: activePiece.position.x,
            y: activePiece.position.y,
          },
        });
      }
    }
  }

  private _tryToConnect(activePiece: TPiece) {
    const availableConnections = this._getAvailableToConnectPiecesForPiece(activePiece);

    if (!availableConnections.length) {
      if (!activePiece.parentPieceId) {
        return;
      }

      const parentPiece = this._piecesPile.getItemById(activePiece.parentPieceId);
      if (!parentPiece) {
        throw new Error("Error. Active piece should has id of parent group in puzzle pile of pieces");
      }

      this._piecesPile.cutItemFromItemIdsInOrder(parentPiece);
      this._piecesPile.addGroupInTheMiddleByGroupSize(parentPiece);

      return;
    }

    this._connectSuitablePieces(availableConnections);
  }

  movePiecesToManualInitialPositions(initialPiecesPositions: PiecePositionData[] = []): void {
    this._isManualMovingPieces = true;

    for (let i = 0; i < initialPiecesPositions.length; i++) {
      const movedPiece = initialPiecesPositions[i];
      const movedPieceId = movedPiece.id;

      const piece = this.pieces.find(({ id }) => id === movedPieceId);
      if (!piece) {
        continue;
      }

      this.selectActivePiece(piece);
      const positionDelta: PositionDelta = {
        dx: movedPiece.position.x - piece.position.x,
        dy: movedPiece.position.y - piece.position.y,
      };
      this.moveActivePiece(positionDelta);
      this.unselectActivePiece();
    }

    this._isManualMovingPieces = false;
    this._calculateCompletenessProgress();
  }

  private _unselectPiece(): void {
    this._markPuzzleWasTouched();
    this._activePiece = undefined;
  }

  moveActivePiece(positionDelta: PositionDelta): void {
    this._markPuzzleWasTouched();

    const piece = this._activePiece;
    if (!piece) {
      console.error("Warning. Puzzle core has no activePiece. Are you trying move piece that is not active any more");
      return;
    }

    if (!piece?.position) {
      throw new Error("Error. Active piece of puzzle should has initial position");
    }
    if (!piece.parentPieceId) {
      piece.moveOnPositionDelta(positionDelta);
      return;
    }

    const parentPiece = this.pieces.getItemById(piece.parentPieceId);
    if (!parentPiece) {
      throw new Error("Error. Parent piece not found in the root pile, but parameter piece has parentPieceId");
    }
    parentPiece.moveOnPositionDelta(positionDelta);
  }

  private _connectTwoGroups(pieceA: TPiece, pieceB: TPiece): TPiece {
    if (!pieceA.parentPieceId) {
      throw new Error("Error. Parameter pieceA should be a group");
    }

    if (!pieceB.parentPieceId) {
      throw new Error("Error. Parameter pieceB should be a group");
    }

    const rootPile = this._piecesPile;

    const parentPieceA = rootPile.getItemById(pieceA.parentPieceId);
    if (!parentPieceA) {
      throw new Error("Error. Parameter pieceA.parentPieceId should has id of parent group in pile");
    }
    const containingPieceAPile = parentPieceA.nestedPile;
    if (!containingPieceAPile?.length) {
      throw new Error("Error. Pile of parent piece for pieceA can not be empty");
    }

    const parentPieceB = rootPile.getItemById(pieceB.parentPieceId);
    if (!parentPieceB) {
      throw new Error("Error. Parameter pieceB.parentPieceId should has id of parent group in pile");
    }
    const containingPieceBPile = parentPieceB.nestedPile;
    if (!containingPieceBPile?.length) {
      throw new Error("Error. Pile of parent piece for pieceB can not be empty");
    }

    rootPile.cutItemFromItemIdsInOrder(parentPieceA);
    rootPile.cutItemFromItemIdsInOrder(parentPieceB);

    containingPieceBPile.forEach((nestedPiece) => {
      containingPieceAPile.addPieceOnTheTop(nestedPiece);
      nestedPiece.setParentPieceId(parentPieceA.id);

      const newPositionOfNestedPieceInParentPieceB = Point.create({
        x: nestedPiece.position.x + parentPieceB.position.x - parentPieceA.position.x,
        y: nestedPiece.position.y + parentPieceB.position.y - parentPieceA.position.y,
      });
      nestedPiece.setPosition(newPositionOfNestedPieceInParentPieceB);
    });

    containingPieceBPile.forEach((nestedPiece) => {
      nestedPiece.markNeighborAsConnected(containingPieceAPile);
    });

    rootPile.removeItem(parentPieceB);

    rootPile.addGroupInTheMiddleByGroupSize(parentPieceA);

    parentPieceA.recomputePositionAndSize();

    return pieceA;
  }

  private _connectGroupWithPiece(pieceA: TPiece, pieceB: TPiece): TPiece {
    if (!pieceA.parentPieceId) {
      throw new Error("Error. Parameter pieceA should be a part of a group");
    }

    if (pieceB.parentPieceId) {
      throw new Error("Error. Parameter pieceB should not be a part of a group");
    }

    const rootPile = this._piecesPile;

    const parentPiece = rootPile.getItemById(pieceA.parentPieceId);
    if (!parentPiece) {
      throw new Error("Error. Parameter pieceA.parentPieceId should has id of parent group in pile");
    }

    const containingPieceAPile = parentPiece.nestedPile;
    if (!containingPieceAPile?.length) {
      throw new Error("Error. Pile of parent piece for pieceA can not be empty");
    }

    rootPile.cutItemFromItemIdsInOrder(parentPiece);
    rootPile.cutItemFromItemIdsInOrder(pieceB);

    const newPositionOfNestedPieceB = Point.create({
      x: pieceB.position.x - parentPiece.position.x,
      y: pieceB.position.y - parentPiece.position.y,
    });
    pieceB.setPosition(newPositionOfNestedPieceB);

    containingPieceAPile.addPieceOnTheTop(pieceB);
    pieceB.setParentPieceId(parentPiece.id);

    pieceA.markNeighborAsConnected(containingPieceAPile);
    pieceB.markNeighborAsConnected(containingPieceAPile);

    rootPile.addGroupInTheMiddleByGroupSize(parentPiece);

    parentPiece.recomputePositionAndSize();

    return pieceA;
  }

  private _connectPieceWithPiece(pieceA: TPiece, pieceB: TPiece): TPiece {
    if (pieceA.parentPieceId) {
      throw new Error("Error. Parameter pieceA should not be a part of a group");
    }

    if (pieceB.parentPieceId) {
      throw new Error("Error. Parameter pieceB should not be a part of a group");
    }

    const rootPile = this._piecesPile;

    rootPile.cutItemFromItemIdsInOrder(pieceA);
    rootPile.cutItemFromItemIdsInOrder(pieceB);

    const x = 0;
    const y = 0;

    const width = 0;
    const height = 0;

    const pieceId = generatePieceIdWithNestedPile(pieceA, pieceB);

    const pieceWithNestedPile = this._createPieceInstance({
      id: pieceId,
      x,
      y,
      width,
      height,
    });

    const nestedPileId = generateNestedPileId();
    const nestedPile = new Pile<TPiece, TPieceOptions>({ id: nestedPileId });

    const aX = pieceA.position.x;
    const aY = pieceA.position.y;

    const bX = pieceB.position.x;
    const bY = pieceB.position.y;

    const p0 = Point.create({
      x: aX < bX ? aX : bX,
      y: aY < bY ? aY : bY,
    });

    const newPositionOfNestedPieceA = Point.create({
      x: aX - p0.x,
      y: aY - p0.y,
    });
    pieceA.setPosition(newPositionOfNestedPieceA);

    const newPositionOfNestedPieceB = Point.create({
      x: bX - p0.x,
      y: bY - p0.y,
    });
    pieceB.setPosition(newPositionOfNestedPieceB);

    pieceWithNestedPile.setPosition(p0);

    nestedPile.addPieceOnTheTop(pieceA);
    pieceA.setParentPieceId(pieceWithNestedPile.id);

    nestedPile.addPieceOnTheTop(pieceB);
    pieceB.setParentPieceId(pieceWithNestedPile.id);

    pieceWithNestedPile.setNestedPile(nestedPile);

    pieceA.markNeighborAsConnected(nestedPile);
    pieceB.markNeighborAsConnected(nestedPile);

    rootPile.addGroupInTheMiddleByGroupSize(pieceWithNestedPile);

    pieceWithNestedPile.recomputePositionAndSize();
    return pieceA;
  }

  private _groupItems(pieceA: TPiece, pieceB: TPiece): void {
    this._markPuzzleWasTouched();

    let pieceInGroup: TPiece | undefined;

    if (pieceA.parentPieceId && pieceB.parentPieceId) {
      if (pieceA.parentPieceId !== pieceB.parentPieceId) {
        const availableConnections: Connection<TPiece>[] = pieceA.getAvailableToConnectNeighbors();

        const connection = availableConnections.find(({ neighborPiece }) => neighborPiece.id === pieceB.id);

        if (connection) {
          pieceInGroup = this._connectTwoGroups(pieceA, pieceB);
        }
      }
    } else if (pieceA.parentPieceId) {
      pieceInGroup = this._connectGroupWithPiece(pieceA, pieceB);
    } else if (pieceB.parentPieceId) {
      pieceInGroup = this._connectGroupWithPiece(pieceB, pieceA);
    } else {
      pieceInGroup = this._connectPieceWithPiece(pieceA, pieceB);
    }

    if (pieceInGroup) {
      this._markNeighborsAsConnectedForPiecesInTheSamePile(pieceInGroup);
    }
  }

  private _markNeighborsAsConnectedForPiecesInTheSamePile(pieceInGroup: TPiece): void {
    if (!pieceInGroup.parentPieceId) {
      throw new Error("Error. Parameter piece should be a part of a group");
    }

    const rootPile = this._piecesPile;
    const parentPiece = rootPile.getItemById(pieceInGroup.parentPieceId);
    if (!parentPiece) {
      throw new Error("Error. Parameter pieceInGroup.parentPieceId should has id of parent group in pile");
    }

    const containingPiecePile = parentPiece.nestedPile;
    if (!containingPiecePile?.length) {
      throw new Error("Error. Pile of parent piece for pieceInGroup can not be empty");
    }

    containingPiecePile.forEach((pieceInGroup) => {
      pieceInGroup.markNeighborAsConnected(containingPiecePile);
    });
  }
}

import type seedrandom from "seedrandom";
import { getOppositeSideName } from "../../models/SideName";
import type { ConnectionType } from "../../utils-path/SideIndex";
import { CONNECTION_TYPE_NONE } from "../../utils-path/SideIndex";
import { generateConnectionType } from "../../utils-path/generateConnectionType";
import { getOppositeOfConnectionType } from "../../utils-path/getOppositeOfConnectionType";
import { uuid } from "../../utils/uuid";
import type { BaseEntityOptions, Id } from "./BaseEntity";
import { Item } from "./Item";
import type { Pile } from "./Pile";
import { Point } from "./Point";
import { PositionDelta } from "./PositionDelta";

export type SidesConnectionTypesAsString = string;

export type PieceId = Id;

export const NEIGHBOR_SIDE_TOP = "top" as const;
export const NEIGHBOR_SIDE_RIGHT = "right" as const;
export const NEIGHBOR_SIDE_BOTTOM = "bottom" as const;
export const NEIGHBOR_SIDE_LEFT = "left" as const;

export type NEIGHBOR_SIDE =
  | typeof NEIGHBOR_SIDE_TOP
  | typeof NEIGHBOR_SIDE_RIGHT
  | typeof NEIGHBOR_SIDE_BOTTOM
  | typeof NEIGHBOR_SIDE_LEFT;

export const NEIGHBOR_SIDES_CLOCKWISE_ORDER: NEIGHBOR_SIDE[] = [
  NEIGHBOR_SIDE_TOP,
  NEIGHBOR_SIDE_RIGHT,
  NEIGHBOR_SIDE_BOTTOM,
  NEIGHBOR_SIDE_LEFT,
];

export const NEIGHBOR_SIDES_COUNTERCLOCKWISE_ORDER: NEIGHBOR_SIDE[] = [
  NEIGHBOR_SIDE_LEFT,
  NEIGHBOR_SIDE_BOTTOM,
  NEIGHBOR_SIDE_RIGHT,
  NEIGHBOR_SIDE_TOP,
];

export type Connection<TPiece extends Piece = Piece> = {
  piece: TPiece;
  side: NEIGHBOR_SIDE;
  neighborPiece: TPiece;
};

export const TOTAL_NUMBER_OF_PIECE_SIDES = NEIGHBOR_SIDES_CLOCKWISE_ORDER.length;

export const getSideNameBySideIndex = (
  sideIndex: number,
  totalNumberOfSides: number,
  isCounterclockwise = false,
): NEIGHBOR_SIDE => {
  if (sideIndex < 0 || sideIndex > totalNumberOfSides) {
    throw new Error("Error. Incorrect side index");
  }

  if (isCounterclockwise) {
    return NEIGHBOR_SIDES_COUNTERCLOCKWISE_ORDER[sideIndex];
  }

  return NEIGHBOR_SIDES_CLOCKWISE_ORDER[sideIndex];
};

export interface PieceCreation {
  id?: PieceId;
  x: number;
  y: number;
  width: number;
  height: number;
  connectionActivationAreaSideSizeScaleFromPieceSideSize: number;
}

export const generatePieceId = (
  x?: number,
  y?: number,
  horizontalIndex?: number,
  verticalIndex?: number,
  usePositionForIdGeneration = false,
): PieceId => {
  let appendix: string;

  if (usePositionForIdGeneration && typeof x !== "undefined" && typeof y !== "undefined" && !isNaN(x) && !isNaN(y)) {
    appendix = `${x}:${y}`;
  } else if (
    typeof horizontalIndex !== "undefined" &&
    typeof verticalIndex !== "undefined" &&
    !isNaN(horizontalIndex) &&
    !isNaN(verticalIndex)
  ) {
    appendix = `${horizontalIndex}:${verticalIndex}`;
  } else {
    appendix = uuid();
  }

  return `piece_${appendix}`;
};

export const createPiece = ({
  id,
  x,
  y,
  width,
  height,
  connectionActivationAreaSideSizeScaleFromPieceSideSize,
}: PieceCreation): Piece => {
  let instanceId = id;
  if (!instanceId) {
    instanceId = generatePieceId(x, y);
  }

  const position = new Point(x, y);

  return new Piece({
    id: instanceId,
    position,
    width,
    height,
    connectionActivationAreaSideSizeScaleFromPieceSideSize,
  });
};

export interface PieceOptions extends BaseEntityOptions {
  position: Point;
  width: number;
  height: number;
  connectionActivationAreaSideSizeScaleFromPieceSideSize: number;
}

class Piece<ExtendedPiece extends Item = Item, ExtendedPieceOptions extends PieceOptions = PieceOptions> extends Item<
  ExtendedPiece,
  ExtendedPieceOptions
> {
  private _position: Point = new Point(0, 0);

  private _width: number = 0;
  private _height: number = 0;

  private _notConnectedNeighborsIds = new Map<NEIGHBOR_SIDE, PieceId>();
  private _connectedNeighborsIds = new Map<NEIGHBOR_SIDE, PieceId>();

  private _connectionActivationAreaSideSizeScaleFromPieceSideSize = 0.1;

  protected _sidesConnectionTypes = new Map<NEIGHBOR_SIDE, ConnectionType>();

  get sidesConnectionTypes() {
    return this._sidesConnectionTypes;
  }

  get sidesConnectionTypesAsString(): SidesConnectionTypesAsString {
    let connectionTypesPerSidesString = "";

    this._sidesConnectionTypes.forEach((connectionType, neighborSide) => {
      connectionTypesPerSidesString += `${neighborSide}:${connectionType}`;

      connectionTypesPerSidesString += `;`;
    });

    return connectionTypesPerSidesString;
  }

  constructor({
    position,
    width,
    height,
    connectionActivationAreaSideSizeScaleFromPieceSideSize,
    ...restOptions
  }: PieceOptions) {
    super(restOptions);

    this._position = position;
    this._width = width;
    this._height = height;

    this._connectionActivationAreaSideSizeScaleFromPieceSideSize =
      connectionActivationAreaSideSizeScaleFromPieceSideSize;
  }

  static create = createPiece;

  getItemById?: (pieceId: PieceId) => this | undefined = (_pieceId: PieceId) => undefined;

  getItemByIdFromRootPile?: (pieceId: PieceId) => this | undefined = (_pieceId: PieceId) => undefined;

  private _getPieceByIdFromRootPile(pieceId: PieceId): this | undefined {
    if (typeof this.getItemByIdFromRootPile !== "function") {
      throw new Error("Error. Piece should has defined method getPieceByIdFromRootPile");
    }

    return this.getItemByIdFromRootPile(pieceId);
  }

  private _getParentPiece(): this | undefined {
    if (!this.parentPieceId) {
      return undefined;
    }

    if (typeof this.getItemByIdFromRootPile !== "function") {
      throw new Error(
        "Error. Piece has not defined method getPieceById, but has attribute parentPieceId. Should has both defined",
      );
    }

    const parentPiece = this.getItemByIdFromRootPile(this.parentPieceId);
    if (!parentPiece) {
      throw new Error("Error. Piece that was get by parentPieceId should in the root pile");
    }

    return parentPiece;
  }

  prepareConnectionTypes(puzzlePRNG: seedrandom.PRNG) {
    NEIGHBOR_SIDES_CLOCKWISE_ORDER.forEach((sideName) => {
      if (!this.notConnectedNeighborsIds.has(sideName)) {
        this._sidesConnectionTypes.set(sideName, CONNECTION_TYPE_NONE);
        return;
      }

      const oppositeSideConnectionType = this._getOppositeSideConnectionType(sideName);

      let connectionType;
      if (oppositeSideConnectionType) {
        connectionType = getOppositeOfConnectionType(oppositeSideConnectionType);
      } else {
        connectionType = generateConnectionType(puzzlePRNG);
      }

      this._sidesConnectionTypes.set(sideName, connectionType);
    });
  }

  private _getOppositeSideConnectionType(sideName: NEIGHBOR_SIDE): ConnectionType | undefined {
    const neighborIdOnSide = this.notConnectedNeighborsIds.get(sideName);
    if (!neighborIdOnSide) {
      return undefined;
    }

    if (typeof this.getItemByIdFromRootPile !== "function") {
      throw new Error("Error. Impossible to get piece by id from the root pile");
    }

    const neighborOnSide = this.getItemByIdFromRootPile(neighborIdOnSide);
    if (!neighborOnSide) {
      return undefined;
    }

    const oppositeSideName = getOppositeSideName(sideName);

    return neighborOnSide.sidesConnectionTypes.get(oppositeSideName);
  }

  get position() {
    return this._position;
  }
  setPosition(position: Point) {
    this._position = position;
  }
  getWorldPosition(): Point {
    if (!this.parentPieceId) {
      return Point.clone(this._position);
    }

    const parentPiece = this._getParentPiece();
    if (!parentPiece) {
      throw new Error("Error. Piece that was get by parentPieceId should in the root pile");
    }

    const relativeToParentX = parentPiece.getWorldPosition().x + this._position.x;
    const relativeToParentY = parentPiece.getWorldPosition().y + this._position.y;

    return new Point(relativeToParentX, relativeToParentY);
  }

  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get size() {
    return {
      width: this._width,
      height: this._height,
    };
  }
  setSize(width: number, height: number) {
    this._width = width;
    this._height = height;
  }

  get notConnectedNeighborsIds() {
    return this._notConnectedNeighborsIds;
  }
  get connectedNeighborsIds() {
    return this._connectedNeighborsIds;
  }
  get connectionActivationAreaSideSizeScaleFromPieceSideSize() {
    return this._connectionActivationAreaSideSizeScaleFromPieceSideSize;
  }

  /**
   * Return two points {p0, p2}, where
   *
   * p0 - position of the top left corner of the piece relative to parent coordinates
   *
   * p2 - position of the bottom right corner of the piece relative to parent coordinates
   *
   * @returns { p0: Point; p2: Point; }
   */
  getBoundaryCornerPoints(): { p0: Point; p2: Point } {
    const p0 = new Point(this.getWorldPosition().x, this.getWorldPosition().y);

    const p2 = new Point(p0.x + this._width - 1, p0.y + this._height - 1);

    return { p0, p2 };
  }

  getCenterPointPosition(): Point {
    const { x, y } = this.getWorldPosition();
    const { width, height } = this.size;
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    return Point.create({ x: centerX, y: centerY });
  }

  moveOnPositionDelta(positionDelta: PositionDelta): void {
    const newPosition = Point.addDelta(this.position, positionDelta);
    this.setPosition(newPosition);
  }

  moveOnPositionDeltaOrMoveParentPieceIfItExists(positionDelta: PositionDelta): void {
    if (!this.parentPieceId) {
      this.moveOnPositionDelta(positionDelta);
      return;
    }

    const parentPiece = this._getParentPiece();
    if (!parentPiece) {
      throw new Error("Error. Piece that was get by parentPieceId should in the root pile");
    }

    parentPiece.moveOnPositionDeltaOrMoveParentPieceIfItExists(positionDelta);
  }

  getPositionDeltaToMoveOnConnectionPositionOfNeighborPiece(neightborPiece: Piece, side: NEIGHBOR_SIDE): PositionDelta {
    const sideNameOfNotConnectedNeighbor = neightborPiece._getNotConnectedNeighborSideNameByPieceId(this.id);
    if (!sideNameOfNotConnectedNeighbor) {
      const sideNameOfConnectedNeighbor = neightborPiece._getConnectedNeighborSideNameByPieceId(this.id);

      if (sideNameOfConnectedNeighbor) {
        return PositionDelta.zeroDelta();
      }

      throw new Error("Error. Impossible to get a neighbor name of the side for the neightbor Piece");
    }

    const positionInConnectedState = neightborPiece._getNotConnectedNeighborPositionBySideNameInConnectedState(side);
    if (!positionInConnectedState) {
      throw new Error(
        "Error. Impossible to get a position of this piece in the connected state. Is this piece already connected?",
      );
    }

    const dx = positionInConnectedState.x - this.getWorldPosition().x;
    const dy = positionInConnectedState.y - this.getWorldPosition().y;

    return new PositionDelta(dx, dy);
  }

  private _getNeighborSideNameByPieceId(
    pieceId: PieceId,
    neighborIds: Map<NEIGHBOR_SIDE, PieceId>,
  ): NEIGHBOR_SIDE | undefined {
    let side = undefined;
    neighborIds.forEach((neighborPieceId, neighborSideName) => {
      if (pieceId === neighborPieceId) {
        side = neighborSideName;
      }
    });

    return side;
  }

  private _getConnectedNeighborSideNameByPieceId(pieceId: PieceId): NEIGHBOR_SIDE | undefined {
    return this._getNeighborSideNameByPieceId(pieceId, this._connectedNeighborsIds);
  }

  private _getNotConnectedNeighborSideNameByPieceId(pieceId: PieceId): NEIGHBOR_SIDE | undefined {
    return this._getNeighborSideNameByPieceId(pieceId, this._notConnectedNeighborsIds);
  }

  private _getNotConnectedNeighborPositionBySideNameInConnectedState(side: NEIGHBOR_SIDE): Point | undefined {
    return this._getNeighborConnectionActivationAreaCenterPositionBySide(side);
  }

  getAvailableToConnectNeighbors(): Connection<this>[] {
    const connectionActivationAreaWidth = this._connectionActivationAreaSideSizeScaleFromPieceSideSize * this.width;

    const availableToConnectNeighbors: Connection<this>[] = [];

    this._notConnectedNeighborsIds.forEach((neighborId, side) => {
      const neighbor = this._getPieceByIdFromRootPile(neighborId);
      if (!neighbor) {
        throw new Error(`Error. Neighbor piece with id: ${neighborId} should be in a pile`);
      }

      const connectionActivationAreaCenterPosition =
        this._getNeighborConnectionActivationAreaCenterPositionBySide(side);

      if (!connectionActivationAreaCenterPosition) {
        return;
      }

      const isNeighborInsideConnectionActivationArea = Point.isPointInAreaWithCenterPointAndAreaSideSize(
        neighbor.getWorldPosition(),
        connectionActivationAreaCenterPosition,
        connectionActivationAreaWidth,
      );

      if (!isNeighborInsideConnectionActivationArea) {
        return;
      }

      availableToConnectNeighbors.push({
        piece: this,
        side,
        neighborPiece: neighbor,
      });
    });

    return availableToConnectNeighbors;
  }

  private _getNeighborConnectionActivationAreaCenterPositionBySide(side: NEIGHBOR_SIDE): Point | undefined {
    if (!this._notConnectedNeighborsIds.has(side)) {
      return undefined;
    }

    const position = this.getWorldPosition();

    if (side === NEIGHBOR_SIDE_TOP) {
      return new Point(position.x, position.y - this.height);
    } else if (side === NEIGHBOR_SIDE_RIGHT) {
      return new Point(position.x + this.width, position.y);
    } else if (side === NEIGHBOR_SIDE_BOTTOM) {
      return new Point(position.x, position.y + this.height);
    } else if (side === NEIGHBOR_SIDE_LEFT) {
      return new Point(position.x - this.width, position.y);
    }

    return undefined;
  }

  addNotConnectedNeighborBySide(side: NEIGHBOR_SIDE, neighbor: this) {
    this._notConnectedNeighborsIds.set(side, neighbor.id);
  }

  markNeighborAsConnected(pile: Pile<ExtendedPiece, ExtendedPieceOptions>): void {
    this.notConnectedNeighborsIds.forEach((neighborPieceId, side) => {
      if (pile.items.get(neighborPieceId)) {
        this._markNeighborAsConnected(side, neighborPieceId);
      }
    });
  }

  private _markNeighborAsConnected(side: NEIGHBOR_SIDE, neighborPieceId: PieceId): void {
    const existingNeighborId = this._notConnectedNeighborsIds.get(side);
    if (!existingNeighborId) {
      throw new Error("Error. Neighbor piece is not in not connected neighbor ids array");
    }

    if (existingNeighborId !== neighborPieceId) {
      throw new Error("Error. Tried to mark a not neighbor piece as a connected neighbor piece");
    }

    this._notConnectedNeighborsIds.delete(side);
    this._connectedNeighborsIds.set(side, existingNeighborId);
  }

  markPieceOnSideAsConnected(side: NEIGHBOR_SIDE, pieceToConnect: this) {
    const existingNeighborId = this._notConnectedNeighborsIds.get(side);
    const pieceToConnectId = pieceToConnect.id;

    if (existingNeighborId !== pieceToConnectId) {
      throw new Error("Error. Impossible to connect a piece that is not a neighbor by connection");
    }

    if (!existingNeighborId) {
      throw new Error(
        "Error. Impossible to connect a piece from the side that is not existing by connection or already connected",
      );
    }

    this._markNeighborAsConnected(side, existingNeighborId);
  }

  private _recomputePositionOfPieceWithNestedPiecesAndPositionOfNestedPieces(): void {
    const topLeftPointOfBoundaryRectangleInWorldCoordinates =
      this._getTopLeftPointOfBoundaryRectangleForNestedPiecesInWorldCoordinates();

    const oldPositionOfParentPiece = Point.clone(this.getWorldPosition());

    const parentPiecePositionDelta = PositionDelta.create({
      dx: topLeftPointOfBoundaryRectangleInWorldCoordinates.x - oldPositionOfParentPiece.x,
      dy: topLeftPointOfBoundaryRectangleInWorldCoordinates.y - oldPositionOfParentPiece.y,
    });

    this.setPosition(topLeftPointOfBoundaryRectangleInWorldCoordinates);

    this._setRelativePositionForPiecesInNestedPile(parentPiecePositionDelta);
  }

  private _getTopLeftPointOfBoundaryRectangleForNestedPiecesInWorldCoordinates(): Point {
    if (!this.nestedPile?.length) {
      throw new Error(
        "Error. Impossible to recompute position of the piece that has no a nested pile of pieces or nested pile has no pieces",
      );
    }

    const nestedPiecePile = this.nestedPile;
    const pieceOnTop = nestedPiecePile.itemOnTop;

    if (!pieceOnTop) {
      throw new Error("Error. Nested pile should contains at least one piece");
    }

    const theMostTopLeftPointOfBoundary = Point.clone(pieceOnTop.getWorldPosition());

    nestedPiecePile.forEach((piece) => {
      const position = piece.getWorldPosition();

      if (position.x < theMostTopLeftPointOfBoundary.x) {
        theMostTopLeftPointOfBoundary.x = position.x;
      }
      if (position.y < theMostTopLeftPointOfBoundary.y) {
        theMostTopLeftPointOfBoundary.y = position.y;
      }
    });

    return Point.clone(theMostTopLeftPointOfBoundary);
  }

  private _recomputeSize(): void {
    if (!this.nestedPile?.length) {
      throw new Error(
        "Error. Impossible to recompute position of the piece that has no a nested pile of pieces or nested pile has no pieces",
      );
    }

    const nestedPiecePile = this.nestedPile;
    const pieceOnTop = nestedPiecePile.itemOnTop;

    if (!pieceOnTop) {
      throw new Error("Error. Nested pile should contains a piece");
    }

    const theMostTopLeftPointOfBoundary = Point.clone(pieceOnTop.position);
    const theMostBottomRightPointOfBoundary = Point.clone(pieceOnTop.position);

    nestedPiecePile.forEach((piece) => {
      const position = piece.position;

      if (position.x < theMostTopLeftPointOfBoundary.x) {
        theMostTopLeftPointOfBoundary.x = position.x;
      }
      if (position.y < theMostTopLeftPointOfBoundary.y) {
        theMostTopLeftPointOfBoundary.y = position.y;
      }

      if (position.x > theMostBottomRightPointOfBoundary.x) {
        theMostBottomRightPointOfBoundary.x = position.x;
      }
      if (position.y > theMostBottomRightPointOfBoundary.y) {
        theMostBottomRightPointOfBoundary.y = position.y;
      }
    });

    const width = theMostBottomRightPointOfBoundary.x - theMostTopLeftPointOfBoundary.x + pieceOnTop.width;

    const height = theMostBottomRightPointOfBoundary.y - theMostTopLeftPointOfBoundary.y + +pieceOnTop.height;

    this.setSize(width, height);
  }

  recomputePositionAndSize(): void {
    this._recomputePositionOfPieceWithNestedPiecesAndPositionOfNestedPieces();
    this._recomputeSize();
  }

  private _setRelativePositionForPiecesInNestedPile(parentPiecePositionDelta: PositionDelta): void {
    if (!this.nestedPile?.length) {
      throw new Error(
        "Error. Impossible to recompute positions of nested pieces for the piece that has no a nested pile of pieces or nested pile has no pieces",
      );
    }

    const positionDeltaForNestedPieces = PositionDelta.reverse(parentPiecePositionDelta);
    const nestedPiecePile = this.nestedPile;

    nestedPiecePile.forEach((piece) => {
      const oldPosition = piece.position;
      const newPosition = Point.addDelta(oldPosition, positionDeltaForNestedPieces);

      piece.setPosition(newPosition);
    });
  }

  toStringWithPosition() {
    const attributesString = `{x: ${this.position.x}, y: ${this.position.y}}`;
    return `${this.id} ${attributesString}`;
  }

  isGroup(): boolean {
    if (!this.nestedPile || this.nestedPile.length === 0) {
      return false;
    }

    return true;
  }
}

export { Piece };

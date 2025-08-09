import type { Area } from "../core/puzzle/Area";
import type { PieceCreation, PieceId, PieceOptions } from "../core/puzzle/Piece";
import {
  NEIGHBOR_SIDE_BOTTOM,
  NEIGHBOR_SIDE_LEFT,
  NEIGHBOR_SIDE_RIGHT,
  NEIGHBOR_SIDE_TOP,
  Piece,
  TOTAL_NUMBER_OF_PIECE_SIDES,
} from "../core/puzzle/Piece";
import { Point } from "../core/puzzle/Point";
import { connectSideShapesToPathShapeInClockwiseOrderOfSides } from "../utils-path/connectSideShapesToPathShape";
import { scaleMaskPathOfPiece } from "../utils-path/scaleMaskPathOfPiece";
import type { Boundary } from "./Boundary";
import type { CanvasBackgroundColor } from "./CanvasBackgroundColor";
import type { Path2dCommand } from "./path2d-commands/Path2dCommand";
import { stringifyPath2dCommands } from "./path2d-commands/Path2dCommand";

export interface ImageMargin {
  expandToTop: number;
  expandToRight: number;
  expandToBottom: number;
  expandToLeft: number;
}

export interface ImageOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RenderablePieceCreation extends PieceCreation {
  image: HTMLImageElement;
  textureArea: Area;
  sideShapeAsSocket: Path2dCommand[];
}

export const generateRenderablePieceId = (x = 0, y = 0): PieceId => {
  return `renderable-piece_${x}:${y}`;
};

export const createRenderablePiece = ({
  id,
  x,
  y,
  width,
  height,
  connectionActivationAreaSideSizeScaleFromPieceSideSize,
  image,
  textureArea,
  sideShapeAsSocket,
}: RenderablePieceCreation): RenderablePiece => {
  let instanceId = id;
  if (!instanceId) {
    instanceId = generateRenderablePieceId(x, y);
  }

  const position = new Point(x, y);

  return new RenderablePiece({
    id: instanceId,
    position,
    width,
    height,
    connectionActivationAreaSideSizeScaleFromPieceSideSize,
    image,
    textureArea,
    sideShapeAsSocket,
  });
};

export interface RenderablePieceOptions extends PieceOptions {
  image: HTMLImageElement;
  textureArea: Area;
  sideShapeAsSocket: Path2dCommand[];
}

export class RenderablePiece<
  RPiece extends Piece = Piece,
  RPieceOptions extends PieceOptions = PieceOptions,
> extends Piece<RPiece, RPieceOptions> {
  protected _image: HTMLImageElement;
  protected _textureArea: Area;

  private _sideShapeAsSocket: Path2dCommand[];

  constructor({ image, textureArea, sideShapeAsSocket, ...restOptions }: RenderablePieceOptions) {
    super(restOptions);

    this._image = image;
    this._textureArea = textureArea;
    this._sideShapeAsSocket = sideShapeAsSocket;
  }

  render(context: CanvasRenderingContext2D | undefined): void {
    if (!context) {
      throw new Error("Error. Render parameter context not defined");
    }

    if (!this.nestedPile?.length) {
      this._renderTexture({ context });
      return;
    }

    this._renderNestedPilePieces(context);
  }

  private _renderNestedPilePieces(context: CanvasRenderingContext2D | undefined): void {
    if (!context) {
      throw new Error("Error. Render parameter context not defined");
    }

    if (!this.nestedPile?.length) {
      throw new Error("Error. Impossible to render empty piece nested pile");
    }

    this.nestedPile.forEach((piece) => piece.render(context));
  }

  protected _getMaskPathParts(x: number = 0, y: number = 0, width: number = 1, height: number = 1): Path2dCommand[] {
    const sideShapeAsSocket = this._sideShapeAsSocket;

    const maskPathClockwisePath: Path2dCommand[] = connectSideShapesToPathShapeInClockwiseOrderOfSides(
      TOTAL_NUMBER_OF_PIECE_SIDES,
      this.sidesConnectionTypes,
      this.sidesConnectionTypesAsString,
      sideShapeAsSocket,
    );

    let maskPath = maskPathClockwisePath;
    maskPath = scaleMaskPathOfPiece(maskPath, width, height);
    maskPath[0] = maskPath[0].moveOnDelta(x, y);

    return maskPath;
  }

  protected _getMaskPath2D(
    pathParts: Path2dCommand[],
    _x: number = 0,
    _y: number = 0,
    _width: number = 1,
    _height: number = 1,
    printToConsoleMaskPath = false,
  ): Path2D {
    if (!pathParts?.length) {
      throw new Error("Error. Parameter maskPath not defined or empty");
    }

    const path2dCommandsString = stringifyPath2dCommands(pathParts);

    if (printToConsoleMaskPath) {
      console.log(path2dCommandsString);
    }

    const path2d = new Path2D(path2dCommandsString);

    return path2d;
  }

  protected _drawMask(
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    maskPath: Path2D,
    debug = false,
  ): void {
    if (debug) {
      context.fillStyle = "#ee448899";
      context.fill(maskPath);
    }

    context.clip(maskPath);

    if (debug) {
      const scaleA = 10;
      context.lineWidth = 5 * scaleA;
      context.strokeStyle = "black";
      context.stroke(maskPath);
    }
  }

  private _drawBorder(
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | undefined,
    maskPath: Path2D,
    borderColor: CanvasBackgroundColor = "black",
    borderWidth: number = 1,
  ) {
    if (!context) {
      throw new Error("Error. Render parameter context not defined");
    }

    context.save();

    context.strokeStyle = borderColor;
    context.lineWidth = borderWidth;
    context.stroke(maskPath);

    context.restore();
  }

  protected _getPieceTargetTextureExpansionSize(): ImageMargin {
    const expandToTop = this.sidesConnectionTypes.has(NEIGHBOR_SIDE_TOP) ? this.height : 0;

    const expandToRight = this.sidesConnectionTypes.has(NEIGHBOR_SIDE_RIGHT) ? this.width : 0;

    const expandToBottom = this.sidesConnectionTypes.has(NEIGHBOR_SIDE_BOTTOM) ? this.height : 0;

    const expandToLeft = this.sidesConnectionTypes.has(NEIGHBOR_SIDE_LEFT) ? this.width : 0;

    return {
      expandToTop,
      expandToRight,
      expandToBottom,
      expandToLeft,
    };
  }

  protected _getPieceImageSourceSizeAndPosition(): ImageOptions {
    const { expandToTop, expandToRight, expandToBottom, expandToLeft } = this._getPieceTargetTextureExpansionSize();

    const widthCoefficient = this._textureArea.width / this.width;
    const heightCoefficient = this._textureArea.height / this.height;

    const imagePartX = this._textureArea.x - expandToLeft * widthCoefficient;
    const imagePartY = this._textureArea.y - expandToTop * heightCoefficient;

    const imagePartWidth = expandToLeft * widthCoefficient + this._textureArea.width + expandToRight * widthCoefficient;

    const imagePartHeight =
      expandToTop * heightCoefficient + this._textureArea.height + expandToBottom * heightCoefficient;

    return {
      x: imagePartX,
      y: imagePartY,
      width: imagePartWidth,
      height: imagePartHeight,
    };
  }

  public getSizeAndPosition(): ImageOptions {
    const { x, y } = this.getWorldPosition();
    const width = this.width;
    const height = this.height;

    return {
      x,
      y,
      width,
      height,
    };
  }

  private getBoundaryRectangleForGroupOfPieces(
    pieces: NonNullable<typeof this.nestedPile>,
    cameraPosition?: { x: number; y: number },
    predicate: undefined | ((piece: typeof this) => true | false) = undefined,
  ): Boundary {
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;

    let index = 0;
    pieces.forEach((piece) => {
      if (typeof predicate === "function") {
        if (!predicate(piece)) {
          return;
        }
      }

      let pieceX1 = 0;
      let pieceY1 = 0;
      let pieceWidth = 0;
      let pieceHeight = 0;

      if (!piece.nestedPile?.length) {
        const pieceParams = piece.getPieceImageTargetSizeAndPosition(cameraPosition);
        pieceX1 = pieceParams.x;
        pieceY1 = pieceParams.y;
        pieceWidth = pieceParams.width;
        pieceHeight = pieceParams.height;
      } else {
        const groupParams = this.getBoundaryRectangleForGroupOfPieces(piece.nestedPile, cameraPosition, predicate);
        pieceX1 = groupParams.x;
        pieceY1 = groupParams.y;
        pieceWidth = groupParams.width;
        pieceHeight = groupParams.height;
      }

      const pieceX2 = pieceX1 + pieceWidth;
      const pieceY2 = pieceY1 + pieceHeight;

      if (index === 0) {
        x1 = pieceX1;
        y1 = pieceY1;
        x2 = pieceX2;
        y2 = pieceY2;
        index++;
        return;
      }

      if (pieceX1 < x1) {
        x1 = pieceX1;
      }

      if (pieceY1 < y1) {
        y1 = pieceY1;
      }

      if (pieceX2 > x2) {
        x2 = pieceX2;
      }

      if (pieceY2 > y2) {
        y2 = pieceY2;
      }

      index++;
    });

    const textureWidth = x2 - x1;
    const textureHeight = y2 - y1;

    const x = x1;
    const y = y1;
    const width = textureWidth;
    const height = textureHeight;

    return {
      x,
      y,
      width,
      height,
    };
  }

  public getPieceImageTargetSizeAndPosition(cameraPosition?: { x: number; y: number }): Boundary {
    if (this.nestedPile?.length) {
      return this.getBoundaryRectangleForGroupOfPieces(this.nestedPile, cameraPosition);
    }

    const { x, y } = this.getWorldPosition();
    const width = this.width;
    const height = this.height;

    const { expandToTop, expandToRight, expandToBottom, expandToLeft } = this._getPieceTargetTextureExpansionSize();

    const shiftX = typeof cameraPosition?.x === "number" ? cameraPosition?.x : 0;
    const shiftY = typeof cameraPosition?.y === "number" ? cameraPosition?.y : 0;

    const imageTargetX = x - expandToLeft + shiftX;
    const imageTargetY = y - expandToTop + shiftY;
    const imageTargetWidth = expandToLeft + width + expandToRight;
    const imageTargetHeight = expandToTop + height + expandToBottom;

    return {
      x: imageTargetX,
      y: imageTargetY,
      width: imageTargetWidth,
      height: imageTargetHeight,
    };
  }

  protected _getPieceMaskSizeAndPosition(): ImageOptions {
    const worldPosition = this.getWorldPosition();
    const maskX = worldPosition.x;
    const maskY = worldPosition.y;
    const maskWidth = this.width;
    const maskHeight = this.height;

    return {
      x: maskX,
      y: maskY,
      width: maskWidth,
      height: maskHeight,
    };
  }

  protected _renderTexture({
    context,
    imageSourceOptions,
    imageTargetOptions,
    imageTargetMaskOptions,
    debugDrawning = false,
  }: {
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | undefined;
    imageSourceOptions?: ImageOptions;
    imageTargetOptions?: ImageOptions;
    imageTargetMaskOptions?: ImageOptions;
    debugDrawning?: boolean;
  }): void {
    if (!context) {
      throw new Error("Error. Render parameter context not defined");
    }

    if (!this._image) {
      throw new Error("Error. Image of the piece not defined");
    }

    context.save();

    const {
      x: imageTargetMaskX,
      y: imageTargetMaskY,
      width: imageTargetMaskWidth,
      height: imageTargetMaskHeight,
    } = imageTargetMaskOptions || this._getPieceMaskSizeAndPosition();

    const maskPathParts = this._getMaskPathParts(
      imageTargetMaskX,
      imageTargetMaskY,
      imageTargetMaskWidth,
      imageTargetMaskHeight,
    );
    const maskPath = this._getMaskPath2D(
      maskPathParts,
      imageTargetMaskX,
      imageTargetMaskY,
      imageTargetMaskWidth,
      imageTargetMaskHeight,
    );

    this._drawMask(context, maskPath, debugDrawning);

    const {
      x: imagePartX,
      y: imagePartY,
      width: imagePartWidth,
      height: imagePartHeight,
    } = imageSourceOptions || this._getPieceImageSourceSizeAndPosition();

    const {
      x: imageTargetX,
      y: imageTargetY,
      width: imageTargetWidth,
      height: imageTargetHeight,
    } = imageTargetOptions || this.getPieceImageTargetSizeAndPosition();

    context.drawImage(
      this._image,

      imagePartX,
      imagePartY,
      imagePartWidth,
      imagePartHeight,

      imageTargetX,
      imageTargetY,
      imageTargetWidth,
      imageTargetHeight,
    );

    context.restore();
  }
}

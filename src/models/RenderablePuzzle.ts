import { Area } from "../core/puzzle/Area";
import type { PuzzleOptions, TAdditionalPieceOptions } from "../core/puzzle/Puzzle";
import { Puzzle } from "../core/puzzle/Puzzle";
import type { DebugSettingsState } from "../hooks/useDebugSettings";
import type { RenderablePiece, RenderablePieceOptions } from "./RenderablePiece";
import type { Path2dCommand } from "./path2d-commands/Path2dCommand";

export interface RenderablePuzzleOptions<UPiece, UPieceOptions> extends PuzzleOptions<UPiece, UPieceOptions> {
  image: HTMLImageElement;
  textureArea: Area;
  sideShapeAsSocket: Path2dCommand[];
  pieceClassDebugOptions: Partial<DebugSettingsState>;
}

export class RenderablePuzzle<
  RPiece extends RenderablePiece = RenderablePiece,
  RPieceOptions extends RenderablePieceOptions = RenderablePieceOptions,
> extends Puzzle<RPiece, RPieceOptions> {
  public image: HTMLImageElement;
  public textureArea?: Area;
  protected imageScaleHorizontal: number = 1;
  protected imageScaleVertical: number = 1;

  constructor(options: RenderablePuzzleOptions<RPiece, RPieceOptions>) {
    const { image } = options;

    super(options);
    this.image = image;
  }

  render(context: CanvasRenderingContext2D | undefined): void {
    if (!context) {
      throw new Error("Error. Render parameter context not defined");
    }

    this.pieces.forEach((piece) => piece.render(context));
  }

  protected getAdditionalPieceOptions(horizontalIndex?: number, verticalIndex?: number): TAdditionalPieceOptions {
    const { textureArea: imageTextureArea } = this._additionalPieceOptions as unknown as RPieceOptions;

    if (horizontalIndex !== undefined && verticalIndex !== undefined) {
      const textureX = imageTextureArea.x;
      const textureY = imageTextureArea.y;
      const textureWidth = imageTextureArea.width;
      const textureHeight = imageTextureArea.height;

      const numberOfPiecesPerWidth = this._numberOfPiecesPerWidth;
      const numberOfPiecesPerHeight = this._numberOfPiecesPerHeight;

      const imagePartWidth = textureWidth / numberOfPiecesPerWidth;
      const imagePartHeight = textureHeight / numberOfPiecesPerHeight;

      const imagePartX = textureX + horizontalIndex * imagePartWidth;
      const imagePartY = textureY + verticalIndex * imagePartHeight;

      const textureArea = new Area(imagePartX, imagePartY, imagePartWidth, imagePartHeight);

      return {
        ...this._additionalPieceOptions,
        textureArea,
      };
    }

    return super.getAdditionalPieceOptions();
  }
}

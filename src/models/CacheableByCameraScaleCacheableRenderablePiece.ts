import type { DebugSettingsState } from "../hooks/useDebugSettings";
import type { Point } from "../models/Point";
import type { CacheableRenderablePieceCreation, CacheableRenderablePieceOptions } from "./CacheableRenderablePiece";
import { CacheableRenderablePiece } from "./CacheableRenderablePiece";
import type { CanvasCacheParams } from "./CanvasCache";
import { CanvasCache } from "./CanvasCache";
import type { RenderingCanvas } from "./RenderingCanvas";
import type { RenderingContext2D } from "./RenderingContext2D";

export type TextureSize = { width: number; height: number };

interface CanvasCacheParamsCachedByCameraScale extends CanvasCacheParams {
  pieceId: string;

  width: number;
  height: number;

  alpha?: boolean;
  willReadFrequently?: boolean;
}

export interface CacheableByCameraScaleCacheableRenderablePieceCreation extends CacheableRenderablePieceCreation {}

export interface CacheableByCameraScaleCacheableRenderablePieceOptions extends CacheableRenderablePieceOptions {
  pieceClassDebugOptions: Partial<DebugSettingsState>;
}

export class CacheableByCameraScaleCacheableRenderablePiece<
  CPiece extends CacheableRenderablePiece = CacheableRenderablePiece,
  CPieceOptions extends
    CacheableByCameraScaleCacheableRenderablePieceOptions = CacheableByCameraScaleCacheableRenderablePieceOptions,
> extends CacheableRenderablePiece<CPiece, CPieceOptions> {
  private _cacheCanvasParamsForTextureCachedByCameraScale?: CanvasCacheParamsCachedByCameraScale;
  private _textureCachedByCameraScale?: RenderingCanvas;
  private _textureCachedByCameraScaleSize: TextureSize = { width: 0, height: 0 };
  private _scaleOfTextureCachedByCameraScale: number = 1;

  public getTextureCachedByCameraScaleSize() {
    return this._textureCachedByCameraScaleSize;
  }

  renderCachedByCameraScale(context: CanvasRenderingContext2D | undefined, cameraScale: number, cameraPosition: Point) {
    if (!context) {
      throw new Error("Error. Render parameter context not defined");
    }

    if (!this.nestedPile?.length) {
      this._renderTextureCachedByCameraScale(context, cameraScale, cameraPosition);
      return;
    }

    this._renderNestedPilePiecesCachedByCameraScale(context, cameraScale, cameraPosition);
  }

  private _renderNestedPilePiecesCachedByCameraScale(
    context: CanvasRenderingContext2D | undefined,
    cameraScale: number,
    cameraPosition: Point,
  ): void {
    if (!context) {
      throw new Error("Error. Render parameter context not defined");
    }

    if (!this.nestedPile?.length) {
      throw new Error("Error. Impossible to render empty piece nested pile");
    }

    this.nestedPile.forEach((piece) => piece.renderCachedByCameraScale(context, cameraScale, cameraPosition));
  }

  protected _renderTextureCachedByCameraScale(
    context: CanvasRenderingContext2D | undefined,
    cameraScale: number,
    cameraPosition: Point,
    debugDrawning = false,
  ): void {
    if (!context) {
      throw new Error("Error. Render parameter context not defined");
    }
    if (isNaN(cameraScale)) {
      throw new Error("Error. Render parameter cameraScale not defined");
    }
    if (!cameraPosition) {
      throw new Error("Error. Render parameter camera position not defined");
    }

    if (
      this._textureCachedByCameraScale &&
      this._textureCachedByCameraScaleSize.width > 0 &&
      this._textureCachedByCameraScaleSize.height > 0 &&
      this._scaleOfTextureCachedByCameraScale === cameraScale
    ) {
      this._renderCachedTextureCachedByCameraScale(
        context,
        this._textureCachedByCameraScale,
        this._textureCachedByCameraScaleSize,
        cameraScale,
        cameraPosition,
      );
      return;
    }

    this._scaleOfTextureCachedByCameraScale = cameraScale;
    this._textureCachedByCameraScale = this._getRenderedTextureForCacheCachedByCameraScale({
      cameraScale,
      debugDrawning,
    });

    this._textureCachedByCameraScaleSize = {
      width: this._textureCachedByCameraScale.width,
      height: this._textureCachedByCameraScale.height,
    };

    this._renderCachedTextureCachedByCameraScale(
      context,
      this._textureCachedByCameraScale,
      this._textureCachedByCameraScaleSize,
      cameraScale,
      cameraPosition,
    );
  }

  private _renderCachedTextureCachedByCameraScale(
    context: RenderingContext2D | undefined,
    canvasWithTextureCache: RenderingCanvas | undefined,
    canvasWithTextureSize: TextureSize | undefined,
    cameraScale: number,
    cameraPosition?: Point,
  ): void {
    if (!context) {
      throw new Error("Error. Render parameter context not defined");
    }

    if (!canvasWithTextureCache) {
      throw new Error("Error. Cached texture not defined");
    }

    if (!canvasWithTextureSize || canvasWithTextureSize.width < 1 || canvasWithTextureSize.height < 1) {
      throw new Error("Error. Cached texture size not defined");
    }

    const imageSourceX = 0;
    const imageSourceY = 0;

    const { width: imageSourceWidth, height: imageSourceHeight } = canvasWithTextureSize;

    const imageTargetWidth = imageSourceWidth;
    const imageTargetHeight = imageSourceHeight;

    const { x: imageTargetX, y: imageTargetY } = this.getPieceImageTargetSizeAndPosition(cameraPosition);

    context.drawImage(
      canvasWithTextureCache,

      imageSourceX,
      imageSourceY,
      imageSourceWidth,
      imageSourceHeight,

      imageTargetX * cameraScale,
      imageTargetY * cameraScale,
      imageTargetWidth,
      imageTargetHeight,
    );
  }

  protected _getRenderedTextureForCacheCachedByCameraScale({
    cameraScale,
    debugDrawning = false,
  }: {
    cameraScale: number;
    debugDrawning?: boolean;
  }) {
    const fullSizeTexture = this.canvasWithTextureCache || this._prepareCachedTexture(debugDrawning);

    const imageSourceX = 0;
    const imageSourceY = 0;
    const imageSourceWidth = fullSizeTexture.width;
    const imageSourceHeight = fullSizeTexture.height;

    const { width: pieceTextureTargetWidth, height: pieceTextureTargetHeight } =
      this.getPieceImageTargetSizeAndPosition();

    const imageTargetX = 0;
    const imageTargetY = 0;
    const imageTargetWidth = pieceTextureTargetWidth * cameraScale;
    const imageTargetHeight = pieceTextureTargetHeight * cameraScale;

    const { canvas: canvasWithTextureCache, context: cacheCanvasContext } =
      this._getTextureCacheCanvasAndContextCachedByCameraScale(imageTargetWidth, imageTargetHeight);

    if (!cacheCanvasContext) {
      throw new Error("Error. Texture cache canvas context not defined");
    }

    if (!canvasWithTextureCache) {
      throw new Error("Error. Texture cache canvas not defined");
    }

    if (canvasWithTextureCache.width !== imageTargetWidth || canvasWithTextureCache.height !== imageTargetHeight) {
      canvasWithTextureCache.width = imageTargetWidth;
      canvasWithTextureCache.height = imageTargetHeight;
    }

    cacheCanvasContext.clearRect(0, 0, imageTargetWidth, imageTargetHeight);

    cacheCanvasContext.save();

    cacheCanvasContext.drawImage(
      fullSizeTexture,

      imageSourceX,
      imageSourceY,
      imageSourceWidth,
      imageSourceHeight,

      imageTargetX,
      imageTargetY,
      imageTargetWidth,
      imageTargetHeight,
    );

    cacheCanvasContext.restore();

    return canvasWithTextureCache;
  }

  private _getTextureCacheCanvasAndContextCachedByCameraScale(
    width: number,
    height: number,
  ): ReturnType<typeof CanvasCache.getCanvasAndContext> {
    const canvasCacheParams = this._getCacheCanvasParamsCachedByCameraScale(width, height);

    return CanvasCache.getCanvasAndContext(canvasCacheParams);
  }

  private _getCacheCanvasParamsCachedByCameraScale(
    width: number,
    height: number,
  ): CanvasCacheParamsCachedByCameraScale {
    if (this._cacheCanvasParamsForTextureCachedByCameraScale) {
      return this._cacheCanvasParamsForTextureCachedByCameraScale;
    }

    this._cacheCanvasParamsForTextureCachedByCameraScale = {
      type: "dynamic-texture-scaled-from-original-by-camera-scale",

      pieceId: this.id,

      width,
      height,

      alpha: true,
      willReadFrequently: true,
    };

    return this._cacheCanvasParamsForTextureCachedByCameraScale;
  }
}

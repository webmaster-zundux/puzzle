import { DEBUG_TEXTURE_CACHE_HTMLCANVASELEMENT_ID } from "../components/DebugTextureCacheCanvas";
import type { CacheIdForPieceShapePat as CacheIdByPieceConnectionTypesAndPositionAndSize } from "../hooks/useCacheHitCounterPieceMaskPath";
import { updateCacheHitCounterForPieceMaskPathCache } from "../hooks/useCacheHitCounterPieceMaskPath";
import type { DebugSettingsState } from "../hooks/useDebugSettings";
import { create2dContext } from "../utils-canvas/create2dContext";
import { getPieceEdgeBevelHighlightAndShadowParamsFromBevelParamsCache } from "../utils-canvas/getPieceEdgeBevelHighlightAndShadowParams";
import { CookedPath2DCache } from "../utils-path/CookedPath2DCache";
import { CookedPathCache } from "../utils-path/CookedPathCache";
import { CookedPieceBevelImagesCache } from "../utils-path/CookedPieceBevelImageCache";
import type { BEVEL_EFFECT_TYPE } from "./BevelColor";
import { BEVEL_EFFECT_HIGHLIGHT, BEVEL_EFFECT_SHADOW } from "./BevelColor";
import type { CanvasCacheParams } from "./CanvasCache";
import { CanvasCache } from "./CanvasCache";
import type { ImageOptions, RenderablePieceCreation, RenderablePieceOptions } from "./RenderablePiece";
import { RenderablePiece } from "./RenderablePiece";
import type { RenderingCanvas } from "./RenderingCanvas";
import type { RenderingContext2D } from "./RenderingContext2D";
import type { Path2dCommand } from "./path2d-commands/Path2dCommand";

interface CanvasCacheParamsCachedBySize extends CanvasCacheParams {
  pieceId: string;

  width: number;
  height: number;

  alpha?: boolean;
  willReadFrequently?: boolean;
}

interface CanvasCacheParamsForBevelEffect extends CanvasCacheParams {
  width: number;
  height: number;

  alpha?: boolean;
  willReadFrequently?: boolean;
}

export interface CacheableRenderablePieceCreation extends RenderablePieceCreation {}

export interface CacheableRenderablePieceOptions extends RenderablePieceOptions {
  pieceClassDebugOptions: Partial<DebugSettingsState>;
}

export class CacheableRenderablePiece<
  CPiece extends RenderablePiece = RenderablePiece,
  CPieceOptions extends RenderablePieceOptions = RenderablePieceOptions,
> extends RenderablePiece<CPiece, CPieceOptions> {
  private _canvasWithTextureCache?: RenderingCanvas;
  private _cacheCanvasParams?: CanvasCacheParamsCachedBySize;
  private _cacheCanvasParamsForBevelEffect?: CanvasCacheParamsForBevelEffect;
  private _pieceClassDebugOptions: Partial<DebugSettingsState> = {};

  get canvasWithTextureCache() {
    return this._canvasWithTextureCache;
  }

  constructor({ pieceClassDebugOptions, ...restOptions }: CacheableRenderablePieceOptions) {
    super(restOptions);

    this._pieceClassDebugOptions = {
      ...this._pieceClassDebugOptions,
      ...pieceClassDebugOptions,
    };
  }

  private _renderToDebugTextureCacheCanvas?: (this: HTMLCanvasElement, ev: MouseEvent) => void;

  protected _renderTexture({
    context,
    debugDrawning = false,
  }: {
    context: RenderingContext2D | undefined;
    debugDrawning?: boolean;
  }): void {
    if (!context) {
      throw new Error("Error. Render parameter context not defined");
    }

    if (this._canvasWithTextureCache) {
      this._renderCachedTexture(context, this._canvasWithTextureCache);
      return;
    }

    this._prepareCachedTexture(debugDrawning);

    this._renderCachedTexture(context, this._canvasWithTextureCache);
  }

  protected _prepareCachedTexture(debugDrawning = false) {
    this._canvasWithTextureCache = this._getRenderedTextureForCache({
      debugDrawning,
    });

    return this._canvasWithTextureCache;
  }

  private _renderCachedTexture(
    context: RenderingContext2D | undefined,
    canvasWithTextureCache: RenderingCanvas | undefined,
  ): void {
    if (!context) {
      throw new Error("Error. Render parameter context not defined");
    }

    if (!canvasWithTextureCache) {
      throw new Error("Error. Cached texture of the piece not defined");
    }

    const imagePartX = 0;
    const imagePartY = 0;

    const { width: imagePartWidth, height: imagePartHeight } = this._getPieceImageSourceSizeAndPosition();

    context.save();

    const {
      x: imageTargetX,
      y: imageTargetY,
      width: imageTargetWidth,
      height: imageTargetHeight,
    } = this.getPieceImageTargetSizeAndPosition();

    context.drawImage(
      canvasWithTextureCache,

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

  private _getPieceMaskSizeAndPositionForRenderToTexture(): ImageOptions {
    const maskWidth = this._textureArea.width;
    const maskHeight = this._textureArea.height;

    const widthCoefficient = this._textureArea.width / this.width;
    const heightCoefficient = this._textureArea.height / this.height;

    const { expandToTop, expandToLeft } = this._getPieceTargetTextureExpansionSize();

    const maskX = expandToLeft * widthCoefficient;
    const maskY = expandToTop * heightCoefficient;

    return {
      x: maskX,
      y: maskY,
      width: maskWidth,
      height: maskHeight,
    };
  }

  private _getPieceImageTargetSizeAndPositionForRenderToTexture(): ImageOptions {
    const { width: imagePartWidth, height: imagePartHeight } = this._getPieceImageSourceSizeAndPosition();

    return {
      x: 0,
      y: 0,
      width: imagePartWidth,
      height: imagePartHeight,
    };
  }

  private _getCacheCanvasParams(width: number, height: number): CanvasCacheParamsCachedBySize {
    if (this._cacheCanvasParams) {
      return this._cacheCanvasParams;
    }

    const imageSourceOptions = this._getPieceImageSourceSizeAndPosition();
    const { width: imagePartWidth, height: imagePartHeight } = imageSourceOptions;

    this._cacheCanvasParams = {
      pieceId: this.id,

      width: width ?? imagePartWidth,
      height: height ?? imagePartHeight,

      alpha: true,
      willReadFrequently: true,
    };

    return this._cacheCanvasParams;
  }

  private _getCacheCanvasParamsForBevelEffect(): CanvasCacheParamsForBevelEffect {
    if (this._cacheCanvasParamsForBevelEffect) {
      return this._cacheCanvasParamsForBevelEffect;
    }

    const imageSourceOptions = this._getPieceImageSourceSizeAndPosition();
    const { width: imagePartWidth, height: imagePartHeight } = imageSourceOptions;

    this._cacheCanvasParamsForBevelEffect = {
      width: imagePartWidth,
      height: imagePartHeight,

      alpha: true,
      willReadFrequently: true,
    };

    return this._cacheCanvasParamsForBevelEffect;
  }

  private _getTextureCacheCanvasAndContext(
    width: number,
    height: number,
  ): ReturnType<typeof CanvasCache.getCanvasAndContext> {
    const canvasCacheParams = this._getCacheCanvasParams(width, height);

    return CanvasCache.getCanvasAndContext(canvasCacheParams);
  }

  protected _getRenderedTextureForCache({ debugDrawning = false }: { debugDrawning?: boolean }): RenderingCanvas {
    const imageSourceOptions = this._getPieceImageSourceSizeAndPosition();

    const { x: imagePartX, y: imagePartY, width: imagePartWidth, height: imagePartHeight } = imageSourceOptions;

    const { canvas: canvasWithTextureCache, context: cacheCanvasContext } = this._getTextureCacheCanvasAndContext(
      imagePartWidth,
      imagePartHeight,
    );

    if (!cacheCanvasContext) {
      throw new Error("Error. Texture cache canvas context not defined");
    }

    if (!canvasWithTextureCache) {
      throw new Error("Error. Texture cache canvas not defined");
    }

    cacheCanvasContext.save();

    const imageTargetOptions = this._getPieceImageTargetSizeAndPositionForRenderToTexture();
    const imageTargetMaskOptions = this._getPieceMaskSizeAndPositionForRenderToTexture();

    if (this._pieceClassDebugOptions.showDebugTextureCacheCanvas) {
      const canvasForDebug = document.querySelector(
        `#${DEBUG_TEXTURE_CACHE_HTMLCANVASELEMENT_ID}`,
      ) as HTMLCanvasElement;

      if (canvasForDebug) {
        canvasForDebug.dataset.textureCacheIds = canvasForDebug.dataset.textureCacheIds + `;` + `${this.id}`;

        const renderToDebugTextureCacheCanvas = () => {
          if (canvasForDebug.dataset.textureCacheIdActive !== this.id) {
            return;
          }
          const ctx = canvasForDebug.getContext("2d") || undefined;
          super._renderTexture({
            context: ctx,
            imageSourceOptions,
            imageTargetOptions,
            imageTargetMaskOptions,

            debugDrawning: this._pieceClassDebugOptions.showDebugInfoForTextureCacheCanvas,
          });
        };

        this._addRenderToDebugTextureCacheCanvasOnClick(canvasForDebug, renderToDebugTextureCacheCanvas);
      }
    }

    const {
      x: imageTargetMaskX,
      y: imageTargetMaskY,
      width: imageTargetMaskWidth,
      height: imageTargetMaskHeight,
    } = imageTargetMaskOptions;

    this._initAndGetCacheIdByPieceConnectionTypesAndPositionAndSize(
      imageTargetMaskX,
      imageTargetMaskY,
      imageTargetMaskWidth,
      imageTargetMaskHeight,
    );

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

    this._drawMask(cacheCanvasContext, maskPath, debugDrawning);

    const { x: imageTargetX, y: imageTargetY, width: imageTargetWidth, height: imageTargetHeight } = imageTargetOptions;

    cacheCanvasContext.drawImage(
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

    if (this._pieceClassDebugOptions.drawEdgeBevelHighlightAndShadow) {
      this._drawBevelLightsAndShadows(cacheCanvasContext, canvasWithTextureCache, imageTargetOptions, maskPath);
    }

    cacheCanvasContext.restore();

    return canvasWithTextureCache;
  }

  private _addRenderToDebugTextureCacheCanvasOnClick(
    canvasForDebug: HTMLCanvasElement,
    func?: (this: HTMLCanvasElement, ev: MouseEvent) => void,
  ) {
    if (!canvasForDebug) {
      return;
    }

    if (typeof this._renderToDebugTextureCacheCanvas === "function") {
      canvasForDebug.removeEventListener("click", this._renderToDebugTextureCacheCanvas);
    }

    this._renderToDebugTextureCacheCanvas = func;
    if (typeof this._renderToDebugTextureCacheCanvas !== "function") {
      return;
    }

    canvasForDebug.addEventListener("click", this._renderToDebugTextureCacheCanvas);
    canvasForDebug.click();
  }

  private _drawBevelEdgeEffectBySideConnectionTypeByShapePath2d(
    image: HTMLImageElement | HTMLCanvasElement | OffscreenCanvas,
    opacity: number = 1.0,
    offsetX = 0,
    offsetY = 0,
    blurWidth = 5,
    type: BEVEL_EFFECT_TYPE,
  ) {
    const width = image.width + (Math.abs(offsetX) + blurWidth) * 2;
    const height = image.height + (Math.abs(offsetY) + blurWidth) * 2;

    const { canvas: canvasWithShadowMask, context: ctx1 } = create2dContext(width, height);
    ctx1.fillRect(0, 0, width, height);
    ctx1.globalCompositeOperation = "destination-out";
    ctx1.drawImage(image, Math.abs(offsetX) + blurWidth, Math.abs(offsetY) + blurWidth);
    const { canvas: canvasWithResultImage, context: ctx2 } = create2dContext(image.width, image.height);

    ctx2.save();

    if (type === BEVEL_EFFECT_SHADOW) {
      ctx2.shadowColor = "black";
      ctx2.globalCompositeOperation = "multiply";
    } else if (type === BEVEL_EFFECT_HIGHLIGHT) {
      ctx2.shadowColor = "white";
      ctx2.globalCompositeOperation = "lighter";
    } else {
      ctx2.shadowColor = type;
    }
    ctx2.globalAlpha = opacity;
    ctx2.shadowOffsetX = offsetX;
    ctx2.shadowOffsetY = offsetY;
    ctx2.shadowBlur = blurWidth;
    ctx2.drawImage(canvasWithShadowMask, -(Math.abs(offsetX) + blurWidth), -(Math.abs(offsetY) + blurWidth));
    ctx2.restore();
    ctx2.globalCompositeOperation = "destination-out";
    ctx2.drawImage(canvasWithShadowMask, -(Math.abs(offsetX) + blurWidth), -(Math.abs(offsetY) + blurWidth));
    ctx2.globalCompositeOperation = "source-over";

    return canvasWithResultImage;
  }

  private _drawBevelEdgeEffectBySideConnectionTypeForUnknownShape(
    image: HTMLImageElement | HTMLCanvasElement | OffscreenCanvas,
    opacity: number = 1.0,
    offsetX = 0,
    offsetY = 0,
    blurWidth = 5,
    type: BEVEL_EFFECT_TYPE,
  ) {
    const width = image.width + (Math.abs(offsetX) + blurWidth) * 2;
    const height = image.height + (Math.abs(offsetY) + blurWidth) * 2;

    const { canvas: canvasWithShadowMask, context: ctx1 } = create2dContext(width, height);
    ctx1.fillRect(0, 0, width, height);
    ctx1.globalCompositeOperation = "destination-out";
    ctx1.drawImage(image, Math.abs(offsetX) + blurWidth, Math.abs(offsetY) + blurWidth);
    const { canvas: canvasWithResultImage, context: ctx2 } = create2dContext(image.width, image.height);

    ctx2.save();

    if (type === BEVEL_EFFECT_SHADOW) {
      ctx2.shadowColor = "black";
      ctx2.globalCompositeOperation = "multiply";
    } else if (type === BEVEL_EFFECT_HIGHLIGHT) {
      ctx2.shadowColor = "white";
      ctx2.globalCompositeOperation = "lighter";
    } else {
      ctx2.shadowColor = type;
    }
    ctx2.globalAlpha = opacity;
    ctx2.shadowOffsetX = offsetX;
    ctx2.shadowOffsetY = offsetY;
    ctx2.shadowBlur = blurWidth;
    ctx2.drawImage(canvasWithShadowMask, -(Math.abs(offsetX) + blurWidth), -(Math.abs(offsetY) + blurWidth));
    ctx2.restore();
    ctx2.globalCompositeOperation = "destination-out";
    ctx2.drawImage(canvasWithShadowMask, -(Math.abs(offsetX) + blurWidth), -(Math.abs(offsetY) + blurWidth));
    ctx2.globalCompositeOperation = "source-over";

    return canvasWithResultImage;
  }

  private _drawBevelEdgeEffectBySideConnectionTypeByShape(
    effectType: BEVEL_EFFECT_TYPE,
    context: RenderingContext2D,
    shape: Path2D,
    opacity: number = 1.0,
    offsetX = 0,
    offsetY = 0,
    blurWidth = 5,
    _width = 50,
    _height = 50,
  ): void {
    if (!context) {
      throw new Error("Context not defined");
    }

    if (effectType === BEVEL_EFFECT_HIGHLIGHT) {
      context.shadowColor = "white";
    } else if (effectType === BEVEL_EFFECT_SHADOW) {
      context.shadowColor = "black";
    } else {
      throw new Error("Error. Unknown bevel effect type");
    }

    context.globalAlpha = opacity;
    context.strokeStyle = "black";
    context.lineWidth = blurWidth;
    context.shadowBlur = blurWidth;
    context.shadowOffsetX = offsetX;
    context.shadowOffsetY = offsetY;
    context.stroke(shape);
  }

  private _drawBevelLightsAndShadows(
    context: RenderingContext2D | undefined,
    canvas: RenderingCanvas | undefined,
    textureImageParameters: ImageOptions,
    shape: Path2D,
  ) {
    if (!canvas) {
      throw new Error("Error. Render parameter canvas not defined");
    }

    if (!context) {
      throw new Error("Error. Render parameter context not defined");
    }

    const {
      x: imageTargetMaskX,
      y: imageTargetMaskY,
      width: imageTargetMaskWidth,
      height: imageTargetMaskHeight,
    } = textureImageParameters;

    const bevelImageCacheId = this._initAndGetCacheIdByPieceConnectionTypesAndPositionAndSize(
      imageTargetMaskX,
      imageTargetMaskY,
      imageTargetMaskWidth,
      imageTargetMaskHeight,
    );

    let bevelImage = CookedPieceBevelImagesCache.get(bevelImageCacheId);

    if (!bevelImage) {
      bevelImage = this._createBevelImageWithLightsAndShadowsByShape(textureImageParameters, shape);

      CookedPieceBevelImagesCache.set(bevelImageCacheId, bevelImage);
    }

    context.drawImage(bevelImage, imageTargetMaskX, imageTargetMaskY);
  }

  private _createPieceShapeBevelEffectImage(_pieceShapePath: Path2D): {
    canvas: RenderingCanvas;
    context: RenderingContext2D;
  } {
    const pieceShapeBevelEffectImageCacheParams = this._getCacheCanvasParamsForBevelEffect();
    const { canvas, context } = CanvasCache.getCanvasAndContext(pieceShapeBevelEffectImageCacheParams);

    if (!canvas) {
      throw new Error("Error. Canvas not defined");
    }

    if (!context) {
      throw new Error("Error. Canvas context not defined");
    }

    return { canvas, context };
  }

  private _createBevelImageWithLightsAndShadowsByShape(
    textureImageParameters: ImageOptions,
    shape: Path2D,
  ): RenderingCanvas {
    const { canvas, context } = this._createPieceShapeBevelEffectImage(shape);

    const { blurWidth, highlightOpacity, highlightOffsetPoint, shadowOpacity, shadowOffsetPoint } =
      getPieceEdgeBevelHighlightAndShadowParamsFromBevelParamsCache(
        textureImageParameters.width,
        textureImageParameters.height,
      );

    const offsetXToHideBorderLine = textureImageParameters.width;
    const offsetYToHideBorderLine = textureImageParameters.height;
    const contextSource = context;

    contextSource.save();

    if (offsetXToHideBorderLine || offsetYToHideBorderLine) {
      contextSource.translate(-offsetXToHideBorderLine, -offsetYToHideBorderLine);
    }

    const drawHighlight = () => {
      this._drawBevelEdgeEffectBySideConnectionTypeByShape(
        BEVEL_EFFECT_HIGHLIGHT,
        contextSource,
        shape,
        highlightOpacity,
        highlightOffsetPoint.x + offsetXToHideBorderLine,
        highlightOffsetPoint.y + offsetYToHideBorderLine,
        blurWidth,
        textureImageParameters.width,
        textureImageParameters.height,
      );
    };

    const drawShadow = () => {
      this._drawBevelEdgeEffectBySideConnectionTypeByShape(
        BEVEL_EFFECT_SHADOW,
        contextSource,
        shape,
        shadowOpacity,
        shadowOffsetPoint.x + offsetXToHideBorderLine,
        shadowOffsetPoint.y + offsetYToHideBorderLine,
        blurWidth,
        textureImageParameters.width,
        textureImageParameters.height,
      );
    };

    const times = 2;
    for (let i = 0; i < times; i++) {
      drawHighlight();
      drawShadow();
    }

    contextSource.restore();

    return canvas;
  }

  private _createBevelImageWithLightsAndShadowsForUnknownShape(
    canvas: RenderingCanvas | undefined,
    context: RenderingContext2D | undefined,
    textureImageParameters: ImageOptions,
  ): RenderingCanvas {
    if (!canvas) {
      throw new Error("Error. Render parameter canvas not defined");
    }

    if (!context) {
      throw new Error("Error. Render parameter context not defined");
    }

    const imageToProcess = canvas;

    const { blurWidth, highlightOpacity, highlightOffsetPoint, shadowOpacity, shadowOffsetPoint } =
      getPieceEdgeBevelHighlightAndShadowParamsFromBevelParamsCache(
        textureImageParameters.width,
        textureImageParameters.height,
      );

    const imageWithHighlight = this._drawBevelEdgeEffectBySideConnectionTypeForUnknownShape(
      imageToProcess,
      highlightOpacity,
      highlightOffsetPoint.x,
      highlightOffsetPoint.y,
      blurWidth,
      BEVEL_EFFECT_HIGHLIGHT,
    );
    const imageWithShadowAndHighlight = this._drawBevelEdgeEffectBySideConnectionTypeForUnknownShape(
      imageWithHighlight,
      shadowOpacity,
      shadowOffsetPoint.x,
      shadowOffsetPoint.y,
      blurWidth,
      BEVEL_EFFECT_SHADOW,
    );
    if (typeof context !== "undefined") {
      context.drawImage(imageToProcess, 10, 10);
      context.drawImage(imageWithHighlight, 10 + this.width + 10, 10);
      context.drawImage(imageWithShadowAndHighlight, 10 + (this.width + 10) * 2, 10);
    }

    return imageWithShadowAndHighlight;
  }

  private _cacheIdByPieceConnectionTypesAndPositionAndSize:
    | CacheIdByPieceConnectionTypesAndPositionAndSize
    | undefined = undefined;

  private _initAndGetCacheIdByPieceConnectionTypesAndPositionAndSize(
    x: number,
    y: number,
    width: number,
    height: number,
  ): CacheIdByPieceConnectionTypesAndPositionAndSize {
    if (this._cacheIdByPieceConnectionTypesAndPositionAndSize) {
      return this._cacheIdByPieceConnectionTypesAndPositionAndSize;
    }

    const cacheId: CacheIdByPieceConnectionTypesAndPositionAndSize = [
      this.sidesConnectionTypesAsString,
      [x, y, width, height].join(","),
    ].join("_");

    this._cacheIdByPieceConnectionTypesAndPositionAndSize = cacheId;

    return this._cacheIdByPieceConnectionTypesAndPositionAndSize;
  }

  protected _getMaskPathParts(x: number = 0, y: number = 0, width: number = 1, height: number = 1): Path2dCommand[] {
    const maskPathHashString = this._initAndGetCacheIdByPieceConnectionTypesAndPositionAndSize(x, y, width, height);

    const cachedMaskPath = CookedPathCache.getCookedConnectedSideShapesFromCache(maskPathHashString);

    if (cachedMaskPath) {
      updateCacheHitCounterForPieceMaskPathCache(maskPathHashString);

      return cachedMaskPath;
    }

    const maskPath = super._getMaskPathParts(x, y, width, height);

    CookedPathCache.setCookedConnectedSideShapesToCache(maskPathHashString, maskPath);

    return maskPath;
  }

  protected _getMaskPath2D(
    pathParts: Path2dCommand[],
    x: number = 0,
    y: number = 0,
    width: number = 1,
    height: number = 1,
    printToConsoleMaskPath = false,
  ): Path2D {
    const maskPath2dCacheId = this._initAndGetCacheIdByPieceConnectionTypesAndPositionAndSize(x, y, width, height);

    const cachedMaskPath = CookedPath2DCache.getCookedConnectedSideShapesPath2dFromCache(maskPath2dCacheId);

    if (cachedMaskPath) {
      updateCacheHitCounterForPieceMaskPathCache(maskPath2dCacheId);

      return cachedMaskPath;
    }

    const path2d = super._getMaskPath2D(pathParts, x, y, width, height, printToConsoleMaskPath);

    CookedPath2DCache.setCookedConnectedSideShapesPath2dToCache(maskPath2dCacheId, path2d);

    return path2d;
  }
}

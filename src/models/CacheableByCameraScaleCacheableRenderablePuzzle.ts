import {
  screenToWorldSize,
  worldToScreenCoordinates,
  worldToScreenSize,
} from "../utils-camera/screenToWorldCoordinates";
import { drawCircle } from "../utils-canvas/drawCircle";
import { drawDashedLine } from "../utils-canvas/drawDashedLine";
import { drawRectangle } from "../utils-canvas/drawRectangle";
import { getIntersectionPointOfTwoLineSegmentsBySegments } from "../utils-path/getIntersectionPointOfTwoLineSegmentsByPoins";
import { getArraySymmetricDifference } from "../utils/getArraySymmetricDifference";
import { Area } from "./Area";
import { Boundary } from "./Boundary";
import type {
  CacheableByCameraScaleCacheableRenderablePiece,
  CacheableByCameraScaleCacheableRenderablePieceOptions,
} from "./CacheableByCameraScaleCacheableRenderablePiece";
import type { CacheableRenderablePuzzleOptions } from "./CacheableRenderablePuzzle";
import { CacheableRenderablePuzzle } from "./CacheableRenderablePuzzle";
import type { CanvasCacheParams } from "./CanvasCache";
import { CanvasCache } from "./CanvasCache";
import type { LineSegment } from "./LineSegment";
import { Point } from "./Point";
import type { ImageOptions } from "./RenderablePiece";
import type { RenderingCanvas } from "./RenderingCanvas";
import type { RenderingContext2D } from "./RenderingContext2D";
import type { Size } from "./Size";
import type { Tile } from "./Tile";
import { TileMesh } from "./TileMesh";

const TILE_SIZE_IN_SCREEN_COORDINATES = 300; // px

type TileTextureParams = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

interface DebugParams {
  debugSettingsShouldDrawCachedTexturesBoundaries: boolean;
}

interface CanvasCacheParamsCachedByLayer extends CanvasCacheParams {
  id: string;

  width: number;
  height: number;

  alpha?: boolean;
  willReadFrequently?: boolean;
}

export interface CacheableByCameraScaleCacheableRenderablePuzzleOptions<UPiece, UPieceOptions>
  extends CacheableRenderablePuzzleOptions<UPiece, UPieceOptions> {}

export class CacheableByCameraScaleCacheableRenderablePuzzle<
  CPiece extends CacheableByCameraScaleCacheableRenderablePiece = CacheableByCameraScaleCacheableRenderablePiece,
  CPieceOptions extends
    CacheableByCameraScaleCacheableRenderablePieceOptions = CacheableByCameraScaleCacheableRenderablePieceOptions,
> extends CacheableRenderablePuzzle<CPiece, CPieceOptions> {
  private allInOneLayerTexture?: RenderingCanvas;
  private allInOneLayerTextureParams?: CanvasCacheParamsCachedByLayer;
  private allInOneLayerTextureCameraScale: number = 1;

  private baseLayerTexture?: RenderingCanvas;
  private baseLayerTextureParams?: CanvasCacheParamsCachedByLayer;
  private baseLayerTextureCameraScale: number = 1;

  private activePieceLayerTexture?: RenderingCanvas;
  private activePieceLayerTextureParams?: CanvasCacheParamsCachedByLayer;
  private activePieceLayerTextureCameraScale: number = 1;

  private tilesTextures = new Map<TileTextureParams["id"], RenderingCanvas>();
  private tilesTexturesParams = new Map<TileTextureParams["id"], TileTextureParams>();

  private theLatestCameraScale: number | undefined = undefined;
  private theLatestTiles: TileMesh | undefined = undefined;

  private cacheParamsForTextureOfDirectionMarkDefaultContrast?: CanvasCacheParamsCachedByLayer;
  private cacheParamsForTextureOfDirectionMarkHighContrast?: CanvasCacheParamsCachedByLayer;
  private directionMarkDefaultContrastTexture?: RenderingCanvas;
  private directionMarkHighContrastTexture?: RenderingCanvas;

  renderByTilesTextures(
    context: CanvasRenderingContext2D | undefined,
    cameraScale: number,
    cameraBoundary: Boundary,
    debugParams?: DebugParams,
  ): void {
    if (!context) {
      throw new Error("Error. Render parameter context not defined");
    }

    const tileSizeInScreenCoordinates: Size = {
      width: TILE_SIZE_IN_SCREEN_COORDINATES,
      height: TILE_SIZE_IN_SCREEN_COORDINATES,
    };
    const tileSizeInWorldCoordinates: Size = {
      width: screenToWorldSize(tileSizeInScreenCoordinates.width, cameraScale),
      height: screenToWorldSize(tileSizeInScreenCoordinates.height, cameraScale),
    };

    let tiles: TileMesh | undefined = undefined;
    if (this.theLatestCameraScale !== cameraScale || (this.activePieceLayerTexture && !this.activePiece)) {
      tiles = this.renderEveryPieceIntoTileTextures(
        cameraScale,
        cameraBoundary,
        tileSizeInWorldCoordinates,
        tileSizeInScreenCoordinates,
      );
    } else {
      tiles = this.renderEveryPieceIntoTileTexturesExceptActivePiece(
        cameraScale,
        cameraBoundary,
        tileSizeInWorldCoordinates,
        tileSizeInScreenCoordinates,
      );
    }

    if (tiles) {
      tiles.forEach((tile) => {
        this.renderCachedTextureOfTile(context, tile, debugParams);
      });
    }

    if (this.activePiece) {
      this.renderActivePieceLayerTexture(context, cameraScale, cameraBoundary, debugParams);
    } else {
      this.activePieceLayerTexture = undefined;
    }
  }

  private renderEveryPieceIntoTileTexturesExceptActivePiece(
    cameraScale: number,
    cameraBoundary: Boundary,
    tileSizeInWorldCoordinates: Size,
    tileSizeInScreenCoordinates: Size,
  ) {
    let tiles: TileMesh | undefined = undefined;

    const predicateFilterEveryPiece = (piece: CPiece) => {
      return !this.isSelectedPiece(piece, false);
    };
    tiles = this.getTilesWithContentWithinCameraViewport(
      cameraBoundary,
      tileSizeInWorldCoordinates,
      predicateFilterEveryPiece,
    );
    const oldTiles = this.theLatestTiles;
    this.theLatestTiles = tiles;

    let tilesWithChangedContent: TileMesh | Tile[] = [];
    if (oldTiles) {
      const tilesWithChangedContentWithinCameraViewport = this.getTilesWithChangedContentWithinCameraViewport(
        oldTiles,
        tiles,
      );

      tilesWithChangedContent = tilesWithChangedContentWithinCameraViewport;
    } else {
      tilesWithChangedContent = tiles;
    }

    if (tilesWithChangedContent) {
      tilesWithChangedContent.forEach((tile) => {
        const tileTextureParamsInScreenCoordinates: TileTextureParams = {
          id: tile.id,
          x: worldToScreenSize(tile.position.x, cameraScale),
          y: worldToScreenSize(tile.position.y, cameraScale),
          width: tileSizeInScreenCoordinates.width,
          height: tileSizeInScreenCoordinates.height,
        };

        const tileTexture = this.getRenderedTileTexture({
          tile,
          cameraScale,
          tileTextureParamsInScreenCoordinates,
        });

        this.tilesTextures.set(tile.id, tileTexture);
        this.tilesTexturesParams.set(tile.id, tileTextureParamsInScreenCoordinates);
      });
    }

    return tiles;
  }

  private renderEveryPieceIntoTileTextures(
    cameraScale: number,
    cameraBoundary: Boundary,
    tileSizeInWorldCoordinates: Size,
    tileSizeInScreenCoordinates: Size,
  ) {
    let tiles: TileMesh | undefined = undefined;

    this.theLatestCameraScale = cameraScale;
    this.tilesTextures.clear();

    const predicateFilterEveryPiece = (_piece: CPiece) => {
      return true;
    };

    tiles = this.getTilesWithContentWithinCameraViewport(
      cameraBoundary,
      tileSizeInWorldCoordinates,
      predicateFilterEveryPiece,
    );
    this.theLatestTiles = tiles;

    tiles.forEach((tile) => {
      const tileTextureParamsInScreenCoordinates: TileTextureParams = {
        id: tile.id,
        x: worldToScreenSize(tile.position.x, cameraScale),
        y: worldToScreenSize(tile.position.y, cameraScale),
        width: tileSizeInScreenCoordinates.width,
        height: tileSizeInScreenCoordinates.height,
      };

      const tileTexture = this.getRenderedTileTexture({
        tile,
        cameraScale,
        tileTextureParamsInScreenCoordinates,
      });

      this.tilesTextures.set(tile.id, tileTexture);
      this.tilesTexturesParams.set(tile.id, tileTextureParamsInScreenCoordinates);
    });

    return tiles;
  }

  private renderCachedTextureOfTile(
    context: RenderingContext2D | undefined,
    tile: Tile,
    debugParams?: DebugParams,
  ): void {
    if (!context) {
      throw new Error("Error. Render context not defined");
    }

    const canvasWithTextureCache = this.tilesTextures.get(tile.id);
    const textureParamsInScreenCoordinates = this.tilesTexturesParams.get(tile.id);

    if (!canvasWithTextureCache) {
      throw new Error("Error. Cached texture of the tile does not defined");
    }

    if (!textureParamsInScreenCoordinates) {
      throw new Error("Error. Cached texture params of the tile does not defined");
    }

    const imagePartX = 0;
    const imagePartY = 0;

    const { width: imagePartWidth, height: imagePartHeight } = textureParamsInScreenCoordinates;

    const {
      x: imageTargetX,
      y: imageTargetY,
      width: imageTargetWidth,
      height: imageTargetHeight,
    } = textureParamsInScreenCoordinates;

    context.save();

    if (canvasWithTextureCache.width > 0 || canvasWithTextureCache.height > 0) {
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
    }

    if (debugParams?.debugSettingsShouldDrawCachedTexturesBoundaries) {
      this.drawTextureBoundaries(context, imageTargetX, imageTargetY, imageTargetWidth, imageTargetHeight);
    }

    context.restore();
  }

  getTilesWithChangedContentWithinCameraViewport(oldTiles: TileMesh, currentTiles: TileMesh): Tile[] {
    const tilesWithChangedContent: Tile[] = [];

    currentTiles.forEach((currentTile) => {
      const oldTile = oldTiles.getById(currentTile.id);
      if (!oldTile) {
        tilesWithChangedContent.push(currentTile);
      } else {
        const oldTileStatePiecesIds = oldTile.getPiecesIds();
        const currentTileStatePiecesIds = currentTile.getPiecesIds();
        const difference = getArraySymmetricDifference(oldTileStatePiecesIds, currentTileStatePiecesIds);

        if (difference.length) {
          tilesWithChangedContent.push(currentTile);
        }
      }
    });

    return tilesWithChangedContent;
  }

  getTilesWithActivePieceWithinCameraViewport(cameraBoundary: Boundary, tileSize: Size): TileMesh {
    const tileMesh = new TileMesh(tileSize.width, tileSize.height);

    const piece = this.activePiece;
    if (!piece) {
      return tileMesh;
    }

    if (piece.parentPieceId) {
      const parentPiece = this.pieces.getItemById(piece.parentPieceId);

      if (!parentPiece || !parentPiece.nestedPile) {
        return tileMesh;
      }

      this.gatherTilesWithContent(tileMesh, parentPiece.nestedPile, cameraBoundary);

      return tileMesh;
    }

    const pieceTextureBoundary: Boundary = piece.getPieceImageTargetSizeAndPosition();
    const limitedBoundaryWitninCameraViewport = Boundary.getIntersectionBoundaryOfTwoBoundaries(
      pieceTextureBoundary,
      cameraBoundary,
    );

    if (!limitedBoundaryWitninCameraViewport) {
      return tileMesh;
    }

    tileMesh.addTilesWithinBoundary(limitedBoundaryWitninCameraViewport, piece.id);

    return tileMesh;
  }

  getTilesWithContentWithinCameraViewport(
    cameraBoundary: Boundary,
    tileSize: Size,
    predicate: undefined | ((piece: CPiece) => true | false),
  ) {
    const tileMesh = new TileMesh(tileSize.width, tileSize.height);

    this.gatherTilesWithContent(tileMesh, this.pieces, cameraBoundary, predicate);

    return tileMesh;
  }

  private gatherTilesWithContent(
    tileMesh: TileMesh,
    pieces: typeof this.pieces,
    cameraBoundary: Boundary,
    predicate: undefined | ((piece: CPiece) => true | false) = undefined,
  ): void {
    pieces.forEach((piece) => {
      if (typeof predicate === "function") {
        if (!predicate(piece)) {
          return;
        }
      }

      if (piece.nestedPile?.length) {
        this.gatherTilesWithContent(tileMesh, piece.nestedPile, cameraBoundary, predicate);
        return;
      }

      const pieceTextureBoundary: Boundary = piece.getPieceImageTargetSizeAndPosition();
      const limitedBoundaryWitninCameraViewport = Boundary.getIntersectionBoundaryOfTwoBoundaries(
        pieceTextureBoundary,
        cameraBoundary,
      );
      if (!limitedBoundaryWitninCameraViewport) {
        return;
      }

      tileMesh.addTilesWithinBoundary(limitedBoundaryWitninCameraViewport, piece.id);
    });
  }

  renderByTexturesCachedByCameraScale_DEPRECATED(
    context: CanvasRenderingContext2D | undefined,
    cameraScale: number,
    cameraPosition: Point,
    cameraSize: Point,
    debugParams?: DebugParams,
  ): void {
    if (!context) {
      throw new Error("Error. Render parameter context not defined");
    }

    const cameraBoundary = new Boundary(cameraPosition.x, cameraPosition.y, cameraSize.x, cameraSize.y);
    if (!this.activePiece) {
      this.baseLayerTexture = undefined;
      this.activePieceLayerTexture = undefined;
      this.renderAllInOneLayerTexture(context, cameraScale, cameraBoundary, debugParams);
    } else {
      this.allInOneLayerTexture = undefined;
      this.renderBaseLayerTexture(context, cameraScale, cameraBoundary, debugParams);
      this.renderActivePieceLayerTexture(context, cameraScale, cameraBoundary, debugParams);
    }
  }

  protected getRenderedTileTexture({
    tile,
    cameraScale,
    tileTextureParamsInScreenCoordinates,
  }: {
    tile: Tile;
    cameraScale: number;
    tileTextureParamsInScreenCoordinates: TileTextureParams;
  }): RenderingCanvas {
    const canvasCacheParams = {
      id: tileTextureParamsInScreenCoordinates.id,

      width: tileTextureParamsInScreenCoordinates.width,
      height: tileTextureParamsInScreenCoordinates.height,

      alpha: true,
      willReadFrequently: true,
    };
    const { canvas: canvasWithTexture, context: canvasWithTextureContext } =
      CanvasCache.getCanvasAndContext(canvasCacheParams);

    if (!canvasWithTextureContext) {
      throw new Error("Error. Texture canvas context not defined");
    }

    if (!canvasWithTexture) {
      throw new Error("Error. Texture canvas not defined");
    }

    canvasWithTextureContext.clearRect(
      0,
      0,
      canvasWithTextureContext.canvas.width,
      canvasWithTextureContext.canvas.height,
    );
    if (
      canvasWithTexture.width !== tileTextureParamsInScreenCoordinates.width ||
      canvasWithTexture.height !== tileTextureParamsInScreenCoordinates.height
    ) {
      canvasWithTexture.width = tileTextureParamsInScreenCoordinates.width;
      canvasWithTexture.height = tileTextureParamsInScreenCoordinates.height;
    }

    canvasWithTextureContext.save();

    const shiftedPositionByTileAreaOriginPoint = new Point(-tile.position.x, -tile.position.y);
    const piecesIdsInTile = tile.getPiecesIds();
    piecesIdsInTile.forEach((pieceId) => {
      const piece = this.pieces.getItemById(pieceId);
      if (!piece) {
        throw new Error("Error. Piece id noted for the tile texture does not exists in the pieces pile");
      }

      piece.renderCachedByCameraScale(canvasWithTextureContext, cameraScale, shiftedPositionByTileAreaOriginPoint);
    });

    canvasWithTextureContext.restore();

    return canvasWithTexture;
  }

  private renderAllInOneLayerTexture(
    context: CanvasRenderingContext2D | undefined,
    cameraScale: number,
    cameraBoundary: Boundary,
    debugParams?: DebugParams,
  ) {
    if (!context) {
      throw new Error("Error. Render parameter context not defined");
    }

    if (this.allInOneLayerTexture && cameraScale == this.allInOneLayerTextureCameraScale) {
      this.renderCachedTextureForAllInOneLayer(
        context,
        this.allInOneLayerTexture,
        cameraScale,
        cameraBoundary,
        debugParams,
      );
      return;
    }

    this.allInOneLayerTextureCameraScale = cameraScale;
    this.allInOneLayerTexture = this.getRenderedTextureForAllInOneLayer({
      cameraScale,
      cameraBoundary,
    });

    this.renderCachedTextureForAllInOneLayer(
      context,
      this.allInOneLayerTexture,
      cameraScale,
      cameraBoundary,
      debugParams,
    );
  }

  private getTextureCanvasAndContextForAllInOneLayer(
    width: number,
    height: number,
    cameraScale: number,
    cameraBoundary: Boundary,
  ): ReturnType<typeof CanvasCache.getCanvasAndContext> {
    const canvasCacheParams = this.getTextureParamsForAllInOneLayer(width, height, cameraScale, cameraBoundary);

    return CanvasCache.getCanvasAndContext(canvasCacheParams);
  }

  private getTextureParamsForAllInOneLayer(
    width: number,
    height: number,
    cameraScale: number,
    cameraBoundary: Boundary,
  ): CanvasCacheParamsCachedByLayer {
    if (this.allInOneLayerTextureParams) {
      return this.allInOneLayerTextureParams;
    }

    const { width: imagePartWidth, height: imagePartHeight } = this.getTextureSizeAndPositionForAllInOneLayer(
      cameraScale,
      cameraBoundary,
    );

    this.allInOneLayerTextureParams = {
      id: "all-in-one-layer",

      width: width ?? imagePartWidth,
      height: height ?? imagePartHeight,

      alpha: true,
      willReadFrequently: true,
    };

    return this.allInOneLayerTextureParams;
  }

  private renderCachedTextureOfLayer(
    context: RenderingContext2D | undefined,
    canvasWithTextureCache: RenderingCanvas | undefined,
    _cameraScale: number,
    _cameraBoundary: Boundary,
    textureParams: ImageOptions,
    debugParams?: DebugParams,
  ): void {
    if (!context) {
      throw new Error("Error. Render context not defined");
    }

    if (!canvasWithTextureCache) {
      throw new Error("Error. Cached texture of the layer does not defined");
    }

    const imagePartX = 0;
    const imagePartY = 0;

    const { width: imagePartWidth, height: imagePartHeight } = textureParams;
    const { x: imageTargetX, y: imageTargetY, width: imageTargetWidth, height: imageTargetHeight } = textureParams;

    context.save();

    if (canvasWithTextureCache.width > 0 || canvasWithTextureCache.height > 0) {
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
    }

    if (debugParams?.debugSettingsShouldDrawCachedTexturesBoundaries) {
      this.drawTextureBoundaries(context, imageTargetX, imageTargetY, imageTargetWidth, imageTargetHeight);
    }

    context.restore();
  }

  private drawTextureBoundaries(context: RenderingContext2D, x: number, y: number, width: number, height: number) {
    const paddingWidth = 2;
    const paddingDirection = "inner"; // 'outer' : 'inner'
    const paddingDirectionMiltiplier = paddingDirection === "inner" ? +1 : -1;
    const padding = paddingDirectionMiltiplier * paddingWidth;

    drawRectangle(
      context,
      x + padding,
      y + padding,
      width - padding * 2,
      height - padding * 2,
      "black",
      true,
      1,
      true,
      [5, 5],
    );
  }

  private renderCachedTextureForAllInOneLayer(
    context: RenderingContext2D | undefined,
    canvasWithTextureCache: RenderingCanvas | undefined,
    cameraScale: number,
    cameraBoundary: Boundary,
    debugParams?: DebugParams,
  ): void {
    const textureParams = this.getTextureSizeAndPositionForAllInOneLayer(cameraScale, cameraBoundary);
    this.renderCachedTextureOfLayer(
      context,
      canvasWithTextureCache,
      cameraScale,
      cameraBoundary,
      textureParams,
      debugParams,
    );
  }

  protected getRenderedTextureForAllInOneLayer({
    cameraScale,
    cameraBoundary,
  }: {
    cameraScale: number;
    cameraBoundary: Boundary;
  }): RenderingCanvas {
    const textureParams = this.getTextureSizeAndPositionForAllInOneLayer(cameraScale, cameraBoundary);

    const { canvas: canvasWithTexture, context: canvasWithTextureContext } =
      this.getTextureCanvasAndContextForAllInOneLayer(1, 1, 1, cameraBoundary);

    if (!canvasWithTextureContext) {
      throw new Error("Error. Texture canvas context not defined");
    }

    if (!canvasWithTexture) {
      throw new Error("Error. Texture canvas not defined");
    }

    canvasWithTextureContext.clearRect(
      0,
      0,
      canvasWithTextureContext.canvas.width,
      canvasWithTextureContext.canvas.height,
    );
    canvasWithTexture.width = textureParams.width;
    canvasWithTexture.height = textureParams.height;

    canvasWithTextureContext.save();

    this.pieces.forEach((piece) => {
      if (!this.isPieceVisibleInCameraViewport_OLD_INCORRECT(cameraBoundary, piece)) {
        return;
      }

      const shiftedPositionByLayerOriginPoint = new Point(
        -textureParams.x / cameraScale,
        -textureParams.y / cameraScale,
      );

      piece.renderCachedByCameraScale(canvasWithTextureContext, cameraScale, shiftedPositionByLayerOriginPoint);
    });

    canvasWithTextureContext.restore();

    return canvasWithTexture;
  }

  public isPieceVisibleInTileArea(tileAreaPosition: Point, tileAreaSize: Size, piece: CPiece): boolean {
    const tileAreaPointP0 = {
      x: tileAreaPosition.x,
      y: tileAreaPosition.y,
    };

    const tileAreaPointP2 = {
      x: tileAreaPosition.x + tileAreaSize.width,
      y: tileAreaPosition.y + tileAreaSize.height,
    };

    const {
      x: pieceX1,
      y: pieceY1,
      width: pieceWidth,
      height: pieceHeight,
    } = piece.getPieceImageTargetSizeAndPosition();

    const pieceX2 = pieceX1 + pieceWidth;
    const pieceY2 = pieceY1 + pieceHeight;

    const piecePointP0 = {
      x: pieceX1,
      y: pieceY1,
    };

    const piecePointP2 = {
      x: pieceX2,
      y: pieceY2,
    };

    return Area.doTwoAreasIntersectByCornerPoints(piecePointP0, piecePointP2, tileAreaPointP0, tileAreaPointP2);
  }

  public isPieceVisibleInCameraViewport_OLD_INCORRECT(cameraBoundary: Boundary, piece: CPiece): boolean {
    const cameraPointP0 = {
      x: -cameraBoundary.x,
      y: -cameraBoundary.y,
    };

    const cameraPointP2 = {
      x: -cameraBoundary.x + cameraBoundary.width,
      y: -cameraBoundary.y + cameraBoundary.height,
    };

    const {
      x: pieceX1,
      y: pieceY1,
      width: pieceWidth,
      height: pieceHeight,
    } = piece.getPieceImageTargetSizeAndPosition();

    const pieceX2 = pieceX1 + pieceWidth;
    const pieceY2 = pieceY1 + pieceHeight;

    const piecePointP0 = {
      x: pieceX1,
      y: pieceY1,
    };

    const piecePointP2 = {
      x: pieceX2,
      y: pieceY2,
    };

    return Area.doTwoAreasIntersectByCornerPoints(piecePointP0, piecePointP2, cameraPointP0, cameraPointP2);
  }

  public isPieceVisibleInCameraViewport(cameraBoundary: Boundary, piece: CPiece): boolean {
    const cameraPointP0 = {
      x: cameraBoundary.x,
      y: cameraBoundary.y,
    };

    const cameraPointP2 = {
      x: cameraBoundary.x + cameraBoundary.width,
      y: cameraBoundary.y + cameraBoundary.height,
    };

    const {
      x: pieceX1,
      y: pieceY1,
      width: pieceWidth,
      height: pieceHeight,
    } = piece.getPieceImageTargetSizeAndPosition();

    const pieceX2 = pieceX1 + pieceWidth;
    const pieceY2 = pieceY1 + pieceHeight;

    const piecePointP0 = {
      x: pieceX1,
      y: pieceY1,
    };

    const piecePointP2 = {
      x: pieceX2,
      y: pieceY2,
    };

    return Area.doTwoAreasIntersectByCornerPoints(piecePointP0, piecePointP2, cameraPointP0, cameraPointP2);
  }

  private getBoundaryRectangleForGroupOfPiecesInWorldCoordinates(
    pieces: typeof this.pieces,
    cameraBoundary: Boundary,
    predicate: undefined | ((piece: CPiece) => true | false) = undefined,
    shouldCheckIfPieceIsVisibleInCameraViewport = true,
  ): ImageOptions {
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;

    let areValuesWereInitialized = false;
    pieces.forEach((piece) => {
      if (typeof predicate === "function") {
        if (!predicate(piece)) {
          return;
        }
      }

      const {
        x: pieceX1,
        y: pieceY1,
        width: pieceWidth,
        height: pieceHeight,
      } = piece.getPieceImageTargetSizeAndPosition();

      const pieceX2 = pieceX1 + pieceWidth;
      const pieceY2 = pieceY1 + pieceHeight;

      if (shouldCheckIfPieceIsVisibleInCameraViewport) {
        if (!this.isPieceVisibleInCameraViewport(cameraBoundary, piece)) {
          return;
        }
      }

      if (!areValuesWereInitialized) {
        x1 = pieceX1;
        y1 = pieceY1;
        x2 = pieceX2;
        y2 = pieceY2;

        areValuesWereInitialized = true;
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

  private getBoundaryRectangleForGroupOfPieces(
    pieces: typeof this.pieces,
    cameraScale: number,
    cameraBoundary: Boundary,
    predicate: undefined | ((piece: CPiece) => true | false) = undefined,
    shouldCheckIfPieceIsVisibleInCameraViewport = true,
  ): ImageOptions {
    const {
      x: x1,
      y: y1,
      width: textureWidth,
      height: textureHeight,
    } = this.getBoundaryRectangleForGroupOfPiecesInWorldCoordinates(
      pieces,
      cameraBoundary,
      predicate,
      shouldCheckIfPieceIsVisibleInCameraViewport,
    );

    const x = Math.floor(x1 * cameraScale);
    const y = Math.floor(y1 * cameraScale);
    const width = Math.floor(textureWidth * cameraScale);
    const height = Math.floor(textureHeight * cameraScale);

    return {
      x,
      y,
      width,
      height,
    };
  }

  protected getTextureSizeAndPositionForLayer(
    cameraScale: number,
    cameraBoundary: Boundary,
    predicate: undefined | ((piece: CPiece) => true | false) = undefined,
    shouldCheckIfPieceIsVisibleInCameraViewport = true,
  ): ImageOptions {
    return this.getBoundaryRectangleForGroupOfPieces(
      this.pieces,
      cameraScale,
      cameraBoundary,
      predicate,
      shouldCheckIfPieceIsVisibleInCameraViewport,
    );
  }

  protected getTextureSizeAndPositionForAllInOneLayer(cameraScale: number, cameraBoundary: Boundary): ImageOptions {
    return this.getTextureSizeAndPositionForLayer(cameraScale, cameraBoundary);
  }

  private isEmptyBaseLayerTexture() {
    if (this.baseLayerTexture && (this.baseLayerTexture.width === 0 || this.baseLayerTexture.height === 0)) {
      return true;
    }

    return false;
  }

  private renderBaseLayerTexture(
    context: CanvasRenderingContext2D | undefined,
    cameraScale: number,
    cameraBoundary: Boundary,
    debugParams?: DebugParams,
  ) {
    if (!context) {
      throw new Error("Error. Render parameter context not defined");
    }

    if (this.isEmptyBaseLayerTexture()) {
      return;
    }

    this.baseLayerTextureCameraScale = cameraScale;
    this.baseLayerTexture = this._getRenderedTextureForBaseLayer({ cameraScale, cameraBoundary });

    if (this.isEmptyBaseLayerTexture()) {
      return;
    }

    this.renderCachedTextureForBaseLayer(context, this.baseLayerTexture, cameraScale, cameraBoundary, debugParams);
  }

  private renderActivePieceLayerTexture(
    context: CanvasRenderingContext2D | undefined,
    cameraScale: number,
    cameraBoundary: Boundary,
    debugParams?: DebugParams,
  ) {
    if (!context) {
      throw new Error("Error. Render parameter context not defined");
    }

    if (this.activePieceLayerTexture && cameraScale == this.activePieceLayerTextureCameraScale) {
      this.renderCachedTextureForActivePieceLayer(
        context,
        this.activePieceLayerTexture,
        cameraScale,
        cameraBoundary,
        debugParams,
      );
      return;
    }

    this.activePieceLayerTextureCameraScale = cameraScale;
    this.activePieceLayerTexture = this.getRenderedTextureForActivePieceLayer({
      cameraScale,
      cameraBoundary,
    });

    this.renderCachedTextureForActivePieceLayer(
      context,
      this.activePieceLayerTexture,
      cameraScale,
      cameraBoundary,
      debugParams,
    );
  }

  private renderCachedTextureForBaseLayer(
    context: RenderingContext2D | undefined,
    canvasWithTextureCache: RenderingCanvas | undefined,
    cameraScale: number,
    cameraBoundary: Boundary,
    debugParams?: DebugParams,
  ): void {
    const textureParams = this.getTextureSizeAndPositionForBaseLayer(cameraScale, cameraBoundary);
    this.renderCachedTextureOfLayer(
      context,
      canvasWithTextureCache,
      cameraScale,
      cameraBoundary,
      textureParams,
      debugParams,
    );
  }

  private renderCachedTextureForActivePieceLayer(
    context: RenderingContext2D | undefined,
    canvasWithTextureCache: RenderingCanvas | undefined,
    cameraScale: number,
    cameraBoundary: Boundary,
    debugParams?: DebugParams,
  ): void {
    const textureParams = this.getTextureSizeAndPositionForActivePieceLayer(cameraScale, cameraBoundary);
    this.renderCachedTextureOfLayer(
      context,
      canvasWithTextureCache,
      cameraScale,
      cameraBoundary,
      textureParams,
      debugParams,
    );
  }

  private isSelectedPiece(piece?: CPiece, shouldBeActiveIfItIsInGroup = false): boolean {
    if (!piece) {
      return false;
    }

    if (this.activePiece && piece.id === this.activePiece.id) {
      return true;
    }

    if (shouldBeActiveIfItIsInGroup) {
      if (piece.parentPieceId !== undefined) {
        return this.isSelectedPiece(this.pieces.getItemById(piece.parentPieceId));
      }
    } else {
      if (piece.nestedPile?.length) {
        const selectedNestedPiece = piece.nestedPile.find((nestedPiece) => this.isSelectedPiece(nestedPiece));

        return selectedNestedPiece !== undefined;
      }
    }

    return false;
  }

  protected getTextureSizeAndPositionForBaseLayer(cameraScale: number, cameraBoundary: Boundary): ImageOptions {
    return this.getTextureSizeAndPositionForLayer(
      cameraScale,
      cameraBoundary,
      (piece) => !this.isSelectedPiece(piece),
      false,
    );
  }

  protected getTextureSizeAndPositionForActivePieceLayer(cameraScale: number, cameraBoundary: Boundary): ImageOptions {
    return this.getTextureSizeAndPositionForLayer(
      cameraScale,
      cameraBoundary,
      (piece) => this.isSelectedPiece(piece, false),
      false,
    );
  }

  protected _getRenderedTextureForBaseLayer({
    cameraScale,
    cameraBoundary,
  }: {
    cameraScale: number;
    cameraBoundary: Boundary;
  }): RenderingCanvas {
    const textureParams = this.getTextureSizeAndPositionForBaseLayer(cameraScale, cameraBoundary);

    const { canvas: canvasWithTexture, context: canvasWithTextureContext } =
      this.getTextureCanvasAndContextForBaseLayer(1, 1, 1, cameraBoundary);

    if (!canvasWithTextureContext) {
      throw new Error("Error. Texture canvas context not defined");
    }

    if (!canvasWithTexture) {
      throw new Error("Error. Texture canvas not defined");
    }

    canvasWithTextureContext.clearRect(
      0,
      0,
      canvasWithTextureContext.canvas.width,
      canvasWithTextureContext.canvas.height,
    );
    canvasWithTexture.width = textureParams.width;
    canvasWithTexture.height = textureParams.height;

    canvasWithTextureContext.save();

    this.pieces.forEach((piece) => {
      if (this.isSelectedPiece(piece)) {
        return;
      }

      if (!this.isPieceVisibleInCameraViewport_OLD_INCORRECT(cameraBoundary, piece)) {
        return;
      }

      const shiftedPositionByLayerOriginPoint = new Point(
        -textureParams.x / cameraScale,
        -textureParams.y / cameraScale,
      );

      piece.renderCachedByCameraScale(canvasWithTextureContext, cameraScale, shiftedPositionByLayerOriginPoint);
    });

    canvasWithTextureContext.restore();

    return canvasWithTexture;
  }

  protected getRenderedTextureForActivePieceLayer({
    cameraScale,
    cameraBoundary,
  }: {
    cameraScale: number;
    cameraBoundary: Boundary;
  }): RenderingCanvas {
    const textureParams = this.getTextureSizeAndPositionForActivePieceLayer(cameraScale, cameraBoundary);

    const { canvas: canvasWithTexture, context: canvasWithTextureContext } =
      this.getTextureCanvasAndContextForActivePieceLayer(1, 1, 1, cameraBoundary);

    if (!canvasWithTextureContext) {
      throw new Error("Error. Texture canvas context not defined");
    }

    if (!canvasWithTexture) {
      throw new Error("Error. Texture canvas not defined");
    }

    canvasWithTextureContext.clearRect(
      0,
      0,
      canvasWithTextureContext.canvas.width,
      canvasWithTextureContext.canvas.height,
    );
    canvasWithTexture.width = textureParams.width;
    canvasWithTexture.height = textureParams.height;

    canvasWithTextureContext.save();

    this.pieces.forEach((piece) => {
      if (!this.isSelectedPiece(piece, false)) {
        return;
      }

      const shiftedPositionByLayerOriginPoint = new Point(
        -textureParams.x / cameraScale,
        -textureParams.y / cameraScale,
      );

      piece.renderCachedByCameraScale(canvasWithTextureContext, cameraScale, shiftedPositionByLayerOriginPoint);
    });

    canvasWithTextureContext.restore();

    return canvasWithTexture;
  }

  private getTextureParamsForBaseLayer(
    width: number,
    height: number,
    cameraScale: number,
    cameraBoundary: Boundary,
  ): CanvasCacheParamsCachedByLayer {
    if (this.baseLayerTextureParams) {
      return this.baseLayerTextureParams;
    }

    const { width: imagePartWidth, height: imagePartHeight } = this.getTextureSizeAndPositionForBaseLayer(
      cameraScale,
      cameraBoundary,
    );

    this.baseLayerTextureParams = {
      id: "base-layer",

      width: width ?? imagePartWidth,
      height: height ?? imagePartHeight,

      alpha: true,
      willReadFrequently: true,
    };

    return this.baseLayerTextureParams;
  }

  private getTextureParamsForActivePieceLayer(
    width: number,
    height: number,
    cameraScale: number,
    cameraBoundary: Boundary,
  ): CanvasCacheParamsCachedByLayer {
    if (this.activePieceLayerTextureParams) {
      return this.activePieceLayerTextureParams;
    }

    const { width: imagePartWidth, height: imagePartHeight } = this.getTextureSizeAndPositionForActivePieceLayer(
      cameraScale,
      cameraBoundary,
    );

    this.activePieceLayerTextureParams = {
      id: "active-piece-layer",

      width: width ?? imagePartWidth,
      height: height ?? imagePartHeight,

      alpha: true,
      willReadFrequently: true,
    };

    return this.activePieceLayerTextureParams;
  }

  private getTextureCanvasAndContextForBaseLayer(
    width: number,
    height: number,
    cameraScale: number,
    cameraBoundary: Boundary,
  ): ReturnType<typeof CanvasCache.getCanvasAndContext> {
    const canvasCacheParams = this.getTextureParamsForBaseLayer(width, height, cameraScale, cameraBoundary);

    return CanvasCache.getCanvasAndContext(canvasCacheParams);
  }

  private getTextureCanvasAndContextForActivePieceLayer(
    width: number,
    height: number,
    cameraScale: number,
    cameraBoundary: Boundary,
  ): ReturnType<typeof CanvasCache.getCanvasAndContext> {
    const canvasCacheParams = this.getTextureParamsForActivePieceLayer(width, height, cameraScale, cameraBoundary);

    return CanvasCache.getCanvasAndContext(canvasCacheParams);
  }

  private getRectangeLineSegments(
    x: number,
    y: number,
    width: number,
    height: number,
  ): readonly [LineSegment, LineSegment, LineSegment, LineSegment] {
    const topLeftPoint = Point.create({
      x,
      y,
    });
    const topRightPoint = Point.create({
      x: x + width,
      y: y,
    });
    const bottomRightPoint = Point.create({
      x: x + width,
      y: y + height,
    });
    const bottomLeftPoint = Point.create({
      x: x,
      y: y + height,
    });

    const viewportTopSegment = [topLeftPoint, topRightPoint] as LineSegment;
    const viewportRightSegment = [topRightPoint, bottomRightPoint] as LineSegment;
    const viewportBottomSegment = [bottomRightPoint, bottomLeftPoint] as LineSegment;
    const viewportLeftSegment = [bottomLeftPoint, topLeftPoint] as LineSegment;

    const viewportBoundaryLineSegments = [
      viewportTopSegment,
      viewportRightSegment,
      viewportBottomSegment,
      viewportLeftSegment,
    ] as const;

    return viewportBoundaryLineSegments;
  }

  public drawMarksForDirectionToPositionOutsideCameraViewport({
    context,
    puzzle,
    cameraPosition,
    cameraScale,
    cameraWidth,
    cameraHeight,
    isHighContrastVersion = false,
    shoulShowDebugInfo: isShowDebugInfo = false,
    debugSettingsShouldDrawCachedTexturesBoundaries = false,
  }: {
    context: CanvasRenderingContext2D;
    puzzle: CacheableRenderablePuzzle;
    cameraPosition: Point;
    cameraScale: number;
    cameraWidth: number;
    cameraHeight: number;
    isHighContrastVersion: boolean;
    shoulShowDebugInfo: boolean;
    debugSettingsShouldDrawCachedTexturesBoundaries: boolean;
  }): void {
    if (!context) {
      return;
    }

    if (!puzzle) {
      return;
    }

    const cameraPositionInScreenCoordinates = Point.getZeroPoint();

    if (isShowDebugInfo) {
      drawCircle(context, cameraPositionInScreenCoordinates.x, cameraPositionInScreenCoordinates.y, "Tomato", 32);
    }

    const extendingRange = worldToScreenSize((puzzle.pieceSideSize / 2) * 1.2, cameraScale);
    const cameraViewportPositionForDetectionNotVisiblePieces = Point.create({
      x: cameraPositionInScreenCoordinates.x - extendingRange,
      y: cameraPositionInScreenCoordinates.y - extendingRange,
    });
    const widthOfCameraViewportForDetectionNotVisiblePieces = cameraWidth + extendingRange * 2;
    const heightOfCameraViewportForDetectionNotVisiblePieces = cameraHeight + extendingRange * 2;

    const viewportBoundaryLineSegmentsForDetectionNotVisiblePieces = this.getRectangeLineSegments(
      cameraViewportPositionForDetectionNotVisiblePieces.x,
      cameraViewportPositionForDetectionNotVisiblePieces.y,
      widthOfCameraViewportForDetectionNotVisiblePieces,
      heightOfCameraViewportForDetectionNotVisiblePieces,
    );

    const viewportBoundaryLineSegments = this.getRectangeLineSegments(
      cameraPositionInScreenCoordinates.x,
      cameraPositionInScreenCoordinates.y,
      cameraWidth,
      cameraHeight,
    );

    const cameraViewportCenterPointInScreenCoordinates = Point.create({
      x: cameraPositionInScreenCoordinates.x + cameraWidth / 2,
      y: cameraPositionInScreenCoordinates.y + cameraHeight / 2,
    });

    if (isShowDebugInfo) {
      drawCircle(
        context,
        cameraViewportCenterPointInScreenCoordinates.x,
        cameraViewportCenterPointInScreenCoordinates.y,
        "DodgerBlue",
        10,
      );
    }

    const directionMarkSize: Size = { width: 20, height: 20 };
    const directionMarkTexturePositionShift = new Point(-directionMarkSize.width / 2, -directionMarkSize.height / 2);

    puzzle.pieces.forEach((piece) => {
      const { x, y } = piece.getCenterPointPosition();
      const pieceCenterPointInScreenCoordinates = worldToScreenCoordinates(
        Point.create({ x, y }),
        cameraScale,
        cameraPosition,
      );

      for (let i = 0; i < viewportBoundaryLineSegmentsForDetectionNotVisiblePieces.length; i++) {
        if (isShowDebugInfo) {
          drawDashedLine(
            context,
            cameraViewportCenterPointInScreenCoordinates.x,
            cameraViewportCenterPointInScreenCoordinates.y,
            pieceCenterPointInScreenCoordinates.x,
            pieceCenterPointInScreenCoordinates.y,
            "white",
            2,
            2,
            2,
          );
        }

        const intersectionPoint = getIntersectionPointOfTwoLineSegmentsBySegments(
          [pieceCenterPointInScreenCoordinates, cameraViewportCenterPointInScreenCoordinates],
          viewportBoundaryLineSegmentsForDetectionNotVisiblePieces[i],
        );

        if (intersectionPoint) {
          const intersectionPointWithinViewport = getIntersectionPointOfTwoLineSegmentsBySegments(
            [pieceCenterPointInScreenCoordinates, cameraViewportCenterPointInScreenCoordinates],
            viewportBoundaryLineSegments[i],
          );
          if (!intersectionPointWithinViewport) {
            return;
          }

          if (isShowDebugInfo) {
            drawCircle(context, intersectionPoint.x, intersectionPoint.y, "#e5e8", 150, true, 3);
            drawCircle(
              context,
              intersectionPointWithinViewport.x,
              intersectionPointWithinViewport.y,
              "#e568",
              120,
              true,
              3,
            );
          }

          this.renderDirectionMark(
            context,
            directionMarkSize,
            intersectionPointWithinViewport,
            directionMarkTexturePositionShift,
            isHighContrastVersion,
            debugSettingsShouldDrawCachedTexturesBoundaries,
          );

          return;
        }
      }
    });

    if (isShowDebugInfo) {
      drawRectangle(
        context,
        cameraPositionInScreenCoordinates.x,
        cameraPositionInScreenCoordinates.y,
        cameraWidth,
        cameraHeight,
        "yellow",
        true,
        2,
        false,
      );
    }
  }

  protected renderDirectionMark(
    context: CanvasRenderingContext2D,
    directionMarkSize: Size,
    position: Point,
    texturePositionShift: Point,
    isHighContrastVersion: boolean = false,
    debugSettingsShouldDrawCachedTexturesBoundaries: boolean = false,
  ) {
    if (isHighContrastVersion) {
      if (!this.directionMarkHighContrastTexture) {
        this.directionMarkHighContrastTexture = this.getRenderedTextureForDirectionMark(
          true,
          directionMarkSize.width,
          directionMarkSize.height,
        );
      }
    } else {
      if (!this.directionMarkDefaultContrastTexture) {
        this.directionMarkDefaultContrastTexture = this.getRenderedTextureForDirectionMark(
          false,
          directionMarkSize.width,
          directionMarkSize.height,
        );
      }
    }

    if (isHighContrastVersion) {
      this.renderCachedTextureForDirectionMark(
        context,
        this.directionMarkHighContrastTexture,
        position,
        texturePositionShift,
        debugSettingsShouldDrawCachedTexturesBoundaries,
      );
    } else {
      this.renderCachedTextureForDirectionMark(
        context,
        this.directionMarkDefaultContrastTexture,
        position,
        texturePositionShift,
        debugSettingsShouldDrawCachedTexturesBoundaries,
      );
    }
  }

  protected renderCachedTextureForDirectionMark(
    context: RenderingContext2D,
    canvasWithTextureCache: RenderingCanvas | undefined,
    position: Point,
    texturePositionShift: Point,
    debugSettingsShouldDrawCachedTexturesBoundaries: boolean = false,
  ) {
    if (!canvasWithTextureCache) {
      throw new Error("Error. Cached texture of the layer does not defined");
    }

    context.drawImage(
      canvasWithTextureCache,

      0,
      0,
      canvasWithTextureCache.width,
      canvasWithTextureCache.height,

      position.x + texturePositionShift.x,
      position.y + texturePositionShift.y,
      canvasWithTextureCache.width,
      canvasWithTextureCache.height,
    );

    if (debugSettingsShouldDrawCachedTexturesBoundaries) {
      this.drawTextureBoundaries(
        context,
        position.x + texturePositionShift.x,
        position.y + texturePositionShift.y,
        canvasWithTextureCache.width,
        canvasWithTextureCache.height,
      );
    }
  }

  protected getRenderedTextureForDirectionMark(
    isHighContrastVersion: boolean = false,
    width: number = 20,
    height: number = 20,
  ): RenderingCanvas {
    const { canvas: canvasWithTexture, context: canvasWithTextureContext } =
      this.getTextureCanvasAndContextForDirectionMark(width, height, isHighContrastVersion);

    if (!canvasWithTextureContext) {
      throw new Error("Error. Texture canvas context not defined");
    }

    if (!canvasWithTexture) {
      throw new Error("Error. Texture canvas not defined");
    }

    canvasWithTextureContext.clearRect(
      0,
      0,
      canvasWithTextureContext.canvas.width,
      canvasWithTextureContext.canvas.height,
    );
    canvasWithTexture.width = width;
    canvasWithTexture.height = height;

    const radius = width / 2;
    const borderWidth = radius / 10;
    const innerRadius = radius - borderWidth;

    canvasWithTextureContext.save();

    if (isHighContrastVersion) {
      drawCircle(canvasWithTextureContext, radius, radius, "#eee", innerRadius, false, borderWidth);
      drawCircle(canvasWithTextureContext, radius, radius, "#444", innerRadius * 0.8, false, borderWidth);
    } else {
      drawCircle(canvasWithTextureContext, radius, radius, "#fff6", innerRadius, false, borderWidth);
    }

    canvasWithTextureContext.restore();

    return canvasWithTexture;
  }

  protected getTextureCanvasAndContextForDirectionMark(
    width: number,
    height: number,
    isHighContrastVersion: boolean = false,
  ): ReturnType<typeof CanvasCache.getCanvasAndContext> {
    if (!this.cacheParamsForTextureOfDirectionMarkDefaultContrast)
      this.cacheParamsForTextureOfDirectionMarkDefaultContrast = {
        id: "direction-mark-default",

        width: width,
        height: height,

        alpha: true,
        willReadFrequently: true,
      };

    if (!this.cacheParamsForTextureOfDirectionMarkHighContrast)
      this.cacheParamsForTextureOfDirectionMarkHighContrast = {
        id: "direction-mark-high-contrast",

        width: width,
        height: height,

        alpha: true,
        willReadFrequently: true,
      };

    const canvasCacheParams = isHighContrastVersion
      ? this.cacheParamsForTextureOfDirectionMarkHighContrast
      : this.cacheParamsForTextureOfDirectionMarkDefaultContrast;

    return CanvasCache.getCanvasAndContext(canvasCacheParams);
  }
}

import type { Boundary } from "./Boundary";
import { Point } from "./Point";
import { Tile } from "./Tile";

export class TileMesh {
  private tileSize: { width: number; height: number };
  private tiles = new Map<Tile["id"], Tile>();

  constructor(tileWidth: number, tileHeight: number) {
    this.tileSize = {
      width: tileWidth,
      height: tileHeight,
    };
  }

  forEach(callbackFn: Parameters<typeof this.tiles.forEach>[0]) {
    this.tiles.forEach(callbackFn);
  }

  getById(id: Tile["id"]) {
    return this.tiles.get(id);
  }

  private addTile(id: Tile["id"], position: Point, pieceId: string) {
    let existedTile = this.tiles.get(id);
    if (!existedTile) {
      existedTile = new Tile(id, position, this.tileSize, [pieceId]);
      this.tiles.set(id, existedTile);
    } else {
      existedTile.addPieceId(pieceId);
    }
  }

  addTilesWithinBoundary(boundary: Boundary, pieceId: string) {
    // p0
    const x1 = Math.floor(boundary.x / this.tileSize.width);
    const y1 = Math.floor(boundary.y / this.tileSize.height);

    // p2
    const x2 = Math.floor((boundary.x + boundary.width) / this.tileSize.width);
    const y2 = Math.floor((boundary.y + boundary.height) / this.tileSize.height);

    if (!Number.isFinite(x1) || !Number.isFinite(y1) || !Number.isFinite(x2) || !Number.isFinite(y2)) {
      console.log(`Error. Boundary area allocated by the piece ${pieceId} has incorrect size`);
      return;
    }

    for (let j = y1; j <= y2; j++) {
      for (let i = x1; i <= x2; i++) {
        const tileId = `tile_${i}_${j}`;
        const tilePosition = new Point(i * this.tileSize.width, j * this.tileSize.height);

        this.addTile(tileId, tilePosition, pieceId);
      }
    }
  }
}

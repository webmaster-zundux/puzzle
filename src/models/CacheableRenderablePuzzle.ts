import type { CacheableRenderablePiece, CacheableRenderablePieceOptions } from "./CacheableRenderablePiece";
import type { RenderablePuzzleOptions } from "./RenderablePuzzle";
import { RenderablePuzzle } from "./RenderablePuzzle";

export interface CacheableRenderablePuzzleOptions<UPiece, UPieceOptions>
  extends RenderablePuzzleOptions<UPiece, UPieceOptions> {}

export class CacheableRenderablePuzzle<
  CPiece extends CacheableRenderablePiece = CacheableRenderablePiece,
  CPieceOptions extends CacheableRenderablePieceOptions = CacheableRenderablePieceOptions,
> extends RenderablePuzzle<CPiece, CPieceOptions> {}

import type { SimplePoint } from "../models/SimplePoint";
import { limitNumberToInteger } from "../utils/limitNumberToInteger";

export interface PieceEdgeBevelHighlightAndShadowParams {
  blurWidth: number;
  highlightOffsetPoint: SimplePoint;
  shadowOffsetPoint: SimplePoint;
  highlightOpacity: number;
  shadowOpacity: number;
}
export const getPieceEdgeBevelHighlightAndShadowParams = (
  pieceWidth: number = 50,
  pieceHeight: number = 50,
): PieceEdgeBevelHighlightAndShadowParams => {
  const smallestSideSize = pieceWidth > pieceHeight ? pieceHeight : pieceWidth;
  const width = smallestSideSize;
  const bevelWidth = limitNumberToInteger(width / 50 / 2); // px

  const minBevelWidth = 1; // px
  const maxBevelWidth = 50; // px
  const pieceEdgeBevelOffsetToWidthRatio = 0.5;

  let pieceEdgBevelWidth = bevelWidth; // px

  if (pieceEdgBevelWidth < minBevelWidth) {
    pieceEdgBevelWidth = minBevelWidth;
  } else if (pieceEdgBevelWidth > maxBevelWidth) {
    pieceEdgBevelWidth = maxBevelWidth;
  }

  const offset = (pieceEdgBevelWidth * pieceEdgeBevelOffsetToWidthRatio) / 2; // px

  const highlightOffsetPoint = { x: offset, y: offset }; // px, px
  const shadowOffsetPoint = { x: -offset, y: -offset }; // px, px
  const highlightOpacity = 0.5;
  const shadowOpacity = 0.5;

  const blurWidth = pieceEdgBevelWidth;

  const bevelParams = {
    blurWidth,
    highlightOffsetPoint,
    shadowOffsetPoint,
    highlightOpacity,
    shadowOpacity,
  };

  return bevelParams;
};

let cachedBevelParams: {
  [key: string]: PieceEdgeBevelHighlightAndShadowParams;
};

export const getPieceEdgeBevelHighlightAndShadowParamsFromBevelParamsCache = (
  pieceWidth: number = 50,
  pieceHeight: number = 50,
): PieceEdgeBevelHighlightAndShadowParams => {
  const optionHash = `${pieceWidth}x${pieceHeight}`;

  if (cachedBevelParams && cachedBevelParams[optionHash]) {
    return cachedBevelParams[optionHash];
  }

  cachedBevelParams = {
    [optionHash]: getPieceEdgeBevelHighlightAndShadowParams(pieceWidth, pieceHeight),
  };

  return cachedBevelParams[optionHash];
};

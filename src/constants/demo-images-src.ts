import type { PuzzleParams } from "../hooks/usePuzzleInformation";
import { Point } from "../models/Point";

export type ImageSrc = string;

type DemoPuzzleParams = Required<
  Omit<
    PuzzleParams,
    | "name"
    | "pieceWidth"
    | "connectionActivationAreaSideSizeFractionFromPieceSideSize"
    | "piecesPositions"
    | "pieceSideShapeName"
    | "imageOriginalSize"
  >
>;

export const DEMO_IMAGES_PUZZLE_PARAMS: DemoPuzzleParams[] = [
  {
    imageSrc: "/demo-images/demo-image-1920x1080.png",
    numberOfPiecesPerWidth: 7,
    numberOfPiecesPerHeight: 4,
    boundaryPoints: {
      tl: new Point(0, 0),
      br: new Point(1890, 1080),
    },
  },
  {
    imageSrc: "/demo-images/demo-image-1080x1920.png",
    numberOfPiecesPerWidth: 4,
    numberOfPiecesPerHeight: 7,
    boundaryPoints: {
      tl: new Point(0, 0),
      br: new Point(1080, 1890),
    },
  },
];

export const DEMO_PUZZLE = DEMO_IMAGES_PUZZLE_PARAMS[0];

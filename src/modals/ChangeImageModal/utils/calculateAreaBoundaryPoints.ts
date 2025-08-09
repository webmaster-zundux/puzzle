import { Point } from "../../../models/Point";
import { DEFAULT_MINIMAL_PIECE_SIDE_SIZE_IN_PX } from "../components/PuzzleCreationForm";

/**
 * if `secondaryDiagonal` is `true` then `topLeftPointIsModificationRootPoint` will be ignored
 */
export const calculateAreaPointsLimitedByMinimalAreaSize = ({
  topLeftPointIsModificationRootPoint,
  secondaryDiagonal = false,
  bottomLeftIsModificationRootPoint = false,
  tl,
  br,
  imageWidth,
  imageHeight,
}: {
  topLeftPointIsModificationRootPoint: boolean;
  secondaryDiagonal?: boolean;
  bottomLeftIsModificationRootPoint?: boolean;
  tl: Point;
  br: Point;
  imageWidth: number;
  imageHeight: number;
}) => {
  let tlX = tl.x;
  let tlY = tl.y;

  let brX = br.x;
  let brY = br.y;

  const SIDE_SIZE = DEFAULT_MINIMAL_PIECE_SIDE_SIZE_IN_PX + 1;

  const width = Math.ceil(brX - tlX);
  const height = Math.ceil(brY - tlY);

  if (secondaryDiagonal) {
    if (bottomLeftIsModificationRootPoint) {
      if (width < SIDE_SIZE) {
        tlX = brX - SIDE_SIZE;
      }

      if (height < SIDE_SIZE) {
        brY = tlY + SIDE_SIZE;
      }
    } else {
      if (width < SIDE_SIZE) {
        brX = tlX + SIDE_SIZE;
      }

      if (height < SIDE_SIZE) {
        tlY = brY - SIDE_SIZE;
      }
    }

    if (bottomLeftIsModificationRootPoint) {
      if (tlX < 0) {
        tlX = 0;
        brX = SIDE_SIZE;
      }

      if (brY > imageHeight) {
        brY = imageHeight;
        tlY = brY - SIDE_SIZE;
      }
    } else {
      if (brX > imageWidth) {
        brX = imageWidth;
        tlX = brX - SIDE_SIZE;
      }

      if (tlY < 0) {
        tlY = 0;
        brY = SIDE_SIZE;
      }
    }
  } else {
    if (topLeftPointIsModificationRootPoint) {
      if (width < SIDE_SIZE) {
        tlX = brX - SIDE_SIZE;
      }

      if (height < SIDE_SIZE) {
        tlY = brY - SIDE_SIZE;
      }
    } else {
      if (width < SIDE_SIZE) {
        brX = tlX + SIDE_SIZE;
      }

      if (height < SIDE_SIZE) {
        brY = tlY + SIDE_SIZE;
      }
    }

    if (topLeftPointIsModificationRootPoint) {
      if (tlX < 0) {
        tlX = 0;
        brX = SIDE_SIZE;
      }

      if (tlY < 0) {
        tlY = 0;
        brY = SIDE_SIZE;
      }
    } else {
      if (brX > imageWidth) {
        brX = imageWidth;
        tlX = brX - SIDE_SIZE;
      }

      if (brY > imageHeight) {
        brY = imageHeight;
        tlY = brY - SIDE_SIZE;
      }
    }
  }

  return {
    tl: new Point(tlX, tlY),
    br: new Point(brX, brY),
  };
};

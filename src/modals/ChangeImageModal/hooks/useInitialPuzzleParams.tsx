import { useEffect } from "react";
import { usePuzzleInformation } from "../../../hooks/usePuzzleInformation";
import { Point } from "../../../models/Point";
import type { useSelectedZoneBoundaryPoints } from "./useSelectedZoneBoundaryPoints";

export const useInitialSelectedAreaIfImageSrcIsTheSame = ({
  imageSrc = undefined,
  isImageDisplayed = false,
  dispatchZoneControlPointsChange,
  imageScale,
}: {
  imageSrc?: string;
  dispatchZoneControlPointsChange: ReturnType<typeof useSelectedZoneBoundaryPoints>["dispatchZoneControlPointsChange"];
  isImageDisplayed: boolean;
  imageScale: number;
}) => {
  const { imageSrc: initialImageSrc, boundaryPoints: initialBoundaryPoints } = usePuzzleInformation();

  useEffect(() => {
    if (!isImageDisplayed) {
      return;
    }

    if (imageSrc !== initialImageSrc) {
      return;
    }

    dispatchZoneControlPointsChange({
      type: "set",
      tl: new Point(initialBoundaryPoints.tl.x / imageScale, initialBoundaryPoints.tl.y / imageScale),
      br: new Point(initialBoundaryPoints.br.x / imageScale, initialBoundaryPoints.br.y / imageScale),
    });
  }, [isImageDisplayed, dispatchZoneControlPointsChange, imageScale, initialBoundaryPoints, initialImageSrc, imageSrc]);
};

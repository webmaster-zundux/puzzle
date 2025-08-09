import { useCallback } from "react";
import type { ControlPointName } from "../components/SelectZone";

export const useTextSelectionIsolation = (imageContainerRef: React.RefObject<HTMLDivElement>) => {
  const handleTextSelectionMode = useCallback(
    (controlPointName?: ControlPointName) => {
      const bodyElement = document.querySelector("body");
      if (!bodyElement) {
        return;
      }

      const imageContainer = imageContainerRef?.current;
      if (!imageContainer) {
        return;
      }

      if (!controlPointName) {
        bodyElement.style.userSelect = "auto";
        imageContainer.style.userSelect = "auto";
        return;
      }

      bodyElement.style.userSelect = "none";
      imageContainer.style.userSelect = "all";
    },
    [imageContainerRef],
  );

  return handleTextSelectionMode;
};

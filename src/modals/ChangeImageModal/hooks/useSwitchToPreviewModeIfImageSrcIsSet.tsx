import { useEffect } from "react";

export const useSwitchToPreviewModeIfImageSrcIsSet = (onSwitchToPreviewMode: () => void, imageSrc?: string) => {
  useEffect(() => {
    if (!imageSrc) {
      return;
    }

    onSwitchToPreviewMode();
  }, [imageSrc, onSwitchToPreviewMode]);
};

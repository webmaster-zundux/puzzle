import { useCallback } from "react";
import { useFullScreenHandle, FullScreen } from "react-full-screen";

export function useFullscreenMode() {
  const fullScreenModeHandle = useFullScreenHandle();
  const isFullscreenModeActive = fullScreenModeHandle.active;

  const handleFullScreenModeEnter = useCallback(async () => {
    try {
      await fullScreenModeHandle.enter();
    } catch (error) {
      console.error("failure of entering into fullscreen mode", error);
    }
  }, [fullScreenModeHandle]);

  const handleFullScreenModeExit = useCallback(async () => {
    try {
      await fullScreenModeHandle.exit();
    } catch (error) {
      console.error("failure of exiting from fullscreen mode", error);
    }
  }, [fullScreenModeHandle]);

  const toggleFullscreenMode = isFullscreenModeActive ? handleFullScreenModeExit : handleFullScreenModeEnter;

  return {
    toggleFullscreenMode,
    FullScreen,
    fullScreenModeHandle,
    isFullscreenModeActive,
  };
}

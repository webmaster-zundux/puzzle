import type { PropsWithChildren } from "react";
import { memo } from "react";
import { CameraStateProvider } from "../hooks/useCameraState";
import { DebugSettingsStateProvider } from "../hooks/useDebugSettings";
import { PuzzleInformationProvider } from "../hooks/usePuzzleInformation";

export const PuzzleDataProvider = memo(function PuzzleDataProvider({ children }: PropsWithChildren) {
  return (
    <DebugSettingsStateProvider>
      <PuzzleInformationProvider>
        <CameraStateProvider>{children}</CameraStateProvider>
      </PuzzleInformationProvider>
    </DebugSettingsStateProvider>
  );
});

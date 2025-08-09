import { memo, useCallback } from "react";
import { useDebugSettingsState } from "../../hooks/useDebugSettings";
import { ActionButton } from "../ActionButton";
import { DebugTextureCacheCanvas } from "../DebugTextureCacheCanvas";
import { Separator } from "./Separator";

export interface ShowDebugSettingsDialogButtonProps {
  onClick?: () => void;
}

export const ShowDebugSettingsDialogButton = memo(function ShowDebugSettingsDialogButton({
  onClick,
}: ShowDebugSettingsDialogButtonProps) {
  const handleShow = useCallback(() => onClick && onClick(), [onClick]);

  const { showDebugTextureCacheCanvas } = useDebugSettingsState();

  return (
    <>
      <Separator />

      <ActionButton onClick={handleShow} isSidebarButton>
        Debug Settings
      </ActionButton>

      {showDebugTextureCacheCanvas && <DebugTextureCacheCanvas />}
    </>
  );
});

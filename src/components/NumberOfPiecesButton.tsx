import { memo, useCallback, useMemo } from "react";
import type { PuzzleSize } from "../models/PuzzleSize";
import { ActionButton } from "./ActionButton";

interface NumberOfPiecesButtonProps {
  size: PuzzleSize;
  isActive: boolean;
  onSizeChange: (size: PuzzleSize) => void;
}

export const NumberOfPiecesButton = memo(function NumberOfPiecesButton({
  size,
  isActive,
  onSizeChange,
}: NumberOfPiecesButtonProps) {
  const totalNumberOfPieces = useMemo(() => (size[0] * size[1]).toString(), [size]);

  const handleSetChosenSize = useCallback(() => {
    onSizeChange(size);
  }, [size, onSizeChange]);

  const style = {
    minWidth: "3em",
  };

  const title = `${totalNumberOfPieces} pieces`;

  return (
    <ActionButton
      text={totalNumberOfPieces}
      title={title}
      isActive={isActive}
      onClick={handleSetChosenSize}
      style={style}
    />
  );
});

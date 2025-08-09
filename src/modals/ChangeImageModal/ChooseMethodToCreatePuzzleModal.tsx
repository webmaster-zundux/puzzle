import { memo, useCallback, useState } from "react";
import { Modal } from "../../components/Modal";
import type { PuzzleCreationMode } from "../../models/PuzzleCreationMode";
import { PUZZLE_CREATION_MODES } from "../../models/PuzzleCreationMode";
import { ImageCreationMethodForm } from "./components/ImageCreationMethodForm";
import { ImageFromFileForm } from "./components/ImageFromFileForm";
import { ImageFromUrlForm } from "./components/ImageFromUrlForm";
import { PuzzleCreationForm } from "./components/PuzzleCreationForm";
import { SelectingDemoImageForm } from "./components/SelectingDemoImageForm";
import { useImageFileDrop } from "./hooks/useImageFileDrop";
import { usePasteImageFromClipboard } from "./hooks/usePasteImageFromClipboard";
import { useSwitchToPreviewModeIfImageSrcIsSet } from "./hooks/useSwitchToPreviewModeIfImageSrcIsSet";

export interface ChooseMethodToCreatePuzzleModalProps {
  initialImageSrc?: string;
  onHide: () => void;
}

export const ChooseMethodToCreatePuzzleModal = memo(function ChooseMethodToCreatePuzzleModal({
  initialImageSrc,
  onHide,
}: ChooseMethodToCreatePuzzleModalProps) {
  const handleHide = useCallback(() => {
    if (typeof onHide !== "function") {
      return;
    }

    onHide();
  }, [onHide]);

  const [imageSrc, setImageSrc] = useState<string | undefined>(initialImageSrc);
  const [mode, setMode] = useState<PuzzleCreationMode>();

  const handleSwitchToModeChooseMethod = useCallback(() => {
    setMode(PUZZLE_CREATION_MODES.choosing);
    setImageSrc(undefined);
  }, [setMode]);

  const handleSwitchToModeUploadImageFromFile = useCallback(() => {
    setMode(PUZZLE_CREATION_MODES.uploadFromFile);
    setImageSrc(undefined);
  }, [setMode]);

  const handleSwitchToModeEnterImageUrl = useCallback(() => {
    setMode(PUZZLE_CREATION_MODES.enterImageUrl);
    setImageSrc(undefined);
  }, [setMode]);

  const handleSwitchToModeSelectingDemoImage = useCallback(() => {
    setMode(PUZZLE_CREATION_MODES.selectingFromDemoImages);
    setImageSrc(undefined);
  }, [setMode]);

  const handleSwitchToModePreview = useCallback(() => {
    setMode(PUZZLE_CREATION_MODES.previewingImage);
  }, [setMode]);

  useSwitchToPreviewModeIfImageSrcIsSet(handleSwitchToModePreview, imageSrc);

  usePasteImageFromClipboard({ setImageSrc });
  useImageFileDrop({ setImageSrc });

  const dialogTitle =
    mode === PUZZLE_CREATION_MODES.uploadFromFile
      ? "Upload an image from device"
      : mode === PUZZLE_CREATION_MODES.enterImageUrl
        ? "Load an image from a link"
        : mode === PUZZLE_CREATION_MODES.selectingFromDemoImages
          ? "Choose a demo image"
          : mode === PUZZLE_CREATION_MODES.previewingImage
            ? "Puzzle creation"
            : "Choose method to create a puzzle";

  if (imageSrc && mode !== PUZZLE_CREATION_MODES.previewingImage) {
    return;
  }

  return (
    <Modal
      dialogTitle={dialogTitle}
      onHide={handleHide}
      onClickOnBackground={handleHide}
      fullHeight={mode === PUZZLE_CREATION_MODES.previewingImage}
    >
      {mode === PUZZLE_CREATION_MODES.choosing && (
        <ImageCreationMethodForm
          onShowChoiceSelectDemoImageDialog={handleSwitchToModeSelectingDemoImage}
          onSwitchToModeUploadImageFromFile={handleSwitchToModeUploadImageFromFile}
          onSwitchToModeEnterImageUrl={handleSwitchToModeEnterImageUrl}
        />
      )}

      {mode === PUZZLE_CREATION_MODES.uploadFromFile && (
        <ImageFromFileForm
          setImageSrc={setImageSrc}
          onShowChoiceSelectDemoImageDialog={handleSwitchToModeSelectingDemoImage}
          onSwitchToModeEnterImageUrl={handleSwitchToModeEnterImageUrl}
        />
      )}

      {mode === PUZZLE_CREATION_MODES.enterImageUrl && (
        <ImageFromUrlForm
          setImageSrc={setImageSrc}
          onShowChoiceSelectDemoImageDialog={handleSwitchToModeSelectingDemoImage}
          onSwitchToModeUploadImageFromFile={handleSwitchToModeUploadImageFromFile}
        />
      )}

      {mode === PUZZLE_CREATION_MODES.selectingFromDemoImages && (
        <SelectingDemoImageForm
          onChooseMethodToUploadImage={handleSwitchToModeChooseMethod}
          onSelectImageSrc={setImageSrc}
          onSwitchToModeUploadImageFromFile={handleSwitchToModeUploadImageFromFile}
          onSwitchToModeEnterImageUrl={handleSwitchToModeEnterImageUrl}
        />
      )}

      {mode === PUZZLE_CREATION_MODES.previewingImage && (
        <PuzzleCreationForm
          imageSrc={imageSrc}
          onHideModal={handleHide}
          onSwitchToModeChooseMethod={handleSwitchToModeChooseMethod}
        />
      )}
    </Modal>
  );
});

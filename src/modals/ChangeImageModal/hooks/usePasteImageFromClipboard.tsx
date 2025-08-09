import { useEffect } from "react";
import { getImageFileAsDataUrlFromDataTransfer } from "../utils/getFileFromDataTransfer";

interface UsePasteImageFromClipboardProps {
  setImageSrc: (imageSrc: string) => void;
}

export const usePasteImageFromClipboard = ({ setImageSrc }: UsePasteImageFromClipboardProps) => {
  useEffect(() => {
    const handlePasteFromClipBoard = async (event: ClipboardEvent) => {
      const items = event?.clipboardData?.files;
      if (!items) {
        return;
      }

      try {
        const imageDataUrl = await getImageFileAsDataUrlFromDataTransfer(items);
        if (!imageDataUrl) {
          return;
        }

        setImageSrc(imageDataUrl);
      } catch (error) {
        console.error("Error while loading the image from the clipboard", error);
      }
    };

    document.addEventListener("paste", handlePasteFromClipBoard);

    return () => {
      document.removeEventListener("paste", handlePasteFromClipBoard);
    };
  }, [setImageSrc]);
};

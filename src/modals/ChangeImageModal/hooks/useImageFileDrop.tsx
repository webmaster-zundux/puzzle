import { useEffect } from "react";
import { getImageFileAsDataUrlFromDataTransfer } from "../utils/getFileFromDataTransfer";

interface UseImageFileDropProps {
  setImageSrc: (imageSrc: string) => void;
}

export const useImageFileDrop = ({ setImageSrc }: UseImageFileDropProps) => {
  useEffect(() => {
    const handleDrop = async (event: DragEvent) => {
      event.preventDefault();

      const items = event.dataTransfer?.items;
      if (!items) {
        return;
      }

      const imageDataUrl = await getImageFileAsDataUrlFromDataTransfer(items);

      if (!imageDataUrl) {
        return;
      }

      setImageSrc(imageDataUrl);
    };

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
    };

    const handleDragEnter = () => {};
    const handleDragLeave = () => {};

    document.addEventListener("drop", handleDrop);
    document.addEventListener("dragover", handleDragOver);

    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);

    return () => {
      document.removeEventListener("drop", handleDrop);
      document.removeEventListener("dragover", handleDragOver);

      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
    };
  }, [setImageSrc]);
};

import { useEffect, useState } from "react";
import { loadImageFromUrlOnTheSameDomain } from "../../../utils/loadImageFromUrlOnTheSameDomain";

interface UseLoadImageForPreviewProps {
  imageSrc?: string;
}

export const useLoadImageForPreview = ({
  imageSrc,
}: UseLoadImageForPreviewProps): {
  image: HTMLImageElement | undefined;
  imageWidth: number;
  imageHeight: number;
} => {
  const [image, setImage] = useState<HTMLImageElement | undefined>();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!imageSrc) {
      setImage(undefined);
      setWidth(0);
      setHeight(0);
      return;
    }

    const loadImageFromImageScr = async () => {
      const image = await loadImageFromUrlOnTheSameDomain(imageSrc);
      if (!image) {
        console.error("Error to load image from imageSrc");
        setImage(undefined);
        setWidth(0);
        setHeight(0);
        return;
      }

      setImage(image);
      setWidth(image.width);
      setHeight(image.height);
    };

    loadImageFromImageScr();
  }, [imageSrc, setImage, setWidth, setHeight]);

  return {
    image,
    imageWidth: width,
    imageHeight: height,
  };
};

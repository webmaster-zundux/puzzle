import { useEffect, useState } from "react";
import { loadImageFromUrlOnTheSameDomain } from "../utils/loadImageFromUrlOnTheSameDomain";

interface useImageLoadFromUrl {
  imageSrc?: string;
}

export const useImageLoadFromUrl = ({ imageSrc }: useImageLoadFromUrl) => {
  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    if (!imageSrc) {
      return;
    }

    try {
      const loadImage = async () => {
        const image = await loadImageFromUrlOnTheSameDomain(imageSrc);
        if (!image) {
          return;
        }

        setImage(image);
      };
      loadImage();
    } catch (error) {
      console.error("Error to load the file from url error", error);
    }
  }, [imageSrc, setImage]);

  return { image };
};

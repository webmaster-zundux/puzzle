import type * as originalModule from "../useLoadImageForPreview";

export const useLoadImageForPreview: typeof originalModule.useLoadImageForPreview = ({ imageSrc }) => {
  if (imageSrc) {
    const image = {} as HTMLImageElement;
    image.src = imageSrc;
    image.width = 1920;
    image.height = 1080;

    return {
      image,
      imageWidth: image.width,
      imageHeight: image.height,
    };
  }

  return {
    image: undefined,
    imageWidth: 0,
    imageHeight: 0,
  };
};

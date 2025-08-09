import type { ImageSrc } from "../../../constants/demo-images-src";

export const getHumanizedImageName = (imageSrc: ImageSrc): string | undefined => {
  if (!imageSrc) {
    return undefined;
  }

  const filePathParts = imageSrc.split("/");
  const fileName = filePathParts[filePathParts.length - 1];
  const fileNameParts = fileName.split(".");
  fileNameParts.pop();

  const fileNameWithoutFileExtension = fileNameParts.join(" ");
  const humanizedFileName = fileNameWithoutFileExtension.replace(/-/gi, " ");

  return humanizedFileName;
};

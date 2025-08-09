import { isAllowedMimeType } from "./isAllowedMimeType";

export const getImageFileAsDataUrlFromFormFileInput = (file: File | undefined) => {
  return new Promise<string | undefined>((resolve, reject) => {
    if (!file) {
      reject(undefined);
      return;
    }

    if (isAllowedMimeType(file.type)) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const dataUrl = event?.target?.result;
        if (typeof dataUrl === "string") {
          resolve(dataUrl);
          return;
        }

        reject(undefined);
      };
      reader.readAsDataURL(file);
    } else {
      console.error("file type is not allowed");
    }
  });
};

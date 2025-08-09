import { isAllowedMimeType } from "./isAllowedMimeType";

export const getImageFileAsDataUrlFromDataTransfer = (items: FileList | DataTransferItemList | undefined) => {
  return new Promise<string | undefined>((resolve, reject) => {
    if (!items?.length) {
      reject(undefined);
      return;
    }

    const item = items[0];
    if (item instanceof DataTransferItem) {
      if (item.kind !== "file") {
        console.error("Error. Only file transfer supporting");
        reject(undefined);
        return;
      }
    }

    if (!isAllowedMimeType(item.type)) {
      console.error("Error. File type does not supported. File should be an image");
      reject(undefined);
      return;
    }

    const blob = item instanceof DataTransferItem ? item.getAsFile() : item;
    if (!blob) {
      reject(undefined);
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const dataUrl = event?.target?.result;
      if (typeof dataUrl === "string") {
        resolve(dataUrl);
        return;
      }

      reject(undefined);
      return;
    };
    reader.readAsDataURL(blob);
  });
};

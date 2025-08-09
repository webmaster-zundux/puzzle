export const loadImageFromUrlOnTheSameDomain = async (
  imageSrc: string,
  isCrossOriginAnonymous: boolean = false,
): Promise<HTMLImageElement | undefined> =>
  new Promise((resolve, reject) => {
    if (!imageSrc) {
      reject(undefined);
      return;
    }

    const imageInstance = new Image();
    imageInstance.onload = () => {
      resolve(imageInstance);
    };
    imageInstance.onabort = () => {
      reject(undefined);
    };
    imageInstance.onerror = (error) => {
      console.error("Error to load the image from url error", error);
      reject(undefined);
    };

    if (isCrossOriginAnonymous) {
      imageInstance.crossOrigin = "anonymous";
    }
    imageInstance.referrerPolicy = "no-referrer";
    imageInstance.src = imageSrc;
  });

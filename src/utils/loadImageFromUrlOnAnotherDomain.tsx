export const loadImageFromUrlOnAnotherDomain = async (imageSrc: string): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    fetch(imageSrc, { mode: "no-cors", referrerPolicy: "no-referrer", credentials: "omit", redirect: "error" })
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      })
      .catch((error) => reject(error));
  });
};

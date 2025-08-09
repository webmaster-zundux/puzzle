export const getBase64ImageFromUrl = async (imageUrl: string): Promise<string | undefined> => {
  const res = await fetch(imageUrl, {
    mode: "no-cors",
    referrerPolicy: "no-referrer",
    credentials: "omit",
    redirect: "error",
  });
  const blob = await res.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(undefined);
        return;
      }

      resolve(reader.result);
    };
    reader.onerror = (error) => {
      console.error("Error to encod the image from url to base64 error", error);
      reject(undefined);
    };
    reader.readAsDataURL(blob);
  });
};

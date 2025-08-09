export const urlToFile = async (url: string, filename: string, mimeType: string) => {
  const res = await fetch(url, {
    mode: "no-cors",
    referrerPolicy: "no-referrer",
    credentials: "omit",
    redirect: "error",
  });
  const buf = await res.arrayBuffer();

  return new File([buf], filename, { type: mimeType });
};

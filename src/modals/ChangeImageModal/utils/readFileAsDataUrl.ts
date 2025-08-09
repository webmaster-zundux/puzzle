export const readFileAsDataURL = async (file: File) =>
  new Promise<FileReader>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr);
    fr.onerror = (err) => reject(err);
    fr.readAsDataURL(file);
  });

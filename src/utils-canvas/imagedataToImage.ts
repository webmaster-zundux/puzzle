import { create2dContext } from "./create2dContext";

export const imagedataToImage = (imagedata: ImageData) => {
  const { canvas: resultCanvas, context: ctx } = create2dContext(imagedata.width, imagedata.height);

  ctx.putImageData(imagedata, 0, 0);

  const image = new Image();
  image.src = resultCanvas.toDataURL();

  return image;
};

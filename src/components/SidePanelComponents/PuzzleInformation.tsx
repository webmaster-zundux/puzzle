import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useHtmlElementResize } from "../../hooks/useElementResize";
import { usePuzzleInformation } from "../../hooks/usePuzzleInformation";
import { loadImageFromUrlOnTheSameDomain } from "../../utils/loadImageFromUrlOnTheSameDomain";
import s from "./PuzzleInformation.module.css";

export interface PuzzleInformationProps {}

export const PuzzleInformation = memo(function PuzzleInformation() {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { numberOfPiecesPerWidth, numberOfPiecesPerHeight, imageSrc, boundaryPoints } = usePuzzleInformation();

  const totalNumberOfPieces = useMemo(
    () => numberOfPiecesPerWidth * numberOfPiecesPerHeight,
    [numberOfPiecesPerWidth, numberOfPiecesPerHeight],
  );

  const { elementWidth: imageContainerWidth } = useHtmlElementResize(imageContainerRef);

  const renderPreview = useCallback(async () => {
    if (!imageSrc) {
      return;
    }

    const canvas = canvasRef?.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const image = await loadImageFromUrlOnTheSameDomain(imageSrc);
    if (!image || !image.width || !image.height) {
      return;
    }

    const x1 = boundaryPoints.tl.x;
    const y1 = boundaryPoints.tl.y;
    const x2 = boundaryPoints.br.x;
    const y2 = boundaryPoints.br.y;

    const width = x2 - x1;
    const height = y2 - y1;

    const scale = width / imageContainerWidth;

    const targetWidth = imageContainerWidth;
    const targetHeight = height / scale;

    if (targetWidth < 1 || targetWidth < 1) {
      return;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.drawImage(image, x1, y1, x2 - x1, y2 - y1, 0, 0, targetWidth, targetHeight);
  }, [
    imageSrc,
    boundaryPoints.tl.x,
    boundaryPoints.tl.y,
    boundaryPoints.br.x,
    boundaryPoints.br.y,
    imageContainerWidth,
  ]);

  useEffect(() => {
    renderPreview();
  }, [renderPreview]);

  return (
    <div className={s.PuzzleInformation}>
      <div ref={imageContainerRef} className={s.ImageContainer}>
        <canvas ref={canvasRef} className={s.Preview} title="puzzle preview"></canvas>
      </div>
      <div className={s.AdditionalInformation}>
        <div className={s.PiecesInformation} role="note" aria-label="pieces info">
          {totalNumberOfPieces} pieces ({numberOfPiecesPerWidth}x{numberOfPiecesPerHeight})
        </div>
      </div>
    </div>
  );
});

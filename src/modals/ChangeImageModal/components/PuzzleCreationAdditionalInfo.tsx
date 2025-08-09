import { memo } from "react";
import { HotKeyLabel } from "../../../components/HotKeyLabel";
import { Note } from "./Note";
import s from "./PuzzleCreationAdditionalInfo.module.css";

interface PuzzleCreationAdditionalInfoProps {
  imageWidth: number;
  imageHeight: number;
  pieceSideSize: number;
  pieceMinimalSideSizeInImageScale: number;
}

export const PuzzleCreationAdditionalInfo = memo(function PuzzleCreationAdditionalInfo({
  imageWidth,
  imageHeight,
  pieceSideSize = 0,
  pieceMinimalSideSizeInImageScale,
}: PuzzleCreationAdditionalInfoProps) {
  return (
    <div className={s.AdditionalInfo}>
      <div className={s.SideSizeNote}>
        Side size of single piece: {pieceSideSize > 0 ? pieceSideSize.toFixed() : 0}px (min{" "}
        {pieceMinimalSideSizeInImageScale}px)
      </div>

      <div className={s.SideSizeNote}>
        Image size: {imageWidth > 0 ? imageWidth.toFixed() : 0}x{imageHeight > 0 ? imageHeight.toFixed() : 0}px
      </div>

      <Note asText noGapInRow aria-label="quick way to change the image">
        <div>To quick change the image:&nbsp;</div>
        <div>drag and drop an image here&nbsp;</div>
        <div>
          or use {""}
          <HotKeyLabel>
            <kbd>ctrl</kbd> + <kbd>v</kbd>
          </HotKeyLabel>{" "}
          (to paste an image from clipboard)
        </div>
      </Note>
    </div>
  );
});

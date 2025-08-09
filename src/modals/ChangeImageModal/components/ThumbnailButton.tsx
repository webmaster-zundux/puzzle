import { memo, useCallback, useMemo } from "react";
import { ActionButton } from "../../../components/ActionButton";
import type { ImageSrc } from "../../../constants/demo-images-src";
import { getHumanizedImageName } from "../utils/getHumanizedImageName";
import s from "./ThumbnailButton.module.css";

interface ThumbnailButtonProps {
  imageSrc: ImageSrc;
  isActive: boolean;
  onSelectImage: (imageSrc: string) => void;
}

export const ThumbnailButton = memo(function ThumbnailButton({
  imageSrc,
  isActive,
  onSelectImage,
}: ThumbnailButtonProps) {
  const handleSelectImage = useCallback(() => {
    if (typeof onSelectImage !== "function") {
      return;
    }

    onSelectImage(imageSrc);
  }, [imageSrc, onSelectImage]);

  const imageHumanizedName = useMemo(() => getHumanizedImageName(imageSrc), [imageSrc]);

  return (
    <div className={s.ImageThumbnailContainer}>
      <ActionButton isActive={isActive} onClick={handleSelectImage} style={{ padding: "0.5em" }}>
        <img src={imageSrc} alt={imageSrc} className={s.Thumbnail} />
      </ActionButton>

      <div className={s.ImageHumanizedName}>{imageHumanizedName}</div>

      <div className={s.ImageSourceLink}>
        <span>Image link:</span>{" "}
        <a href={imageSrc} target="__blank">
          {imageSrc}
        </a>
      </div>
    </div>
  );
});

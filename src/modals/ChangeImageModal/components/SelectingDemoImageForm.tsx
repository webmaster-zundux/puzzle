import type { FormEvent } from "react";
import { memo, useCallback, useState } from "react";
import { ModalActionButton } from "../../../components/ModalActionButton";
import type { ImageSrc } from "../../../constants/demo-images-src";
import { DEMO_IMAGES_PUZZLE_PARAMS } from "../../../constants/demo-images-src";
import { cn } from "../../../utils/cssClassNames";
import { Note } from "./Note";
import { NoteLink } from "./NoteLink";
import s from "./SelectingDemoImageForm.module.css";
import { ThumbnailButton } from "./ThumbnailButton";

export interface SelectingDemoImageFormProps {
  onChooseMethodToUploadImage?: () => void;
  onSelectImageSrc: (imageSrc: string) => void;
  onSwitchToModeUploadImageFromFile: () => void;
  onSwitchToModeEnterImageUrl: () => void;
}

export const SelectingDemoImageForm = memo(function SelectingDemoImageForm({
  onChooseMethodToUploadImage,
  onSelectImageSrc,
  onSwitchToModeUploadImageFromFile,
  onSwitchToModeEnterImageUrl,
}: SelectingDemoImageFormProps) {
  const [chosenImageSrc, setChosenImageSrc] = useState<ImageSrc>();

  const handleChooseMethodToUploadImage = useCallback(() => {
    if (typeof onChooseMethodToUploadImage === "function") {
      onChooseMethodToUploadImage();
    }
  }, [onChooseMethodToUploadImage]);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      if (!chosenImageSrc) {
        return;
      }
      onSelectImageSrc(chosenImageSrc);
    },
    [onSelectImageSrc, chosenImageSrc],
  );

  return (
    <form className={s.Form} onSubmit={handleSubmit}>
      <ul className={s.ImageList}>
        {DEMO_IMAGES_PUZZLE_PARAMS.map(({ imageSrc }, index) => (
          <li key={index} className={s.ImageListItem}>
            <ThumbnailButton
              imageSrc={imageSrc}
              onSelectImage={setChosenImageSrc}
              isActive={imageSrc === chosenImageSrc}
            />
          </li>
        ))}
      </ul>

      <div className={s.FormFooter}>
        <div className={cn([s.ActionButtonList])}>
          <ModalActionButton onClick={handleChooseMethodToUploadImage}>Choose another image</ModalActionButton>

          <ModalActionButton type="submit" isPrimary disabled={!chosenImageSrc}>
            Use selected image
          </ModalActionButton>
        </div>

        <Note aria-label="alternative way to load an image">
          also you can <NoteLink onClick={onSwitchToModeUploadImageFromFile}>upload an image from device</NoteLink>{" "}
          <br />
          or <NoteLink onClick={onSwitchToModeEnterImageUrl}>load an image from a link</NoteLink> <br />
        </Note>
      </div>
    </form>
  );
});

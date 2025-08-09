import type { FC, FormEvent } from "react";
import { useCallback, useRef } from "react";
import { loadImageFromUrlOnTheSameDomain } from "../../../utils/loadImageFromUrlOnTheSameDomain";
import s from "./ImageFromUrlForm.module.css";
import { Note } from "./Note";
import { NoteLink } from "./NoteLink";
import { NoteSuggestingToUseDemoImage } from "./NoteSuggestingToUseDemoImage";
import { ModalActionButton } from "../../../components/ModalActionButton";

interface ImageFromUrlFormProps {
  setImageSrc: (imageSrc: string) => void;
  onShowChoiceSelectDemoImageDialog: () => void;
  onSwitchToModeUploadImageFromFile: () => void;
}

export const ImageFromUrlForm: FC<ImageFromUrlFormProps> = ({
  setImageSrc,
  onShowChoiceSelectDemoImageDialog,
  onSwitchToModeUploadImageFromFile,
}) => {
  const imageFromUrlFormRef = useRef<HTMLFormElement>(null);
  const handleSubmitImageUrl = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const form = imageFromUrlFormRef.current;
      if (!form) {
        return;
      }

      const formData = new FormData(form);
      const imageUrl = formData.get("image-link") as string | undefined;
      if (!imageUrl) {
        return;
      }

      try {
        let image;
        image = await loadImageFromUrlOnTheSameDomain(imageUrl, false);
        if (!image) {
          console.error("Error to load an image from the link");
          return;
        }
        setImageSrc(image.src);
      } catch (error) {
        console.error("failure to load an image by link on the same domain", error);
      }
    },
    [setImageSrc],
  );

  return (
    <form ref={imageFromUrlFormRef} onSubmit={handleSubmitImageUrl} className={s.ImageUrlForm}>
      <div className={s.FormField}>
        <input
          type="text"
          name="image-link"
          aria-label="image-link"
          required
          placeholder={`https://example.com/image.png`}
          className={s.Input}
        />
        <ModalActionButton type="submit">Load image</ModalActionButton>
      </div>

      <Note aria-label="alternative way to load an image">
        also you can <NoteLink onClick={onSwitchToModeUploadImageFromFile}>upload an image from device</NoteLink> <br />
        <NoteSuggestingToUseDemoImage onShowChoiceSelectDemoImageDialog={onShowChoiceSelectDemoImageDialog} />
      </Note>
    </form>
  );
};

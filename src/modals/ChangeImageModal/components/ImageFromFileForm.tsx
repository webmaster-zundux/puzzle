import type { FC, FormEvent } from "react";
import { useCallback, useRef } from "react";
import { HotKeyLabel } from "../../../components/HotKeyLabel";
import { ALLOWED_MIME_TYPES, isAllowedMimeType } from "../utils/isAllowedMimeType";
import { readFileAsDataURL } from "../utils/readFileAsDataUrl";
import s from "./ImageFromFileForm.module.css";
import { Note } from "./Note";
import { NoteLink } from "./NoteLink";
import { NoteSuggestingToUseDemoImage } from "./NoteSuggestingToUseDemoImage";

interface ImageFromFileFormProps {
  setImageSrc: (imageSrc: string) => void;
  onShowChoiceSelectDemoImageDialog: () => void;
  onSwitchToModeEnterImageUrl: () => void;
}

export const ImageFromFileForm: FC<ImageFromFileFormProps> = ({
  setImageSrc,
  onShowChoiceSelectDemoImageDialog,
  onSwitchToModeEnterImageUrl,
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmitUploadFileForm = useCallback((event: FormEvent) => {
    event.preventDefault();
  }, []);

  const handleChangeFile = useCallback(async () => {
    const form = formRef.current;
    if (!form) {
      return;
    }

    const formData = new FormData(form);

    try {
      const imageFile = formData.get("image") as File;
      if (!imageFile) {
        console.error("Error. File is not selected");
        return;
      }
      if (!isAllowedMimeType(imageFile.type)) {
        console.error("Error. File type does not supported. File should be an image");
        return;
      }

      const imageAsDataUrl = (await readFileAsDataURL(imageFile)).result;
      if (typeof imageAsDataUrl !== "string") {
        console.error("Error reading the image as data url");
        return;
      }

      setImageSrc(imageAsDataUrl);
    } catch (error) {
      console.error("Error while read the image file", error);
    }
  }, [setImageSrc]);

  const inputFileRef = useRef<HTMLInputElement>(null);
  const handleSelectFile = useCallback(() => {
    const input = inputFileRef.current;
    if (!input) {
      return;
    }

    input.click();
  }, [inputFileRef]);

  return (
    <form ref={formRef} className={s.ImageFromFileForm} onSubmit={handleSubmitUploadFileForm}>
      <div className={s.UploadFileField}>
        <label htmlFor="selected-image-to-upload">Selected image:</label>
        <input
          type="file"
          name="image"
          id="selected-image-to-upload"
          ref={inputFileRef}
          onChange={handleChangeFile}
          accept={ALLOWED_MIME_TYPES.join(", ")}
        />
      </div>
      <button className={s.UploadButton} onClick={handleSelectFile}>
        <div>Click to select an image</div>
        <div>or</div>
        <div>Drag and drop an image here</div>
        <div>or</div>
        <div>
          use {""}
          <HotKeyLabel>
            <kbd>ctrl</kbd> + <kbd>v</kbd>
          </HotKeyLabel>{" "}
        </div>
        <em>(to paste an image from clipboard)</em>
      </button>

      <Note aria-label="alternative way to load an image">
        also you can <NoteLink onClick={onSwitchToModeEnterImageUrl}>load an image from a link</NoteLink> <br />
        <NoteSuggestingToUseDemoImage onShowChoiceSelectDemoImageDialog={onShowChoiceSelectDemoImageDialog} />
      </Note>
    </form>
  );
};

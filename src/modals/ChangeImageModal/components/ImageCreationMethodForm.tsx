import type { FC } from "react";
import { ChoiceButton } from "./ChoiceButton";
import s from "./ImageCreationMethodForm.module.css";
import { Note } from "./Note";
import { NoteLink } from "./NoteLink";
import { HotKeyLabel } from "../../../components/HotKeyLabel";

interface ImageCreationMethodFormProps {
  onSwitchToModeUploadImageFromFile: () => void;
  onSwitchToModeEnterImageUrl: () => void;
  onShowChoiceSelectDemoImageDialog: () => void;
}

export const ImageCreationMethodForm: FC<ImageCreationMethodFormProps> = ({
  onSwitchToModeUploadImageFromFile,
  onSwitchToModeEnterImageUrl,
  onShowChoiceSelectDemoImageDialog,
}) => {
  return (
    <div className={s.ChoicesContainer}>
      <ul className={s.ChoiceButtonGroup}>
        <li className={s.ChoiceButtonContainer}>
          <ChoiceButton isPrimary onClick={onSwitchToModeUploadImageFromFile}>
            <div>Upload an image from device</div>
            <div>or</div>
            <div>drag and drop an image here</div>
            <div>or</div>
            <HotKeyLabel>
              use <kbd>ctrl</kbd> + <kbd>v</kbd>
            </HotKeyLabel>{" "}
            <em>(to paste an image from clipboard)</em>
          </ChoiceButton>
        </li>
        <li className={s.ChoiceButtonContainer}>
          <ChoiceButton onClick={onSwitchToModeEnterImageUrl}>Load an image from a link</ChoiceButton>
        </li>
      </ul>

      <Note aria-label="alternative way to create a puzzle">
        also you can use <NoteLink onClick={onShowChoiceSelectDemoImageDialog}>demo images</NoteLink>
      </Note>
    </div>
  );
};

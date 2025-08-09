import type { FC } from "react";
import { NoteLink } from "./NoteLink";

interface NoteAboutDemoImagesProps {
  onShowChoiceSelectDemoImageDialog: () => void;
}

export const NoteSuggestingToUseDemoImage: FC<NoteAboutDemoImagesProps> = ({ onShowChoiceSelectDemoImageDialog }) => {
  return (
    <>
      or use one of <NoteLink onClick={onShowChoiceSelectDemoImageDialog}>demo images</NoteLink>
    </>
  );
};

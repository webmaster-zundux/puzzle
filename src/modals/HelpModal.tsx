import { memo } from "react";
import { Modal } from "../components/Modal";
import s from "./HelpModal.module.css";

export interface HelpModalProps {
  onHide?: () => void;
}

export const HelpModal = memo(function HelpModal({ onHide }: HelpModalProps) {
  const dialogTitle = "Help";

  return (
    <Modal dialogTitle={dialogTitle} onHide={onHide} onClickOnBackground={onHide}>
      <div className={s.InterfaceScreenshotContainer}>
        <div className={s.InterfaceScreenshot}>interface screenshots</div>
        <div className={s.InterfaceScreenshotLegendLabel}>legend label for screenshot</div>
      </div>

      <div className={s.AnimatedPuzzleSolvingGifContainer}>
        <img
          src="#animated-puzzle-solving-gif"
          alt="animated puzzle solving gif"
          title="animated puzzle solving gif"
          className={s.AnimatedPuzzleSolvingGif}
        />
      </div>
    </Modal>
  );
});

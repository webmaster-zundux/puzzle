import type { FC } from "react";
import { memo } from "react";
import { Modal } from "../components/Modal";
import { ModalActionButton } from "../components/ModalActionButton";

interface ActionButtonsProps {
  onReject?: () => void;
  onConfirm?: () => void;
}

const ActionButtons: FC<ActionButtonsProps> = ({ onReject, onConfirm }) => {
  return (
    <>
      <ModalActionButton onClick={onReject}>Cancel</ModalActionButton>

      <ModalActionButton isPrimary onClick={onConfirm}>
        Solve again
      </ModalActionButton>
    </>
  );
};

export interface PuzzleRestartConfirmationModalProps {
  onHide?: () => void;
  onReject?: () => void;
  onConfirm?: () => void;
}

export const PuzzleRestartConfirmationModal = memo(function PuzzleRestartConfirmationModal({
  onHide,
  onReject,
  onConfirm,
}: PuzzleRestartConfirmationModalProps) {
  const dialogTitle = "Want to solve the puzzle again?";

  return (
    <Modal
      dialogTitle={dialogTitle}
      isCloseButtonHidden
      onHide={onHide}
      onClickOnBackground={onHide}
      isActionButtonsAlignByCenter
      actionButtons={<ActionButtons onReject={onReject} onConfirm={onConfirm} />}
    ></Modal>
  );
});

import type { FC } from "react";
import { cn } from "../utils/cssClassNames";
import { ActionButton } from "./ActionButton";
import s from "./ModalCloseButton.module.css";

interface ModalCloseButtonProps {
  isCloseButtonOutsideOfModalBody?: boolean;
  onClick?: () => void;
}

export const ModalCloseButton: FC<ModalCloseButtonProps> = ({ isCloseButtonOutsideOfModalBody = false, onClick }) => {
  return (
    <div className={cn([s.CloseIcon, isCloseButtonOutsideOfModalBody && s.CloseIconOutsideOfModalBody])}>
      <ActionButton iconName="xmark" noBackground noBorder onClick={onClick} iconSize="double" aria-label="close" />
    </div>
  );
};

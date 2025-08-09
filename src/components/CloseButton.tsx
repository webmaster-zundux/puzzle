import { memo } from "react";
import { ActionButton } from "./ActionButton";
import s from "./CloseIcon.module.css";

export type CloseButtonProps = {
  onClick?: () => void;
};

export const CloseButton = memo(function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <div className={s.CloseIcon}>
      <ActionButton iconName="xmark" noBackground noBorder onClick={onClick} />
    </div>
  );
});

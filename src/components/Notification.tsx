import { type FC, type PropsWithChildren } from "react";
import s from "./Notification.module.css";
import { ModalCloseButton } from "./ModalCloseButton";

interface NotificationProps {
  onHide?: () => void;
  ariaRole?: string;
  ariaLabel?: string;
}

export const Notification: FC<PropsWithChildren<NotificationProps>> = ({
  onHide,
  children,
  ariaRole = "note",
  ariaLabel,
}) => {
  const attributes: Partial<{ role: string; "aria-label": string }> = {};

  if (ariaLabel) {
    attributes["role"] = ariaRole;
    attributes["aria-label"] = ariaLabel;
  }

  return (
    <div className={s.Notification} {...attributes}>
      {children}

      {typeof onHide === "function" && <ModalCloseButton onClick={onHide} />}
    </div>
  );
};

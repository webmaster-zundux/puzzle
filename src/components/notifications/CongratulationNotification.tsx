import type { FC } from "react";
import s from "./CongratulationNotification.module.css";
import { Notification } from "../Notification";

interface CongratulationNotificationProps {
  onHide?: () => void;
}

export const CongratulationNotification: FC<CongratulationNotificationProps> = ({ onHide }) => {
  return (
    <Notification onHide={onHide} ariaRole="note" ariaLabel="puzzle was solved">
      <div className={s.Container} role="alert" aria-label="puzzle was solved">
        <div className={s.Header}>Congratulation!</div>
        <div className={s.Spacer}>&nbsp;</div>
        <div className={s.Message}>Puzzle was solved</div>
      </div>
    </Notification>
  );
};

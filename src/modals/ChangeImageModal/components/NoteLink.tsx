import type { FC, PropsWithChildren } from "react";
import s from "./NoteLink.module.css";

interface NoteLinkProps {
  onClick: () => void;
}

export const NoteLink: FC<PropsWithChildren<NoteLinkProps>> = ({ children, onClick }) => {
  return (
    <a href="#" className={s.NoteLink} onClick={onClick}>
      {children}
    </a>
  );
};

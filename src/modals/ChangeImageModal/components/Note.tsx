import type { DetailedHTMLProps, FC, HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../../utils/cssClassNames";
import s from "./Note.module.css";

interface NoteProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  asText?: boolean;
  noGapInRow?: boolean;
}

export const Note: FC<PropsWithChildren<NoteProps>> = ({ asText = false, noGapInRow = false, children, ...rest }) => {
  const classNames = cn([s.Note, asText && s.AsText, noGapInRow && s.NoHorizontalGap]);

  return (
    <div role="note" className={classNames} {...rest}>
      {children}
    </div>
  );
};

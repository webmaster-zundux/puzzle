import { type FC, type PropsWithChildren, type ReactNode } from "react";
import s from "./Modal.module.css";
import type { ModalBaseProps } from "./ModalBase";
import { ModalBase } from "./ModalBase";
import { cn } from "../utils/cssClassNames";

interface ModalProps extends Omit<ModalBaseProps, "titleForAriaLabel"> {
  dialogTitle?: string;
  actionButtons?: ReactNode;
  isActionButtonsAlignByCenter?: boolean;
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  dialogTitle,
  actionButtons,
  isActionButtonsAlignByCenter = false,
  children,
  ...restProps
}) => {
  return (
    <ModalBase dialogTitleForAriaLabel={dialogTitle} {...restProps}>
      <div className={s.Content}>
        {dialogTitle && <h3 className={s.Title}>{dialogTitle}</h3>}

        <div className={s.MainContent}>{children}</div>

        {actionButtons && (
          <div className={cn([s.ActionButtonList, isActionButtonsAlignByCenter && s.AlignByCenter])}>
            {actionButtons}
          </div>
        )}
      </div>
    </ModalBase>
  );
};

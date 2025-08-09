import type { FC, PropsWithChildren, RefObject } from "react";
import { memo, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { APP_ROOT_ELEMENT_ID } from "../constants/AppRootElementId";
import { KeyboardKey } from "../constants/KeyboardKey";
import { cn } from "../utils/cssClassNames";
import { DialogTabTrap } from "./DialogTabTrap";
import s from "./ModalBase.module.css";
import { ModalCloseButton } from "./ModalCloseButton";

const USE_NATIVE_HTML_DIALOG_ELEMENT = import.meta.env.VITE_USE_DIV_AS_DIALOG_CONTAINER !== "1";

const USE_TAB_TRAP_FOR_DIALOG_WITH_DIV_ELEMENT_CONTAINER =
  import.meta.env.VITE_USE_DIV_AS_DIALOG_CONTAINER_WITH_TAB_TRAP === "1";

const useHtmlDialogElementCancelAndCloseEvents = ({
  dialogRef,
  onHide,
  isPreventCloseByEscapeKeyPress = false,
}: {
  dialogRef: RefObject<HTMLDialogElement | null> | null;
  onHide?: () => void;
  isPreventCloseByEscapeKeyPress?: boolean;
}) => {
  useEffect(() => {
    const dialog = dialogRef?.current;
    if (!dialog) {
      return;
    }

    const handleClose = (event: Event) => {
      event.preventDefault();

      if (typeof onHide === "function") {
        onHide();
      }
    };

    const handleCancel = (event: Event) => {
      event.preventDefault();
    };

    dialog.addEventListener("close", handleClose);

    if (isPreventCloseByEscapeKeyPress) {
      dialog.addEventListener("cancel", handleCancel);
    }

    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("cancel", handleCancel);
    };
  }, [dialogRef, onHide, isPreventCloseByEscapeKeyPress]);
};

interface DialogAsNativeDialogProps {
  ariaLabel?: string;
  isPreventCloseByEscapeKeyPress?: boolean;
  onHide?: () => void;
}

const DialogAsNativeDialog: FC<PropsWithChildren<DialogAsNativeDialogProps>> = ({
  ariaLabel,
  isPreventCloseByEscapeKeyPress = false,
  onHide,
  children,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useHtmlDialogElementCancelAndCloseEvents({
    dialogRef,
    onHide,
    isPreventCloseByEscapeKeyPress,
  });

  useEffect(() => {
    const dialog = dialogRef?.current;
    if (dialog instanceof HTMLDivElement) {
      return;
    }

    if (!dialog) {
      return;
    }

    dialog.showModal();
  }, [dialogRef]);

  return (
    <dialog ref={dialogRef} className={s.Dialog} aria-modal="true" aria-label={ariaLabel}>
      {children}
    </dialog>
  );
};

const useAppRootElementInertAttribute = () => {
  const appRootElement = useMemo(() => document.getElementById(APP_ROOT_ELEMENT_ID), []);

  useEffect(() => {
    if (!appRootElement) {
      console.error("Error! App root element does not exist");
      return;
    }

    appRootElement.setAttribute("inert", "");

    return () => {
      appRootElement.removeAttribute("inert");
    };
  }, [appRootElement]);
};

interface DialogAsDivContainerProps {
  ariaLabel?: string;
  isPreventCloseByEscapeKeyPress?: boolean;
  onHide?: () => void;
}

const DialogAsDivContainer = memo(function DialogAsDivContainer({
  // eslint-disable-next-line react/prop-types
  ariaLabel,
  // eslint-disable-next-line react/prop-types
  isPreventCloseByEscapeKeyPress = false,
  // eslint-disable-next-line react/prop-types
  onHide,
  // eslint-disable-next-line react/prop-types
  children,
}: PropsWithChildren<DialogAsDivContainerProps>) {
  useAppRootElementInertAttribute();

  const wrapperElement = useMemo(() => document.createElement("div"), []);

  useEffect(() => {
    document.body.appendChild(wrapperElement);

    return () => {
      wrapperElement.remove();
    };
  }, [wrapperElement]);

  useEffect(() => {
    if (typeof onHide !== "function") {
      return;
    }

    const handlePressEscKey = (event: KeyboardEvent) => {
      if (isPreventCloseByEscapeKeyPress) {
        return;
      }

      if (event.key === KeyboardKey.Escape) {
        onHide();
      }
    };

    document.addEventListener("keydown", handlePressEscKey);

    return () => {
      document.removeEventListener("keydown", handlePressEscKey);
    };
  }, [onHide, isPreventCloseByEscapeKeyPress]);

  const hasTabTrap = USE_TAB_TRAP_FOR_DIALOG_WITH_DIV_ELEMENT_CONTAINER;

  return createPortal(
    <div className={cn([s.Dialog, s.DialogAsDiv])} role="dialog" aria-modal="true" aria-label={ariaLabel}>
      {hasTabTrap && <DialogTabTrap>{children}</DialogTabTrap>}
      {!hasTabTrap && children}
    </div>,
    wrapperElement,
  );
});

export interface ModalBaseProps {
  dialogTitleForAriaLabel?: string;
  withCardForContent?: boolean;
  fullHeight?: boolean;
  isCloseButtonHidden?: boolean;
  isPreventCloseByEscapeKeyPress?: boolean;
  onHide?: () => void;
  onClickOnBackground?: () => void;
}

export const ModalBase = memo(function ModalBase({
  dialogTitleForAriaLabel = "",
  withCardForContent = true,
  fullHeight = false,
  isCloseButtonHidden = false,
  isPreventCloseByEscapeKeyPress = false,
  onHide,
  onClickOnBackground,
  children,
}: PropsWithChildren<ModalBaseProps>) {
  const dialogContent = (
    <div className={s.DialogBodyContainer}>
      <div className={s.Backdrop} onClick={onClickOnBackground} aria-label="modal-backdrop" aria-hidden="true"></div>

      {!isCloseButtonHidden && !withCardForContent && (
        <ModalCloseButton onClick={onHide} isCloseButtonOutsideOfModalBody={!withCardForContent} />
      )}

      <div className={cn([s.DialogBody, fullHeight && s.FullHeight, withCardForContent && s.WithCardForContent])}>
        {!isCloseButtonHidden && withCardForContent && <ModalCloseButton onClick={onHide} />}
        <div className={s.DialogContent}>{children}</div>
      </div>
    </div>
  );

  if (USE_NATIVE_HTML_DIALOG_ELEMENT) {
    return (
      <DialogAsNativeDialog
        ariaLabel={dialogTitleForAriaLabel}
        onHide={onHide}
        isPreventCloseByEscapeKeyPress={isPreventCloseByEscapeKeyPress}
      >
        {dialogContent}
      </DialogAsNativeDialog>
    );
  } else {
    return (
      <DialogAsDivContainer
        ariaLabel={dialogTitleForAriaLabel}
        onHide={onHide}
        isPreventCloseByEscapeKeyPress={isPreventCloseByEscapeKeyPress}
      >
        {dialogContent}
      </DialogAsDivContainer>
    );
  }
});

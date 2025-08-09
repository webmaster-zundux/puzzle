import type { PropsWithChildren } from "react";
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface DialogTabTrapProps {}

export const DialogTabTrap = memo(function DialogTabTrap({ children }: PropsWithChildren<DialogTabTrapProps>) {
  let [firstElement, setFirstElement] = useState<HTMLDivElement>();
  let [latestElement, setLatestElement] = useState<HTMLDivElement>();

  const firstInBodyRef = useRef<HTMLSpanElement>(null);
  const latestInBodyRef = useRef<HTMLSpanElement>(null);

  const firstInDialogRef = useRef<HTMLSpanElement>(null);
  const latestInDialogRef = useRef<HTMLSpanElement>(null);

  const toFirstInDialog = useCallback(() => {
    if (!firstInDialogRef.current) {
      return;
    }
    firstInDialogRef.current.focus();
  }, [firstInDialogRef]);

  const toLatestInDialog = useCallback(() => {
    if (!latestInDialogRef.current) {
      return;
    }
    latestInDialogRef.current.focus();
  }, [latestInDialogRef]);

  const toFirstInBody = useCallback(() => {
    if (!firstInBodyRef.current) {
      return;
    }
    firstInBodyRef.current.focus();
  }, [firstInBodyRef]);

  const toLastestInBody = useCallback(() => {
    if (!latestInBodyRef?.current) {
      return;
    }
    latestInBodyRef.current.focus();
  }, [latestInBodyRef]);

  useLayoutEffect(() => {
    if (!firstInDialogRef?.current) {
      return;
    }
    firstInDialogRef.current.focus();
  }, [firstInDialogRef]);

  useLayoutEffect(() => {
    const first = document.createElement("div");
    first.id = "first-focusable-element-in-page-body";
    first.style = `
        display: flex;
        position: fixed;
        width: 1px;
        height: 1px;
        background-color: transparent;
        top:0;
        left:0;
      `;

    const latest = document.createElement("div");
    latest.id = "latest-focusable-element-in-page-body";
    latest.style = `
        display: flex;
        position: fixed;
        width: 1px;
        height: 1px;
        background-color: transparent;
        bottom: 0;
        left: 0;
        z-index: 2;
      `;

    try {
      document.body.insertAdjacentElement("afterbegin", first);
      document.body.insertAdjacentElement("beforeend", latest);
    } catch (error) {
      console.error("Error. Impossible init dialog tabbing brigde", error);
    }

    setFirstElement(first);
    setLatestElement(latest);

    return () => {
      setFirstElement(undefined);
      setLatestElement(undefined);
      first.remove();
      latest.remove();
    };
  }, []);

  useEffect(() => {
    const dialogAnchor = firstInDialogRef?.current;
    if (!dialogAnchor || typeof dialogAnchor.focus !== "function") {
      return;
    }

    setTimeout(() => {
      dialogAnchor.focus();
    }, 0);
  }, [firstInDialogRef]);

  return (
    <>
      {firstElement &&
        createPortal(
          <>
            <span id="fb" ref={firstInBodyRef} tabIndex={-1} aria-hidden="true"></span>
            <span tabIndex={0} aria-hidden="true" onFocus={toFirstInDialog}></span>
          </>,
          firstElement,
        )}

      <span tabIndex={0} aria-hidden="true" onFocus={toFirstInBody}></span>
      <span id="-fd-" ref={firstInDialogRef} tabIndex={-1} aria-hidden="true"></span>

      {children}

      <span id="-ld-" ref={latestInDialogRef} tabIndex={-1} aria-hidden="true"></span>
      <span tabIndex={0} aria-hidden="true" onFocus={toLastestInBody}></span>

      {latestElement &&
        createPortal(
          <>
            <span tabIndex={0} aria-hidden="true" onFocus={toLatestInDialog}></span>
            <span id="lb" ref={latestInBodyRef} tabIndex={-1} aria-hidden="true"></span>
          </>,
          latestElement,
        )}
    </>
  );
});

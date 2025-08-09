import type { RefObject } from "react";
import { useCallback, useEffect, useState } from "react";
import { MOUSE_BUTTON_CODE_PRESSED_PRIMARY_BUTTON } from "../constants/MouseButtons";

export interface UsePrimaryMouseButtonProps {
  elementRef: RefObject<HTMLElement> | null;
}

export const usePrimaryMouseButton = ({ elementRef }: UsePrimaryMouseButtonProps): boolean => {
  const [isLeftMousePressed, setIsLeftMousePressed] = useState(false);
  const handleLeftMouseDown = useCallback(
    (event: MouseEvent): void => {
      if (event?.button !== MOUSE_BUTTON_CODE_PRESSED_PRIMARY_BUTTON) {
        return;
      }

      setIsLeftMousePressed(true);
    },
    [setIsLeftMousePressed],
  );

  const handleLeftMouseUp = useCallback(
    (event: MouseEvent): void => {
      if (event?.button !== MOUSE_BUTTON_CODE_PRESSED_PRIMARY_BUTTON) {
        return;
      }

      setIsLeftMousePressed(false);
    },
    [setIsLeftMousePressed],
  );

  const handleMouseLeave = useCallback(() => {
    setIsLeftMousePressed(false);
  }, [setIsLeftMousePressed]);

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) {
      return;
    }

    const mouseEventListenerOptions: Parameters<typeof addEventListener>[2] = { passive: true };
    element.addEventListener("mousedown", handleLeftMouseDown, mouseEventListenerOptions);
    element.addEventListener("mouseup", handleLeftMouseUp, mouseEventListenerOptions);
    element.addEventListener("mouseleave", handleMouseLeave, mouseEventListenerOptions);

    return () => {
      element.removeEventListener("mousedown", handleLeftMouseDown, mouseEventListenerOptions);
      element.removeEventListener("mouseup", handleLeftMouseUp, mouseEventListenerOptions);
      element.removeEventListener("mouseleave", handleMouseLeave, mouseEventListenerOptions);
    };
  }, [elementRef, handleLeftMouseDown, handleLeftMouseUp, handleMouseLeave]);

  return isLeftMousePressed;
};

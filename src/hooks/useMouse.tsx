import type { RefObject } from "react";
import { useCallback, useEffect, useState } from "react";
import { MOUSE_BUTTON_CODE_PRESSED_PRIMARY_BUTTON } from "../constants/MouseButtons";
import type { Point } from "../models/Point";
import { getMousePositionOnScreen } from "../utils/mouse/getMousePositionOnScreen";

export interface UseMouseProps {
  elementRef: RefObject<HTMLElement> | null;
}

export const useMouse = ({
  elementRef,
}: UseMouseProps): {
  isPrimaryMouseButtonPressed: boolean;
  mousePosition: Point | undefined;
} => {
  const [isPrimaryMouseButtonPressed, setIsPrimaryMouseButtonPressed] = useState(false);
  const [mousePosition, setMousePosition] = useState<Point>();

  const setMousePositionFromEvent = useCallback(
    (event: MouseEvent, element: HTMLElement) => {
      if (!element) {
        return;
      }

      const newMousePosition = getMousePositionOnScreen(event, element);
      setMousePosition(newMousePosition);
    },
    [setMousePosition],
  );

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) {
      return;
    }

    let isLeftMousePressed = false;

    const handleLeftMouseDown = (event: MouseEvent): void => {
      setMousePositionFromEvent(event, element);

      if (event.button === MOUSE_BUTTON_CODE_PRESSED_PRIMARY_BUTTON) {
        setIsPrimaryMouseButtonPressed(true);
        isLeftMousePressed = true;
      }
    };

    const handleLeftMouseUp = (event: MouseEvent): void => {
      setMousePositionFromEvent(event, element);

      if (event.button === MOUSE_BUTTON_CODE_PRESSED_PRIMARY_BUTTON) {
        setIsPrimaryMouseButtonPressed(false);
        isLeftMousePressed = false;
      }
    };

    const handleMouseLeave = (event: MouseEvent) => {
      if (!isLeftMousePressed) {
        return;
      }
      setMousePositionFromEvent(event, element);
      setIsPrimaryMouseButtonPressed(false);
      isLeftMousePressed = false;
    };

    const handleMouseMove = (event: MouseEvent): void => {
      const element = elementRef?.current;
      if (!element) {
        return;
      }

      if (!isLeftMousePressed) {
        return;
      }

      setMousePositionFromEvent(event, element);
    };

    const mouseEventListenerOptions: Parameters<typeof addEventListener>[2] = { passive: true };
    element.addEventListener("mousedown", handleLeftMouseDown, mouseEventListenerOptions);
    element.addEventListener("mouseup", handleLeftMouseUp, mouseEventListenerOptions);
    element.addEventListener("mouseleave", handleMouseLeave, mouseEventListenerOptions);
    element.addEventListener("mousemove", handleMouseMove, mouseEventListenerOptions);

    return () => {
      element.removeEventListener("mousedown", handleLeftMouseDown, mouseEventListenerOptions);
      element.removeEventListener("mouseup", handleLeftMouseUp, mouseEventListenerOptions);
      element.removeEventListener("mouseleave", handleMouseLeave, mouseEventListenerOptions);
      element.removeEventListener("mousemove", handleMouseMove, mouseEventListenerOptions);
    };
  }, [elementRef, setMousePositionFromEvent]);

  return { isPrimaryMouseButtonPressed: isPrimaryMouseButtonPressed, mousePosition };
};

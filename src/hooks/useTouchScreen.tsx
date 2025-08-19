import type { RefObject } from "react";
import { useCallback, useEffect, useState } from "react";
import type { Point } from "../models/Point";
import { getTouchPositionOnScreen } from "../utils/touchScreen/getTouchPositionOnScreen";

export interface UseTouchProps {
  elementRef: RefObject<HTMLElement> | null;
}

export const useTouchScreen = ({
  elementRef,
}: UseTouchProps): {
  hasTouch: boolean;
  touchPosition: Point | undefined;
} => {
  const [hasTouch, setHasTouch] = useState(false);
  const [touchPosition, setTouchPosition] = useState<Point>();
  const setTouchPositionFromEvent = useCallback(
    (event: TouchEvent, element: HTMLElement) => {
      if (!element) {
        return;
      }

      const newTouchPosition = getTouchPositionOnScreen(event, element);
      setTouchPosition(newTouchPosition);
    },
    [setTouchPosition],
  );

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) {
      return;
    }

    let hasTouch = false;

    const handleTouchStart = (event: TouchEvent): void => {
      event.preventDefault()
      setTouchPositionFromEvent(event, element);
      setHasTouch(true);
      hasTouch = true;
    };

    const handleTouchEnd = (event: TouchEvent): void => {
      event.preventDefault()
      setTouchPositionFromEvent(event, element);
      setHasTouch(false);
      hasTouch = false;
    };

    const handleTouchCancel = (event: TouchEvent) => {
      event.preventDefault()
      if (!hasTouch) {
        return;
      }
      setTouchPositionFromEvent(event, element);
      setHasTouch(false);
      hasTouch = false;
    };

    const handleTouchMove = (event: TouchEvent): void => {
      event.preventDefault()
      const element = elementRef?.current;
      if (!element) {
        return;
      }

      if (!hasTouch) {
        return;
      }

      setTouchPositionFromEvent(event, element);
    };

    const touchEventListenerOptions: Parameters<typeof addEventListener>[2] = { passive: true };
    element.addEventListener("touchstart", handleTouchStart, touchEventListenerOptions);
    element.addEventListener("touchend", handleTouchEnd, touchEventListenerOptions);
    element.addEventListener("touchcancel", handleTouchCancel, touchEventListenerOptions);
    element.addEventListener("touchmove", handleTouchMove, touchEventListenerOptions);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart, touchEventListenerOptions);
      element.removeEventListener("touchend", handleTouchEnd, touchEventListenerOptions);
      element.removeEventListener("touchcancel", handleTouchCancel, touchEventListenerOptions);
      element.removeEventListener("touchmove", handleTouchMove, touchEventListenerOptions);
    };
  }, [elementRef, setHasTouch, setTouchPositionFromEvent]);

  return { hasTouch, touchPosition };
};

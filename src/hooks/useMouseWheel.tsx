import type { RefObject } from "react";
import { useCallback, useEffect, useState } from "react";
import { MouseWheelDelta } from "../models/MouseWheelDelta";

export interface UseMouseWheelProps {
  elementRef: RefObject<HTMLElement>;
}

export const useMouseWheel = ({ elementRef }: UseMouseWheelProps) => {
  const [mouseWheelDelta, setMouseWheelDelta] = useState<MouseWheelDelta>(MouseWheelDelta.getZeroWheelDelta);

  const handleMouseWheel = useCallback(
    (event: WheelEvent) => {
      const element = elementRef?.current;
      if (!element) {
        return;
      }

      const wheelDeltaX = event?.deltaX || 0;
      const wheelDeltaY = event?.deltaY || 0;
      const newMouseWheelDelta = new MouseWheelDelta(wheelDeltaX, wheelDeltaY);

      setMouseWheelDelta(newMouseWheelDelta);
    },
    [elementRef, setMouseWheelDelta],
  );

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) {
      return;
    }

    element.addEventListener("wheel", handleMouseWheel);

    return () => {
      element.removeEventListener("wheel", handleMouseWheel);
    };
  }, [elementRef, handleMouseWheel]);

  return mouseWheelDelta;
};

import type { RefObject } from "react";
import { useEffect, useState } from "react";
import type { Point } from "../models/Point";
import { getMousePositionOnScreen } from "../utils/mouse/getMousePositionOnScreen";

export interface UseMouseMoveProps {
  elementRef: RefObject<HTMLElement> | null;
}

export const useMousePosition = ({ elementRef }: UseMouseMoveProps) => {
  const [mousePosition, setMousePosition] = useState<Point>();

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) {
      return;
    }

    const handleMouseMove = (event: MouseEvent): void => {
      const element = elementRef?.current;
      if (!element) {
        return;
      }

      const newMousePosition = getMousePositionOnScreen(event, element);
      setMousePosition(newMousePosition);
    };

    element.addEventListener("mousemove", handleMouseMove);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
    };
  }, [elementRef, setMousePosition]);

  return mousePosition;
};

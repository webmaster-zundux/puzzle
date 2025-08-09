import type { RefObject } from "react";
import type { Point } from "../models/Point";
import { useMouse } from "./useMouse";
import { useTouchScreen } from "./useTouchScreen";

export interface UseTouchProps {
  elementRef: RefObject<HTMLElement> | null;
}

export const useMouseOrTouchPosition = ({
  elementRef,
}: UseTouchProps): {
  isPressed: boolean;
  position: Point | undefined;
} => {
  const { hasTouch, touchPosition } = useTouchScreen({ elementRef });
  const { isPrimaryMouseButtonPressed, mousePosition } = useMouse({ elementRef });

  if (hasTouch) {
    return {
      isPressed: true,
      position: touchPosition,
    };
  }

  if (isPrimaryMouseButtonPressed) {
    return {
      isPressed: true,
      position: mousePosition,
    };
  }

  return {
    isPressed: false,
    position: undefined,
  };
};

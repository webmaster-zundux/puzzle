import type { RefObject } from "react";
import { Point } from "../models/Point";

export const getCenterPointOfRectangle = (elementRef: RefObject<HTMLElement>): Point => {
  if (!elementRef?.current) {
    return Point.getZeroPoint();
  }

  const width = elementRef?.current?.clientWidth || 0;
  const height = elementRef?.current?.clientHeight || 0;

  return new Point(width / 2, height / 2);
};

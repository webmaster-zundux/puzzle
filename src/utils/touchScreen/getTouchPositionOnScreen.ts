import { Point } from "../../models/Point";

export const getTouchPositionOnScreen = (event: TouchEvent, element: HTMLElement | SVGSVGElement): Point => {
  const mainTouch = event.targetTouches[0];

  if (!element) {
    return new Point(mainTouch?.clientX || 0, mainTouch?.clientY || 0);
  }

  if (element instanceof SVGSVGElement) {
    const { x: svgX, y: svgY } = element.getBoundingClientRect();

    const touchPosition = new Point(mainTouch?.clientX || 0 - svgX || 0, mainTouch?.clientY || 0 - svgY || 0);

    return touchPosition;
  }

  const touchPosition = new Point(
    mainTouch?.clientX || 0 - element?.offsetLeft || 0,
    mainTouch?.clientY || 0 - element?.offsetTop || 0,
  );

  return touchPosition;
};

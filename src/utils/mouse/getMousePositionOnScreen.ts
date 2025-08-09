import { Point } from "../../models/Point";

export const getMousePositionOnScreen = (event: MouseEvent, element: HTMLElement | SVGSVGElement): Point => {
  if (!element) {
    return new Point(event?.clientX || 0, event?.clientY || 0);
  }

  if (element instanceof SVGSVGElement) {
    const { x: svgX, y: svgY } = element.getBoundingClientRect();

    const touchPosition = new Point(event?.clientX || 0 - svgX || 0, event?.clientY || 0 - svgY || 0);

    return touchPosition;
  }

  const mousePosition = new Point(
    event?.clientX || 0 - element?.offsetLeft || 0,
    event?.clientY || 0 - element?.offsetTop || 0,
  );

  return mousePosition;
};

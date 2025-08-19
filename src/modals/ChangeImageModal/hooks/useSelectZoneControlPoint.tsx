import type { Dispatch, useState } from "react";
import { useEffect } from "react";
import { getTouchPositionOnScreen } from "../../../utils/touchScreen/getTouchPositionOnScreen";
import { getMousePositionOnScreen } from "../../../utils/mouse/getMousePositionOnScreen";
import { Point } from "../../../models/Point";
import { isAreaEqualOrGreaterThanMinimalAreaSize } from "../utils/isAreaEqualOrGreaterThanMinimalAreaSize";
import { calculateAreaPointsLimitedByMinimalAreaSize } from "../utils/calculateAreaBoundaryPoints";
import type { ZoneBoundaryPointsReducerAction } from "./useSelectedZoneBoundaryPoints";
import type { ControlPointName } from "../components/SelectZone";
import { resetCurrentSelectionOfThePageDocument } from "../utils/resetCurrentSelectionOfThePageDocument";

interface UseSelectZoneControlPointMoveProps {
  selectingZoneRef: React.RefObject<SVGSVGElement>;
  imageWidth: number;
  imageHeight: number;
  selectedControlPointName?: ControlPointName;
  setSelectedControlPointName: ReturnType<typeof useState<ControlPointName>>[1];
  tl: Point;
  br: Point;
  onDispatchZoneControlPointsChange: Dispatch<ZoneBoundaryPointsReducerAction>;
}
export function useSelectZoneControlPoint({
  selectingZoneRef,
  imageWidth,
  imageHeight,
  selectedControlPointName,
  setSelectedControlPointName,
  tl,
  br,
  onDispatchZoneControlPointsChange,
}: UseSelectZoneControlPointMoveProps) {
  useEffect(
    function useSelectZoneControlPointEffect() {
      const svgElement = selectingZoneRef.current;
      if (!svgElement) {
        return;
      }

      const { x: svgX, y: svgY, width: svgW, height: svgH } = svgElement.getBoundingClientRect();
      const xCoefficient = imageWidth / svgW;
      const yCoefficient = imageHeight / svgH;

      const handleTouchMoveOrMouseMove = (event: MouseEvent | TouchEvent) => {
        event.preventDefault();

        if (!selectedControlPointName) {
          return;
        }

        let clientX;
        let clientY;
        if (event instanceof TouchEvent) {
          const positionOnScreen = getTouchPositionOnScreen(event, svgElement);
          clientX = positionOnScreen.x;
          clientY = positionOnScreen.y;
        } else {
          const positionOnScreen = getMousePositionOnScreen(event, svgElement);
          clientX = positionOnScreen.x;
          clientY = positionOnScreen.y;
        }

        let x = (clientX - svgX) * xCoefficient;
        let y = (clientY - svgY) * yCoefficient;

        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x > imageWidth) x = imageWidth;
        if (y > imageHeight) y = imageHeight;

        if (selectedControlPointName === "tl") {
          const newTl = new Point(x, y);
          if (!isAreaEqualOrGreaterThanMinimalAreaSize(newTl, br)) {
            const { tl: calculatedTl, br: calculatedBr } = calculateAreaPointsLimitedByMinimalAreaSize({
              topLeftPointIsModificationRootPoint: true,
              tl: newTl,
              br,
              imageWidth,
              imageHeight,
            });

            onDispatchZoneControlPointsChange({
              type: "set",
              tl: calculatedTl,
              br: calculatedBr,
            });
            return;
          }

          onDispatchZoneControlPointsChange({
            type: "set-tl",
            x: x,
            y: y,
          });
          return;
        }
        if (selectedControlPointName === "br") {
          const newBr = new Point(x, y);
          if (!isAreaEqualOrGreaterThanMinimalAreaSize(tl, newBr)) {
            const { tl: calculatedTl, br: calculatedBr } = calculateAreaPointsLimitedByMinimalAreaSize({
              topLeftPointIsModificationRootPoint: false,
              tl,
              br: newBr,
              imageWidth,
              imageHeight,
            });

            onDispatchZoneControlPointsChange({
              type: "set",
              tl: calculatedTl,
              br: calculatedBr,
            });
            return;
          }

          onDispatchZoneControlPointsChange({
            type: "set-br",
            x: x,
            y: y,
          });
          return;
        }
        if (selectedControlPointName === "t") {
          const newTl = new Point(tl.x, y);
          if (!isAreaEqualOrGreaterThanMinimalAreaSize(newTl, br)) {
            const { tl: calculatedTl, br: calculatedBr } = calculateAreaPointsLimitedByMinimalAreaSize({
              topLeftPointIsModificationRootPoint: true,
              tl: newTl,
              br,
              imageWidth,
              imageHeight,
            });

            onDispatchZoneControlPointsChange({
              type: "set",
              tl: calculatedTl,
              br: calculatedBr,
            });
            return;
          }

          onDispatchZoneControlPointsChange({ type: "set-t", y });
          return;
        }
        if (selectedControlPointName === "b") {
          const newBr = new Point(br.x, y);
          if (!isAreaEqualOrGreaterThanMinimalAreaSize(tl, newBr)) {
            const { tl: calculatedTl, br: calculatedBr } = calculateAreaPointsLimitedByMinimalAreaSize({
              topLeftPointIsModificationRootPoint: false,
              tl,
              br: newBr,
              imageWidth,
              imageHeight,
            });

            onDispatchZoneControlPointsChange({
              type: "set",
              tl: calculatedTl,
              br: calculatedBr,
            });
            return;
          }

          onDispatchZoneControlPointsChange({ type: "set-b", y });
          return;
        }
        if (selectedControlPointName === "l") {
          const newTl = new Point(x, tl.y);
          if (!isAreaEqualOrGreaterThanMinimalAreaSize(newTl, br)) {
            const { tl: calculatedTl, br: calculatedBr } = calculateAreaPointsLimitedByMinimalAreaSize({
              topLeftPointIsModificationRootPoint: true,
              tl: newTl,
              br,
              imageWidth,
              imageHeight,
            });

            onDispatchZoneControlPointsChange({
              type: "set",
              tl: calculatedTl,
              br: calculatedBr,
            });
            return;
          }

          onDispatchZoneControlPointsChange({ type: "set-l", x });
          return;
        }
        if (selectedControlPointName === "r") {
          const newBr = new Point(x, br.y);
          if (!isAreaEqualOrGreaterThanMinimalAreaSize(tl, newBr)) {
            const { tl: calculatedTl, br: calculatedBr } = calculateAreaPointsLimitedByMinimalAreaSize({
              topLeftPointIsModificationRootPoint: false,
              tl,
              br: newBr,
              imageWidth,
              imageHeight,
            });

            onDispatchZoneControlPointsChange({
              type: "set",
              tl: calculatedTl,
              br: calculatedBr,
            });
            return;
          }

          onDispatchZoneControlPointsChange({ type: "set-r", x });
          return;
        }

        if (selectedControlPointName === "tr") {
          const newTl = new Point(tl.x, y);
          const newBr = new Point(x, br.y);
          if (!isAreaEqualOrGreaterThanMinimalAreaSize(newTl, newBr)) {
            const { tl: calculatedTl, br: calculatedBr } = calculateAreaPointsLimitedByMinimalAreaSize({
              topLeftPointIsModificationRootPoint: false,
              secondaryDiagonal: true,
              bottomLeftIsModificationRootPoint: false,
              tl: newTl,
              br: newBr,
              imageWidth,
              imageHeight,
            });

            onDispatchZoneControlPointsChange({
              type: "set",
              tl: calculatedTl,
              br: calculatedBr,
            });
            return;
          }

          onDispatchZoneControlPointsChange({ type: "set-tr", x, y });
          return;
        }
        if (selectedControlPointName === "bl") {
          const newTl = new Point(x, tl.y);
          const newBr = new Point(br.x, y);
          if (!isAreaEqualOrGreaterThanMinimalAreaSize(newTl, newBr)) {
            const { tl: calculatedTl, br: calculatedBr } = calculateAreaPointsLimitedByMinimalAreaSize({
              topLeftPointIsModificationRootPoint: false,
              secondaryDiagonal: true,
              bottomLeftIsModificationRootPoint: true,
              tl: newTl,
              br: newBr,
              imageWidth,
              imageHeight,
            });

            onDispatchZoneControlPointsChange({
              type: "set",
              tl: calculatedTl,
              br: calculatedBr,
            });
            return;
          }

          onDispatchZoneControlPointsChange({ type: "set-bl", x, y });
          return;
        }

        if (selectedControlPointName === "c") {
          const selectedZoneWidth = br.x - tl.x;
          const selectedZoneHeight = br.y - tl.y;

          const halfSelectedZoneWidth = selectedZoneWidth / 2;
          const halfSelectedZoneHeight = selectedZoneHeight / 2;

          const newTL = new Point(x - halfSelectedZoneWidth, y - halfSelectedZoneHeight);
          const newBR = new Point(x + halfSelectedZoneWidth, y + halfSelectedZoneHeight);

          if (newTL.x < 0) {
            newTL.x = 0;
            newBR.x = selectedZoneWidth;
          }
          if (newTL.y < 0) {
            newTL.y = 0;
            newBR.y = selectedZoneHeight;
          }
          if (newBR.x > imageWidth) {
            newTL.x = imageWidth - selectedZoneWidth;
            newBR.x = imageWidth;
          }
          if (newBR.y > imageHeight) {
            newTL.y = imageHeight - selectedZoneHeight;
            newBR.y = imageHeight;
          }

          onDispatchZoneControlPointsChange({
            type: "set",
            tl: newTL,
            br: newBR,
          });
          return;
        }

        console.error("unknown control point");
      };

      const handleTouchEndOrMouseUp = (event: MouseEvent | TouchEvent) => {
        event.preventDefault()
        setSelectedControlPointName(undefined);
      };

      const handleTouchCancelOrMouseLeaveBodyElement = (event: MouseEvent | TouchEvent) => {
        event.preventDefault()
        setSelectedControlPointName(undefined);

        if (selectedControlPointName) {
          resetCurrentSelectionOfThePageDocument();
        }
      };

      const mouseEventListenerOptions: Parameters<typeof addEventListener>[2] = { passive: false };
      svgElement.addEventListener("touchmove", handleTouchMoveOrMouseMove, mouseEventListenerOptions);
      svgElement.addEventListener("mousemove", handleTouchMoveOrMouseMove, mouseEventListenerOptions);
      svgElement.addEventListener("touchend", handleTouchEndOrMouseUp, mouseEventListenerOptions);
      svgElement.addEventListener("mouseup", handleTouchEndOrMouseUp, mouseEventListenerOptions);
      svgElement.addEventListener("touchcancel", handleTouchCancelOrMouseLeaveBodyElement, mouseEventListenerOptions);
      svgElement.addEventListener("mouseleave", handleTouchCancelOrMouseLeaveBodyElement, mouseEventListenerOptions);

      return () => {
        svgElement.removeEventListener("touchmove", handleTouchMoveOrMouseMove, mouseEventListenerOptions);
        svgElement.removeEventListener("mousemove", handleTouchMoveOrMouseMove, mouseEventListenerOptions);
        svgElement.removeEventListener("touchend", handleTouchEndOrMouseUp, mouseEventListenerOptions);
        svgElement.removeEventListener("mouseup", handleTouchEndOrMouseUp, mouseEventListenerOptions);
        svgElement.removeEventListener(
          "touchcancel",
          handleTouchCancelOrMouseLeaveBodyElement,
          mouseEventListenerOptions,
        );
        svgElement.removeEventListener(
          "mouseleave",
          handleTouchCancelOrMouseLeaveBodyElement,
          mouseEventListenerOptions,
        );
      };
    },
    [
      selectingZoneRef,
      selectedControlPointName,
      setSelectedControlPointName,
      imageWidth,
      imageHeight,
      onDispatchZoneControlPointsChange,
      tl,
      br,
      tl.x,
      tl.y,
      br.x,
      br.y,
    ],
  );
}

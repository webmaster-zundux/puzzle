import type { RefObject } from "react";
import { useEffect, useReducer } from "react";
import { useHtmlElementResize } from "../../../hooks/useElementResize";
import { Point } from "../../../models/Point";

type ZoneBoundaryPointState = {
  tl: Point;
  br: Point;
};

export type ZoneBoundaryPointsReducerAction =
  | { type: "reset" }
  | { type: "set"; tl: Point; br: Point }
  | { type: "set-tl"; x: number; y: number }
  | { type: "set-tr"; x: number; y: number }
  | { type: "set-br"; x: number; y: number }
  | { type: "set-bl"; x: number; y: number }
  | { type: "set-t"; y: number }
  | { type: "set-r"; x: number }
  | { type: "set-b"; y: number }
  | { type: "set-l"; x: number };

const getDefaultZoneBoundaryPoints = () => ({
  tl: new Point(0, 0),
  br: new Point(0, 0),
});

const getInitialZoneBoundaryPointsState = () => getDefaultZoneBoundaryPoints();

const zoneBoundaryPointsReducer = (
  state: ZoneBoundaryPointState,
  action: ZoneBoundaryPointsReducerAction,
): ZoneBoundaryPointState => {
  switch (action.type) {
    case "reset": {
      return getDefaultZoneBoundaryPoints();
    }
    case "set": {
      return {
        tl: action.tl,
        br: action.br,
      };
    }

    case "set-tl": {
      const { x, y } = action;
      return {
        ...state,
        tl: new Point(x, y),
      };
    }
    case "set-br": {
      const { x, y } = action;
      return {
        ...state,
        br: new Point(x, y),
      };
    }

    case "set-tr": {
      return {
        ...state,
        tl: new Point(state.tl.x, action.y),
        br: new Point(action.x, state.br.y),
      };
    }
    case "set-bl": {
      return {
        ...state,
        tl: new Point(action.x, state.tl.y),
        br: new Point(state.br.x, action.y),
      };
    }

    case "set-t": {
      return {
        ...state,
        tl: new Point(state.tl.x, action.y),
      };
    }
    case "set-b": {
      return {
        ...state,
        br: new Point(state.br.x, action.y),
      };
    }
    case "set-l": {
      return {
        ...state,
        tl: new Point(action.x, state.tl.y),
      };
    }
    case "set-r": {
      return {
        ...state,
        br: new Point(action.x, state.br.y),
      };
    }
    default: {
      console.error("Unknown action type");
      return state;
    }
  }
};

interface UseSelectedZoneBoundaryPointsProps {
  imageContainerRef: RefObject<HTMLDivElement>;
}

export const useSelectedZoneBoundaryPoints = ({ imageContainerRef }: UseSelectedZoneBoundaryPointsProps) => {
  const [controlPoints, dispatchZoneControlPointsChange] = useReducer(
    zoneBoundaryPointsReducer,
    null,
    getInitialZoneBoundaryPointsState,
  );

  const { elementWidth: imageContainerElementWidth, elementHeight: imageContainerElementHeight } =
    useHtmlElementResize(imageContainerRef);

  useEffect(() => {
    if (imageContainerElementWidth < 1 || imageContainerElementHeight < 1) {
      return;
    }

    dispatchZoneControlPointsChange({
      type: "set",
      tl: new Point(0, 0),
      br: new Point(imageContainerElementWidth, imageContainerElementHeight),
    });
  }, [imageContainerElementWidth, imageContainerElementHeight]);

  return {
    controlPoints,
    dispatchZoneControlPointsChange,
  };
};

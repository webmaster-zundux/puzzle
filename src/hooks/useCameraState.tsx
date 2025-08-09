import type { Dispatch, FC, PropsWithChildren, RefObject } from "react";
import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { MouseMovementDelta } from "../models/MouseMovementDelta";
import { MouseWheelDelta } from "../models/MouseWheelDelta";
import { Point } from "../models/Point";
import { CANVAS_SCALE_DEFAULT_VALUE, getNextZoomInValue, getNextZoomOutValue } from "../utils-camera/getNextZoomValue";
import { scalePointARelativeToPointB } from "../utils-camera/scalePointARelativeToPointB";
import { getFunctionName } from "../utils/getFunctionName";
import { getMousePositionOnScreen } from "../utils/mouse/getMousePositionOnScreen";

// eslint-disable-next-line react-refresh/only-export-components
export const CANVAS_DEFAULT_CAMERA_POSITION = Point.getZeroPoint();

type CameraState = {
  position: Point;
  scale: number;
};

const getDefaultCameraState = (): CameraState => ({
  position: Point.getZeroPoint(),
  scale: 1.0,
});

const getInitialCameraState = () => getDefaultCameraState();

const CameraStateContext = createContext<CameraState | null>(null);

const CameraStateDispatchContext = createContext<Dispatch<CameraStateReducerAction>>(() => {});

type ResetScale = {
  type: "reset-scale";
};

type ResetScaleAndResetPosition = {
  type: "reset-scale-and-reset-position";
};

type ResetScaleAndSetPosition = {
  type: "reset-scale-and-set-position";
  position: Point;
};

type ResetScaleWithCenterOfScale = {
  type: "reset-scale-with-center-of-scale";
  centerOfScale: Point;
};

type SetPosition = {
  type: "set-position";
  position: Point;
};

type SetScale = {
  type: "set-scale";
  scale: number;
};

type SetScaleAndSetPosition = {
  type: "set-scale-and-set-position";
  scale: number;
  position: Point;
};

type AddMouseMovementInScreenCoordinatesToPosition = {
  type: "add-mouse-movement-in-screen-coordinates-to-position";
  mouseMovementDelta: MouseMovementDelta;
};

type AddMouseWheelDeltaInScreenCoordinatesToScale = {
  type: "add-mouse-wheel-delta-in-screen-coordinates-to-scale";
  centerOfScale: Point;
  mouseWheelDelta: MouseWheelDelta;
};

export type CameraStateReducerAction =
  | ResetScale
  | ResetScaleAndResetPosition
  | ResetScaleAndSetPosition
  | ResetScaleWithCenterOfScale
  | SetPosition
  | SetScale
  | SetScaleAndSetPosition
  | AddMouseMovementInScreenCoordinatesToPosition
  | AddMouseWheelDeltaInScreenCoordinatesToScale;

function cameraStateReducer(cameraState: CameraState, action: CameraStateReducerAction): CameraState {
  switch (action.type) {
    case "reset-scale": {
      return {
        ...cameraState,
        scale: CANVAS_SCALE_DEFAULT_VALUE,
      };
    }
    case "reset-scale-and-reset-position": {
      return {
        ...cameraState,
        position: CANVAS_DEFAULT_CAMERA_POSITION,
        scale: CANVAS_SCALE_DEFAULT_VALUE,
      };
    }
    case "reset-scale-and-set-position": {
      return {
        ...cameraState,
        position: action.position,
        scale: CANVAS_SCALE_DEFAULT_VALUE,
      };
    }
    case "reset-scale-with-center-of-scale": {
      const centerOfScale = action.centerOfScale;

      const scale = cameraState.scale;
      const cameraPosition = cameraState.position;

      const newScale = CANVAS_SCALE_DEFAULT_VALUE;

      const newCameraPosition = scalePointARelativeToPointB(cameraPosition, centerOfScale, scale, newScale);

      return {
        ...cameraState,
        position: newCameraPosition,
        scale: newScale,
      };
    }
    case "set-position": {
      return {
        ...cameraState,
        position: action.position,
      };
    }
    case "set-scale": {
      return {
        ...cameraState,
        scale: action.scale,
      };
    }
    case "set-scale-and-set-position": {
      return {
        ...cameraState,
        scale: action.scale,
        position: action.position,
      };
    }
    case "add-mouse-movement-in-screen-coordinates-to-position": {
      const prevCameraPosition = cameraState.position;
      const scale = cameraState.scale;
      const { dx, dy } = action.mouseMovementDelta;

      const mousePositionDeltaXInWorldScale = dx / scale;
      const mousePositionDeltaYInWorldScale = dy / scale;
      const x = prevCameraPosition.x + mousePositionDeltaXInWorldScale;
      const y = prevCameraPosition.y + mousePositionDeltaYInWorldScale;
      const newCameraPositionInWorldCoordinates = new Point(x, y);

      return {
        ...cameraState,
        position: newCameraPositionInWorldCoordinates,
      };
    }
    case "add-mouse-wheel-delta-in-screen-coordinates-to-scale": {
      const centerOfScale = action.centerOfScale;
      const mouseWheelDelta = action.mouseWheelDelta;

      const scale = cameraState.scale;
      const cameraPosition = cameraState.position;

      const wheelDeltaY = mouseWheelDelta.dy || 0;
      const scaleDirection = wheelDeltaY > 0 ? -1 : wheelDeltaY < 0 ? +1 : 0;

      let newScale = scale;
      if (scaleDirection === 0) {
        return cameraState;
      } else if (scaleDirection > 0) {
        newScale = getNextZoomInValue(scale);
      } else if (scaleDirection < 0) {
        newScale = getNextZoomOutValue(scale);
      }

      const newCameraPosition = scalePointARelativeToPointB(cameraPosition, centerOfScale, scale, newScale);

      return {
        ...cameraState,
        position: newCameraPosition,
        scale: newScale,
      };
    }

    default: {
      //@ts-expect-error action type and structure are unknown
      throw Error(`Unknown action in ${getFunctionName()}: ${action?.type}`);
    }
  }
}

export interface CameraStateProviderProps {}
export const CameraStateProvider: FC<PropsWithChildren<CameraStateProviderProps>> = ({ children }) => {
  const [cameraState, dispatch] = useReducer(cameraStateReducer, null, getInitialCameraState);

  return (
    <CameraStateContext.Provider value={cameraState}>
      <CameraStateDispatchContext.Provider value={dispatch}>{children}</CameraStateDispatchContext.Provider>
    </CameraStateContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useCameraState() {
  const context = useContext(CameraStateContext);
  if (!context) {
    throw new Error("useCameraState must be used within a CameraStateProvider");
  }

  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCameraStateDispatch() {
  const context = useContext(CameraStateDispatchContext);
  if (context === undefined) {
    throw new Error("useCameraStateDispatch must be used within a CameraStateProvider");
  }

  return context;
}

export interface UseCameraMoveProps {
  isCameraMoving: boolean;
  mousePosition?: Point;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCameraMove = ({ isCameraMoving, mousePosition }: UseCameraMoveProps) => {
  const dispatchCameraStateChange = useCameraStateDispatch();
  const [prevMousePosition, setPrevMousePosition] = useState<Point>();

  useEffect(() => {
    if (!isCameraMoving) {
      setPrevMousePosition(undefined);
      return;
    }

    const newMousePosition = mousePosition;
    setPrevMousePosition(newMousePosition);

    if (!newMousePosition) {
      return;
    }

    if (!prevMousePosition) {
      return;
    }

    const dx = newMousePosition.x - prevMousePosition.x;
    const dy = newMousePosition.y - prevMousePosition.y;
    if (dx === 0 && dy === 0) {
      return;
    }

    const mouseMovementDelta = new MouseMovementDelta(dx, dy);

    dispatchCameraStateChange({
      type: "add-mouse-movement-in-screen-coordinates-to-position",
      mouseMovementDelta,
    });
  }, [dispatchCameraStateChange, isCameraMoving, prevMousePosition, mousePosition]);
};

export interface UseCameraScaleProps {
  elementRef: RefObject<HTMLElement> | null;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCameraScale = ({ elementRef }: UseCameraScaleProps) => {
  const dispatchCameraStateChange = useCameraStateDispatch();

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) {
      return;
    }

    const handleMouseWheel = (event: WheelEvent) => {
      const mousePosition = getMousePositionOnScreen(event, element);
      const newMouseWheelDelta = getMouseWheelDelta(event);

      dispatchCameraStateChange({
        type: "add-mouse-wheel-delta-in-screen-coordinates-to-scale",
        centerOfScale: mousePosition,
        mouseWheelDelta: newMouseWheelDelta,
      });
    };

    const wheelEventListenerOptions: Parameters<typeof addEventListener>[2] = { passive: true };
    element.addEventListener("wheel", handleMouseWheel, wheelEventListenerOptions);

    return () => {
      element.removeEventListener("wheel", handleMouseWheel, wheelEventListenerOptions);
    };
  }, [dispatchCameraStateChange, elementRef]);
};

// eslint-disable-next-line react-refresh/only-export-components
export const getMouseWheelDelta = (event: WheelEvent): MouseWheelDelta => {
  const wheelDeltaX = event?.deltaX || 0;
  const wheelDeltaY = event?.deltaY || 0;
  const newMouseWheelDelta = new MouseWheelDelta(wheelDeltaX, wheelDeltaY);

  return newMouseWheelDelta;
};

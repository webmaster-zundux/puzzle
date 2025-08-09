import type { Dispatch, FC, PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useReducer } from "react";
import { getFunctionName } from "../utils/getFunctionName";

const USE_DISPLAY_POINTER_INFORMATION = import.meta.env.VITE_USE_DISPLAY_POINTER_INFORMATION === "1";

const DEFAULT_VALUE_DEBUG_SETTINGS_SHOULD_DISPLAY_POINTER_INFORMATION = false;
const VALUE_DEBUG_SETTINGS_SHOULD_DISPLAY_POINTER_INFORMATION =
  // @ts-expect-error property 'debugSettingsShouldDisplayPointerInformation' does not exist on type 'Window & typeof globalThis'
  window?.debugSettingsShouldDisplayPointerInformation ??
  DEFAULT_VALUE_DEBUG_SETTINGS_SHOULD_DISPLAY_POINTER_INFORMATION;

const LOCAL_STORAGE_KEY_NAME_DEBUG_SETTINGS = "debugSettings";

export type DebugSettingsState = {
  experimentalUseNativeSmoothingQualityMethod: boolean;

  debugSettingsUseSolvedPuzzlePiecesPositionsMultipliedBy2AsInitialPiecesPositions: boolean;

  drawEdgeBevelHighlightAndShadow: boolean;

  showCanvasPerfomanceMonitor: boolean;
  debugSettingsShouldPrintPuzzleRenderTime: boolean;
  debugSettingsShouldPrintPuzzleRenderTimeForFirstRender: boolean;

  debugSettingsShouldPrintPuzzleCreationTime: boolean;

  showDebugTextureCacheCanvas: boolean;
  showDebugInfoForTextureCacheCanvas: boolean;
  showDebugInfoForTextureCanvas: boolean;

  debugSettingsShouldDrawCenterOfWorld: boolean;
  debugSettingsShouldDrawPuzzleBoundaryPoints: boolean;
  debugSettingsShouldDrawPuzzlePiecesBoundaries: boolean;
  debugSettingsShouldDrawCachedTexturesBoundaries: boolean;

  debugSettingsShouldDrawCameraPosition: boolean;
  debugSettingsShouldDrawMousePosition: boolean;
  debugSettingsShouldDrawActivePiecePosition: boolean;
  debugSettingsShouldDrawCameraViewportCenterPosition: boolean;

  debugSettingsShouldDrawDebugInfoForMarksForDirectionToPositionOutsideCameraViewport: boolean;

  useHitCounterForPieceShapePath: boolean;
  exposeHitCounterForPieceShapePathToWindowObject: boolean;
  useHitCounterForPieceMaskPath: boolean;
  exposeHitCounterForPieceMaskPathToWindowObject: boolean;

  debugSettingsShouldDisplayPointerInformation: boolean;
};

export type DebugSettingsName = keyof DebugSettingsState;

const getDefaultDebugSettingsState = (): DebugSettingsState => ({
  experimentalUseNativeSmoothingQualityMethod: true,
  debugSettingsUseSolvedPuzzlePiecesPositionsMultipliedBy2AsInitialPiecesPositions: false,

  drawEdgeBevelHighlightAndShadow: true,
  showCanvasPerfomanceMonitor: false,
  debugSettingsShouldPrintPuzzleRenderTime: false,
  debugSettingsShouldPrintPuzzleRenderTimeForFirstRender: false,

  debugSettingsShouldPrintPuzzleCreationTime: false,

  showDebugTextureCacheCanvas: false,
  showDebugInfoForTextureCacheCanvas: false,
  showDebugInfoForTextureCanvas: false,

  debugSettingsShouldDrawCenterOfWorld: false,
  debugSettingsShouldDrawPuzzleBoundaryPoints: false,
  debugSettingsShouldDrawPuzzlePiecesBoundaries: false,
  debugSettingsShouldDrawCachedTexturesBoundaries: false,

  debugSettingsShouldDrawCameraPosition: false,
  debugSettingsShouldDrawMousePosition: false,
  debugSettingsShouldDrawActivePiecePosition: false,
  debugSettingsShouldDrawCameraViewportCenterPosition: false,

  debugSettingsShouldDrawDebugInfoForMarksForDirectionToPositionOutsideCameraViewport: false,

  useHitCounterForPieceShapePath: false,
  exposeHitCounterForPieceShapePathToWindowObject: false,
  useHitCounterForPieceMaskPath: false,
  exposeHitCounterForPieceMaskPathToWindowObject: false,

  debugSettingsShouldDisplayPointerInformation:
    VALUE_DEBUG_SETTINGS_SHOULD_DISPLAY_POINTER_INFORMATION || USE_DISPLAY_POINTER_INFORMATION,
});

const loadDebugSettingsFromLocalStorage = (): DebugSettingsState | undefined => {
  try {
    const defaultDebugSettingsState = getDefaultDebugSettingsState();
    const dataString = window?.localStorage.getItem(LOCAL_STORAGE_KEY_NAME_DEBUG_SETTINGS);

    if (typeof dataString !== "string") {
      return undefined;
    }

    const settingsNames = Object.keys(defaultDebugSettingsState) as DebugSettingsName[];

    const parsedData = JSON.parse(dataString);
    const loadedDebugSettings = {} as DebugSettingsState;

    settingsNames.forEach((settingsName) => {
      if (typeof parsedData[settingsName] === "boolean") {
        loadedDebugSettings[settingsName] = Boolean(parsedData[settingsName]);
      }
    });

    return {
      ...defaultDebugSettingsState,
      ...loadedDebugSettings,
    };
  } catch (err) {
    console.error("failure of loading debug settings from localStorage", err);
  }

  return undefined;
};

const getInitialDebugSettingsState = (): DebugSettingsState =>
  loadDebugSettingsFromLocalStorage() || getDefaultDebugSettingsState();

export const DebugSettingsStateContext = createContext<DebugSettingsState | null>(null);

export const DebugSettingsStateDispatchContext = createContext<Dispatch<DebugSettingsStateReducerAction>>(() => {});

type SetSetting = {
  type: "set-setting";
  name: DebugSettingsName;
  value: boolean;
};

type SetLoadedSettings = {
  type: "set-loaded-settings";
  loadedDebugSettings: Partial<DebugSettingsState>;
};

type ResetSettings = {
  type: "reset-settings";
};

export type DebugSettingsStateReducerAction = SetSetting | SetLoadedSettings | ResetSettings;

function debugSettingsStateReducer(
  debugSettingsState: DebugSettingsState,
  action: DebugSettingsStateReducerAction,
): DebugSettingsState {
  switch (action.type) {
    case "set-setting": {
      return {
        ...debugSettingsState,
        [action.name]: action.value,
      };
    }
    case "set-loaded-settings": {
      return {
        ...debugSettingsState,
        ...action.loadedDebugSettings,
      };
    }
    case "reset-settings": {
      return getDefaultDebugSettingsState();
    }

    default: {
      //@ts-expect-error action type and structure are unknown
      throw Error(`Unknown action in ${getFunctionName()}: ${action?.type}`);
    }
  }
}

export interface DebugSettingsStateProviderProps {}
export const DebugSettingsStateProvider: FC<PropsWithChildren<DebugSettingsStateProviderProps>> = ({ children }) => {
  const [debugSettingsState, dispatch] = useReducer(debugSettingsStateReducer, null, getInitialDebugSettingsState);

  useEffect(() => {
    try {
      const serializedData = JSON.stringify(debugSettingsState);

      const savedData = window?.localStorage.getItem(LOCAL_STORAGE_KEY_NAME_DEBUG_SETTINGS);
      if (serializedData === savedData) {
        return;
      }

      window?.localStorage.setItem(LOCAL_STORAGE_KEY_NAME_DEBUG_SETTINGS, serializedData);
    } catch (err) {
      console.error("failure of update debug settings in localStorage", err);
    }
  }, [debugSettingsState]);

  return (
    <DebugSettingsStateContext.Provider value={debugSettingsState}>
      <DebugSettingsStateDispatchContext.Provider value={dispatch}>
        {children}
      </DebugSettingsStateDispatchContext.Provider>
    </DebugSettingsStateContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useDebugSettingsState() {
  const context = useContext(DebugSettingsStateContext);
  if (!context) {
    throw new Error("useDebugSettingsState must be used within a DebugSettingsStateProvider");
  }

  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDebugSettingsStateDispatch() {
  const context = useContext(DebugSettingsStateDispatchContext);
  if (context === undefined) {
    throw new Error("useDebugSettingsStateDispatch must be used within a DebugSettingsStateProvider");
  }

  return context;
}

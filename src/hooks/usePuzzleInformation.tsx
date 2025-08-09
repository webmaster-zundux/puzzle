import type { Dispatch, FC, PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { DEMO_PUZZLE } from "../constants/demo-images-src";
import type { PieceId } from "../core/puzzle/Piece";
import type { PiecePositionData } from "../core/puzzle/Puzzle";
import type { BoundaryPoints } from "../models/BoundaryPoints";
import type { CanvasBackgroundColor } from "../models/CanvasBackgroundColor";
import { DEFAULT_BACKGROUND_COLOR_NAME_FOR_SCENE_CANVAS } from "../models/CanvasBackgroundColor";
import { generateChallengeId, type ChallengeId } from "../models/Challenge";
import { Point } from "../models/Point";
import type { Size } from "../models/Size";
import type { PieceShapeName } from "../utils-path/getSideShapes";
import { DEFAULT_PIECE_SHAPE_NAME } from "../utils-path/getSideShapes";
import { getFunctionName } from "../utils/getFunctionName";

const LOCAL_STORAGE_KEY_NAME_PUZZLE_INFORMATION = "puzzleInformation";

const PUZZLE_COMPLETE_PROGRESS_PERCENTAGE = 100;

type PuzzleProgressState = {
  completenessProgress: number;
  puzzleCompleted: boolean;
  puzzleWasTouched: boolean;
  puzzleWasTouchedAt: number;
  activePieceId?: PieceId;
};

export type PuzzleParams = {
  name?: string;
  numberOfPiecesPerWidth: number;
  numberOfPiecesPerHeight: number;
  pieceWidth: number;
  connectionActivationAreaSideSizeFractionFromPieceSideSize: number;
  imageSrc?: string;
  imageOriginalSize: Size;
  boundaryPoints: BoundaryPoints;
  piecesPositions: PiecePositionData[];
  pieceSideShapeName: PieceShapeName;
};

export type PuzzleInformationState = PuzzleParams &
  PuzzleProgressState & {
    challengeId: ChallengeId;
    timeSpent: number;
    isTimerPaused: boolean;

    isSidebarOpen: boolean;
    canvasBackgroundColor: CanvasBackgroundColor;
  };

export type PuzzleInforamtionStateWithoutId = Omit<PuzzleInformationState, "challengeId">;

export type PuzzleInformationAttributesName = keyof PuzzleInformationState;

const getDefaultPuzzleProgressState = (): PuzzleProgressState => ({
  completenessProgress: 0,
  puzzleCompleted: false,
  puzzleWasTouched: false,
  puzzleWasTouchedAt: 0,

  activePieceId: undefined,
});

type PointForSave = {
  x: number;
  y: number;
};
type ImageBoundaryForSave = {
  tl: PointForSave;
  br: PointForSave;
};

const getDefaultImageBoundaryPoints = (): BoundaryPoints => ({
  tl: new Point(0, 0),
  br: new Point(1, 1),
});

// eslint-disable-next-line react-refresh/only-export-components
export const getDefaultPieceShapeName = (): PieceShapeName => {
  return DEFAULT_PIECE_SHAPE_NAME;
};

const getDefaultPuzzleInformationStateWithoutId = (): PuzzleInforamtionStateWithoutId => ({
  name: "puzzle name",

  numberOfPiecesPerWidth: DEMO_PUZZLE.numberOfPiecesPerWidth,
  numberOfPiecesPerHeight: DEMO_PUZZLE.numberOfPiecesPerHeight,
  pieceWidth: 50,

  connectionActivationAreaSideSizeFractionFromPieceSideSize: 0.2,
  imageSrc: DEMO_PUZZLE.imageSrc,
  imageOriginalSize: getDefaultImageOriginSize(),
  boundaryPoints: DEMO_PUZZLE.boundaryPoints,
  piecesPositions: [],
  timeSpent: 0,
  isTimerPaused: false,
  ...getDefaultPuzzleProgressState(),
  pieceSideShapeName: getDefaultPieceShapeName(),

  isSidebarOpen: true,
  canvasBackgroundColor: DEFAULT_BACKGROUND_COLOR_NAME_FOR_SCENE_CANVAS,
});

const getDefaultPuzzleInformationState = (): PuzzleInformationState => {
  return {
    ...getDefaultPuzzleInformationStateWithoutId(),
    challengeId: generateChallengeId(),
  };
};

export type PuzzleInformationForSave = {
  name?: string;
  numberOfPiecesPerWidth: number;
  numberOfPiecesPerHeight: number;
  pieceWidth: number;
  connectionActivationAreaSideSizeFractionFromPieceSideSize: number;
  imageSrc: string;
  imageOriginalSize: Size;
  boundaryPoints: BoundaryPoints;
  piecesPositions: PiecePositionData[];
  timeSpent: number;
  challengeId: string;
  pieceSideShapeName: PieceShapeName;
  isSidebarOpen: boolean;
  canvasBackgroundColor: CanvasBackgroundColor;
};

type RevivedPuzzleInformationForSave = Omit<Partial<PuzzleInformationForSave>, "boundaryPoints"> & {
  boundaryPoints?: ImageBoundaryForSave;
  piecesPositions?: PiecePositionData[];
};

const getDefaultImageOriginSize = (): Size => ({
  width: 0,
  height: 0,
});

const getDefaultPuzzleInformationForSave = (): PuzzleInformationForSave => ({
  name: "puzzle name",
  numberOfPiecesPerWidth: 1,
  numberOfPiecesPerHeight: 1,
  pieceWidth: 1,
  connectionActivationAreaSideSizeFractionFromPieceSideSize: 0.5,
  imageSrc: "no-image-src",
  imageOriginalSize: getDefaultImageOriginSize(),
  boundaryPoints: getDefaultImageBoundaryPoints(),
  piecesPositions: [],
  timeSpent: 0,
  challengeId: "no-challenge-id",
  pieceSideShapeName: DEFAULT_PIECE_SHAPE_NAME,
  isSidebarOpen: true,
  canvasBackgroundColor: DEFAULT_BACKGROUND_COLOR_NAME_FOR_SCENE_CANVAS,
});

export type PuzzleInformationForSaveAttributeName = keyof PuzzleInformationForSave;

// eslint-disable-next-line react-refresh/only-export-components
export const loadPuzzleInformationFromLocalStorage = (): PuzzleInformationState | undefined => {
  try {
    const savedState = getDefaultPuzzleInformationForSave();
    const dataString = window?.localStorage.getItem(LOCAL_STORAGE_KEY_NAME_PUZZLE_INFORMATION);

    if (typeof dataString !== "string") {
      return undefined;
    }

    const savedStateReviver = function (
      this: unknown,
      key: string,
      value: unknown,
    ):
      | PuzzleInformationForSave
      | PuzzleInformationForSave[PuzzleInformationForSaveAttributeName]
      | PuzzleInformationForSave["imageOriginalSize"]["width"]
      | PuzzleInformationForSave["imageOriginalSize"]["height"]
      | PuzzleInformationForSave["boundaryPoints"]["tl"]
      | PuzzleInformationForSave["boundaryPoints"]["br"]
      | PuzzleInformationForSave["piecesPositions"][number]
      | PuzzleInformationForSave["piecesPositions"][number]["id"]
      | PuzzleInformationForSave["piecesPositions"][number]["position"]
      | PuzzleInformationForSave["piecesPositions"][number]["position"]["x"]
      | PuzzleInformationForSave["piecesPositions"][number]["position"]["y"]
      | undefined {
      if (typeof savedState[key as PuzzleInformationForSaveAttributeName] !== "undefined") {
        if (typeof value !== typeof savedState[key as PuzzleInformationForSaveAttributeName]) {
          return undefined;
        }

        return value as (typeof savedState)[PuzzleInformationForSaveAttributeName];
      } else if (key === "tl" || key === "br") {
        if (
          typeof value !== typeof savedState.boundaryPoints[key as keyof PuzzleInformationForSave["boundaryPoints"]]
        ) {
          return undefined;
        }

        return value as (typeof savedState.boundaryPoints)[keyof PuzzleInformationForSave["boundaryPoints"]];
      } else if (key === "id") {
        if (typeof value !== "string") {
          return undefined;
        }

        return value;
      } else if (key === "position") {
        if (typeof value !== "object") {
          return undefined;
        }

        return value as PuzzleInformationForSave["piecesPositions"][number]["position"];
      } else if (key === "x" || key === "y") {
        if (!Number.isFinite(value)) {
          return undefined;
        }

        return value as number;
      } else if (key === "width" || key === "height") {
        if (!Number.isFinite(value)) {
          return undefined;
        }

        return value as number;
      } else if (typeof key === "string" && Number.isFinite(Number.parseInt(key))) {
        return value as PuzzleInformationForSave["piecesPositions"];
      } else if (key === "") {
        return value as PuzzleInformationForSave;
      }

      return undefined;
    };

    const parsedData = JSON.parse(dataString, savedStateReviver) as RevivedPuzzleInformationForSave;

    if (
      !parsedData.boundaryPoints ||
      !parsedData.boundaryPoints.tl ||
      !parsedData.boundaryPoints.br ||
      !Number.isFinite(parsedData.boundaryPoints.tl.x) ||
      !Number.isFinite(parsedData.boundaryPoints.tl.y) ||
      !Number.isFinite(parsedData.boundaryPoints.br.x) ||
      !Number.isFinite(parsedData.boundaryPoints.br.y)
    ) {
      parsedData.boundaryPoints = getDefaultImageBoundaryPoints();
    }

    if (parsedData.piecesPositions?.length) {
      parsedData.piecesPositions = parsedData.piecesPositions.filter(
        ({ id, position: { x, y } }) => typeof id === "string" && Number.isFinite(x) && Number.isFinite(y),
      );
      if (!parsedData.piecesPositions.length) {
        parsedData.piecesPositions = [];
      }
    }

    if (
      !parsedData.imageOriginalSize ||
      !parsedData.imageOriginalSize.width ||
      !parsedData.imageOriginalSize.height ||
      !Number.isFinite(parsedData.imageOriginalSize.width) ||
      !Number.isFinite(parsedData.imageOriginalSize.height)
    ) {
      parsedData.imageOriginalSize = getDefaultImageOriginSize();
    }

    const countOfNotFilledAttributes = (Object.keys(savedState) as PuzzleInformationForSaveAttributeName[]).filter(
      (keyName) => typeof parsedData[keyName] === "undefined",
    ).length;

    if (countOfNotFilledAttributes) {
      return undefined;
    }

    const loadedAttributes = parsedData as Partial<PuzzleInformationForSave>;
    if (!loadedAttributes.challengeId) {
      return {
        ...getDefaultPuzzleInformationStateWithoutId(),
        ...loadedAttributes,
        challengeId: generateChallengeId(),
      };
    }

    return {
      ...getDefaultPuzzleInformationStateWithoutId(),
      ...(loadedAttributes as Partial<PuzzleInformationForSave> & Pick<PuzzleInformationForSave, "challengeId">),
    };
  } catch (err) {
    console.error("Error. Impossible to load puzzle data from localStorage", err);
  }

  return undefined;
};

const getInitialPuzzleInformationState = (): PuzzleInformationState =>
  loadPuzzleInformationFromLocalStorage() || getDefaultPuzzleInformationState();

const PuzzleInformationStateContext = createContext<PuzzleInformationState | null>(null);

const PuzzleInformationStateDispatchContext = createContext<Dispatch<PuzzleInformationStateReducerAction>>(() => {});

type SetPuzzleName = {
  type: "set-puzzle-name";
  name: string;
};
type SetNewChallengeId = {
  type: "init-new-challenge-id";
  params?: {
    imageSrc?: string;
    imageOriginalSize?: Size;
    pieceSideShapeName?: PieceShapeName;
    numberOfPiecesPerWidth?: number;
    numberOfPiecesPerHeight?: number;
    boundaryPoints?: BoundaryPoints;
  };
};
type SetChallengeCompletenessProgress = {
  type: "set-challenge-completeness-progress";
  completenessProgress: number;
};
type SetPuzzleWasTouched = {
  type: "set-puzzle-was-touched";
};
type SetActivePieceId = {
  type: "set-active-piece-id";
  pieceId: PieceId | undefined;
};
type SetIsSidebarOpen = {
  type: "set-is-sidebar-open";
  isSidebarOpen: boolean;
};
type ToggleSidebarVisibilityState = {
  type: "toggle-sidebar-visibility-state";
};
type SetPuzzlePieceWasReleased = {
  type: "set-puzzle-piece-was-released";
  piecePositionData: PiecePositionData;
};
type SetPuzzleGroupOfPiecesWereReleased = {
  type: "set-puzzle-group-of-pieces-were-released";
  groupOfPiecesPositionData: PiecePositionData[];
};
type SetSolvingPuzzleTimeSpent = {
  type: "set-solving-puzzle-time-spent";
  timeSpent: number;
};
type SetSolvingPuzzleTimeSpentByAddTimeDelta = {
  type: "set-solving-puzzle-time-spent-by-add-time-delta";
  timeDelta: number;
};
type SetSolvingPuzzleTimerState = {
  type: "set-solving-puzzle-timer-state";
  isTimerPaused: boolean;
};
type setCanvasBackgroundColor = {
  type: "set-canvas-background-color";
  color: CanvasBackgroundColor;
};

export type PuzzleInformationStateReducerAction =
  | SetPuzzleName
  | SetNewChallengeId
  | SetChallengeCompletenessProgress
  | SetPuzzleWasTouched
  | SetActivePieceId
  | SetIsSidebarOpen
  | ToggleSidebarVisibilityState
  | SetPuzzlePieceWasReleased
  | SetPuzzleGroupOfPiecesWereReleased
  | SetSolvingPuzzleTimeSpent
  | SetSolvingPuzzleTimeSpentByAddTimeDelta
  | SetSolvingPuzzleTimerState
  | setCanvasBackgroundColor;

function puzzleInformationReducer(
  prevState: PuzzleInformationState,
  action: PuzzleInformationStateReducerAction,
): PuzzleInformationState {
  switch (action.type) {
    case "set-puzzle-name": {
      return {
        ...prevState,
        name: action.name,
      };
    }
    case "init-new-challenge-id": {
      const params = action.params;
      const newId = generateChallengeId();

      return {
        ...prevState,
        challengeId: newId,
        piecesPositions: [],
        timeSpent: 0,
        ...getDefaultPuzzleProgressState(),
        ...params,
      };
    }
    case "set-challenge-completeness-progress": {
      return {
        ...prevState,
        completenessProgress: action.completenessProgress,
        puzzleCompleted: action.completenessProgress === PUZZLE_COMPLETE_PROGRESS_PERCENTAGE,
      };
    }
    case "set-puzzle-was-touched": {
      return {
        ...prevState,
        puzzleWasTouched: true,
        puzzleWasTouchedAt: Date.now(),
        isTimerPaused: false,
      };
    }
    case "set-active-piece-id": {
      return {
        ...prevState,
        activePieceId: action.pieceId,
      };
    }
    case "set-is-sidebar-open": {
      return {
        ...prevState,
        isSidebarOpen: action.isSidebarOpen,
      };
    }
    case "toggle-sidebar-visibility-state": {
      return {
        ...prevState,
        isSidebarOpen: !prevState.isSidebarOpen,
      };
    }
    case "set-puzzle-piece-was-released": {
      return {
        ...prevState,
        piecesPositions: prevState.piecesPositions
          .filter(({ id }) => action.piecePositionData.id !== id)
          .concat([
            {
              id: action.piecePositionData.id,
              position: {
                x: action.piecePositionData.position.x,
                y: action.piecePositionData.position.y,
              },
            },
          ]),
      };
    }
    case "set-puzzle-group-of-pieces-were-released": {
      const groupOfPiecesPositionData = action.groupOfPiecesPositionData.map((movedPiece) => ({
        id: movedPiece.id,
        position: {
          x: movedPiece.position.x,
          y: movedPiece.position.y,
        },
      }));
      const previousPiecesPositions = prevState.piecesPositions;

      const notMovedPieces = previousPiecesPositions.filter(
        ({ id }) => !groupOfPiecesPositionData.find((movedPiece) => movedPiece.id === id),
      );

      return {
        ...prevState,
        piecesPositions: notMovedPieces.concat(groupOfPiecesPositionData),
      };
    }
    case "set-solving-puzzle-time-spent": {
      return {
        ...prevState,
        timeSpent: action.timeSpent,
      };
    }
    case "set-solving-puzzle-time-spent-by-add-time-delta": {
      return {
        ...prevState,
        timeSpent: prevState.timeSpent + action.timeDelta,
      };
    }
    case "set-solving-puzzle-timer-state": {
      return {
        ...prevState,
        isTimerPaused: action.isTimerPaused,
      };
    }
    case "set-canvas-background-color": {
      return {
        ...prevState,
        canvasBackgroundColor: action.color,
      };
    }

    default: {
      //@ts-expect-error action type and structure are unknown
      throw Error(`Unknown action in ${getFunctionName()}: ${action?.type}`);
    }
  }
}

const prepareDataForSave = (data: PuzzleInformationForSave): RevivedPuzzleInformationForSave => {
  const preparedData = data as unknown as RevivedPuzzleInformationForSave;

  preparedData.boundaryPoints = {
    tl: {
      x: data.boundaryPoints.tl.x,
      y: data.boundaryPoints.tl.y,
    },
    br: {
      x: data.boundaryPoints.br.x,
      y: data.boundaryPoints.br.y,
    },
  };

  return preparedData;
};

export interface PuzzleInformationProviderProps {}

export const PuzzleInformationProvider: FC<PropsWithChildren<PuzzleInformationProviderProps>> = ({ children }) => {
  const [puzzleInformationState, dispatch] = useReducer(
    puzzleInformationReducer,
    null,
    getInitialPuzzleInformationState,
  );

  const puzzleInformationStateForSaveIntoLocalStorage = useMemo((): PuzzleInformationForSave | undefined => {
    const {
      name,
      numberOfPiecesPerWidth,
      numberOfPiecesPerHeight,
      pieceWidth,
      connectionActivationAreaSideSizeFractionFromPieceSideSize,
      challengeId,
      imageSrc,
      imageOriginalSize,
      boundaryPoints,
      piecesPositions,
      timeSpent,
      pieceSideShapeName,
      isSidebarOpen,
      canvasBackgroundColor,
    } = puzzleInformationState;

    const isPuzzleExist =
      numberOfPiecesPerWidth &&
      numberOfPiecesPerHeight &&
      pieceWidth &&
      connectionActivationAreaSideSizeFractionFromPieceSideSize &&
      imageSrc &&
      challengeId &&
      pieceSideShapeName;

    if (isPuzzleExist) {
      return {
        name,
        challengeId,
        numberOfPiecesPerWidth,
        numberOfPiecesPerHeight,
        pieceWidth,
        connectionActivationAreaSideSizeFractionFromPieceSideSize,
        imageSrc,
        imageOriginalSize,
        boundaryPoints,
        piecesPositions,
        timeSpent,
        pieceSideShapeName,
        isSidebarOpen,
        canvasBackgroundColor,
      };
    }

    return undefined;
  }, [puzzleInformationState]);

  useEffect(() => {
    try {
      if (!puzzleInformationStateForSaveIntoLocalStorage) {
        return;
      }

      const preparedDataForSave = prepareDataForSave(puzzleInformationStateForSaveIntoLocalStorage);
      const serializedData = JSON.stringify(preparedDataForSave);
      const savedData = window?.localStorage.getItem(LOCAL_STORAGE_KEY_NAME_PUZZLE_INFORMATION);
      if (serializedData === savedData) {
        return;
      }

      window?.localStorage.setItem(LOCAL_STORAGE_KEY_NAME_PUZZLE_INFORMATION, serializedData);
    } catch (err) {
      console.error("failure of updating puzzle information in localStorage", err);
    }
  }, [puzzleInformationStateForSaveIntoLocalStorage]);

  return (
    <PuzzleInformationStateContext.Provider value={puzzleInformationState}>
      <PuzzleInformationStateDispatchContext.Provider value={dispatch}>
        {children}
      </PuzzleInformationStateDispatchContext.Provider>
    </PuzzleInformationStateContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function usePuzzleInformation() {
  const context = useContext(PuzzleInformationStateContext);
  if (!context) {
    throw new Error("usePuzzleInformation must be used within a PuzzleInformationProvider");
  }

  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePuzzleInformationDispatch() {
  const context = useContext(PuzzleInformationStateDispatchContext);
  if (context === undefined) {
    throw new Error("usePuzzleInformationDispatch must be used within a PuzzleInformationProvider");
  }

  return context;
}

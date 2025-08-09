import { useEffect } from "react";
import type { SidesConnectionTypesAsString } from "../core/puzzle/Piece";
import { useDebugSettingsState } from "./useDebugSettings";

const hitCounterPieceShapePath = new Map<SidesConnectionTypesAsString, number>();

let isHitCounterPieceShapePathActive = false;

const HIT_COUNTER_PIECE_SHAPE_PATH_EXPOSING_ID = "cacheHitCounterPieceShapePath";

export const useCacheHitCounterPieceShapePath = () => {
  const { useHitCounterForPieceShapePath, exposeHitCounterForPieceShapePathToWindowObject } = useDebugSettingsState();

  useEffect(() => {
    if (exposeHitCounterForPieceShapePathToWindowObject && window) {
      //@ts-expect-error access to window global variable
      window[HIT_COUNTER_PIECE_SHAPE_PATH_EXPOSING_ID] = hitCounterPieceShapePath;
    } else {
      //@ts-expect-error access to window global variable
      delete window?.[HIT_COUNTER_PIECE_SHAPE_PATH_EXPOSING_ID];
    }

    return () => {
      //@ts-expect-error access to window global variable
      delete window?.[HIT_COUNTER_PIECE_SHAPE_PATH_EXPOSING_ID];
    };
  }, [exposeHitCounterForPieceShapePathToWindowObject]);

  useEffect(() => {
    isHitCounterPieceShapePathActive = !!useHitCounterForPieceShapePath;
  }, [useHitCounterForPieceShapePath]);
};

export const updateCacheHitCounterForPieceShapePath = (
  sidesConnectionTypesAsString: SidesConnectionTypesAsString,
  debugPrintHitCounter = false,
) => {
  if (!isHitCounterPieceShapePathActive) {
    return;
  }

  const value = hitCounterPieceShapePath.get(sidesConnectionTypesAsString);
  if (value === undefined) {
    hitCounterPieceShapePath.set(sidesConnectionTypesAsString, 1);
  } else {
    hitCounterPieceShapePath.set(sidesConnectionTypesAsString, value + 1);
  }

  if (debugPrintHitCounter) {
    console.log(value);
  }
};

export const clearCacheHitCounterForPieceShapePath = () => {
  hitCounterPieceShapePath.clear();
};

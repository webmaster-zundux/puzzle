import { useEffect } from "react";
import { useDebugSettingsState } from "./useDebugSettings";

export type CacheIdForPieceShapePat = string;

const hitCounterPieceMaskPath = new Map<string, number>();

let isHitCounterForPieceMaskPathActive = false;

const HIT_COUNTER_PIECE_MASK_PATH_EXPOSING_ID = "cacheHitCounterPieceMaskPath";

export const useCacheHitCounterPieceMaskPath = () => {
  const { useHitCounterForPieceMaskPath, exposeHitCounterForPieceMaskPathToWindowObject } = useDebugSettingsState();

  useEffect(() => {
    if (exposeHitCounterForPieceMaskPathToWindowObject && window) {
      //@ts-expect-error access to window global variable
      window[HIT_COUNTER_PIECE_MASK_PATH_EXPOSING_ID] = hitCounterPieceMaskPath;
    } else {
      //@ts-expect-error access to window global variable
      delete window?.[HIT_COUNTER_PIECE_MASK_PATH_EXPOSING_ID];
    }

    return () => {
      //@ts-expect-error access to window global variable
      delete window?.[HIT_COUNTER_PIECE_MASK_PATH_EXPOSING_ID];
    };
  }, [exposeHitCounterForPieceMaskPathToWindowObject]);

  useEffect(() => {
    isHitCounterForPieceMaskPathActive = !!useHitCounterForPieceMaskPath;
  }, [useHitCounterForPieceMaskPath]);
};

export const updateCacheHitCounterForPieceMaskPathCache = (
  maskPathHashString: CacheIdForPieceShapePat,
  debugPrintHitCounter = false,
) => {
  if (!isHitCounterForPieceMaskPathActive) {
    return;
  }

  const value = hitCounterPieceMaskPath.get(maskPathHashString);
  if (value === undefined) {
    hitCounterPieceMaskPath.set(maskPathHashString, 1);
  } else {
    hitCounterPieceMaskPath.set(maskPathHashString, value + 1);
  }

  if (debugPrintHitCounter) {
    console.log(value);
  }
};

export const clearCacheHitCounterPieceMaskPath = () => {
  hitCounterPieceMaskPath.clear();
};

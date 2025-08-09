import type { SidesConnectionTypesAsString } from "../core/puzzle/Piece";
import { log } from "../utils-logs/printToConsole";

export type HitCounterId = string;
export type HitCounterInstanceType<AKey = unknown, AValue = unknown> = Map<AKey, AValue>;

class HitCounter {
  private _counters = new Map<HitCounterId, HitCounterInstanceType>();

  private constructor() {}
  private static instance?: HitCounter;

  static create() {
    if (!HitCounter.instance) {
      HitCounter.instance = new HitCounter();
    }

    return HitCounter.instance;
  }

  addCounter<TKey>(counterId: HitCounterId): HitCounterInstanceType<TKey, number> {
    const counter = new Map<TKey, number>();

    this._counters.set(counterId, counter);

    return counter;
  }
}

export const GeneralHitCounter = HitCounter.create();

const hitCounter = new Map<SidesConnectionTypesAsString, number>();

export const updateCacheHitCounter = (
  sidesConnectionTypesAsString: SidesConnectionTypesAsString,
  debugPrintOnUpdate = false,
) => {
  const existingValue = hitCounter.get(sidesConnectionTypesAsString) || 0;

  const newValue = existingValue + 1;

  hitCounter.set(sidesConnectionTypesAsString, newValue);

  if (debugPrintOnUpdate) {
    log("hit", sidesConnectionTypesAsString, newValue);
  }
};

export const getHitCounterStatistics = () => {
  hitCounter.forEach((value, key) => {
    log("hit", key, value);
  });
};

import type { Id } from "../core/puzzle/BaseEntity";
import { uuid } from "../utils/uuid";

export type ChallengeId = Id;

const generateChallengeIdFunction = () => {
  const newUUID = uuid();
  return newUUID;
};

const EXPOSE_CHALLENGE_ID_GENERATION_TO_WINDOW_OBJECT =
  import.meta.env.VITE_TESTING_CHALLENGE_ID_GENERATION_EXPOSE_TO_WINDOW_OBJECT === "1";
if (EXPOSE_CHALLENGE_ID_GENERATION_TO_WINDOW_OBJECT) {
  // @ts-expect-error property 'generateChallengeId' does not exist on type 'Window & typeof globalThis'
  if (typeof window?.generateChallengeId !== "function") {
    Object.defineProperty(window, "generateChallengeId", {
      value: generateChallengeIdFunction,
      writable: false,
      configurable: false,
    });
  }
}

// @ts-expect-error property 'generateChallengeId' does not exist on type 'Window & typeof globalThis'
export const generateChallengeId = window?.generateChallengeId ?? generateChallengeIdFunction;

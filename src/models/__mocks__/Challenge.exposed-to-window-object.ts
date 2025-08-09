import type { Id } from "../../core/puzzle/BaseEntity";
import { uuid } from "../../utils/uuid";

export type ChallengeId = Id;

const generateChallengeIdFunction = () => {
  const newUUID = uuid();
  return newUUID;
};

Object.defineProperty(window, "generateChallengeId", {
  value: generateChallengeIdFunction,
  writable: false,
  configurable: false,
});

// @ts-expect-error property 'generateChallengeId' does not exist on type 'Window & typeof globalThis'
export const generateChallengeId = window?.generateChallengeId ?? generateChallengeIdFunction;

import seedrandom from "seedrandom";

let currentPrngSeed: string;
let prng: seedrandom.PRNG;

/**
 * Create a seeded preudo random number generator
 * @param seed string
 * @returns seedrandom.PRNG
 */
export const initPRNG = (seed: string): seedrandom.PRNG => {
  return seedrandom(seed);
};

/**
 * Get the last created seeded preudo random number generator
 * @param seed string
 * @returns seedrandom.PRNG
 */
export const getPRNG = (seed: string): seedrandom.PRNG => {
  if (seed !== currentPrngSeed || !prng) {
    prng = initPRNG(seed);
    currentPrngSeed = seed;
  }

  return prng;
};

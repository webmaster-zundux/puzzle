import type seedrandom from "seedrandom";
import { NEIGHBOR_SIDES_CLOCKWISE_ORDER } from "../core/puzzle/Piece";
import { getRandomIntWithinRange } from "../utils/getRandomIntWithinRange";
import type { ConnectionType } from "./SideIndex";
import { CONNECTION_TYPE_PLUG, CONNECTION_TYPE_SOCKET } from "./SideIndex";

export const generateConnectionType = (prng: seedrandom.PRNG): ConnectionType => {
  const min = 0;
  const max = NEIGHBOR_SIDES_CLOCKWISE_ORDER.length - 1;

  const value = getRandomIntWithinRange(min, max, prng);

  return value % max ? CONNECTION_TYPE_PLUG : CONNECTION_TYPE_SOCKET;
};

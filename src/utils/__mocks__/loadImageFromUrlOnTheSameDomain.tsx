import type * as originalModule from "../loadImageFromUrlOnTheSameDomain";

export const loadImageFromUrlOnTheSameDomain: typeof originalModule.loadImageFromUrlOnTheSameDomain = () => {
  return Promise.reject(undefined);
};

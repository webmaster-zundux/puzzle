import type * as originalModule from "../useElementResize";

export const useHtmlElementResize: typeof originalModule.useHtmlElementResize = () => {
  return {
    elementWidth: 1920,
    elementHeight: 1080,
  };
};

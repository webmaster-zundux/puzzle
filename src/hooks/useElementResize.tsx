import type { RefObject } from "react";
import { useCallback, useEffect, useState } from "react";

export const useHtmlElementResize = (
  elementRef: RefObject<HTMLDivElement> | null,
): {
  elementWidth: number;
  elementHeight: number;
} => {
  const [elementWidth, setElementWidth] = useState(0);
  const [elementHeight, setElementHeight] = useState(0);

  const setSize = useCallback(
    (newWidth: number, newHeight: number) => {
      setElementWidth(newWidth);
      setElementHeight(newHeight);
    },
    [setElementWidth, setElementHeight],
  );

  const handleSizeChange = useCallback(
    (entries: ResizeObserverEntry[]) => {
      const element = elementRef?.current;
      if (!element) {
        return;
      }

      if (!entries?.length) {
        return;
      }

      const newWidth = element.clientWidth;
      const newHeight = element.clientHeight;

      if (!Number.isFinite(newWidth) || !Number.isFinite(newHeight) || newWidth < 1 || newHeight < 1) {
        return;
      }

      setSize(newWidth, newHeight);
    },
    [elementRef, setSize],
  );

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) {
      return;
    }

    const resizeObserver = new ResizeObserver(handleSizeChange);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.unobserve(element);
      resizeObserver.disconnect();
    };
  }, [elementRef, handleSizeChange]);

  return {
    elementWidth,
    elementHeight,
  };
};

import type { RefObject } from "react";
import { useCallback, useEffect, useState } from "react";

export const useScrollBorders = (
  elementRef: RefObject<HTMLElement>,
): {
  showTopBorder: boolean;
  showRightBorder: boolean;
  showBottomBorder: boolean;
  showLeftBorder: boolean;
} => {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollBottom, setScrollBottom] = useState(0);

  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollRight, setScrollRight] = useState(0);

  const handleScrolls = useCallback(
    (element?: HTMLElement) => {
      if (!element) {
        return;
      }

      const {
        scrollTop: valueScrollTop,
        scrollHeight: valueScrollHeight,
        scrollLeft: valueScrollLeft,
        scrollWidth: valueScrollWidth,
        clientHeight,
        clientWidth,
      } = element;

      if (
        [valueScrollTop, valueScrollHeight, valueScrollLeft, valueScrollWidth, clientHeight, clientWidth].filter(
          (value) => !Number.isFinite(value),
        ).length > 0
      ) {
        return;
      }

      setScrollTop(valueScrollTop);
      const valueScrollBottom = valueScrollHeight - clientHeight - valueScrollTop;
      setScrollBottom(valueScrollBottom);

      setScrollLeft(valueScrollLeft);
      const valueScrollRight = valueScrollWidth - clientWidth - valueScrollLeft;
      setScrollRight(valueScrollRight);
    },
    [setScrollTop, setScrollBottom, setScrollLeft, setScrollRight],
  );

  const handleScroll = useCallback(
    (event: Event) => {
      const currentTarget = event.currentTarget as HTMLElement;
      handleScrolls(currentTarget);
    },
    [handleScrolls],
  );

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) {
      return;
    }

    element.addEventListener("scroll", handleScroll);
    handleScrolls(element);

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [elementRef, handleScrolls, handleScroll]);

  return {
    showTopBorder: scrollTop > 1,
    showRightBorder: scrollRight > 1,
    showBottomBorder: scrollBottom > 1,
    showLeftBorder: scrollLeft > 1,
  };
};

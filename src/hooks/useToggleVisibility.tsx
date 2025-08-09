import { useCallback, useState } from "react";

export interface UseToggleVisibilityProps {
  (initialValue: boolean): {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
  };
}

export const useToggleVisibility: UseToggleVisibilityProps = (initialValue = false) => {
  const [isVisible, setIsVisible] = useState(initialValue);
  const show = useCallback(() => setIsVisible(true), [setIsVisible]);
  const hide = useCallback(() => setIsVisible(false), [setIsVisible]);

  return {
    isVisible,
    show,
    hide,
  };
};

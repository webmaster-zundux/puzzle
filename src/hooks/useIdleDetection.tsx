import { useEffect, useState } from "react";

const DEFAULT_TIMEOUT_IN_MS_UNTIL_USER_IDLE_STATE_AFTER_THE_LAST_USER_ACTIVITY = 60 * 1000;
const THROTTLE_TIME_WINDOW_IN_MS_FOR_SIMILAR_USER_ACTIVITY_EVENTS = 500;

const DEFAULT_DOCUMENT_EVENT_NAMES_OF_BEGINNING_USER_ACTIVITY: (keyof GlobalEventHandlersEventMap)[] = [
  "mousedown",
  "mousemove",
  "keydown",
  "touchstart",
  "touchmove",
  "wheel",
  "resize",
];

export const throttle = (callback: () => void, timeoutMs: number = 0) => {
  let lastTime = 0;

  return () => {
    const now = Date.now();
    if (now - lastTime >= timeoutMs) {
      if (typeof callback === "function") {
        callback();
      }

      lastTime = now;
    }
  };
};

const bulkAddEventListenersForWindow = (
  eventNames: (keyof GlobalEventHandlersEventMap)[],
  callback: EventListenerOrEventListenerObject,
) => {
  if (typeof eventNames === "undefined" || !(eventNames instanceof Array)) {
    return;
  }

  eventNames.forEach((eventName) => {
    window?.addEventListener(eventName, callback);
  });
};

const bulkRemoveEventListenersForWindow = (
  eventNames: (keyof GlobalEventHandlersEventMap)[],
  callback: EventListenerOrEventListenerObject,
) => {
  if (typeof eventNames === "undefined" || !(eventNames instanceof Array)) {
    return;
  }

  eventNames.forEach((eventName) => {
    window?.removeEventListener(eventName, callback);
  });
};

export const useIdleDetection = (
  timeoutMs: number = DEFAULT_TIMEOUT_IN_MS_UNTIL_USER_IDLE_STATE_AFTER_THE_LAST_USER_ACTIVITY,
  eventNames: (keyof GlobalEventHandlersEventMap)[] = [],
  useDocumentVisibilityChange: boolean = true,
) => {
  const [isUserIdle, setIsUserIdle] = useState(false);
  const [isPageHidden, setIsPageHidden] = useState(false);
  const [listeningEventNames, setListeningEventNames] = useState(
    DEFAULT_DOCUMENT_EVENT_NAMES_OF_BEGINNING_USER_ACTIVITY,
  );

  useEffect(() => {
    if (typeof eventNames === "undefined" || !eventNames) {
      return;
    }

    if (!(eventNames instanceof Array) || !eventNames.length) {
      return;
    }

    setListeningEventNames(eventNames);
  }, [eventNames]);

  useEffect(() => {
    let timeoutId: number;

    const handleSetUserIsIdle = () => {
      setIsUserIdle(true);
    };

    const handleSetUserIsActive = throttle(() => {
      setIsUserIdle(false);

      window?.clearTimeout(timeoutId);
      timeoutId = window?.setTimeout(handleSetUserIsIdle, timeoutMs);
    }, THROTTLE_TIME_WINDOW_IN_MS_FOR_SIMILAR_USER_ACTIVITY_EVENTS);

    bulkAddEventListenersForWindow(listeningEventNames, handleSetUserIsActive);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setIsPageHidden(true);
        handleSetUserIsIdle();
        return;
      }

      handleSetUserIsActive();
      setIsPageHidden(false);
    };

    if (useDocumentVisibilityChange) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    timeoutId = window?.setTimeout(handleSetUserIsIdle, timeoutMs);

    return () => {
      window?.clearTimeout(timeoutId);

      bulkRemoveEventListenersForWindow(listeningEventNames, handleSetUserIsActive);

      if (useDocumentVisibilityChange) {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  }, [timeoutMs, listeningEventNames, useDocumentVisibilityChange]);

  return {
    isUserIdle,
    isPageHidden,
  };
};

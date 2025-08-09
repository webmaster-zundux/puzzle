import { useEffect } from "react";
import { useIdleDetection } from "./useIdleDetection";
import { usePuzzleInformation, usePuzzleInformationDispatch } from "./usePuzzleInformation";

const INTERVAL_TIMER_UPDATE_TIMEOUT_MS = 1000;
const INACTIVITY_TIMEOUT_MS = 60 * 1000;

export function useChallengeTimer() {
  const { puzzleCompleted, puzzleWasTouched, isTimerPaused } = usePuzzleInformation();
  const puzzleInformationDispatch = usePuzzleInformationDispatch();
  const { isUserIdle } = useIdleDetection(INACTIVITY_TIMEOUT_MS);

  useEffect(
    function runTimerEffect() {
      if (isTimerPaused) {
        return;
      }

      if (!puzzleWasTouched) {
        return;
      }

      if (puzzleCompleted) {
        return;
      }

      let timerLatestTimeMark = Date.now();
      const intervalTimerTick = () => {
        const now = Date.now();
        const timeDelta = now - timerLatestTimeMark;

        puzzleInformationDispatch({
          type: "set-solving-puzzle-time-spent-by-add-time-delta",
          timeDelta,
        });
        timerLatestTimeMark = now;
      };

      const intervalTimerId = window?.setInterval(intervalTimerTick, INTERVAL_TIMER_UPDATE_TIMEOUT_MS);
      intervalTimerTick();

      return function runTimerEffectCleanup() {
        intervalTimerTick();
        window?.clearInterval(intervalTimerId);
      };
    },
    [puzzleWasTouched, puzzleCompleted, isTimerPaused, puzzleInformationDispatch],
  );

  useEffect(
    function runOrPauseTimerEffect() {
      if (isUserIdle || puzzleCompleted || !puzzleWasTouched) {
        puzzleInformationDispatch({
          type: "set-solving-puzzle-timer-state",
          isTimerPaused: true,
        });
        return;
      }

      puzzleInformationDispatch({
        type: "set-solving-puzzle-timer-state",
        isTimerPaused: false,
      });
    },
    [isUserIdle, puzzleWasTouched, puzzleCompleted, puzzleInformationDispatch],
  );
}

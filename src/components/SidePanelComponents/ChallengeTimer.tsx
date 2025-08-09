import { memo } from "react";
import { usePuzzleInformation } from "../../hooks/usePuzzleInformation";
import { cn } from "../../utils/cssClassNames";
import { getDutarionStringForTimeHtmlElement, humanizeTime } from "../../utils/humanizeTime";
import s from "./ChallengeTimer.module.css";

export const ChallengeTimer = memo(function ChallengeTimer() {
  const { puzzleCompleted, puzzleWasTouched, timeSpent, isTimerPaused } = usePuzzleInformation();
  const recorderedTimeMs = timeSpent;
  const humanizedTimeString = humanizeTime(recorderedTimeMs);
  const dateTimeStringForTimeHtmlElement = getDutarionStringForTimeHtmlElement(recorderedTimeMs, {
    accuracyDownToSeconds: true,
  });
  const isTimerIndicatorActive = (!isTimerPaused && puzzleWasTouched) || puzzleCompleted;

  return (
    <div className={s.ChallengeTimer} role="note" aria-label="elapsed time">
      <div className={s.Label}>Time:</div>
      <time
        className={cn([s.PassedTime, !isTimerIndicatorActive && s.TimerIsPaused])}
        title="elapsed time"
        dateTime={dateTimeStringForTimeHtmlElement}
      >
        {humanizedTimeString}
      </time>
    </div>
  );
});

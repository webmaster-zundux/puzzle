import { memo } from "react";
import { usePuzzleInformation } from "../../hooks/usePuzzleInformation";
import { cn } from "../../utils/cssClassNames";
import { ActionButton } from "../ActionButton";
import s from "./ChallengeProgress.module.css";

const LIMIT_OF_IGNORED_SPENT_TIME = 1000; // ms

export interface ChallengeProgressProps {
  onRestartPuzzleChallenge?: () => void;
}

export const ChallengeProgress = memo(function ChallengeProgress({ onRestartPuzzleChallenge }: ChallengeProgressProps) {
  const { completenessProgress, puzzleWasTouched, timeSpent } = usePuzzleInformation();

  const formattedProgressValue = `${completenessProgress}%`;
  const isResetButtonDisabled =
    completenessProgress === 0 && !puzzleWasTouched && timeSpent < LIMIT_OF_IGNORED_SPENT_TIME;

  const valueStyleClasses = cn([s.Value, completenessProgress === 0 ? s.ZeroValue : ""]);

  return (
    <div className={s.Container}>
      <div className={s.Information} role="note" aria-label="challenge progress">
        <div className={s.Label}>Progress:</div>
        <div className={valueStyleClasses}>{formattedProgressValue}</div>
      </div>
      <div className={s.ActionButtons}>
        <ActionButton
          iconName="arrow-rotate-left"
          onlyIcon
          text="restart puzzle"
          disabled={isResetButtonDisabled}
          onClick={onRestartPuzzleChallenge}
        />
      </div>
    </div>
  );
});

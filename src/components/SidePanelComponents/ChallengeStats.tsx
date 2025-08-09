import type { FC } from "react";
import { ChallengeProgress } from "./ChallengeProgress";
import s from "./ChallengeStats.module.css";
import { ChallengeTimer } from "./ChallengeTimer";

export interface ChallengeStatsProps {
  onRestartPuzzleChallenge?: () => void;
}

export const ChallengeStats: FC<ChallengeStatsProps> = ({ onRestartPuzzleChallenge }) => {
  return (
    <div className={s.ChallengeStats}>
      <ChallengeTimer />
      <ChallengeProgress onRestartPuzzleChallenge={onRestartPuzzleChallenge} />
    </div>
  );
};

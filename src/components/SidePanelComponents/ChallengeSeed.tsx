import { usePuzzleInformation } from "../../hooks/usePuzzleInformation";
import s from "./ChallengeSeed.module.css";
import { Separator } from "./Separator";

export const ChallengeSeed = () => {
  const { challengeId } = usePuzzleInformation();

  return (
    <>
      <Separator />

      <div className={s.SeedLabel}>
        <div id="challenge-seed-label">challenge seed: </div>
        <div role="note" aria-labelledby="challenge-seed-label">
          {challengeId}
        </div>
      </div>
    </>
  );
};

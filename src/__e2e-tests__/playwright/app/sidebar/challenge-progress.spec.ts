import { expect, test as it, test } from "@playwright/test";
import { openPuzzlePageWithDemoPuzzle2x1Data } from "../../page-objects/puzzle-page";

test.describe(`sidebar`, () => {
  test.describe(`challenge progress`, () => {
    test.describe(`value`, () => {
      it(`increases value when puzzle's pieces connects`, async ({ page }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        await expect(puzzlePage.sidebar.getChallengeProgressLabel).toHaveText("Progress:0%");

        await puzzlePage.solveDemoPuzzle2x1();

        await expect(puzzlePage.sidebar.getChallengeProgressLabel).toHaveText("Progress:100%");
      });

      it(`resets value to 0% when a new puzzle created`, async ({ page }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
        await expect(puzzlePage.sidebar.getChallengeProgressLabel).toHaveText("Progress:0%");
        await puzzlePage.solveDemoPuzzle2x1();
        await expect(puzzlePage.sidebar.getChallengeProgressLabel).toHaveText("Progress:100%");

        await puzzlePage.changeNumberOfPiecePerSide();

        const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
        expect(anotherPuzzleSeed).not.toBe(initialPuzzleSeed);
        await expect(puzzlePage.sidebar.getChallengeProgressLabel).toHaveText("Progress:0%");
      });

      it(`has value equals 100% when the puzzle challenge solved`, async ({ page }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        await expect(puzzlePage.sidebar.getChallengeProgressLabel).toHaveText("Progress:0%");

        await puzzlePage.solveDemoPuzzle2x1();

        await expect(puzzlePage.sidebar.getChallengeProgressLabel).toHaveText("Progress:100%");
      });

      test.describe(
        `calculate the challenge progress on the data loaded from localStorage`,
        {
          tag: `@localStorage`,
        },
        () => {
          it(
            `preserves progress when page reloads`,
            {
              tag: `@localStorage`,
            },
            async ({ page }) => {
              const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
              const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
              await expect(puzzlePage.sidebar.getChallengeProgressLabel).toHaveText("Progress:0%");
              await puzzlePage.solveDemoPuzzle2x1();
              await expect(puzzlePage.sidebar.getChallengeProgressLabel).toHaveText("Progress:100%");

              await puzzlePage.reload();

              const theSamePuzzleSeed = await puzzlePage.getPuzzleSeed();
              expect(theSamePuzzleSeed).toBe(initialPuzzleSeed);
              await expect(puzzlePage.sidebar.getChallengeProgressLabel).toHaveText("Progress:100%");
            },
          );

          it(
            `preserves progress when page loads by url`,
            {
              tag: `@localStorage`,
            },
            async ({ page }) => {
              const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
              const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
              await expect(puzzlePage.sidebar.getChallengeProgressLabel).toHaveText("Progress:0%");
              await puzzlePage.solveDemoPuzzle2x1();
              await expect(puzzlePage.sidebar.getChallengeProgressLabel).toHaveText("Progress:100%");

              await puzzlePage.goto();

              const theSamePuzzleSeed = await puzzlePage.getPuzzleSeed();
              expect(theSamePuzzleSeed).toBe(initialPuzzleSeed);
              await expect(puzzlePage.sidebar.getChallengeProgressLabel).toHaveText("Progress:100%");
            },
          );
        },
      );

      test.describe(
        `saving the challenge progress into localStorage`,
        {
          tag: `@localStorage`,
        },
        () => {
          it(
            `causes saving the puzzle data into localStorage when challenge progress changes`,
            {
              tag: `@localStorage`,
              annotation: {
                type: "spec",
                description:
                  "saving to localStorage not needed because a challenge progress calculates based on pieces positions",
              },
            },
            () => {
              test.skip(true, "no action needed");
            },
          );
        },
      );
    });

    test.describe(`button "restart challenge" (with arrow rotate left icon)`, () => {
      it(`becomes enabled when clicking on the puzzle view (canvas)`, async ({ page }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        await expect(puzzlePage.sidebar.getRestartPuzzleButton).toBeDisabled();

        await puzzlePage.getPuzzleView.click();

        await expect(puzzlePage.sidebar.getRestartPuzzleButton).toBeEnabled();
      });

      it(`becomes disabled when a new puzzle created`, async ({ page }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
        await expect(puzzlePage.sidebar.getRestartPuzzleButton).toBeDisabled();
        await puzzlePage.solveDemoPuzzle2x1();
        await expect(puzzlePage.sidebar.getRestartPuzzleButton).toBeEnabled();

        await puzzlePage.restartDemoPuzzle2x1();

        const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
        expect(anotherPuzzleSeed).not.toBe(initialPuzzleSeed);
        await expect(puzzlePage.sidebar.getRestartPuzzleButton).toBeDisabled();
      });

      test.describe(
        `calculate "restart challenge" button state on the data loaded from localStorage`,
        {
          tag: `@localStorage`,
        },
        () => {
          it(
            `preserves state when page reloads when the challenge progress more than 0%`,
            {
              tag: `@localStorage`,
            },
            async ({ page }) => {
              const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
              await expect(puzzlePage.sidebar.getRestartPuzzleButton).toBeDisabled();
              await puzzlePage.solveDemoPuzzle2x1();
              await expect(puzzlePage.sidebar.getChallengeProgressLabel).toHaveText("Progress:100%");

              await puzzlePage.reload();

              await expect(puzzlePage.sidebar.getRestartPuzzleButton).toBeEnabled({ timeout: 1_000 });
            },
          );

          it(
            `preserves state when page loads by url when the challenge progress more than 0%`,
            {
              tag: `@localStorage`,
            },
            async ({ page }) => {
              const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
              await expect(puzzlePage.sidebar.getRestartPuzzleButton).toBeDisabled();
              await puzzlePage.solveDemoPuzzle2x1();
              await expect(puzzlePage.sidebar.getChallengeProgressLabel).toHaveText("Progress:100%");

              await puzzlePage.goto();

              await expect(puzzlePage.sidebar.getRestartPuzzleButton).toBeEnabled({ timeout: 1_000 });
            },
          );
        },
      );
    });
  });
});

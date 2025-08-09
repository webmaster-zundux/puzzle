import { expect, test as it, test } from "@playwright/test";
import { openPuzzlePageWithDemoPuzzle2x1Data } from "../../page-objects/puzzle-page";

test.describe(`sidebar`, () => {
  test.describe(`challenge timer`, () => {
    it(`starts when clicking on the puzzle view (canvas)`, async ({ page }) => {
      await page.clock.install();
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      await page.clock.pauseAt(new Date());
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");

      await puzzlePage.getPuzzleView.click();
      await page.clock.runFor(1000);

      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:01");
    });

    it(`updates the puzzle elapsed time every second while the puzzle timer is running`, async ({ page }) => {
      await page.clock.install();
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      await page.clock.pauseAt(new Date());
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");

      await puzzlePage.getPuzzleView.click();
      await page.clock.runFor(1000);
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:01");

      await page.clock.runFor(1000);
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:02");

      await page.clock.runFor(1000);
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:03");
    });

    it(`pauses when an user idles longer than 60 seconds`, async ({ page }) => {
      await page.clock.install();
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      await page.clock.pauseAt(new Date());
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");

      await puzzlePage.getPuzzleView.click();
      await page.clock.runFor(60_000);
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:00");

      await page.clock.runFor(10_000);
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:00");
    });

    it(`continues to run when an user becomes active after inactivity`, async ({ page }) => {
      await page.clock.install();
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      await page.clock.pauseAt(new Date());
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");
      await puzzlePage.getPuzzleView.click();
      await page.clock.runFor(60_000);
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:00");
      await page.clock.runFor(10_000);
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:00");

      await puzzlePage.getPuzzleView.click();
      await page.clock.runFor(1_000);
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:01");

      await page.clock.runFor(10_000);
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:11");
    });

    it(`stops when the puzzle challenge solved`, async ({ page }) => {
      await page.clock.install();
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      await page.clock.pauseAt(new Date());
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");
      await puzzlePage.getPuzzleView.click();
      await page.clock.runFor(45_000);
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:45");

      await puzzlePage.solveDemoPuzzle2x1();
      await page.clock.runFor(10_000);

      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:45");
    });

    it(`preserves value when puzzle was solved and clicking on puzzle view (canvas)`, async ({ page }) => {
      await page.clock.install();
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      await page.clock.pauseAt(new Date());
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");
      await puzzlePage.getPuzzleView.click();
      await page.clock.runFor(45_000);
      await puzzlePage.solveDemoPuzzle2x1();
      await page.clock.runFor(10_000);
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:45");

      await puzzlePage.getPuzzleView.click();
      await page.clock.runFor(10_000);

      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:45");
    });

    it(`resets to 0 when puzzle restarts`, async ({ page }) => {
      await page.clock.install();
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
      await page.clock.pauseAt(new Date());
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");
      await puzzlePage.getPuzzleView.click();
      await page.clock.runFor(45_000);
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:45");

      await puzzlePage.restartDemoPuzzle2x1();
      await page.clock.runFor(10_000);

      const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
      expect(anotherPuzzleSeed).not.toBe(initialPuzzleSeed);
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");
    });

    it(`resets to 0 when new puzzle creates but current puzzle was not solved`, async ({ page }) => {
      await page.clock.install();
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
      await page.clock.pauseAt(new Date());
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");
      await puzzlePage.getPuzzleView.click();
      await page.clock.runFor(45_000);
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:45");

      await puzzlePage.changeNumberOfPiecePerSide();
      await page.clock.runFor(10_000);

      const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
      expect(anotherPuzzleSeed).not.toBe(initialPuzzleSeed);
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");
    });

    it(`resets to 0 when new puzzle creates and current puzzle was solved`, async ({ page }) => {
      await page.clock.install();
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
      await page.clock.pauseAt(new Date());
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");
      await puzzlePage.getPuzzleView.click();
      await page.clock.runFor(45_000);
      await puzzlePage.solveDemoPuzzle2x1();
      await page.clock.runFor(10_000);
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:45");

      await puzzlePage.changeNumberOfPiecePerSide();
      await page.clock.runFor(10_000);

      const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
      expect(anotherPuzzleSeed).not.toBe(initialPuzzleSeed);
      await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");
    });

    test.describe(
      `loading the timer value from localStorage`,
      {
        tag: `@localStorage`,
      },
      () => {
        it(
          `preserves value when page reloads but current puzzle was not solved`,
          {
            tag: `@localStorage`,
          },
          async ({ page }) => {
            await page.clock.install();
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
            await page.clock.pauseAt(new Date());
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");
            await puzzlePage.getPuzzleView.click();
            await page.clock.runFor(45_000);
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:45");

            await puzzlePage.reload();
            await page.clock.runFor(10_000);

            const theSamePuzzleSeed = await puzzlePage.getPuzzleSeed();
            expect(theSamePuzzleSeed).toBe(initialPuzzleSeed);
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:45");
          },
        );

        it(
          `preserves value when page reloads and current puzzle was solved`,
          {
            tag: `@localStorage`,
          },
          async ({ page }) => {
            await page.clock.install();
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
            await page.clock.pauseAt(new Date());
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");
            await puzzlePage.getPuzzleView.click();
            await page.clock.runFor(45_000);
            await puzzlePage.solveDemoPuzzle2x1();
            await page.clock.runFor(10_000);
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:45");

            await puzzlePage.reload();
            await page.clock.runFor(10_000);

            const theSamePuzzleSeed = await puzzlePage.getPuzzleSeed();
            expect(theSamePuzzleSeed).toBe(initialPuzzleSeed);
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:45");
          },
        );

        it(
          `preserves value when page loads by url but current puzzle was not solved`,
          {
            tag: `@localStorage`,
          },
          async ({ page }) => {
            await page.clock.install();
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
            await page.clock.pauseAt(new Date());
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");
            await puzzlePage.getPuzzleView.click();
            await page.clock.runFor(45_000);
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:45");

            await puzzlePage.goto();
            await page.clock.runFor(10_000);

            const theSamePuzzleSeed = await puzzlePage.getPuzzleSeed();
            expect(theSamePuzzleSeed).toBe(initialPuzzleSeed);
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:45");
          },
        );

        it(
          `preserves value when page loads by url and current puzzle was solved`,
          {
            tag: `@localStorage`,
          },
          async ({ page }) => {
            await page.clock.install();
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
            await page.clock.pauseAt(new Date());
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");
            await puzzlePage.getPuzzleView.click();
            await page.clock.runFor(45_000);
            await puzzlePage.solveDemoPuzzle2x1();
            await page.clock.runFor(10_000);
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:45");

            await puzzlePage.goto();
            await page.clock.runFor(10_000);

            const theSamePuzzleSeed = await puzzlePage.getPuzzleSeed();
            expect(theSamePuzzleSeed).toBe(initialPuzzleSeed);
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:45");
          },
        );

        it(`continues to run when page reloads and clicking on the puzzle view (canvas)`, async ({ page }) => {
          await page.clock.install();
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
          await page.clock.pauseAt(new Date());
          await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");
          await puzzlePage.getPuzzleView.click();
          await page.clock.runFor(60_000);
          await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:00");
          await page.clock.runFor(10_000);
          await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:00");
          await puzzlePage.getPuzzleView.click();
          await page.clock.runFor(1_000);
          await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:01");
          await page.clock.runFor(10_000);
          await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:11");

          await puzzlePage.reload();
          await page.clock.runFor(10_000);
          await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:11");
          await puzzlePage.getPuzzleView.click();
          await page.clock.runFor(1_000);
          await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:12");
          await page.clock.runFor(10_000);
          await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:22");

          const theSamePuzzleSeed = await puzzlePage.getPuzzleSeed();
          expect(theSamePuzzleSeed).toBe(initialPuzzleSeed);
          await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:22");
        });

        it(`continues to run when page loads by url and clicking on the puzzle view (canvas)`, async ({ page }) => {
          await page.clock.install();
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
          await page.clock.pauseAt(new Date());
          await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");
          await puzzlePage.getPuzzleView.click();
          await page.clock.runFor(60_000);
          await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:00");
          await page.clock.runFor(10_000);
          await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:00");
          await puzzlePage.getPuzzleView.click();
          await page.clock.runFor(1_000);
          await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:01");
          await page.clock.runFor(10_000);
          await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:11");

          await puzzlePage.goto();
          await page.clock.runFor(10_000);
          await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:11");
          await puzzlePage.getPuzzleView.click();
          await page.clock.runFor(1_000);
          await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:12");
          await page.clock.runFor(10_000);
          await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:22");

          const theSamePuzzleSeed = await puzzlePage.getPuzzleSeed();
          expect(theSamePuzzleSeed).toBe(initialPuzzleSeed);
          await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:1:22");
        });
      },
    );

    test.describe(
      `saving the timer value into localStorage`,
      {
        tag: `@localStorage`,
      },
      () => {
        it(`causes saving the puzzle data into localStorage when timer ticks`, async ({ page }) => {
          await page.clock.install();
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          await page.clock.pauseAt(new Date());
          const initialData = await puzzlePage.getPuzzleDataFromLocalStorage();
          await puzzlePage.getPuzzleView.click();
          await page.clock.runFor(45_000);

          await puzzlePage.solveDemoPuzzle2x1();
          await page.clock.runFor(10_000);

          const alteredData = await puzzlePage.getPuzzleDataFromLocalStorage();
          expect(alteredData.timeSpent).not.toStrictEqual(initialData.timeSpent);
          const timeSpentInMs = alteredData.timeSpent;
          const timeSpentInSeconds = (timeSpentInMs - (timeSpentInMs % 1000)) / 1000;
          expect(timeSpentInSeconds).toStrictEqual(45);
        });
      },
    );

    test.describe(
      `by toggle page visibility`,
      {
        tag: "@document.visibilityState",
      },
      () => {
        it(
          `pauses when page hides (minimizes)`,
          {
            tag: "@document.visibilityState",
          },
          async ({ page }) => {
            await page.clock.install();
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            await page.clock.pauseAt(new Date());
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");
            await puzzlePage.getPuzzleView.click();
            await page.clock.runFor(10_000);
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:10");

            await puzzlePage.hidePage();
            await page.clock.runFor(10_000);
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:10");
          },
        );

        it(
          `continues when an user focuses on the page after the page was hidden`,
          {
            tag: "@document.visibilityState",
          },
          async ({ page }) => {
            await page.clock.install();
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            await page.clock.pauseAt(new Date());
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:00");
            await puzzlePage.getPuzzleView.click();
            await page.clock.runFor(10_000);
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:10");

            await puzzlePage.hidePage();
            await page.clock.runFor(10_000);
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:10");

            await puzzlePage.showPage();
            await page.clock.runFor(10_000);
            await expect(puzzlePage.sidebar.getElapsedTimeLabel).toHaveText("Time:0:20");
          },
        );
      },
    );
  });
});

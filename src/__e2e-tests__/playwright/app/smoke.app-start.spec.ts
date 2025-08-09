import { expect, test as it, test } from "@playwright/test";
import { openPuzzlePageWithDemoPuzzle2x1Data } from "../page-objects/puzzle-page";

test.describe(
  "@smoke app",
  {
    tag: "@smoke",
  },
  () => {
    it(
      `starts with saved into localStorage puzzle state`,
      {
        tag: "@localStorage",
      },
      async ({ page }) => {
        await openPuzzlePageWithDemoPuzzle2x1Data(page);

        await expect(page).toHaveScreenshot(`app starts with the demo puzzle.full-page.png`, { timeout: 2_000 });
      },
    );

    it(`tests nonexistence of screenshot rendering difference between browser headless and headfull modes and between browsers`, async ({
      page,
      browserName,
      headless,
    }) => {
      await openPuzzlePageWithDemoPuzzle2x1Data(page);

      await expect(page).toHaveScreenshot(`rendering differences.full-page.png`, { timeout: 2_000 });
      await expect(page).toHaveScreenshot(
        `rendering differences.${browserName}-${headless ? "headless" : "normal"}.full-page.png`,
        { timeout: 2_000 },
      );
    });
  },
);

import { test, expect, test as it } from "@playwright/test";
import {
  openPuzzlePageWithDemoPuzzle2x1Data,
  PUZZLE_ZOOM_LABEL_VALUE_MAX,
  PUZZLE_ZOOM_LABEL_VALUE_MIN,
  PUZZLE_ZOOM_LABEL_VALUE_ORIGINAL_SIZE,
  PUZZLE_ZOOM_VALUE_MIN,
  PUZZLE_ZOOM_VALUE_ORIGINAL_SIZE,
  PUZZLE_ZOOM_VALUE_STEP_DELTA,
} from "../../page-objects/puzzle-page";

test.describe("floating action panel", () => {
  test.describe("change camera zoom", () => {
    test.describe("by buttons in floating action panel", () => {
      it(`sets zoom value equal 1.00x when pressing "reset zoom" button`, async ({ page }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        await expect(puzzlePage.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_MAX);

        await puzzlePage.floatingPanel.getResetZoomButton.click();

        await expect(puzzlePage.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_ORIGINAL_SIZE);
      });

      it(`sets zoom value equal canvas.width - 100px when pressing on "show all pieces" button but not greater than 2.00x`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        await puzzlePage.floatingPanel.getResetZoomButton.click();
        await expect(puzzlePage.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_ORIGINAL_SIZE);

        await puzzlePage.floatingPanel.getShowAllPiecesButton.click();

        await expect(puzzlePage.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_MAX);
      });

      it.fixme(
        `sets zoom value to contain all piece in a react with size canvas.size - 100px for each size when pressing on "show all pieces" button but not smaller than 0.50x`,
        async () => {},
      );

      it(`decreases zoom value on 0.1 when pressing on "zoom out" button`, async ({ page }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        await expect(puzzlePage.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_MAX);

        await puzzlePage.floatingPanel.getZoomOutButton.click();

        await expect(puzzlePage.getZoomLabel).toHaveText("1.90x");
      });

      it(`increases zoom value on 0.1 when pressing on "zoom in" button`, async ({ page }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        await puzzlePage.floatingPanel.getResetZoomButton.click();
        await expect(puzzlePage.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_ORIGINAL_SIZE);

        await puzzlePage.floatingPanel.getZoomInButton.click();

        await expect(puzzlePage.getZoomLabel).toHaveText("1.10x");
      });

      it(`does not change zoom value when pressing on "zoom out" button and the zoom value equals "0.50x"`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        await puzzlePage.floatingPanel.getResetZoomButton.click();
        await expect(puzzlePage.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_ORIGINAL_SIZE);
        const step = PUZZLE_ZOOM_VALUE_STEP_DELTA;
        const start = PUZZLE_ZOOM_VALUE_ORIGINAL_SIZE;
        const end = PUZZLE_ZOOM_VALUE_MIN;
        const steps = (start - end) / step;
        for (let i = 1; i <= steps; i++) {
          await puzzlePage.floatingPanel.getZoomOutButton.click();
          await expect(puzzlePage.getZoomLabel).toHaveText(`${(start - i * step).toFixed(2)}x`);
        }
        await expect(puzzlePage.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_MIN);

        await puzzlePage.floatingPanel.getZoomOutButton.click();

        await expect(puzzlePage.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_MIN);
      });

      it(`does not change zoom value when pressing on "zoom in" button and the zoom value equals "2.00x"`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        await expect(puzzlePage.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_MAX);

        await puzzlePage.floatingPanel.getZoomInButton.click();

        await expect(puzzlePage.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_MAX);
      });
    });

    test.describe(`by mouse wheel`, () => {
      it(`decreases zoom value on 0.1 when mouse wheel scrolling down`, async ({ page }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        await expect(puzzlePage.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_MAX);

        await puzzlePage.getPuzzleView.hover();
        await page.mouse.wheel(0, 10);

        await expect(puzzlePage.getZoomLabel).toHaveText("1.90x");
      });

      it(`increases zoom value on 0.1 when mouse wheel scrolling up`, async ({ page }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        await puzzlePage.floatingPanel.getResetZoomButton.click();
        await expect(puzzlePage.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_ORIGINAL_SIZE);

        await puzzlePage.getPuzzleView.hover();
        await page.mouse.wheel(0, -10);

        await expect(puzzlePage.getZoomLabel).toHaveText("1.10x");
      });

      it(`does not change zoom value when mouse wheel scrolling down and the zoom value equals "0.50x"`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        await puzzlePage.floatingPanel.getResetZoomButton.click();
        await expect(puzzlePage.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_ORIGINAL_SIZE);
        const step = PUZZLE_ZOOM_VALUE_STEP_DELTA;
        const start = PUZZLE_ZOOM_VALUE_ORIGINAL_SIZE;
        const end = PUZZLE_ZOOM_VALUE_MIN;
        const steps = (start - end) / step;
        for (let i = 1; i <= steps; i++) {
          await puzzlePage.getPuzzleView.hover();
          await page.mouse.wheel(0, 10);
          await expect(puzzlePage.getZoomLabel).toHaveText(`${(start - i * step).toFixed(2)}x`);
        }
        await expect(puzzlePage.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_MIN);

        await puzzlePage.getPuzzleView.hover();
        await page.mouse.wheel(0, 10);

        await expect(puzzlePage.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_MIN);
      });

      it(`does not change zoom value mouse wheel scrolling up and the zoom value equals "2.00x"`, async ({ page }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        await expect(puzzlePage.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_MAX);

        await puzzlePage.getPuzzleView.hover();
        await page.mouse.wheel(0, -10);

        await expect(puzzlePage.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_MAX);
      });
    });
  });
});

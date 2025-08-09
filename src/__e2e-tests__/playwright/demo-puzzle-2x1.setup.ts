import { expect, test as setup, test } from "@playwright/test";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PuzzlePageObject } from "./page-objects/puzzle-page";

test.use({ storageState: { cookies: [], origins: [] } });

const getDemoPuzzle2x1Path = () => {
  return resolve(dirname(fileURLToPath(import.meta.url)), "./.setup/demo-puzzle-2x1.json");
};

setup.fixme(
  "initialize demo puzzle 2x1 pieces and save it in localStorage",
  {
    tag: "@setup",
  },
  async ({ page }) => {
    const puzzlePage = new PuzzlePageObject(page);
    await puzzlePage.goto();
    await puzzlePage.isVisible();

    await puzzlePage.sidebar.getChangeNumberOfPiecesButton.click();
    await puzzlePage.dialogPuzzleCreation.isVisible();
    const dialogPuzzleCreation = puzzlePage.dialogPuzzleCreation;

    await dialogPuzzleCreation.getRecommendedSizeListItems.getByRole("button", { name: /^2 pieces/i }).click();
    await expect(dialogPuzzleCreation.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");

    await dialogPuzzleCreation.getResetSelectedAreaButton.click();
    await expect(dialogPuzzleCreation.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");

    const area = dialogPuzzleCreation.selectedArea;
    await area.moveControlPointByDelta(area.getTopSideControlPoint, {
      x: 0,
      y: +50,
    });

    await expect(dialogPuzzleCreation.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 2(2x1)");

    await dialogPuzzleCreation.getCreatePuzzleButton.click();
    await expect(puzzlePage.sidebar.getPuzzlePiecesInfoLabel).toHaveText("2 pieces (2x1)");

    await page.context().storageState({ path: getDemoPuzzle2x1Path() });
  },
);

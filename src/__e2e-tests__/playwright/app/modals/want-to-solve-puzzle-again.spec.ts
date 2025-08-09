import { expect, test as it, test } from "@playwright/test";
import { openPuzzlePageWithDemoPuzzle2x1Data } from "../../page-objects/puzzle-page";

test.describe(`modal "want to solve the puzzle again"`, () => {
  it(`displays when clicking on "solve puzzle again" button in the sidebar`, async ({ page }) => {
    const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);

    await puzzlePage.sidebar.getSolvePuzzleAgainButton.click();

    await puzzlePage.dialogSolvePuzzleAgain.isVisible();
  });

  it(`displays when clicking on "restart puzzle" button in the sidebar`, async ({ page }) => {
    const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);

    await puzzlePage.getPuzzleView.click();
    await puzzlePage.sidebar.getRestartPuzzleButton.click();

    await puzzlePage.dialogSolvePuzzleAgain.isVisible();
  });

  it(`hides when clicking on "cancel" button`, async ({ page }) => {
    const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
    await puzzlePage.sidebar.getSolvePuzzleAgainButton.click();
    await puzzlePage.dialogSolvePuzzleAgain.isVisible();

    await puzzlePage.dialogSolvePuzzleAgain.getCancelButton.click();

    await puzzlePage.dialogSolvePuzzleAgain.isNotVisible();
  });

  it(`hides and creates new puzzle when clicking on "solve again" button`, async ({ page }) => {
    const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
    const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
    await puzzlePage.sidebar.getSolvePuzzleAgainButton.click();
    await puzzlePage.dialogSolvePuzzleAgain.isVisible();

    await puzzlePage.dialogSolvePuzzleAgain.getSolveAgainButton.click();

    await puzzlePage.dialogSolvePuzzleAgain.isNotVisible();
    const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
    expect(anotherPuzzleSeed).not.toBe(initialPuzzleSeed);
  });

  it(`hides when clicking on modal backdrop`, async ({ page }) => {
    const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
    const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
    await puzzlePage.sidebar.getSolvePuzzleAgainButton.click();
    await puzzlePage.dialogSolvePuzzleAgain.isVisible();

    await puzzlePage.dialogSolvePuzzleAgain.getBackdrop.click({ position: { x: 0, y: 0 } });

    await puzzlePage.dialogSolvePuzzleAgain.isNotVisible();
    const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
    expect(anotherPuzzleSeed).toBe(initialPuzzleSeed);
  });

  it(`hides when pressing on "esc" key`, async ({ page }) => {
    const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
    const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
    await puzzlePage.sidebar.getSolvePuzzleAgainButton.click();
    await puzzlePage.dialogSolvePuzzleAgain.isVisible();

    await page.keyboard.press("Escape");

    await puzzlePage.dialogSolvePuzzleAgain.isNotVisible();
    const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
    expect(anotherPuzzleSeed).toBe(initialPuzzleSeed);
  });
});

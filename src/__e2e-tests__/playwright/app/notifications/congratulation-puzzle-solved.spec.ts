import { expect, test as it, test } from "@playwright/test";
import { openPuzzlePageWithDemoPuzzle2x1Data } from "../../page-objects/puzzle-page";

test.describe(`notification "congratulation! puzzle solved"`, () => {
  it(`displays when a puzzle becomes solved`, async ({ page }) => {
    const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);

    await puzzlePage.solveDemoPuzzle2x1();

    await puzzlePage.notificationCongratulation.isVisible();
    await expect(page).toHaveScreenshot({ timeout: 2_000 });
  });

  it(`displays when page loads by url with a solved puzzle`, async ({ page }) => {
    const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
    await puzzlePage.solveDemoPuzzle2x1();
    await puzzlePage.notificationCongratulation.isVisible();

    await puzzlePage.goto();

    await puzzlePage.notificationCongratulation.isVisible({ timeout: 2_000 });
    await expect(page).toHaveScreenshot({ timeout: 2_000 });
  });

  it(`displays when page reloads with a solved puzzle`, async ({ page }) => {
    const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
    await puzzlePage.solveDemoPuzzle2x1();
    await puzzlePage.notificationCongratulation.isVisible();

    await puzzlePage.reload();

    await puzzlePage.notificationCongratulation.isVisible({ timeout: 2_000 });
    await expect(page).toHaveScreenshot({ timeout: 2_000 });
  });

  it(`hides when clicking on "close" button`, async ({ page }) => {
    const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
    await puzzlePage.solveDemoPuzzle2x1();
    await puzzlePage.notificationCongratulation.isVisible();

    await puzzlePage.notificationCongratulation.getCloseButton.click();
    await expect(puzzlePage.notificationCongratulation.getNotification).not.toBeVisible();
  });

  it(`hides when a puzzle restarts`, async ({ page }) => {
    const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
    await puzzlePage.solveDemoPuzzle2x1();
    await puzzlePage.notificationCongratulation.isVisible();
    const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();

    await puzzlePage.restartDemoPuzzle2x1();

    await expect(puzzlePage.notificationCongratulation.getNotification).not.toBeVisible();
    const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
    expect(anotherPuzzleSeed).not.toBe(initialPuzzleSeed);
  });

  it(`hides when a new puzzle creates`, async ({ page }) => {
    const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
    await puzzlePage.solveDemoPuzzle2x1();
    await puzzlePage.notificationCongratulation.isVisible();
    const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();

    await puzzlePage.changeNumberOfPiecePerSide();

    await expect(puzzlePage.notificationCongratulation.getNotification).not.toBeVisible();
    const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
    expect(anotherPuzzleSeed).not.toBe(initialPuzzleSeed);
  });
});

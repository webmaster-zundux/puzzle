import { test as it, test } from "@playwright/test";
import { openPuzzlePageWithDemoPuzzle2x1Data } from "../../page-objects/puzzle-page";

test.describe(`modal "help"`, () => {
  it(`displays when clicking on "help" button in the sidebar`, async ({ page }) => {
    const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);

    await puzzlePage.sidebar.getHelpButton.click();

    await puzzlePage.dialogHelp.isVisible();
  });

  it(`hides when clicking on "close" button`, async ({ page }) => {
    const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
    await puzzlePage.sidebar.getHelpButton.click();
    await puzzlePage.dialogHelp.isVisible();

    await puzzlePage.dialogHelp.getCloseButton.click();

    await puzzlePage.dialogHelp.isNotVisible();
  });

  it(`hides when clicking on modal backdrop`, async ({ page }) => {
    const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
    await puzzlePage.sidebar.getHelpButton.click();
    await puzzlePage.dialogHelp.isVisible();

    await puzzlePage.dialogHelp.getBackdrop.click({ position: { x: 0, y: 0 } });

    await puzzlePage.dialogHelp.isNotVisible();
  });

  it(`hides when pressing on "esc" key`, async ({ page }) => {
    const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
    await puzzlePage.sidebar.getHelpButton.click();
    await puzzlePage.dialogHelp.isVisible();

    await page.keyboard.press("Escape");

    await puzzlePage.dialogHelp.isNotVisible();
  });
});

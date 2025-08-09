import { expect, test as it } from "@playwright/test";
import { openPuzzlePageWithDemoPuzzle2x1Data } from "../page-objects/puzzle-page";

it(`does not select text around when moving a piece`, async ({ page }) => {
  await page.addInitScript(() => {
    // @ts-expect-error - Property 'logFilterString' does not exist on type 'Window & typeof globalThis'
    window.logFilterString = `(${[`usePieceMove -`, `moveActivePiece`].join("|")})`;
  }, undefined);
  const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);

  const viewBoundingBox = await puzzlePage.getPuzzleView.boundingBox();
  expect(viewBoundingBox).not.toBe(null);

  const origin = {
    x: viewBoundingBox!.width / 2,
    y: viewBoundingBox!.height / 2,
  };
  const target = {
    x: viewBoundingBox!.width / 2 + 200,
    y: viewBoundingBox!.height / 2 + 200,
  };
  await puzzlePage.movePieceToFromPointToPoint(origin, target);

  const selectionText = await page.evaluate(() => document.getSelection()?.toString());
  expect(selectionText).toBe("");
  await expect(page).toHaveScreenshot({ timeout: 2_000 });
});

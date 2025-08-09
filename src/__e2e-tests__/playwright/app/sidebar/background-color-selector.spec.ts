import { expect, test as it, test } from "@playwright/test";
import {
  openPuzzlePageWithDemoPuzzle2x1Data,
  PUZZLE_BACKGROUND_COLOR_BLACK,
  PUZZLE_BACKGROUND_COLOR_DEFAULT,
} from "../../page-objects/puzzle-page";

test.describe(`sidebar`, () => {
  test.describe(`background color selector`, () => {
    it(`changes the canvas background color when clicking on any not selected color`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      await expect(puzzlePage.getPageContainerHtmlElement).toHaveCSS(
        "background-color",
        PUZZLE_BACKGROUND_COLOR_DEFAULT,
      );
      await expect(
        puzzlePage.sidebar.getBackgroundColorListItems.getByRole("radio", { name: /dark slate gray/i }),
      ).toBeChecked();

      await puzzlePage.sidebar.getBackgroundColorListItems.getByTitle("black").click();

      await expect(puzzlePage.getPageContainerHtmlElement).toHaveCSS("background-color", PUZZLE_BACKGROUND_COLOR_BLACK);
      await expect(puzzlePage.sidebar.getBackgroundColorListItems.getByRole("radio", { name: /black/i })).toBeChecked();
    });

    test.describe(
      `loading the background color value from localStorage`,
      {
        tag: `@localStorage`,
      },
      () => {
        it(
          `preserves selected background color when page reloads`,
          {
            tag: `@localStorage`,
          },
          async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            await expect(puzzlePage.getPageContainerHtmlElement).toHaveCSS(
              "background-color",
              PUZZLE_BACKGROUND_COLOR_DEFAULT,
            );
            await expect(
              puzzlePage.sidebar.getBackgroundColorListItems.getByRole("radio", { name: /dark slate gray/i }),
            ).toBeChecked();
            await puzzlePage.sidebar.getBackgroundColorListItems.getByTitle("black").click();
            await expect(puzzlePage.getPageContainerHtmlElement).toHaveCSS(
              "background-color",
              PUZZLE_BACKGROUND_COLOR_BLACK,
            );
            await expect(
              puzzlePage.sidebar.getBackgroundColorListItems.getByRole("radio", { name: /black/i }),
            ).toBeChecked();

            await puzzlePage.reload();

            await expect(puzzlePage.getPageContainerHtmlElement).toHaveCSS(
              "background-color",
              PUZZLE_BACKGROUND_COLOR_BLACK,
            );
            await expect(
              puzzlePage.sidebar.getBackgroundColorListItems.getByRole("radio", { name: /black/i }),
            ).toBeChecked();
          },
        );

        it(
          `preserves selected background color when page loads by url`,
          {
            tag: `@localStorage`,
          },
          async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            await expect(puzzlePage.getPageContainerHtmlElement).toHaveCSS(
              "background-color",
              PUZZLE_BACKGROUND_COLOR_DEFAULT,
            );
            await expect(
              puzzlePage.sidebar.getBackgroundColorListItems.getByRole("radio", { name: /dark slate gray/i }),
            ).toBeChecked();
            await puzzlePage.sidebar.getBackgroundColorListItems.getByTitle("black").click();
            await expect(puzzlePage.getPageContainerHtmlElement).toHaveCSS(
              "background-color",
              PUZZLE_BACKGROUND_COLOR_BLACK,
            );
            await expect(
              puzzlePage.sidebar.getBackgroundColorListItems.getByRole("radio", { name: /black/i }),
            ).toBeChecked();

            await puzzlePage.goto();

            await expect(puzzlePage.getPageContainerHtmlElement).toHaveCSS(
              "background-color",
              PUZZLE_BACKGROUND_COLOR_BLACK,
            );
            await expect(
              puzzlePage.sidebar.getBackgroundColorListItems.getByRole("radio", { name: /black/i }),
            ).toBeChecked();
          },
        );
      },
    );

    test.describe(
      `saving selected background color into localStorage`,
      {
        tag: `@localStorage`,
      },
      () => {
        it(`causes saving the puzzle data into localStorage when selected background color changes`, async ({
          page,
        }) => {
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          const initialData = await puzzlePage.getPuzzleDataFromLocalStorage();
          await expect(puzzlePage.getPageContainerHtmlElement).toHaveCSS(
            "background-color",
            PUZZLE_BACKGROUND_COLOR_DEFAULT,
          );
          await expect(
            puzzlePage.sidebar.getBackgroundColorListItems.getByRole("radio", { name: /dark slate gray/i }),
          ).toBeChecked();
          await puzzlePage.sidebar.getBackgroundColorListItems.getByTitle("black").click();
          await expect(puzzlePage.getPageContainerHtmlElement).toHaveCSS(
            "background-color",
            PUZZLE_BACKGROUND_COLOR_BLACK,
          );
          await expect(
            puzzlePage.sidebar.getBackgroundColorListItems.getByRole("radio", { name: /black/i }),
          ).toBeChecked();

          const alteredData = await puzzlePage.getPuzzleDataFromLocalStorage();
          expect(alteredData.canvasBackgroundColor).not.toStrictEqual(initialData.canvasBackgroundColor);
          expect(alteredData.canvasBackgroundColor).toStrictEqual("black");
        });
      },
    );
  });
});

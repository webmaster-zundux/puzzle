import { expect, test as it, test } from "@playwright/test";
import { openPuzzlePageWithDemoPuzzle2x1Data } from "../../page-objects/puzzle-page";

test.describe(`floating action panel`, () => {
  test.describe(`toggle sidebar presence`, () => {
    it(`hides the sidebar when clicking on "hide side panel" button`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);

      await puzzlePage.floatingPanel.getHideSidebarButton.click();

      await expect(puzzlePage.sidebar.getSidebar).not.toBeVisible();
      await expect(puzzlePage.floatingPanel.getHideSidebarButton).not.toBeVisible();
      await expect(puzzlePage.floatingPanel.getShowSidebarButton).toBeVisible();
    });

    it(`shows the sidebar when clicking on "show side panel" button`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      await puzzlePage.floatingPanel.getHideSidebarButton.click();
      await page.waitForTimeout(250);
      await expect(puzzlePage.sidebar.getSidebar).not.toBeVisible();
      await expect(puzzlePage.floatingPanel.getShowSidebarButton).toBeVisible();

      await puzzlePage.floatingPanel.getShowSidebarButton.click();

      await page.waitForTimeout(250);
      await expect(puzzlePage.sidebar.getSidebar).toBeVisible();
      await expect(puzzlePage.floatingPanel.getHideSidebarButton).toBeVisible();
      await expect(puzzlePage.floatingPanel.getShowSidebarButton).not.toBeVisible();
    });
  });

  test.describe(
    `loading the sidebar presence state from localStorage`,
    {
      tag: `@localStorage`,
    },
    () => {
      it(
        `shows the sidebar when clicking on "show side panel" button and reloads the page`,
        {
          tag: `@localStorage`,
        },
        async ({ page }) => {
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          await puzzlePage.floatingPanel.getHideSidebarButton.click();
          await expect(puzzlePage.sidebar.getSidebar).not.toBeVisible();
          await expect(puzzlePage.floatingPanel.getHideSidebarButton).not.toBeVisible();
          await expect(puzzlePage.floatingPanel.getShowSidebarButton).toBeVisible();
          await puzzlePage.floatingPanel.getShowSidebarButton.click();
          await page.waitForTimeout(250);
          await expect(puzzlePage.sidebar.getSidebar).toBeVisible();
          await expect(puzzlePage.floatingPanel.getHideSidebarButton).toBeVisible();
          await expect(puzzlePage.floatingPanel.getShowSidebarButton).not.toBeVisible();

          await puzzlePage.reload();

          await expect(puzzlePage.sidebar.getSidebar).toBeVisible();
          await expect(puzzlePage.floatingPanel.getHideSidebarButton).toBeVisible();
          await expect(puzzlePage.floatingPanel.getShowSidebarButton).not.toBeVisible();
        },
      );

      it(
        `shows the sidebar when clicking on "show side panel" button and opens the page by it's url`,
        {
          tag: `@localStorage`,
        },
        async ({ page }) => {
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          await puzzlePage.floatingPanel.getHideSidebarButton.click();
          await expect(puzzlePage.sidebar.getSidebar).not.toBeVisible();
          await expect(puzzlePage.floatingPanel.getHideSidebarButton).not.toBeVisible();
          await expect(puzzlePage.floatingPanel.getShowSidebarButton).toBeVisible();
          await puzzlePage.floatingPanel.getShowSidebarButton.click();
          await page.waitForTimeout(250);
          await expect(puzzlePage.sidebar.getSidebar).toBeVisible();
          await expect(puzzlePage.floatingPanel.getHideSidebarButton).toBeVisible();
          await expect(puzzlePage.floatingPanel.getShowSidebarButton).not.toBeVisible();

          await puzzlePage.goto();

          await expect(puzzlePage.sidebar.getSidebar).toBeVisible();
          await expect(puzzlePage.floatingPanel.getHideSidebarButton).toBeVisible();
          await expect(puzzlePage.floatingPanel.getShowSidebarButton).not.toBeVisible();
        },
      );

      it(
        `hides the sidebar when clicking on "hide side panel" button and reloads the page `,
        {
          tag: `@localStorage`,
        },
        async ({ page }) => {
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          await puzzlePage.floatingPanel.getHideSidebarButton.click();
          await expect(puzzlePage.sidebar.getSidebar).not.toBeVisible();
          await expect(puzzlePage.floatingPanel.getHideSidebarButton).not.toBeVisible();
          await expect(puzzlePage.floatingPanel.getShowSidebarButton).toBeVisible();

          await puzzlePage.reload();

          await expect(puzzlePage.sidebar.getSidebar).not.toBeVisible();
          await expect(puzzlePage.floatingPanel.getHideSidebarButton).not.toBeVisible();
          await expect(puzzlePage.floatingPanel.getShowSidebarButton).toBeVisible();
        },
      );

      it(
        `hides the sidebar when clicking on "hide side panel" button and opens the page by it's url`,
        {
          tag: `@localStorage`,
        },
        async ({ page }) => {
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          await puzzlePage.floatingPanel.getHideSidebarButton.click();
          await expect(puzzlePage.sidebar.getSidebar).not.toBeVisible();
          await expect(puzzlePage.floatingPanel.getHideSidebarButton).not.toBeVisible();
          await expect(puzzlePage.floatingPanel.getShowSidebarButton).toBeVisible();

          await puzzlePage.goto();

          await page.waitForTimeout(250);
          await expect(puzzlePage.sidebar.getSidebar).not.toBeVisible();
          await expect(puzzlePage.floatingPanel.getHideSidebarButton).not.toBeVisible();
          await expect(puzzlePage.floatingPanel.getShowSidebarButton).toBeVisible();
        },
      );
    },
  );

  test.describe(
    `saving the sidebar presence state into localStorage`,
    {
      tag: `@localStorage`,
    },
    () => {
      it(`causes saving the puzzle data into localStorage when the sidebar presence state changes`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const initialData = await puzzlePage.getPuzzleDataFromLocalStorage();

        await puzzlePage.floatingPanel.getHideSidebarButton.click();
        await expect(puzzlePage.sidebar.getSidebar).not.toBeVisible();

        const alteredData = await puzzlePage.getPuzzleDataFromLocalStorage();
        expect(alteredData.isSidebarOpen).not.toStrictEqual(initialData.isSidebarOpen);
        expect(alteredData.isSidebarOpen).toStrictEqual(false);

        await puzzlePage.floatingPanel.getShowSidebarButton.click();
        await page.waitForTimeout(250);
        await expect(puzzlePage.sidebar.getSidebar).toBeVisible();

        const alteredTwiceData = await puzzlePage.getPuzzleDataFromLocalStorage();
        expect(alteredTwiceData.isSidebarOpen).not.toStrictEqual(alteredData.isSidebarOpen);
        expect(alteredTwiceData.isSidebarOpen).toStrictEqual(true);
      });
    },
  );
});

import { test as it, test } from "@playwright/test";
import { openPuzzlePageWithDemoPuzzle2x1Data } from "../../page-objects/puzzle-page";

test.describe(`modal "choose method to create a puzzle"`, () => {
  test.describe(`changes it's visibility state`, () => {
    it(`displays when clicking on "change image" button in the sidebar`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);

      await puzzlePage.sidebar.getChangeImageButton.click();

      await puzzlePage.dialogChooseMethodToCreatePuzzle.isVisible();
    });

    it(`displays when clicking on "use another image" button in "puzzle creation" dialog`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();

      await puzzlePage.dialogPuzzleCreation.getUseAnotherImageButton.click();

      await puzzlePage.dialogChooseMethodToCreatePuzzle.isVisible();
    });

    it(`hides when clicking on "close" button`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      await puzzlePage.openChooseMethodToCreatePuzzleDialogByChangeImageButtonInSidebar();

      await puzzlePage.dialogChooseMethodToCreatePuzzle.getCloseButton.click();

      await puzzlePage.dialogChooseMethodToCreatePuzzle.isNotVisible();
    });

    it(`hides when clicking on modal backdrop`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      await puzzlePage.openChooseMethodToCreatePuzzleDialogByChangeImageButtonInSidebar();

      await puzzlePage.dialogChooseMethodToCreatePuzzle.getBackdrop.click({ position: { x: 0, y: 0 } });

      await puzzlePage.dialogChooseMethodToCreatePuzzle.isNotVisible();
    });

    it(`hides when pressing on "esc" key`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      await puzzlePage.openChooseMethodToCreatePuzzleDialogByChangeImageButtonInSidebar();

      await page.keyboard.press("Escape");

      await puzzlePage.dialogChooseMethodToCreatePuzzle.isNotVisible();
    });

    it(`switches to "upload an image from device" dialog when clicking on "upload an image from device" button`, async ({
      page,
    }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      await puzzlePage.openChooseMethodToCreatePuzzleDialogByChangeImageButtonInSidebar();

      await puzzlePage.dialogChooseMethodToCreatePuzzle.getLoadImageFromDeviceButton.click();

      await puzzlePage.dialogChooseMethodToCreatePuzzle.isNotVisible();
      await puzzlePage.dialogLoadImageFromDevice.isVisible();
    });

    it(`switches to "load an image from a link" dialog when clicking on "load an image from a link" button`, async ({
      page,
    }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      await puzzlePage.openChooseMethodToCreatePuzzleDialogByChangeImageButtonInSidebar();

      await puzzlePage.dialogChooseMethodToCreatePuzzle.getLoadImageFromLinkButton.click();

      await puzzlePage.dialogChooseMethodToCreatePuzzle.isNotVisible();
      await puzzlePage.dialogLoadImageFromLink.isVisible();
    });

    it(`switches to "choose a demo image to create a puzzle" dialog when clicking on "demo images" link`, async ({
      page,
    }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      await puzzlePage.openChooseMethodToCreatePuzzleDialogByChangeImageButtonInSidebar();

      await puzzlePage.dialogChooseMethodToCreatePuzzle.getDemoImagesLink.click();

      await puzzlePage.dialogChooseMethodToCreatePuzzle.isNotVisible();
      await puzzlePage.dialogChooseDemoImage.isVisible();
    });

    test.describe(`on an image upload`, () => {
      it(`switches to "puzzle creation" dialog when drag and drop an image file into browser window`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        await puzzlePage.openChooseMethodToCreatePuzzleDialogByChangeImageButtonInSidebar();

        await puzzlePage.dragAndDropFileImage250x250Png();

        await puzzlePage.dialogChooseMethodToCreatePuzzle.isNotVisible();
        await puzzlePage.dialogPuzzleCreation.isVisible();
      });

      it(
        `switches to "puzzle creation" dialog when paste an image file from clipboard (hotkey: ctrl + v) into browser window`,
        {
          tag: ["@https-url-required", "@secure-context"],
        },
        async ({ page, browserName, headless }) => {
          test.fixme(browserName === "firefox" && headless === true, `need fix for firefox in headless mode`);
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          await puzzlePage.openChooseMethodToCreatePuzzleDialogByChangeImageButtonInSidebar();

          await puzzlePage.pasteFromClipBoardAFileImage250x250Png();

          await puzzlePage.dialogChooseMethodToCreatePuzzle.isNotVisible();
          await puzzlePage.dialogPuzzleCreation.isVisible();
        },
      );
    });
  });

  test.describe(`error messages`, () => {
    it.fixme(`displays error message "incorrect file type. please load an image file"`, async () => {});
    it.fixme(`displays error message "file loading failure (rejected or network problem)"`, async () => {});
    it.fixme(`displays error message "file size too big"`, async () => {});
    it.fixme(`displays error message "file size too small"`, async () => {});
    it.fixme(`displays error message "image dimensions (width, height) too small"`, async () => {});
    it.fixme(`displays error message "image dimensions (width, height) too big"`, async () => {});
  });
});

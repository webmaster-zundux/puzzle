import { expect, test as it, test } from "@playwright/test";
import { openPuzzlePageWithDemoPuzzle2x1Data } from "../../page-objects/puzzle-page";

test.describe(`modal "choose a demo image"`, () => {
  test.describe(`changes it's visibility state`, () => {
    it(`displays when clicking on "demo images" button in "choose method to create puzzle" dialog`, async ({
      page,
    }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      await puzzlePage.openChooseMethodToCreatePuzzleDialogByChangeImageButtonInSidebar();

      await puzzlePage.dialogChooseMethodToCreatePuzzle.getDemoImagesLink.click();

      await puzzlePage.dialogChooseMethodToCreatePuzzle.isNotVisible();
      await puzzlePage.dialogChooseDemoImage.isVisible();
      await expect(page).toHaveScreenshot({ timeout: 2_000 });
    });

    it(`hides when clicking on "close" button`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog =
        await puzzlePage.openChooseDemoImageDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

      await dialog.getCloseButton.click();

      await dialog.isNotVisible();
    });

    it(`hides when clicking on the modal backdrop`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog =
        await puzzlePage.openChooseDemoImageDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

      await dialog.getBackdrop.click({ position: { x: 0, y: 0 } });

      await dialog.isNotVisible();
    });

    it(`hides when pressing on "esc" key`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog =
        await puzzlePage.openChooseDemoImageDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

      await page.keyboard.press("Escape");

      await dialog.isNotVisible();
    });

    it(`switches to "upload an image from device" dialog when clicking on "upload an image from device" button`, async ({
      page,
    }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog =
        await puzzlePage.openChooseDemoImageDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

      await dialog.getLoadImageFromDeviceButton.click();

      await dialog.isNotVisible();
      await puzzlePage.dialogLoadImageFromDevice.isVisible();
    });

    it(`switches to "load an image from a link" dialog when clicking on "load an image from a link" button`, async ({
      page,
    }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog =
        await puzzlePage.openChooseDemoImageDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

      await dialog.getLoadImageFromLinkButton.click();

      await dialog.isNotVisible();
      await puzzlePage.dialogLoadImageFromLink.isVisible();
    });

    it(`switches to "choose method to create a puzzle" dialog when clicking on "choose another image" button`, async ({
      page,
    }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog =
        await puzzlePage.openChooseDemoImageDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

      await dialog.getChooseAnotherImageButton.click();

      await dialog.isNotVisible();
      await puzzlePage.dialogChooseMethodToCreatePuzzle.isVisible();
    });

    test.describe(`selecting a demo image`, () => {
      it(`switches to "puzzle creation" dialog when clicking on the first demo image button and then clicking "use selected image" button`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const dialog =
          await puzzlePage.openChooseDemoImageDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

        await expect(dialog.getUseSelectedImageButton).toBeDisabled();
        await dialog.getDemoImageListItems.nth(0).getByRole("button").click();
        await expect(dialog.getUseSelectedImageButton).toBeEnabled();
        await dialog.getUseSelectedImageButton.click();

        await dialog.isNotVisible();
        await puzzlePage.dialogPuzzleCreation.isVisible();
      });

      it(`switches to "puzzle creation" dialog when clicking on the second demo image button and then clicking "use selected image" button`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const dialog =
          await puzzlePage.openChooseDemoImageDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

        await expect(dialog.getUseSelectedImageButton).toBeDisabled();
        await dialog.getDemoImageListItems.nth(1).getByRole("button").click();
        await expect(dialog.getUseSelectedImageButton).toBeEnabled();
        await dialog.getUseSelectedImageButton.click();

        await dialog.isNotVisible();
        await puzzlePage.dialogPuzzleCreation.isVisible();
      });
    });

    test.describe(`on an image upload`, () => {
      it(`switches to "puzzle creation" dialog when drag and drop an image file into browser window`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const dialog =
          await puzzlePage.openChooseDemoImageDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

        await puzzlePage.dragAndDropFileImage250x250Png();

        await dialog.isNotVisible();
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
          const dialog =
            await puzzlePage.openChooseDemoImageDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

          await puzzlePage.pasteFromClipBoardAFileImage250x250Png();

          await dialog.isNotVisible();
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

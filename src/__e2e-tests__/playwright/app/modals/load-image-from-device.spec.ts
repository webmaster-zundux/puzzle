import { test as it, test, expect } from "@playwright/test";
import { GET_IMAGE_250x250_PNG_FILE_PATH, openPuzzlePageWithDemoPuzzle2x1Data } from "../../page-objects/puzzle-page";

test.describe(`modal "upload an image from device"`, () => {
  test.describe(`changes it's visibility state`, () => {
    it(`displays when clicking on "upload an image from device" button in "choose method to create puzzle" dialog`, async ({
      page,
    }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      await puzzlePage.openChooseMethodToCreatePuzzleDialogByChangeImageButtonInSidebar();

      await puzzlePage.dialogChooseMethodToCreatePuzzle.getLoadImageFromDeviceButton.click();

      await puzzlePage.dialogChooseMethodToCreatePuzzle.isNotVisible();
      await puzzlePage.dialogLoadImageFromDevice.isVisible();
      await expect(page).toHaveScreenshot({ timeout: 2_000 });
    });

    it(`hides when clicking on "close" button`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog =
        await puzzlePage.openLoadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

      await dialog.getCloseButton.click();

      await dialog.isNotVisible();
    });

    it(`hides when clicking on the modal backdrop`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog =
        await puzzlePage.openLoadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

      await dialog.getBackdrop.click({ position: { x: 0, y: 0 } });

      await dialog.isNotVisible();
    });

    it(`hides when pressing on "esc" key`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog =
        await puzzlePage.openLoadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

      await page.keyboard.press("Escape");

      await dialog.isNotVisible();
    });

    it(`switches to "load an image from a link" dialog when clicking on "load an image from a link" button`, async ({
      page,
    }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog =
        await puzzlePage.openLoadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

      await dialog.getLoadImageFromLinkButton.click();

      await dialog.isNotVisible();
      await puzzlePage.dialogLoadImageFromLink.isVisible();
    });

    it(`switches to "choose a demo image to create a puzzle" dialog when clicking on "demo images" link`, async ({
      page,
    }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog =
        await puzzlePage.openLoadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

      await dialog.getDemoImagesLink.click();

      await dialog.isNotVisible();
      await puzzlePage.dialogChooseDemoImage.isVisible();
    });

    test.describe(`selecting an image from device`, () => {
      it(`switches to "puzzle creation" dialog when clicking on "choose file" button and selecting an image file in the device folder native dialog`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const dialog =
          await puzzlePage.openLoadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

        const fileChooserPromise = page.waitForEvent("filechooser");
        await dialog.getFileInput.click();
        const fileChooser = await fileChooserPromise;
        const filePath = GET_IMAGE_250x250_PNG_FILE_PATH();
        await fileChooser.setFiles(filePath);

        await dialog.isNotVisible();
        await puzzlePage.dialogPuzzleCreation.isVisible();
      });

      it(`switches to "puzzle creation" dialog when clicking on "click to select an image" button and selecting an image file in the device folder native dialog`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const dialog =
          await puzzlePage.openLoadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

        const fileChooserPromise = page.waitForEvent("filechooser");
        await dialog.getSelectFileFromDeviceButton.click();
        const fileChooser = await fileChooserPromise;
        const filePath = GET_IMAGE_250x250_PNG_FILE_PATH();
        await fileChooser.setFiles(filePath);

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
          await puzzlePage.openLoadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

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
            await puzzlePage.openLoadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

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

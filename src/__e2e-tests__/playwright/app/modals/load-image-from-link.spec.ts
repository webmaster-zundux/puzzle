import { expect, test as it, test } from "@playwright/test";
import { openPuzzlePageWithDemoPuzzle2x1Data, RELATIVE_URL_DEMO_IMAGE_250x250 } from "../../page-objects/puzzle-page";

test.describe(`modal "load an image from a link"`, () => {
  test.describe(`changes it's visibility state`, () => {
    it(`displays when clicking on "load an image from a link" button in "choose method to create puzzle" dialog`, async ({
      page,
    }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      await puzzlePage.openChooseMethodToCreatePuzzleDialogByChangeImageButtonInSidebar();

      await puzzlePage.dialogChooseMethodToCreatePuzzle.getLoadImageFromLinkButton.click();

      await puzzlePage.dialogChooseMethodToCreatePuzzle.isNotVisible();
      await puzzlePage.dialogLoadImageFromLink.isVisible();
      await expect(page).toHaveScreenshot({ timeout: 2_000 });
    });

    it(`hides when clicking on "close" button`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog =
        await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

      await dialog.getCloseButton.click();

      await dialog.isNotVisible();
    });

    it(`hides when clicking on the modal backdrop`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog =
        await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

      await dialog.getBackdrop.click({ position: { x: 0, y: 0 } });

      await dialog.isNotVisible();
    });

    it(`hides when pressing on "esc" key`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog =
        await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

      await page.keyboard.press("Escape");

      await dialog.isNotVisible();
    });

    it(`switches to "upload an image from device" dialog when clicking on "upload an image from device" button`, async ({
      page,
    }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog =
        await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

      await dialog.getLoadImageFromDeviceButton.click();

      await dialog.isNotVisible();
      await puzzlePage.dialogLoadImageFromDevice.isVisible();
    });

    it(`switches to "choose a demo image to create a puzzle" dialog when clicking on "demo images" link`, async ({
      page,
    }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog =
        await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

      await dialog.getDemoImagesLink.click();

      await dialog.isNotVisible();
      await puzzlePage.dialogChooseDemoImage.isVisible();
    });

    test.describe(`inserting an image link`, () => {
      it(`switches to "puzzle creation" dialog when inserting a link into the related text field and pressing "load image" button`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const dialog =
          await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

        await dialog.getImageLinkInput.fill(RELATIVE_URL_DEMO_IMAGE_250x250);
        await dialog.getLoadImageButton.click();

        await dialog.isNotVisible();
        await puzzlePage.dialogPuzzleCreation.isVisible();
      });

      it(`switches to "puzzle creation" dialog when typing a link in the related text field and pressing "load image" button`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const dialog =
          await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

        await dialog.getImageLinkInput.pressSequentially(RELATIVE_URL_DEMO_IMAGE_250x250);
        await dialog.getLoadImageButton.click();

        await dialog.isNotVisible();
        await puzzlePage.dialogPuzzleCreation.isVisible();
      });

      it(`switches to "puzzle creation" dialog when typing a link in the related text field and pressing "load image" button when current puzzle image was loaded from the same link`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const fileLink = RELATIVE_URL_DEMO_IMAGE_250x250;
        await puzzlePage.createPuzzleFromImageLoadedFromLink(fileLink);
        const dialog =
          await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

        await dialog.getImageLinkInput.pressSequentially(fileLink);
        await dialog.getLoadImageButton.click();

        await dialog.isNotVisible();
        await puzzlePage.dialogPuzzleCreation.isVisible();
      });

      it(`switches to "puzzle creation" dialog when typing a link in the related text field and pressing "load image" button when the image was loaded from the same link and was displayed in "puzzle creation" dialog`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const fileLink = RELATIVE_URL_DEMO_IMAGE_250x250;
        await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

        await puzzlePage.dialogLoadImageFromLink.getImageLinkInput.pressSequentially(fileLink);
        await puzzlePage.dialogLoadImageFromLink.getLoadImageButton.click();
        await puzzlePage.dialogLoadImageFromLink.isNotVisible();
        await puzzlePage.dialogPuzzleCreation.isVisible();

        await puzzlePage.dialogPuzzleCreation.getUseAnotherImageButton.click();
        await puzzlePage.dialogChooseMethodToCreatePuzzle.isVisible();
        await puzzlePage.dialogChooseMethodToCreatePuzzle.getLoadImageFromLinkButton.click();

        await puzzlePage.dialogLoadImageFromLink.getImageLinkInput.pressSequentially(fileLink);
        await puzzlePage.dialogLoadImageFromLink.getLoadImageButton.click();
        await puzzlePage.dialogLoadImageFromLink.isNotVisible();
        await puzzlePage.dialogPuzzleCreation.isVisible();
      });
    });

    test.describe(`on an image upload`, () => {
      it(`switches to "puzzle creation" dialog when drag and drop an image file into browser window`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const dialog =
          await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

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
            await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

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

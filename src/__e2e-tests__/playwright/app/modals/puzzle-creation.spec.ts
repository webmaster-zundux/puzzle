import { expect, test as it, test } from "@playwright/test";
import {
  DEMO_IMAGE_250x250_AS_BASE64_URL,
  DEMO_IMAGE_250x250_AS_BASE64_URL_OF_RELATIVE_URL_DEMO_IMAGE_250x250,
  mockPuzzleSeedGeneration,
  openPuzzlePageWithDemoPuzzle2x1Data,
} from "../../page-objects/puzzle-page";

test.describe(`modal "puzzle creation"`, () => {
  test.describe(`creates new puzzle and changes it's visibility state`, () => {
    test.describe(
      `hides and creates a new puzzle challenge when clicking on "create puzzle" button`,
      {
        tag: `@mock-puzzle-seed`,
        annotation: [
          {
            type: `mock`,
            description: `uses mocked puzzle seed generation to prevent randomized piece's positions generation`,
          },
          { type: `requirements`, description: `VITE_TESTING_CHALLENGE_ID_GENERATION_EXPOSE_TO_WINDOW_OBJECT === '1'` },
        ],
      },
      () => {
        test.beforeEach(async ({ page }) => {
          await mockPuzzleSeedGeneration(page);
        });

        it(`with the same image and the same puzzle params`, async ({ page }, { title }) => {
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
          const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();

          await dialog.getCreatePuzzleButton.click();

          await dialog.isNotVisible();
          const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
          expect(anotherPuzzleSeed).not.toBe(initialPuzzleSeed);
          await expect(puzzlePage.sidebar.getPuzzlePreviewImage).toHaveScreenshot(`image preview ${title}.png`, {
            timeout: 2_000,
          });
          await expect(puzzlePage.getPuzzleView).toHaveScreenshot(`view ${title}.png`, { timeout: 2_000 });
        });

        it(`with demo-image-250x250.png and the same puzzle params`, async ({ page }, { title }) => {
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
          const dialogLoadImageFromLink =
            await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

          await dialogLoadImageFromLink.getImageLinkInput.fill("/demo-images/demo-image-250x250.png");
          await dialogLoadImageFromLink.getLoadImageButton.click();
          await dialogLoadImageFromLink.isNotVisible();
          const dialogPuzzleCreation = puzzlePage.dialogPuzzleCreation;
          await dialogPuzzleCreation.isVisible();
          await dialogPuzzleCreation.getCreatePuzzleButton.click();

          await dialogPuzzleCreation.isNotVisible();
          const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
          expect(anotherPuzzleSeed).not.toBe(initialPuzzleSeed);
          await expect(puzzlePage.sidebar.getPuzzlePreviewImage).toHaveScreenshot(`image preview ${title}.png`, {
            timeout: 2_000,
          });
          await expect(puzzlePage.getPuzzleView).toHaveScreenshot(`view ${title}.png`, { timeout: 2_000 });
        });

        it(`with demo-image-1080x1920.png and the same puzzle params`, async ({ page }, { title }) => {
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
          const dialogLoadImageFromLink =
            await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

          await dialogLoadImageFromLink.getImageLinkInput.fill("/demo-images/demo-image-1080x1920.png");
          await dialogLoadImageFromLink.getLoadImageButton.click();
          await dialogLoadImageFromLink.isNotVisible();
          const dialogPuzzleCreation = puzzlePage.dialogPuzzleCreation;
          await dialogPuzzleCreation.isVisible();
          await dialogPuzzleCreation.getCreatePuzzleButton.click();

          await dialogPuzzleCreation.isNotVisible();
          const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
          expect(anotherPuzzleSeed).not.toBe(initialPuzzleSeed);
          await expect(puzzlePage.sidebar.getPuzzlePreviewImage).toHaveScreenshot(`image preview ${title}.png`, {
            timeout: 2_000,
          });
          await expect(puzzlePage.getPuzzleView).toHaveScreenshot(`view ${title}.png`, { timeout: 2_000 });
        });

        it(`with demo-image-250x250.png and changed piece shape`, async ({ page }, { title }) => {
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
          const dialogLoadImageFromLink =
            await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

          await dialogLoadImageFromLink.getImageLinkInput.fill("/demo-images/demo-image-250x250.png");
          await dialogLoadImageFromLink.getLoadImageButton.click();
          await dialogLoadImageFromLink.isNotVisible();
          const dialogPuzzleCreation = puzzlePage.dialogPuzzleCreation;
          await dialogPuzzleCreation.isVisible();
          await dialogPuzzleCreation.getAvailableShapeListItems.getByRole("radio", { name: /straight line/i }).click();
          await dialogPuzzleCreation.getCreatePuzzleButton.click();

          await dialogPuzzleCreation.isNotVisible();
          const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
          expect(anotherPuzzleSeed).not.toBe(initialPuzzleSeed);
          await expect(puzzlePage.sidebar.getPuzzlePreviewImage).toHaveScreenshot(`image preview ${title}.png`, {
            timeout: 2_000,
          });
          await expect(puzzlePage.getPuzzleView).toHaveScreenshot(`view ${title}.png`, { timeout: 2_000 });
        });

        it(`with demo-image-250x250.png and changed number of pieces per width`, async ({ page }, { title }) => {
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
          const dialogLoadImageFromLink =
            await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

          await dialogLoadImageFromLink.getImageLinkInput.fill("/demo-images/demo-image-250x250.png");
          await dialogLoadImageFromLink.getLoadImageButton.click();
          await dialogLoadImageFromLink.isNotVisible();
          const dialogPuzzleCreation = puzzlePage.dialogPuzzleCreation;
          await dialogPuzzleCreation.isVisible();
          await dialogPuzzleCreation.getPiecesPerWidthInput.fill("4");
          await expect(dialogPuzzleCreation.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 16(4x4)");
          await dialogPuzzleCreation.getCreatePuzzleButton.click();

          await dialogPuzzleCreation.isNotVisible();
          const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
          expect(anotherPuzzleSeed).not.toBe(initialPuzzleSeed);
          await expect(puzzlePage.sidebar.getPuzzlePreviewImage).toHaveScreenshot(`image preview ${title}.png`, {
            timeout: 2_000,
          });
          await expect(puzzlePage.getPuzzleView).toHaveScreenshot(`view ${title}.png`, { timeout: 2_000 });
        });

        it(`with demo-image-250x250.png and changed number of pieces per height`, async ({ page }, { title }) => {
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
          const dialogLoadImageFromLink =
            await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

          await dialogLoadImageFromLink.getImageLinkInput.fill("/demo-images/demo-image-250x250.png");
          await dialogLoadImageFromLink.getLoadImageButton.click();
          await dialogLoadImageFromLink.isNotVisible();
          const dialogPuzzleCreation = puzzlePage.dialogPuzzleCreation;
          await dialogPuzzleCreation.isVisible();
          await dialogPuzzleCreation.getPiecesPerHeightInput.fill("4");
          await expect(dialogPuzzleCreation.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 16(4x4)");
          await dialogPuzzleCreation.getCreatePuzzleButton.click();

          await dialogPuzzleCreation.isNotVisible();
          const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
          expect(anotherPuzzleSeed).not.toBe(initialPuzzleSeed);
          await expect(puzzlePage.sidebar.getPuzzlePreviewImage).toHaveScreenshot(`image preview ${title}.png`, {
            timeout: 2_000,
          });
          await expect(puzzlePage.getPuzzleView).toHaveScreenshot(`view ${title}.png`, { timeout: 2_000 });
        });

        it(`with demo-image-250x250.png and changed number of pieces per width and per height`, async ({ page }, {
          title,
        }) => {
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
          const dialogLoadImageFromLink =
            await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

          await dialogLoadImageFromLink.getImageLinkInput.fill("/demo-images/demo-image-250x250.png");
          await dialogLoadImageFromLink.getLoadImageButton.click();
          await dialogLoadImageFromLink.isNotVisible();
          const dialogPuzzleCreation = puzzlePage.dialogPuzzleCreation;
          await dialogPuzzleCreation.isVisible();
          await dialogPuzzleCreation.getPiecesPerWidthInput.fill("3");
          await dialogPuzzleCreation.getPiecesPerHeightInput.fill("2");
          await expect(dialogPuzzleCreation.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 9(3x3)");
          await dialogPuzzleCreation.getCreatePuzzleButton.click();

          await dialogPuzzleCreation.isNotVisible();
          const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
          expect(anotherPuzzleSeed).not.toBe(initialPuzzleSeed);
          await expect(puzzlePage.sidebar.getPuzzlePreviewImage).toHaveScreenshot(`image preview ${title}.png`, {
            timeout: 2_000,
          });
          await expect(puzzlePage.getPuzzleView).toHaveScreenshot(`view ${title}.png`, { timeout: 2_000 });
        });

        it(`with demo-image-250x250.png and changed number of pieces per width and per height those were selected by recommended total number of pieces`, async ({
          page,
        }, { title }) => {
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
          const dialogLoadImageFromLink =
            await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

          await dialogLoadImageFromLink.getImageLinkInput.fill("/demo-images/demo-image-250x250.png");
          await dialogLoadImageFromLink.getLoadImageButton.click();
          await dialogLoadImageFromLink.isNotVisible();
          const dialogPuzzleCreation = puzzlePage.dialogPuzzleCreation;
          await dialogPuzzleCreation.isVisible();
          await dialogPuzzleCreation.getRecommendedSizeListItems.getByRole("button", { name: "12 pieces" }).click();
          await expect(dialogPuzzleCreation.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 16(4x4)");
          await dialogPuzzleCreation.getCreatePuzzleButton.click();

          await dialogPuzzleCreation.isNotVisible();
          const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
          expect(anotherPuzzleSeed).not.toBe(initialPuzzleSeed);
          await expect(puzzlePage.sidebar.getPuzzlePreviewImage).toHaveScreenshot(`image preview ${title}.png`, {
            timeout: 2_000,
          });
          await expect(puzzlePage.getPuzzleView).toHaveScreenshot(`view ${title}.png`, { timeout: 2_000 });
        });

        it(`with demo-image-250x250.png and changed selected area of image`, async ({ page }, { title }) => {
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
          const dialogLoadImageFromLink =
            await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

          await dialogLoadImageFromLink.getImageLinkInput.fill("/demo-images/demo-image-250x250.png");
          await dialogLoadImageFromLink.getLoadImageButton.click();
          await dialogLoadImageFromLink.isNotVisible();
          const dialogPuzzleCreation = puzzlePage.dialogPuzzleCreation;
          await dialogPuzzleCreation.isVisible();
          await dialogPuzzleCreation.getRecommendedSizeListItems.getByRole("button", { name: "12 pieces" }).click();
          await expect(dialogPuzzleCreation.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 16(4x4)");
          const area = dialogPuzzleCreation.selectedArea;
          await area.moveControlPointByDelta(area.getTopSideControlPoint, {
            x: 0,
            y: +150,
          });
          await expect(dialogPuzzleCreation.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 10(5x2)");
          await dialogPuzzleCreation.getCreatePuzzleButton.click();

          await dialogPuzzleCreation.isNotVisible();
          const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
          expect(anotherPuzzleSeed).not.toBe(initialPuzzleSeed);
          await expect(puzzlePage.sidebar.getPuzzlePreviewImage).toHaveScreenshot(`image preview ${title}.png`, {
            timeout: 2_000,
          });
          await expect(puzzlePage.getPuzzleView).toHaveScreenshot(`view ${title}.png`, { timeout: 2_000 });
        });

        it(`with demo-image-250x250.png and changed selected area of image, changed piece shape, changed number of pieces per width and per height`, async ({
          page,
        }, { title }) => {
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();
          const dialogLoadImageFromLink =
            await puzzlePage.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

          await dialogLoadImageFromLink.getImageLinkInput.fill("/demo-images/demo-image-250x250.png");
          await dialogLoadImageFromLink.getLoadImageButton.click();
          await dialogLoadImageFromLink.isNotVisible();
          const dialogPuzzleCreation = puzzlePage.dialogPuzzleCreation;
          await dialogPuzzleCreation.isVisible();
          await dialogPuzzleCreation.getRecommendedSizeListItems.getByRole("button", { name: "12 pieces" }).click();
          await expect(dialogPuzzleCreation.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 16(4x4)");
          const area = dialogPuzzleCreation.selectedArea;
          await area.moveControlPointByDelta(area.getTopSideControlPoint, {
            x: 0,
            y: +50,
          });
          await dialogPuzzleCreation.getAvailableShapeListItems.getByRole("radio", { name: /straight line/i }).click();
          await expect(dialogPuzzleCreation.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 9(3x3)");
          await dialogPuzzleCreation.getCreatePuzzleButton.click();

          await dialogPuzzleCreation.isNotVisible();
          const anotherPuzzleSeed = await puzzlePage.getPuzzleSeed();
          expect(anotherPuzzleSeed).not.toBe(initialPuzzleSeed);
          await expect(puzzlePage.sidebar.getPuzzlePreviewImage).toHaveScreenshot(`image preview ${title}.png`, {
            timeout: 2_000,
          });
          await expect(puzzlePage.getPuzzleView).toHaveScreenshot(`view ${title}.png`, { timeout: 2_000 });
        });
      },
    );
  });

  test.describe(`changes it's visibility state`, () => {
    it(`displays when clicking on "change number of pieces" button in the sidebar`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);

      await puzzlePage.sidebar.getChangeNumberOfPiecesButton.click();

      await puzzlePage.dialogPuzzleCreation.isVisible();
      await expect(page).toHaveScreenshot({ timeout: 2_000 });
    });

    it(`displays when clicking on "change piece shape" button in the sidebar`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);

      await puzzlePage.sidebar.getChangePieceShapeButton.click();

      await puzzlePage.dialogPuzzleCreation.isVisible();
      await expect(page).toHaveScreenshot({ timeout: 2_000 });
    });

    it(`hides when clicking on "close" button`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();

      await dialog.getCloseButton.click();

      await dialog.isNotVisible();
    });

    it(`hides when clicking on the modal backdrop`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();

      await dialog.getBackdrop.click({ position: { x: 0, y: 0 } });

      await dialog.isNotVisible();
    });

    it(`hides when pressing on "esc" key`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();

      await page.keyboard.press("Escape");

      await dialog.isNotVisible();
    });

    it(`switches to "choose method to create a puzzle" dialog when clicking on "use another image" button`, async ({
      page,
    }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();

      await dialog.getUseAnotherImageButton.click();

      await dialog.isNotVisible();
      await puzzlePage.dialogChooseMethodToCreatePuzzle.isVisible();
      await expect(page).toHaveScreenshot({ timeout: 2_000 });
    });
  });

  test.describe(`changes form values`, () => {
    it(`changes piece shape when clicking on "straight line" shape button`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();

      const straightLineOption = dialog.getAvailableShapeListItems.getByRole("radio", { name: /straight line/i });
      await straightLineOption.click();

      await expect(straightLineOption).toBeChecked();
      await expect(page).toHaveScreenshot({ timeout: 2_000 });
    });

    test.describe(`form fields "minimal number of pieces per side"`, () => {
      it(`changes total number of pieces when inputs "10" in "minimal number of pieces per side" (width) field`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();

        await dialog.getPiecesPerWidthInput.fill("10");

        await expect(dialog.getPiecesPerWidthInput).toHaveValue("10");
        await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 50(10x5)");
        await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(/side size of single piece: 191px \(min 50px\)/i);
      });

      it(`changes total number of pieces when inputs "10" in "minimal number of pieces per side" (height) field`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();

        await dialog.getPiecesPerHeightInput.fill("10");

        await expect(dialog.getPiecesPerHeightInput).toHaveValue("10");
        await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 200(20x10)");
        await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(/side size of single piece: 95px \(min 50px\)/i);
      });

      it(`does not change total number of pieces when inputs too big number into "minimal number of pieces per side" (width) field that leads into piece's side size being less than 50px`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
        await dialog.getPiecesPerWidthInput.fill("100");
        await expect(dialog.getPiecesPerWidthInput).toHaveValue("100");
        await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 722(38x19)");
        await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(/side size of single piece: 50px \(min 50px\)/i);

        await dialog.getPiecesPerWidthInput.fill("200");

        await expect(dialog.getPiecesPerWidthInput).toHaveValue("200");
        await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 722(38x19)");
        await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(/side size of single piece: 50px \(min 50px\)/i);
      });

      it(`does not change total number of pieces when inputing too big number into "minimal number of pieces per side" (height) field that leads into piece's side size being less than 50px`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();

        await dialog.getPiecesPerHeightInput.fill("100");

        await expect(dialog.getPiecesPerHeightInput).toHaveValue("100");
        await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 722(38x19)");
        await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(/side size of single piece: 50px \(min 50px\)/i);

        await dialog.getPiecesPerHeightInput.fill("200");

        await expect(dialog.getPiecesPerHeightInput).toHaveValue("200");
        await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 722(38x19)");
        await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(/side size of single piece: 50px \(min 50px\)/i);
      });
    });

    test.describe(`form field "recommended number of pieces"`, () => {
      it(`changes total number of pieces when clicking "6" pieces in the list "recommended number of pieces"`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();

        const recommendedSize6Pieces = dialog.getRecommendedSizeListItems.getByRole("button", { name: "6 pieces" });
        await recommendedSize6Pieces.click();

        await expect(recommendedSize6Pieces).toBeFocused();
        await expect(dialog.getPiecesPerWidthInput).toHaveValue("3");
        await expect(dialog.getPiecesPerHeightInput).toHaveValue("2");
        await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 8(4x2)");
        await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(/side size of single piece: 477px \(min 50px\)/i);
      });

      it(`does not change total number of pieces when clicking on a set with too big number in the list "recommended number of pieces" that leads into piece's side size being less than 50px`, async ({
        page,
      }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();

        let recommendedSize6Pieces = dialog.getRecommendedSizeListItems.getByRole("button", { name: "500 pieces" });
        await recommendedSize6Pieces.click();

        await expect(recommendedSize6Pieces).toBeFocused();
        await expect(dialog.getPiecesPerWidthInput).toHaveValue("25");
        await expect(dialog.getPiecesPerHeightInput).toHaveValue("20");
        await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 722(38x19)");
        await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(/side size of single piece: 50px \(min 50px\)/i);

        recommendedSize6Pieces = dialog.getRecommendedSizeListItems.getByRole("button", { name: "1000 pieces" });
        await recommendedSize6Pieces.click();

        await expect(recommendedSize6Pieces).toBeFocused();
        await expect(dialog.getPiecesPerWidthInput).toHaveValue("25");
        await expect(dialog.getPiecesPerHeightInput).toHaveValue("40");
        await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 722(38x19)");
        await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(/side size of single piece: 50px \(min 50px\)/i);
      });
    });
  });

  test.describe(`selected area of image`, () => {
    test.describe(`control points`, () => {
      it(`does not select text around when moving control point`, async ({ page }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
        const area = dialog.selectedArea;
        const point = area.getTopLeftCornerControlPoint;

        const pointPosition = await point.boundingBox();
        expect(pointPosition).not.toBe(null);
        await area.moveControlPoint(point, {
          x: pointPosition!.x,
          y: pointPosition!.y - 150,
        });

        const selectionText = await page.evaluate(() => document.getSelection()?.toString());
        expect(selectionText).toBe("");
        await expect(page).toHaveScreenshot({ timeout: 2_000 });
      });

      test.describe(`corners`, () => {
        test.describe(`top-left point`, () => {
          it(`descreases size of the selected area when moves top-left corner control point`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getTopLeftCornerControlPoint, {
              x: 0,
              y: +150,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(171, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(285, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 3(3x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 523px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`increases size of the selected area when moves top-left corner control point`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getTopLeftCornerControlPoint, {
              x: 0,
              y: -150,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(349, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(107, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 1074px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });
        });

        test.describe(`top-right point`, () => {
          it(`descreases size of the selected area when moves top-right corner control point`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getTopRightCornerControlPoint, {
              x: 0,
              y: +150,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(171, 0),
              width: expect.closeTo(614, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(285, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 3(3x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 523px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`increases size of the selected area when moves top-right corner control point`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getTopRightCornerControlPoint, {
              x: 0,
              y: -150,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(349, 0),
              width: expect.closeTo(614, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(107, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 1074px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });
        });

        test.describe(`bottom-right point`, () => {
          it(`descreases size of the selected area when moves bottom-right corner control point`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getBottomRightCornerControlPoint, {
              x: 0,
              y: -150,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(150, 0),
              width: expect.closeTo(614, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 4(4x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 462px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`increases size of the selected area when moves bottom-right corner control point`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await area.moveControlPointByDelta(area.getBottomRightCornerControlPoint, {
              x: 0,
              y: -150,
            });
            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(150, 0),
              width: expect.closeTo(614, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 4(4x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 462px \(min 50px\)/i,
            );

            await area.moveControlPointByDelta(area.getBottomRightCornerControlPoint, {
              x: 0,
              y: +50,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(190, 0),
              width: expect.closeTo(604, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 3(3x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 585px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });
        });

        test.describe(`bottom-left point`, () => {
          it(`descreases size of the selected area when moves bottom-left corner control point`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getBottomLeftCornerControlPoint, {
              x: 0,
              y: -150,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(150, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 4(4x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 462px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`increases size of the selected area when moves bottom-left corner control point`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await area.moveControlPointByDelta(area.getBottomLeftCornerControlPoint, {
              x: 0,
              y: -150,
            });
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 4(4x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 462px \(min 50px\)/i,
            );
            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(150, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });

            await area.moveControlPointByDelta(area.getBottomLeftCornerControlPoint, {
              x: 0,
              y: +50,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(190, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 3(3x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 585px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });
        });
      });

      test.describe(`side control points`, () => {
        test.describe(`top side point`, () => {
          it(`descreases size of the selected area when moves top side control point`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getTopSideControlPoint, {
              x: 0,
              y: +150,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(177, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(279, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 3(3x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 542px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`increases size of the selected area when moves top side control point`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getTopSideControlPoint, {
              x: 0,
              y: -150,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(349, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(107, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 1074px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });
        });

        test.describe(`right side point`, () => {
          it(`descreases size of the selected area when moves right side control point`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getRightSideControlPoint, {
              x: -150,
              y: 0,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(310, 0),
              width: expect.closeTo(457, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 954px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`increases size of the selected area when moves right side control point`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await area.moveControlPointByDelta(area.getRightSideControlPoint, {
              x: -250,
              y: 0,
            });
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 954px \(min 50px\)/i,
            );
            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(310, 0),
              width: expect.closeTo(357, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });

            await area.moveControlPointByDelta(area.getRightSideControlPoint, {
              x: +300,
              y: 0,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(310, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 2(2x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 954px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });
        });

        test.describe(`bottom side point`, () => {
          it(`descreases size of the selected area when moves bottom side control point`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getBottomSideControlPoint, {
              x: 0,
              y: -150,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(143, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 4(4x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 440px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`increases size of the selected area when moves bottom side control point`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await area.moveControlPointByDelta(area.getBottomSideControlPoint, {
              x: 0,
              y: -150,
            });
            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(143, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 4(4x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 440px \(min 50px\)/i,
            );

            await area.moveControlPointByDelta(area.getBottomSideControlPoint, {
              x: 0,
              y: +250,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(311, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 2(2x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 957px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });
        });

        test.describe(`left side point`, () => {
          it(`descreases size of the selected area when moves left side control point`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getLeftSideControlPoint, {
              x: +150,
              y: 0,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(310, 0),
              width: expect.closeTo(490, 0),
              x: expect.closeTo(286, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 954px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`increases size of the selected area when moves left side control point`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await area.moveControlPointByDelta(area.getLeftSideControlPoint, {
              x: +250,
              y: 0,
            });
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 954px \(min 50px\)/i,
            );
            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(310, 0),
              width: expect.closeTo(390, 0),
              x: expect.closeTo(386, 0),
              y: expect.closeTo(146, 0),
            });

            await area.moveControlPointByDelta(area.getLeftSideControlPoint, {
              x: -300,
              y: 0,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(310, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 2(2x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 954px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });
        });
      });

      test.describe(`center control point`, () => {
        it(`changes positions of selected area control points when moves center control point`, async ({ page }) => {
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
          await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
          const area = dialog.selectedArea;
          await area.moveControlPointByDelta(area.getTopLeftCornerControlPoint, {
            x: +100,
            y: +250,
          });
          await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 7(7x1)");
          await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
            /side size of single piece: 215px \(min 50px\)/i,
          );
          expect(await area.calculateBoundingClientRect()).toMatchObject({
            height: expect.closeTo(71, 0),
            width: expect.closeTo(534, 0),
            x: expect.closeTo(242, 0),
            y: expect.closeTo(385, 0),
          });

          await area.moveControlPointByDelta(area.getCenterControlPoint, {
            x: -50,
            y: -150,
          });

          expect(await area.calculateBoundingClientRect()).toMatchObject({
            height: expect.closeTo(71, 0),
            width: expect.closeTo(534, 0),
            x: expect.closeTo(179, 0),
            y: expect.closeTo(222, 0),
          });
          await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
          await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
          await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 7(7x1)");
          await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
            /side size of single piece: 215px \(min 50px\)/i,
          );
          await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
          await expect(page).toHaveScreenshot({ timeout: 2_000 });
        });
      });

      test.describe(`original image area limits`, () => {
        test.describe(`selected area does not move away from "original image area" (when central pointer moves)`, () => {
          it(`when central pointer moves to up`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await dialog.formSmallSelectedAreaFromDemoImage1920x1080ForPuzzle2x1();

            await area.moveControlPointByDelta(area.getCenterControlPoint, {
              x: 0,
              y: -500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(111, 0),
              width: expect.closeTo(224, 0),
              x: expect.closeTo(329, 0),
              y: expect.closeTo(107, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 2(2x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 342px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when central pointer moves to down`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await dialog.formSmallSelectedAreaFromDemoImage1920x1080ForPuzzle2x1();

            await area.moveControlPointByDelta(area.getCenterControlPoint, {
              x: 0,
              y: +500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(111, 0),
              width: expect.closeTo(224, 0),
              x: expect.closeTo(329, 0),
              y: expect.closeTo(346, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 2(2x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 342px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when central pointer moves to left`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await dialog.formSmallSelectedAreaFromDemoImage1920x1080ForPuzzle2x1();

            await area.moveControlPointByDelta(area.getCenterControlPoint, {
              x: -500,
              y: 0,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(111, 0),
              width: expect.closeTo(224, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(221.5, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 2(2x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 342px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when central pointer moves to right`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await dialog.formSmallSelectedAreaFromDemoImage1920x1080ForPuzzle2x1();

            await area.moveControlPointByDelta(area.getCenterControlPoint, {
              x: +500,
              y: 0,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(111, 0),
              width: expect.closeTo(224, 0),
              x: expect.closeTo(552, 0),
              y: expect.closeTo(221.5, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 2(2x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 342px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when central pointer moves to up-left`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await dialog.formSmallSelectedAreaFromDemoImage1920x1080ForPuzzle2x1();

            await area.moveControlPointByDelta(area.getCenterControlPoint, {
              x: -500,
              y: -500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(111, 0),
              width: expect.closeTo(224, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(107, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 2(2x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 342px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when central pointer moves to up-right`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await dialog.formSmallSelectedAreaFromDemoImage1920x1080ForPuzzle2x1();

            await area.moveControlPointByDelta(area.getCenterControlPoint, {
              x: +500,
              y: -500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(111, 0),
              width: expect.closeTo(224, 0),
              x: expect.closeTo(552, 0),
              y: expect.closeTo(107, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 2(2x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 342px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when central pointer moves to bottom-left`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await dialog.formSmallSelectedAreaFromDemoImage1920x1080ForPuzzle2x1();

            await area.moveControlPointByDelta(area.getCenterControlPoint, {
              x: -500,
              y: +500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(111, 0),
              width: expect.closeTo(224, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(346, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 2(2x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 342px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when central pointer moves to bottom-right`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await dialog.formSmallSelectedAreaFromDemoImage1920x1080ForPuzzle2x1();

            await area.moveControlPointByDelta(area.getCenterControlPoint, {
              x: +500,
              y: +500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(111, 0),
              width: expect.closeTo(224, 0),
              x: expect.closeTo(552, 0),
              y: expect.closeTo(346, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 2(2x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 342px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });
        });

        test.describe(`selected area does not move when selected area size equals "original image area" (and central pointer moves)`, () => {
          it(`and central pointer moves to up`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await dialog.getResetSelectedAreaButton.click();

            await area.moveControlPointByDelta(area.getCenterControlPoint, {
              x: 0,
              y: -500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(350, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(107, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 1077px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`and central pointer moves to down`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await dialog.getResetSelectedAreaButton.click();

            await area.moveControlPointByDelta(area.getCenterControlPoint, {
              x: 0,
              y: +500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(350, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(107, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 1077px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`and central pointer moves to left`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await dialog.getResetSelectedAreaButton.click();

            await area.moveControlPointByDelta(area.getCenterControlPoint, {
              x: -500,
              y: 0,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(350, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(107, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 1077px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`and central pointer moves to right`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await dialog.getResetSelectedAreaButton.click();

            await area.moveControlPointByDelta(area.getCenterControlPoint, {
              x: +500,
              y: 0,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(350, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(107, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 1077px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`and central pointer moves to up-left`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await dialog.getResetSelectedAreaButton.click();

            await area.moveControlPointByDelta(area.getCenterControlPoint, {
              x: -500,
              y: -500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(350, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(107, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 1077px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`and central pointer moves to up-right`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await dialog.getResetSelectedAreaButton.click();

            await area.moveControlPointByDelta(area.getCenterControlPoint, {
              x: +500,
              y: -500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(350, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(107, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 1077px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`and central pointer moves to bottom-left`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await dialog.getResetSelectedAreaButton.click();

            await area.moveControlPointByDelta(area.getCenterControlPoint, {
              x: -500,
              y: +500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(350, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(107, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 1077px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`and central pointer moves to bottom-right`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;
            await dialog.getResetSelectedAreaButton.click();

            await area.moveControlPointByDelta(area.getCenterControlPoint, {
              x: +500,
              y: +500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(350, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(107, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 1077px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });
        });

        test.describe(`selected area does not overflow "original image area" when resizes`, () => {
          it(`when top side control point moves to up`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getTopSideControlPoint, {
              x: 0,
              y: -500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(349, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(107, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 1074px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when bottom side control point moves to down`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getBottomSideControlPoint, {
              x: 0,
              y: +500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(311, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 2(2x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 957px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when left side control point moves to left`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getLeftSideControlPoint, {
              x: -500,
              y: 0,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(310, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 2(2x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 954px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when right side control point moves to right`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getRightSideControlPoint, {
              x: +500,
              y: 0,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(310, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 2(2x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 954px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when top-left control point moves to up-left`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getTopLeftCornerControlPoint, {
              x: -500,
              y: -500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(349, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(107, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 1074px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when top-right control point moves to up-right`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getTopRightCornerControlPoint, {
              x: +500,
              y: -500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(349, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(107, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 1074px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when bottom-left control point moves to bottom-left`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getBottomLeftCornerControlPoint, {
              x: -500,
              y: +500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(311, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 2(2x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 957px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when bottom-right control point moves to bottom-right`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getBottomRightCornerControlPoint, {
              x: +500,
              y: +500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(311, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 2(2x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 957px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });
        });

        test.describe(`selected area does not descrease it's size less than minimal size of piece (50x50px)`, () => {
          it(`when top side control point moves to down`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getTopSideControlPoint, {
              x: 0,
              y: +500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(51, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(405, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 12(12x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 157px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when bottom side control point moves to up`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getBottomSideControlPoint, {
              x: 0,
              y: -500,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(51, 0),
              width: expect.closeTo(624, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 12(12x1)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 157px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when left side control point moves to right`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getLeftSideControlPoint, {
              x: +1000,
              y: 0,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(310, 0),
              width: expect.closeTo(51.0, 0),
              x: expect.closeTo(725, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 24(2x12)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 77px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when right side control point moves to left`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getRightSideControlPoint, {
              x: -1000,
              y: 0,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(310, 0),
              width: expect.closeTo(51, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 24(2x12)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 77px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when top-left control point moves to down-right`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getTopLeftCornerControlPoint, {
              x: +1000,
              y: +1000,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(51, 0),
              width: expect.closeTo(51, 0),
              x: expect.closeTo(725, 0),
              y: expect.closeTo(405, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 4(2x2)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 77px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when top-right control point moves to down-left`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getTopRightCornerControlPoint, {
              x: -1000,
              y: +1000,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(51, 0),
              width: expect.closeTo(51, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(405, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 4(2x2)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 77px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when bottom-left control point moves to up-right`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getBottomLeftCornerControlPoint, {
              x: +1000,
              y: -1000,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(51, 0),
              width: expect.closeTo(51, 0),
              x: expect.closeTo(725, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 4(2x2)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 77px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });

          it(`when bottom-right control point moves to up-left`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
            await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
            const area = dialog.selectedArea;

            await area.moveControlPointByDelta(area.getBottomRightCornerControlPoint, {
              x: -1000,
              y: -1000,
            });

            expect(await area.calculateBoundingClientRect()).toMatchObject({
              height: expect.closeTo(51, 0),
              width: expect.closeTo(51, 0),
              x: expect.closeTo(152, 0),
              y: expect.closeTo(146, 0),
            });
            await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
            await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
            await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 4(2x2)");
            await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(
              /side size of single piece: 77px \(min 50px\)/i,
            );
            await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
            await expect(page).toHaveScreenshot({ timeout: 2_000 });
          });
        });
      });
    });

    it(`sets whole area of "the original image area" as selected area when clicking on "reset selected area" button`, async ({
      page,
    }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
      await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();

      await dialog.getResetSelectedAreaButton.click();

      await dialog.selectedArea.hasSelectedAreaTheSameAsOriginalDemoImage1920x1080();
      await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
      await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
      await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 1(1x1)");
      await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(/side size of single piece: 1077px \(min 50px\)/i);
      await expect(dialog.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
      await expect(page).toHaveScreenshot({ timeout: 2_000 });
    });
  });

  test.describe(`on an image upload`, () => {
    it(`changes image and uses the loaded image size as selected area when drag and drop an image file into browser window`, async ({
      page,
    }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
      await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
      const area = dialog.selectedArea;

      await puzzlePage.dragAndDropFileImage250x250Png();

      await area.hasSelectedAreaTheSameAsOriginalDemoImage250x250();
      await expect(area.getPreviewImage).toHaveAttribute("src", DEMO_IMAGE_250x250_AS_BASE64_URL);
      await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
      await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
      await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 4(2x2)");
      await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(/side size of single piece: 125px \(min 50px\)/i);
      await expect(dialog.getImageSizeLabel).toHaveText(/image size: 250x250px/i);
      await expect(page).toHaveScreenshot({ timeout: 2_000 });
    });

    it(
      `changes image and uses the loaded image size as selected area when paste an image file from clipboard (hotkey: ctrl + v) into browser window`,
      {
        tag: ["@https-url-required", "@secure-context"],
      },
      async ({ page, browserName, headless }) => {
        test.fixme(browserName === "firefox" && headless === true, `need fix for firefox in headless mode`);
        const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
        const dialog = await puzzlePage.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
        await dialog.hasDataOfDemoImage1920x1080ForPuzzle2x1();
        const area = dialog.selectedArea;

        await puzzlePage.pasteFromClipBoardAFileImage250x250Png();

        await area.hasSelectedAreaTheSameAsOriginalDemoImage250x250();
        await expect(area.getPreviewImage).toHaveAttribute(
          "src",
          DEMO_IMAGE_250x250_AS_BASE64_URL_OF_RELATIVE_URL_DEMO_IMAGE_250x250,
        );
        await expect(dialog.getPiecesPerWidthInput).toHaveValue("2");
        await expect(dialog.getPiecesPerHeightInput).toHaveValue("1");
        await expect(dialog.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 4(2x2)");
        await expect(dialog.getSideSizeOfSinglePieceLabel).toHaveText(/side size of single piece: 125px \(min 50px\)/i);
        await expect(dialog.getImageSizeLabel).toHaveText(/image size: 250x250px/i);
        await expect(page).toHaveScreenshot({ timeout: 2_000 });
      },
    );

    test.describe(`error messages`, () => {
      it.fixme(`displays error message "incorrect file type. please load an image file"`, async () => {});
      it.fixme(`displays error message "file loading failure (rejected or network problem)"`, async () => {});
      it.fixme(`displays error message "file size too big"`, async () => {});
      it.fixme(`displays error message "file size too small"`, async () => {});
      it.fixme(`displays error message "image dimensions (width, height) too small"`, async () => {});
      it.fixme(`displays error message "image dimensions (width, height) too big"`, async () => {});
    });
  });

  test.describe(`changes dialog size and it's parts composition`, () => {
    it.fixme(`with portrait orientation image`, () => {});
    it.fixme(`with landscape orientation image`, () => {});
    it.fixme(`with square image`, () => {});

    it.fixme(`with big portrait orientation image`, () => {});
    it.fixme(`with big landscape orientation image`, () => {});
    it.fixme(`with big square image`, () => {});
  });
});

import { expect, type Locator, type Page } from "@playwright/test";
import { type PageFragment } from "../../page-fragment";
import { SelectedAreaFragment } from "./selected-area-fragment";

export class ModalPuzzleCreationFragment implements PageFragment {
  readonly page: Page;

  readonly getDialog: Locator;
  readonly getBackdrop: Locator;
  readonly getCloseButton: Locator;

  readonly getHeading: Locator;
  readonly getResetSelectedAreaButton: Locator;
  readonly getUseAnotherImageButton: Locator;
  readonly getCreatePuzzleButton: Locator;

  readonly selectedArea: SelectedAreaFragment;

  readonly getSideSizeOfSinglePieceLabel: Locator;
  readonly getImageSizeLabel: Locator;
  readonly getQuickWayToChangeTheImageLabel: Locator;

  readonly getPieceShapeHeading: Locator;
  readonly getAvailableShapeList: Locator;
  readonly getAvailableShapeListItems: Locator;

  readonly getMinimalNumberOfPiecesHeading: Locator;
  readonly getPiecesPerWidthInput: Locator;
  readonly getPiecesPerWidthLabel: Locator;
  readonly getPiecesPerHeightInput: Locator;
  readonly getPiecesPerHeightLabel: Locator;

  readonly getRecommendedNumberOfPiecesHeading: Locator;
  readonly getRecommendedSizeList: Locator;
  readonly getRecommendedSizeListItems: Locator;

  readonly getTotalNumberOfPiecesLabel: Locator;

  constructor(page: Page) {
    this.page = page;

    this.getDialog = page.getByRole("dialog", { name: /puzzle creation/i });
    const base = this.getDialog;

    this.getBackdrop = base.getByLabel(/modal-backdrop/i);
    this.getCloseButton = base.getByRole("button", { name: /close/i });
    this.getHeading = base.getByRole("heading", { name: /puzzle creation/i });

    this.getResetSelectedAreaButton = base.getByRole("button", { name: /reset selected area/i });
    this.getUseAnotherImageButton = base.getByRole("button", { name: /use another image/i });
    this.getCreatePuzzleButton = base.getByRole("button", { name: /create puzzle/i });

    this.selectedArea = new SelectedAreaFragment(page);

    this.getSideSizeOfSinglePieceLabel = base.getByText(/side size of single piece:/i);
    this.getImageSizeLabel = base.getByText(/image size:/i);
    this.getQuickWayToChangeTheImageLabel = base.getByRole("note", { name: /quick way to change the image/i });

    this.getPieceShapeHeading = base.getByRole("heading", { name: /piece shape/i });
    this.getAvailableShapeList = base.getByRole("list", { name: "available shapes" });
    this.getAvailableShapeListItems = this.getAvailableShapeList.getByRole("listitem");

    this.getMinimalNumberOfPiecesHeading = base.getByRole("heading", { name: /minimal number of pieces per side/i });
    this.getPiecesPerWidthInput = base.getByRole("spinbutton", { name: /width/i });
    this.getPiecesPerWidthLabel = base.getByText(/width/i);
    this.getPiecesPerHeightInput = base.getByRole("spinbutton", { name: /height/i });
    this.getPiecesPerHeightLabel = base.getByText(/height/i);

    this.getRecommendedNumberOfPiecesHeading = base.getByRole("heading", { name: /recommended number of pieces/i });
    this.getRecommendedSizeList = base.getByRole("list", { name: /recommended sizes/i });
    this.getRecommendedSizeListItems = this.getRecommendedSizeList.getByRole("listitem");

    this.getTotalNumberOfPiecesLabel = base.getByRole("note", { name: /total number of pieces:/i });
  }

  async isVisible() {
    await expect(this.getDialog).toBeVisible();

    await expect(this.getBackdrop).toBeVisible();
    await expect(this.getCloseButton).toBeVisible();

    await expect(this.getHeading).toBeVisible();
    await expect(this.getResetSelectedAreaButton).toBeVisible();
    await expect(this.getUseAnotherImageButton).toBeVisible();
    await expect(this.getCreatePuzzleButton).toBeVisible();
    await expect(this.getCreatePuzzleButton).not.toBeDisabled({ timeout: 250 });

    await this.selectedArea.isVisible();

    await expect(this.getSideSizeOfSinglePieceLabel).toBeVisible();
    await expect(this.getImageSizeLabel).toBeVisible();
    await expect(this.getQuickWayToChangeTheImageLabel).toBeVisible();
    await expect(this.getQuickWayToChangeTheImageLabel).toHaveText(
      "To quick change the image: drag and drop an image here or use ctrl + v (to paste an image from clipboard)",
    );

    await expect(this.getPieceShapeHeading).toBeVisible();
    await expect(this.getAvailableShapeList).toBeVisible();
    await expect(this.getAvailableShapeListItems.getByRole("radio")).toHaveCount(9);

    await expect(this.getMinimalNumberOfPiecesHeading).toBeVisible();

    await expect(this.getPiecesPerWidthInput).toBeVisible();
    await expect(this.getPiecesPerWidthLabel).toBeVisible();

    await expect(this.getPiecesPerHeightInput).toBeVisible();
    await expect(this.getPiecesPerHeightLabel).toBeVisible();

    await expect(this.getRecommendedNumberOfPiecesHeading).toBeVisible();
    await expect(this.getRecommendedSizeList).toBeVisible();
    await expect(this.getRecommendedSizeListItems.getByRole("button")).toHaveCount(12);

    await expect(this.getTotalNumberOfPiecesLabel).toBeVisible();
  }

  async isNotVisible() {
    await expect(this.getDialog).not.toBeVisible();
  }

  async hasDataOfDemoImage1920x1080ForPuzzle7x4() {
    await expect(this.getSideSizeOfSinglePieceLabel).toHaveText(/side size of single piece: 268px \(min 50px\)/i);
    await expect(this.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
    await expect(
      this.getAvailableShapeListItems.getByRole("radio", { name: /underground river circle bottom in eroded hill/i }),
    ).toBeChecked();
    await expect(this.getPiecesPerWidthInput).toHaveValue(/7/);
    await expect(this.getPiecesPerHeightInput).toHaveValue(/4/);
    await expect(this.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 28(7x4)");
    await this.selectedArea.hasPreviewImageRelativeSrcOfDemoImage1920x1080();
    await this.selectedArea.hasSelectedAreaTheSameAsDemoPuzzle7x4ForDemoImage1920x1080();
  }

  async hasDataOfDemoImage1920x1080ForPuzzle2x1() {
    await expect(this.getSideSizeOfSinglePieceLabel).toHaveText(/side size of single piece: 954px \(min 50px\)/i);
    await expect(this.getImageSizeLabel).toHaveText(/image size: 1920x1080px/i);
    await expect(
      this.getAvailableShapeListItems.getByRole("radio", { name: /underground river circle bottom in eroded hill/i }),
    ).toBeChecked();
    await expect(this.getPiecesPerWidthInput).toHaveValue(/2/);
    await expect(this.getPiecesPerHeightInput).toHaveValue(/1/);
    await expect(this.getTotalNumberOfPiecesLabel).toHaveText("Total number of pieces: 2(2x1)");

    await this.selectedArea.hasPreviewImageRelativeSrcOfDemoImage1920x1080();
    await this.selectedArea.hasSelectedAreaTheSameAsDemoPuzzle2x1ForDemoImage1920x1080();
  }

  async formSmallSelectedAreaFromDemoImage1920x1080ForPuzzle2x1() {
    const area = this.selectedArea;
    await area.moveControlPointByDelta(area.getTopLeftCornerControlPoint, {
      x: +200,
      y: +100,
    });
    await area.moveControlPointByDelta(area.getBottomRightCornerControlPoint, {
      x: -200,
      y: -100,
    });
    expect(await area.calculateBoundingClientRect()).toMatchObject({
      height: expect.closeTo(111, 0),
      width: expect.closeTo(224, 0),
      x: expect.closeTo(342, 0),
      y: expect.closeTo(235, 0),
    });
  }
}

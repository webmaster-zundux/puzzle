import { expect, type Locator, type Page } from "@playwright/test";
import { colord } from "../../../colord";
import { dragAndDropFileByLocator } from "../utils/drag-and-drop-file";
import { getFilePath } from "../utils/get-file-path";
import { getDataFromLocalStorage } from "../utils/local-storage";
import { pasteFromClipBoardAFileByLocator } from "../utils/paste-from-clipboard";
import { hidePage, showPage } from "../utils/toggle-page-visibility";
import { FloatingPanelPageFragment } from "./page-fragments/floating-panel-page-fragment";
import { DialogChooseDemoImage } from "./page-fragments/modals/choose-demo-images";
import { DialogChooseMethodToCreatePuzzle } from "./page-fragments/modals/choose-method-to-create-puzzle-fragment";
import { ModalHelpFragment as DialogHelpFragment } from "./page-fragments/modals/help-fragment";
import { DialogLoadImageFromDevice } from "./page-fragments/modals/load-image-from-device-fragment";
import { DialogLoadImageFromLink } from "./page-fragments/modals/load-image-from-link";
import { ModalPuzzleCreationFragment as DialogPuzzleCreationFragment } from "./page-fragments/modals/puzzle-creation/puzzle-creation-fragment";
import { ModalSolvePuzzleAgainFragment as DialogSolvePuzzleAgainFragment } from "./page-fragments/modals/solve-puzzle-again-fragment";
import { NotificationCongratulationFragment } from "./page-fragments/notification-congratulation-fragment";
import { PUZZLE_SEED_LENGTH, SidebarPageFragment } from "./page-fragments/sidebar-page-fragment";
import { mouseMove } from "../utils/mouse-move";

export const PUZZLE_BACKGROUND_COLOR_DEFAULT = colord("darkslategray").toRgbString();

export const PUZZLE_BACKGROUND_COLOR_BLACK = colord("black").toRgbString();

export const PUZZLE_ZOOM_VALUE_STEP_DELTA = 0.1;

export const PUZZLE_ZOOM_VALUE_MIN = 0.5;
export const PUZZLE_ZOOM_LABEL_VALUE_MIN = `${PUZZLE_ZOOM_VALUE_MIN.toFixed(2)}x`;

export const PUZZLE_ZOOM_VALUE_ORIGINAL_SIZE = 1.0;
export const PUZZLE_ZOOM_LABEL_VALUE_ORIGINAL_SIZE = `${PUZZLE_ZOOM_VALUE_ORIGINAL_SIZE.toFixed(2)}x`;

export const PUZZLE_ZOOM_VALUE_MAX = 2.0;
export const PUZZLE_ZOOM_LABEL_VALUE_MAX = `${PUZZLE_ZOOM_VALUE_MAX.toFixed(2)}x`;

export const PUZZLE_LOCAL_STORAGE_KEY_NAME = "puzzleInformation";

export const GET_IMAGE_250x250_PNG_FILE_PATH = () => getFilePath("../.assets/250x250.png", import.meta.url);

export const DEMO_IMAGE_250x250_AS_BASE64_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6BAMAAAB6wkcOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAADUExURf///6fEG8gAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA2SURBVHja7cGBAAAAAMOg+VNf4AhVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcNUAewwAAbU7lLAAAAAASUVORK5CYII=";

export const DEMO_IMAGE_250x250_AS_BASE64_URL_OF_RELATIVE_URL_DEMO_IMAGE_250x250 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAIAAAAHjs1qAAAAAXNSR0IArs4c6QAABJxJREFUeAHt0gEBAAAIgzD7l75BmA2OuzkFMgUus9RQBYY7BKECuIeebSruDIQK4B56tqm4MxAqgHvo2abizkCoAO6hZ5uKOwOhAriHnm0q7gyECuAeerapuDMQKoB76Nmm4s5AqADuoWebijsDoQK4h55tKu4MhArgHnq2qbgzECqAe+jZpuLOQKgA7qFnm4o7A6ECuIeebSruDIQK4B56tqm4MxAqgHvo2abizkCoAO6hZ5uKOwOhAriHnm0q7gyECuAeerapuDMQKoB76Nmm4s5AqADuoWebijsDoQK4h55tKu4MhArgHnq2qbgzECqAe+jZpuLOQKgA7qFnm4o7A6ECuIeebSruDIQK4B56tqm4MxAqgHvo2abizkCoAO6hZ5uKOwOhAriHnm0q7gyECuAeerapuDMQKoB76Nmm4s5AqADuoWebijsDoQK4h55tKu4MhArgHnq2qbgzECqAe+jZpuLOQKgA7qFnm4o7A6ECuIeebSruDIQK4B56tqm4MxAqgHvo2abizkCoAO6hZ5uKOwOhAriHnm0q7gyECuAeerapuDMQKoB76Nmm4s5AqADuoWebijsDoQK4h55tKu4MhArgHnq2qbgzECqAe+jZpuLOQKgA7qFnm4o7A6ECuIeebSruDIQK4B56tqm4MxAqgHvo2abizkCoAO6hZ5uKOwOhAriHnm0q7gyECuAeerapuDMQKoB76Nmm4s5AqADuoWebijsDoQK4h55tKu4MhArgHnq2qbgzECqAe+jZpuLOQKgA7qFnm4o7A6ECuIeebSruDIQK4B56tqm4MxAqgHvo2abizkCoAO6hZ5uKOwOhAriHnm0q7gyECuAeerapuDMQKoB76Nmm4s5AqADuoWebijsDoQK4h55tKu4MhArgHnq2qbgzECqAe+jZpuLOQKgA7qFnm4o7A6ECuIeebSruDIQK4B56tqm4MxAqgHvo2abizkCoAO6hZ5uKOwOhAriHnm0q7gyECuAeerapuDMQKoB76Nmm4s5AqADuoWebijsDoQK4h55tKu4MhArgHnq2qbgzECqAe+jZpuLOQKgA7qFnm4o7A6ECuIeebSruDIQK4B56tqm4MxAqgHvo2abizkCoAO6hZ5uKOwOhAriHnm0q7gyECuAeerapuDMQKoB76Nmm4s5AqADuoWebijsDoQK4h55tKu4MhArgHnq2qbgzECqAe+jZpuLOQKgA7qFnm4o7A6ECuIeebSruDIQK4B56tqm4MxAqgHvo2abizkCoAO6hZ5uKOwOhAriHnm0q7gyECuAeerapuDMQKoB76Nmm4s5AqADuoWebijsDoQK4h55tKu4MhArgHnq2qbgzECqAe+jZpuLOQKgA7qFnm4o7A6ECuIeebSruDIQK4B56tqm4MxAqgHvo2abizkCoAO6hZ5uKOwOhAriHnm0q7gyECuAeerapuDMQKoB76Nmm4s5AqADuoWebijsDoQK4h55tKu4MhArgHnq2qbgzECqAe+jZpuLOQKgA7qFnm4o7A6ECuIeebSruDIQK4B56tqm4MxAqgHvo2abizkCoAO6hZ5v6/Zy6TCcQjpUAAAAASUVORK5CYII=";

export const RELATIVE_URL_DEMO_IMAGE_1920x1080 = `/demo-images/demo-image-1920x1080.png`;
export const RELATIVE_URL_DEMO_IMAGE_1080x1920 = `/demo-images/demo-image-1080x1920.png`;
export const RELATIVE_URL_DEMO_IMAGE_250x250 = `/demo-images/demo-image-250x250.png`;

export class PuzzlePageObject {
  readonly page: Page;

  readonly getPageContainerHtmlElement: Locator;
  readonly getDocumentBody: Locator;

  readonly sidebar: SidebarPageFragment;
  readonly floatingPanel: FloatingPanelPageFragment;

  readonly getZoomLabel: Locator;
  readonly getPuzzleView: Locator;

  readonly dialogPuzzleCreation: DialogPuzzleCreationFragment;
  readonly dialogSolvePuzzleAgain: DialogSolvePuzzleAgainFragment;
  readonly dialogHelp: DialogHelpFragment;
  readonly dialogChooseMethodToCreatePuzzle: DialogChooseMethodToCreatePuzzle;
  readonly dialogLoadImageFromDevice: DialogLoadImageFromDevice;
  readonly dialogLoadImageFromLink: DialogLoadImageFromLink;
  readonly dialogChooseDemoImage: DialogChooseDemoImage;

  readonly notificationCongratulation: NotificationCongratulationFragment;

  constructor(page: Page) {
    this.page = page;

    this.getPageContainerHtmlElement = page.getByRole("main");
    this.getDocumentBody = page.locator("body");

    this.floatingPanel = new FloatingPanelPageFragment(page);
    this.sidebar = new SidebarPageFragment(page);

    this.getPuzzleView = page.getByRole("application", { name: /puzzle view/i });
    this.getZoomLabel = page.getByRole("note", { name: /zoom/i });

    this.dialogSolvePuzzleAgain = new DialogSolvePuzzleAgainFragment(page);

    this.dialogPuzzleCreation = new DialogPuzzleCreationFragment(page);

    this.dialogChooseMethodToCreatePuzzle = new DialogChooseMethodToCreatePuzzle(page);
    this.dialogLoadImageFromDevice = new DialogLoadImageFromDevice(page);
    this.dialogLoadImageFromLink = new DialogLoadImageFromLink(page);

    this.dialogChooseDemoImage = new DialogChooseDemoImage(page);

    this.dialogHelp = new DialogHelpFragment(page);

    this.notificationCongratulation = new NotificationCongratulationFragment(page);
  }

  async goto() {
    await this.page.goto("/");
  }

  async reload() {
    await this.page.reload();
  }

  async close() {
    await this.page.close();
  }

  async isVisible() {
    await expect(this.page).toHaveTitle(/puzzle/i);

    await this.sidebar.isVisible();
    await this.floatingPanel.isVisible();

    await expect(this.getPuzzleView).toBeVisible();
    await expect(this.getZoomLabel).toBeVisible();

    await this.dialogSolvePuzzleAgain.isNotVisible();
    await this.dialogPuzzleCreation.isNotVisible();
    await this.dialogChooseMethodToCreatePuzzle.isNotVisible();
    await this.dialogHelp.isNotVisible();
  }

  async hasDemoPuzzle7x4Data() {
    await this.isVisible();
    await expect(this.getPageContainerHtmlElement).toHaveCSS("background-color", PUZZLE_BACKGROUND_COLOR_DEFAULT);
    await this.sidebar.hasDemoPuzzle7x4Data();
    await this.floatingPanel.hasDemoPuzzle7x4Data();
    await expect(this.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_MAX);
  }

  async hasExactDemoPuzzle7x4Data() {
    await this.hasDemoPuzzle7x4Data();
    await this.sidebar.hasDemoPuzzle7x4DataSeed();
  }

  async hasDemoPuzzle2x1Data() {
    await this.isVisible();
    await expect(this.getPageContainerHtmlElement).toHaveCSS("background-color", PUZZLE_BACKGROUND_COLOR_DEFAULT);
    await this.sidebar.hasDemoPuzzle2x1Data();
    await this.floatingPanel.hasDemoPuzzle2x1Data();
    await expect(this.getZoomLabel).toHaveText(PUZZLE_ZOOM_LABEL_VALUE_MAX);
  }

  async hasExactDemoPuzzle2x1Data() {
    await this.hasDemoPuzzle2x1Data();
    await this.sidebar.hasDemoPuzzle2x1DataSeed();
  }

  async solveDemoPuzzle2x1() {
    await this.movePieceToPoint({ x: 600, y: 360 });
  }

  async movePieceToPoint(targetPosition = { x: 0, y: 0 }) {
    await mouseMove(this.page, this.getPuzzleView, targetPosition);
  }

  async movePieceToFromPointToPoint(originPosition = { x: 0, y: 0 }, targetPosition = { x: 0, y: 0 }, steps = 1) {
    await this.page.mouse.move(originPosition.x, originPosition.y);
    await this.page.mouse.down();
    await this.page.mouse.move(targetPosition.x, targetPosition.y, { steps });
    await this.page.mouse.up();
  }

  async moveSceneFromPointToPoint(originPosition = { x: 0, y: 0 }, targetPosition = { x: 0, y: 0 }, steps = 1) {
    await this.page.mouse.move(originPosition.x, originPosition.y);
    await this.page.mouse.down();
    await this.page.mouse.move(targetPosition.x, targetPosition.y, { steps });
    await this.page.mouse.up();
  }

  async restartDemoPuzzle2x1() {
    await this.sidebar.getRestartPuzzleButton.click();
    await this.dialogSolvePuzzleAgain.isVisible();
    await this.dialogSolvePuzzleAgain.getSolveAgainButton.click();
    await this.dialogSolvePuzzleAgain.isNotVisible();
  }

  async changeNumberOfPiecePerSide() {
    await this.openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar();
    await this.dialogPuzzleCreation.getCreatePuzzleButton.click();
    await this.dialogPuzzleCreation.isNotVisible();
  }

  async createPuzzleFromImageLoadedFromLink(link: string) {
    await this.openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();
    await this.dialogLoadImageFromLink.getImageLinkInput.fill(link);
    await this.dialogLoadImageFromLink.getLoadImageButton.click();
    await this.dialogLoadImageFromLink.isNotVisible();
    await this.dialogPuzzleCreation.isVisible();
    await this.dialogPuzzleCreation.getCreatePuzzleButton.click();
    await this.dialogPuzzleCreation.isNotVisible();
  }

  async openPuzzleCreationDialogByChangeNumberOfPieceButtonInSidebar() {
    await this.sidebar.getChangeNumberOfPiecesButton.click();
    await this.dialogPuzzleCreation.isVisible();

    return this.dialogPuzzleCreation;
  }

  async openChooseMethodToCreatePuzzleDialogByChangeImageButtonInSidebar() {
    await this.sidebar.getChangeImageButton.click();
    await this.dialogChooseMethodToCreatePuzzle.isVisible();

    return this.dialogChooseMethodToCreatePuzzle;
  }

  async openLoadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog() {
    await this.openChooseMethodToCreatePuzzleDialogByChangeImageButtonInSidebar();
    await this.dialogChooseMethodToCreatePuzzle.getLoadImageFromDeviceButton.click();
    await this.dialogChooseMethodToCreatePuzzle.isNotVisible();
    await this.dialogLoadImageFromDevice.isVisible();

    return this.dialogLoadImageFromDevice;
  }

  async openLoadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog() {
    await this.openChooseMethodToCreatePuzzleDialogByChangeImageButtonInSidebar();
    await this.dialogChooseMethodToCreatePuzzle.getLoadImageFromLinkButton.click();
    await this.dialogChooseMethodToCreatePuzzle.isNotVisible();
    await this.dialogLoadImageFromLink.isVisible();

    return this.dialogLoadImageFromLink;
  }

  async openChooseDemoImageDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog() {
    await this.openChooseMethodToCreatePuzzleDialogByChangeImageButtonInSidebar();
    await this.dialogChooseMethodToCreatePuzzle.getDemoImagesLink.click();
    await this.dialogChooseMethodToCreatePuzzle.isNotVisible();
    await this.dialogChooseDemoImage.isVisible();

    return this.dialogChooseDemoImage;
  }

  async getPuzzleSeed() {
    const seed = await this.sidebar.getPuzzleSeedLabel.textContent();
    expect(seed).toHaveLength(PUZZLE_SEED_LENGTH);
    return seed;
  }

  async hidePage() {
    await hidePage(this.page);
  }

  async showPage() {
    await showPage(this.page);
  }

  async getPuzzleDataFromLocalStorage() {
    return await getDataFromLocalStorage(this.page, PUZZLE_LOCAL_STORAGE_KEY_NAME);
  }

  async dragAndDropFileImage250x250Png() {
    await dragAndDropFileByLocator(
      this.page,
      this.getDocumentBody,
      GET_IMAGE_250x250_PNG_FILE_PATH(),
      "250x250.png",
      "image/png",
    );
  }

  async pasteFromClipBoardAFileImage250x250Png() {
    await pasteFromClipBoardAFileByLocator(
      this.page,
      this.getDocumentBody,
      GET_IMAGE_250x250_PNG_FILE_PATH(),
      "250x250.png",
      "image/png",
    );
  }
}

export const openPuzzlePageWithDemoPuzzle2x1Data = async (page: Page) => {
  const puzzlePage = new PuzzlePageObject(page);
  await puzzlePage.goto();
  await puzzlePage.hasExactDemoPuzzle2x1Data();

  return puzzlePage;
};

export const openPuzzlePageWithDemoPuzzle7x4Data = async (page: Page) => {
  const puzzlePage = new PuzzlePageObject(page);
  await puzzlePage.goto();
  await puzzlePage.hasExactDemoPuzzle7x4Data();

  return puzzlePage;
};

/**
 * @param styleFilePath string
 * @returns string
 *
 *  Example:
 * ```
        await expect(puzzlePage.sidebar.getPuzzlePreviewImage).toHaveScreenshot(`image preview of new puzzle with puzzle-2x1-params and demo-image-1920x1080.sidebar.png`, { timeout: 2_000, stylePath: getStylePath('cut-puzzle-seed-in-sidebar.css') });
 * ```
 */
export const getStylePath = (styleFilePath: string) => {
  return getFilePath(`../.screenshot-styles/${styleFilePath}`, import.meta.url);
};

/**
 * Add init script to mock puzzle seed generation
 * @param page Page
 */
export const mockPuzzleSeedGeneration = async (page: Page) => {
  await page.addInitScript(() => {
    // @ts-expect-error property 'generateChallengeId' does not exist on type 'Window & typeof globalThis'
    const originalFunction = window.generateChallengeId;

    const ids = [
      "11e80c0c-1111-1111-1111-b147c88a2a11",
      "227663e4-2222-2222-2222-0f165a6a7f22",
      "227663e4-3333-3333-3333-0f165a6a7f33",
      "227663e4-4444-4444-4444-0f165a6a7f44",
      "227663e4-5555-5555-5555-0f165a6a7f55",
    ];

    let index = 0;
    const mockGenerateChallengeIdFunction = () => {
      if (index >= ids.length) {
        index = 0;
      }

      const newId = ids[index];
      console.log(`request to generate puzzle id (challenge seed/id) for index ${index} - result: ${newId}`);
      index++;

      return newId;
    };
    mockGenerateChallengeIdFunction.originalFunction = originalFunction;

    Object.defineProperty(window, "generateChallengeId", {
      value: mockGenerateChallengeIdFunction,
      writable: false,
      configurable: false,
    });
  }, undefined);
};

/**
 * Add init script to mock default value of `debugSettingsShouldDisplayPointerInformation`
 * @param page Page
 */
export const mockDefaultValueOfDebugSettingsShouldDisplayPointerInformation = async (page: Page) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "debugSettingsShouldDisplayPointerInformation", {
      value: true,
      writable: false,
      configurable: false,
    });
  }, undefined);
};

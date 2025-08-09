import { expect, type Locator, type Page } from "@playwright/test";
import { type PageFragment } from "./page-fragment";

export const PUZZLE_SEED_LENGTH = 36;

export class SidebarPageFragment implements PageFragment {
  readonly page: Page;

  readonly getSidebar: Locator;

  readonly getPuzzlePreviewImage: Locator;
  readonly getPuzzlePiecesInfoLabel: Locator;

  readonly getElapsedTimeLabel: Locator;
  readonly getChallengeProgressLabel: Locator;
  readonly getRestartPuzzleButton: Locator;

  readonly getBackgroundColorHeader: Locator;
  readonly getBackgroundColorList: Locator;
  readonly getBackgroundColorListItems: Locator;

  readonly getSolvePuzzleAgainButton: Locator;
  readonly getChangeNumberOfPiecesButton: Locator;
  readonly getChangeImageButton: Locator;
  readonly getChangePieceShapeButton: Locator;
  readonly getHelpButton: Locator;
  readonly getDebugSettingsButton: Locator;

  readonly getPuzzleSeedLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getSidebar = page.getByRole("complementary", { name: /sidebar/i });

    this.getPuzzlePreviewImage = this.getSidebar.getByTitle("puzzle preview");
    this.getPuzzlePiecesInfoLabel = this.getSidebar.getByRole("note", { name: "pieces info" });

    this.getElapsedTimeLabel = this.getSidebar.getByRole("note", { name: "elapsed time" });
    this.getChallengeProgressLabel = this.getSidebar.getByRole("note", { name: "challenge progress" });
    this.getRestartPuzzleButton = this.getSidebar.getByRole("button", { name: /restart puzzle/i });

    this.getBackgroundColorHeader = this.getSidebar.getByText("Background color");
    this.getBackgroundColorList = this.getSidebar.getByRole("list", { name: /background color/i });

    this.getBackgroundColorListItems = this.getBackgroundColorList.getByRole("listitem");

    this.getSolvePuzzleAgainButton = this.getSidebar.getByRole("button", { name: /solve puzzle again/i });
    this.getChangeNumberOfPiecesButton = this.getSidebar.getByRole("button", { name: /change number of pieces/i });
    this.getChangeImageButton = this.getSidebar.getByRole("button", { name: /change image/i });
    this.getChangePieceShapeButton = this.getSidebar.getByRole("button", { name: /change piece shape/i });
    this.getHelpButton = this.getSidebar.getByRole("button", { name: /help/i });
    this.getDebugSettingsButton = this.getSidebar.getByRole("button", { name: /debug settings/i });

    this.getPuzzleSeedLabel = this.getSidebar.getByRole("note", { name: /challenge seed:/i });
  }

  async isVisible() {
    await expect(this.getSidebar).toBeVisible();

    await expect(this.getPuzzlePreviewImage).toBeVisible();
    await expect(this.getPuzzlePiecesInfoLabel).toBeVisible();

    await expect(this.getElapsedTimeLabel).toBeVisible();
    await expect(this.getChallengeProgressLabel).toBeVisible();
    await expect(this.getRestartPuzzleButton).toBeVisible();

    await expect(this.getBackgroundColorHeader).toBeVisible();
    await expect(this.getBackgroundColorList).toBeVisible();
    await expect(this.getBackgroundColorListItems.getByRole("radio")).toHaveCount(7);

    await expect(this.getSolvePuzzleAgainButton).toBeVisible();
    await expect(this.getChangeNumberOfPiecesButton).toBeVisible();
    await expect(this.getChangeImageButton).toBeVisible();
    await expect(this.getChangePieceShapeButton).toBeVisible();
    await expect(this.getHelpButton).toBeVisible();

    await expect(this.getDebugSettingsButton).toBeVisible();

    await expect(this.getPuzzleSeedLabel).toBeVisible();
    const puzzleSeed = await this.getPuzzleSeedLabel.textContent();
    expect(puzzleSeed).toHaveLength(PUZZLE_SEED_LENGTH);
  }

  async hasDemoPuzzle7x4Data() {
    await expect(this.getPuzzlePiecesInfoLabel).toHaveText(/28 pieces \(7x4\)/i);
    await expect(this.getElapsedTimeLabel).toHaveText("Time:0:00");
    await expect(this.getChallengeProgressLabel).toHaveText("Progress:0%");
    await expect(this.getRestartPuzzleButton).toBeDisabled();
    await expect(this.getBackgroundColorListItems.getByRole("radio", { name: /dark slate gray/i })).toBeChecked();
  }

  async hasDemoPuzzle7x4DataSeed() {
    await expect(this.getPuzzleSeedLabel).toHaveText("fcf87673-5264-4763-bdc3-092f29d9b05f");
  }

  async hasDemoPuzzle2x1Data() {
    await expect(this.getPuzzlePiecesInfoLabel).toHaveText(/2 pieces \(2x1\)/i);
    await expect(this.getElapsedTimeLabel).toHaveText("Time:0:00");
    await expect(this.getChallengeProgressLabel).toHaveText("Progress:0%");
    await expect(this.getRestartPuzzleButton).toBeDisabled();
    await expect(this.getBackgroundColorListItems.getByRole("radio", { name: /dark slate gray/i })).toBeChecked();
  }

  async hasDemoPuzzle2x1DataSeed() {
    await expect(this.getPuzzleSeedLabel).toHaveText("db247e7d-22fe-44a4-943b-1274c532c3cf");
  }
}

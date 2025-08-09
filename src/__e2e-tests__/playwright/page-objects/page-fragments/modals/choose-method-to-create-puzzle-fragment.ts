import { expect, type Locator, type Page } from "@playwright/test";
import { type PageFragment } from "../page-fragment";

export class DialogChooseMethodToCreatePuzzle implements PageFragment {
  readonly page: Page;

  readonly getDialog: Locator;
  readonly getBackdrop: Locator;
  readonly getCloseButton: Locator;

  readonly getHeading: Locator;
  readonly getLoadImageFromDeviceButton: Locator;
  readonly getLoadImageFromLinkButton: Locator;
  readonly getAlternativeWayToCreatePuzzleLabel: Locator;
  readonly getDemoImagesLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.getDialog = page.getByRole("dialog", { name: /choose method to create a puzzle/i });
    const base = this.getDialog;

    this.getBackdrop = base.getByLabel(/modal-backdrop/i);
    this.getCloseButton = base.getByRole("button", { name: /close/i });

    this.getHeading = base.getByRole("heading", { name: /choose method to create a puzzle/i });

    this.getLoadImageFromDeviceButton = base.getByRole("button", {
      name: /upload an image from device or drag and drop an image here or use ctrl \+ v \(to paste an image from clipboard\)/i,
    });

    this.getLoadImageFromLinkButton = base.getByRole("button", { name: /load an image from a link/i });

    this.getAlternativeWayToCreatePuzzleLabel = base.getByRole("note", { name: /alternative way to create a puzzle/i });

    this.getDemoImagesLink = base.getByRole("link", { name: /demo images/i });
  }

  async isVisible() {
    await expect(this.getDialog).toBeVisible();

    await expect(this.getBackdrop).toBeVisible();
    await expect(this.getCloseButton).toBeVisible();

    await expect(this.getHeading).toBeVisible();

    await expect(this.getLoadImageFromDeviceButton).toBeVisible();
    await expect(this.getLoadImageFromLinkButton).toBeVisible();
    await expect(this.getAlternativeWayToCreatePuzzleLabel).toBeVisible();
    await expect(this.getAlternativeWayToCreatePuzzleLabel).toHaveText(/also you can use demo images/i);
    await expect(this.getDemoImagesLink).toBeVisible();
    await expect(this.getDemoImagesLink).toHaveText(/demo images/i);
  }

  async isNotVisible() {
    await expect(this.getDialog).not.toBeVisible();
  }
}

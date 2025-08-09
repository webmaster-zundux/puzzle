import { expect, type Locator, type Page } from "@playwright/test";
import { type PageFragment } from "../page-fragment";

export class DialogLoadImageFromDevice implements PageFragment {
  readonly page: Page;

  readonly getDialog: Locator;
  readonly getBackdrop: Locator;
  readonly getCloseButton: Locator;

  readonly getHeading: Locator;

  readonly getSelectedImageLabel: Locator;
  readonly getFileInput: Locator;

  readonly getSelectFileFromDeviceButton: Locator;

  readonly getAlternativeWayToCreatePuzzleLabel: Locator;
  readonly getLoadImageFromLinkButton: Locator;
  readonly getDemoImagesLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.getDialog = page.getByRole("dialog", { name: /upload an image from device/i });
    const base = this.getDialog;

    this.getBackdrop = base.getByLabel(/modal-backdrop/i);
    this.getCloseButton = base.getByRole("button", { name: /close/i });

    this.getHeading = base.getByRole("heading", { name: /upload an image from device/i });

    this.getSelectedImageLabel = base.getByLabel(/selected image:/i);
    this.getFileInput = base.getByLabel(/selected image:/i);

    this.getSelectFileFromDeviceButton = base.getByRole("button", {
      name: /click to select an image or drag and drop an image here or use ctrl \+ v \(to paste an image from clipboard\)/i,
    });

    this.getAlternativeWayToCreatePuzzleLabel = base.getByRole("note", { name: /alternative way to load an image/i });

    this.getLoadImageFromLinkButton = base.getByRole("link", { name: /load an image from a link/i });

    this.getDemoImagesLink = base.getByRole("link", { name: /demo images/i });
  }

  async isVisible() {
    await expect(this.getDialog).toBeVisible();

    await expect(this.getBackdrop).toBeVisible();
    await expect(this.getCloseButton).toBeVisible();

    await expect(this.getHeading).toBeVisible();

    await expect(this.getSelectedImageLabel).toBeVisible();
    await expect(this.getFileInput).toBeVisible();
    await expect(this.getFileInput).toBeEnabled();
    await expect(this.getFileInput).toHaveValue("");

    await expect(this.getSelectFileFromDeviceButton).toBeVisible();

    await expect(this.getAlternativeWayToCreatePuzzleLabel).toBeVisible();
    await expect(this.getAlternativeWayToCreatePuzzleLabel).toHaveText(
      /also you can load an image from a link or use one of demo images/i,
    );

    await expect(this.getLoadImageFromLinkButton).toBeVisible();
    await expect(this.getLoadImageFromLinkButton).toHaveText(/load an image from a link/i);

    await expect(this.getDemoImagesLink).toBeVisible();
    await expect(this.getDemoImagesLink).toHaveText(/demo images/i);
  }

  async isNotVisible() {
    await expect(this.getDialog).not.toBeVisible();
  }
}

import { expect, type Locator, type Page } from "@playwright/test";
import { type PageFragment } from "../page-fragment";

export class DialogLoadImageFromLink implements PageFragment {
  readonly page: Page;

  readonly getDialog: Locator;
  readonly getBackdrop: Locator;
  readonly getCloseButton: Locator;

  readonly getHeading: Locator;

  readonly getImageLinkInput: Locator;
  readonly getLoadImageButton: Locator;

  readonly getAlternativeWayToCreatePuzzleLabel: Locator;
  readonly getLoadImageFromDeviceButton: Locator;
  readonly getDemoImagesLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.getDialog = page.getByRole("dialog", { name: /load an image from a link/i });
    const base = this.getDialog;

    this.getBackdrop = base.getByLabel(/modal-backdrop/i);
    this.getCloseButton = base.getByRole("button", { name: /close/i });

    this.getHeading = base.getByRole("heading", { name: /load an image from a link/i });

    this.getImageLinkInput = base.getByRole("textbox", { name: /image-link/i });
    this.getLoadImageButton = base.getByRole("button", { name: /load image/i });

    this.getAlternativeWayToCreatePuzzleLabel = base.getByRole("note", { name: /alternative way to load an image/i });

    this.getLoadImageFromDeviceButton = base.getByRole("link", { name: /upload an image from device/i });

    this.getDemoImagesLink = base.getByRole("link", { name: /demo images/i });
  }

  async isVisible() {
    await expect(this.getDialog).toBeVisible();

    await expect(this.getBackdrop).toBeVisible();
    await expect(this.getCloseButton).toBeVisible();

    await expect(this.getHeading).toBeVisible();

    await expect(this.getImageLinkInput).toBeVisible();
    await expect(this.getImageLinkInput).toHaveValue("");
    await expect(this.getImageLinkInput).toHaveAttribute("required");
    await expect(this.getImageLinkInput).toHaveAttribute("placeholder", "https://example.com/image.png");

    await expect(this.getLoadImageButton).toBeVisible();
    await expect(this.getLoadImageButton).toBeEnabled();

    await expect(this.getAlternativeWayToCreatePuzzleLabel).toBeVisible();
    await expect(this.getAlternativeWayToCreatePuzzleLabel).toHaveText(
      /also you can upload an image from device or use one of demo images/i,
    );

    await expect(this.getLoadImageFromDeviceButton).toBeVisible();
    await expect(this.getLoadImageFromDeviceButton).toHaveText(/upload an image from device/i);

    await expect(this.getDemoImagesLink).toBeVisible();
    await expect(this.getDemoImagesLink).toHaveText(/demo images/i);
  }

  async isNotVisible() {
    await expect(this.getDialog).not.toBeVisible();
  }
}

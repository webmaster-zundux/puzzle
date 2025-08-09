import { expect, type Locator, type Page } from "@playwright/test";
import { type PageFragment } from "../page-fragment";

export class DialogChooseDemoImage implements PageFragment {
  readonly page: Page;

  readonly getDialog: Locator;
  readonly getBackdrop: Locator;
  readonly getCloseButton: Locator;

  readonly getHeading: Locator;

  readonly getDemoImageList: Locator;
  readonly getDemoImageListItems: Locator;

  readonly getChooseAnotherImageButton: Locator;
  readonly getUseSelectedImageButton: Locator;

  readonly getAlternativeWayToCreatePuzzleLabel: Locator;
  readonly getLoadImageFromDeviceButton: Locator;
  readonly getLoadImageFromLinkButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.getDialog = page.getByRole("dialog", { name: /choose a demo image/i });
    const base = this.getDialog;

    this.getBackdrop = base.getByLabel(/modal-backdrop/i);
    this.getCloseButton = base.getByRole("button", { name: /close/i });

    this.getHeading = base.getByRole("heading", { name: /choose a demo image/i });

    this.getDemoImageList = base.getByRole("list");
    this.getDemoImageListItems = this.getDemoImageList.getByRole("listitem");

    this.getChooseAnotherImageButton = base.getByRole("button", { name: /choose another image/i });
    this.getUseSelectedImageButton = base.getByRole("button", { name: /use selected image/i });

    this.getAlternativeWayToCreatePuzzleLabel = base.getByRole("note", { name: /alternative way to load an image/i });

    this.getLoadImageFromDeviceButton = base.getByRole("link", { name: /upload an image from device/i });

    this.getLoadImageFromLinkButton = base.getByRole("link", { name: /load an image from a link/i });
  }

  async isVisible() {
    await expect(this.getDialog).toBeVisible();

    await expect(this.getBackdrop).toBeVisible();
    await expect(this.getCloseButton).toBeVisible();

    await expect(this.getHeading).toBeVisible();

    await expect(this.getDemoImageList).toBeVisible();
    await expect(this.getDemoImageListItems).toHaveCount(2);
    await this.isVisibleDemoImage(
      this.getDemoImageListItems.nth(0),
      "/demo-images/demo-image-1920x1080.png",
      "demo image 1920x1080",
    );
    await this.isVisibleDemoImage(
      this.getDemoImageListItems.nth(1),
      "/demo-images/demo-image-1080x1920.png",
      "demo image 1080x1920",
    );

    await expect(this.getChooseAnotherImageButton).toBeVisible();
    await expect(this.getChooseAnotherImageButton).toBeEnabled();

    await expect(this.getUseSelectedImageButton).toBeVisible();
    await expect(this.getUseSelectedImageButton).toBeDisabled();

    await expect(this.getAlternativeWayToCreatePuzzleLabel).toBeVisible();
    await expect(this.getAlternativeWayToCreatePuzzleLabel).toHaveText(
      /also you can upload an image from device or load an image from a link/i,
    );

    await expect(this.getLoadImageFromDeviceButton).toBeVisible();
    await expect(this.getLoadImageFromDeviceButton).toHaveText(/upload an image from device/i);

    await expect(this.getLoadImageFromLinkButton).toBeVisible();
    await expect(this.getLoadImageFromLinkButton).toHaveText(/load an image from a link/i);
  }

  async isNotVisible() {
    await expect(this.getDialog).not.toBeVisible();
  }

  async isVisibleDemoImage(imageLocator: Locator, link: string, imageName: string) {
    await expect(imageLocator.getByRole("button")).toBeVisible();
    await expect(imageLocator.getByRole("button")).toBeEnabled();

    await expect(imageLocator.getByRole("img")).toBeVisible();
    await expect(imageLocator.getByRole("img")).toHaveAttribute("src", link);
    await expect(imageLocator.getByRole("img")).toHaveAttribute("alt", link);

    await expect(imageLocator.getByText(imageName)).toBeVisible();

    await expect(imageLocator.getByText("image link:")).toBeVisible();
    await expect(imageLocator.getByRole("link")).toBeVisible();
    await expect(imageLocator.getByRole("link")).toHaveAttribute("href", link);
    await expect(imageLocator.getByRole("link")).toHaveAttribute("target", "__blank");
  }
}

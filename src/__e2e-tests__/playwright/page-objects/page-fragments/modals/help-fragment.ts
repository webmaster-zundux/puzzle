import { expect, type Locator, type Page } from "@playwright/test";
import { type PageFragment } from "../page-fragment";

export class ModalHelpFragment implements PageFragment {
  readonly page: Page;

  readonly getDialog: Locator;
  readonly getBackdrop: Locator;
  readonly getCloseButton: Locator;

  readonly getHeading: Locator;
  readonly getLegendLabel: Locator;
  readonly getSolvingGif: Locator;

  constructor(page: Page) {
    this.page = page;

    this.getDialog = page.getByRole("dialog", { name: /help/i });
    const base = this.getDialog;

    this.getBackdrop = base.getByLabel(/modal-backdrop/i);
    this.getCloseButton = base.getByRole("button", { name: /close/i });

    this.getHeading = base.getByRole("heading", { name: /help/i });
    this.getLegendLabel = base.getByText(/legend label for screenshot/i);
    this.getSolvingGif = base.getByRole("img", { name: /animated puzzle solving gif/i });
  }

  async isVisible() {
    await expect(this.getDialog).toBeVisible();

    await expect(this.getBackdrop).toBeVisible();
    await expect(this.getCloseButton).toBeVisible();

    await expect(this.getHeading).toBeVisible();
    await expect(this.getLegendLabel).toBeVisible();
    await expect(this.getSolvingGif).toBeVisible();
  }

  async isNotVisible() {
    await expect(this.getDialog).not.toBeVisible();
  }
}

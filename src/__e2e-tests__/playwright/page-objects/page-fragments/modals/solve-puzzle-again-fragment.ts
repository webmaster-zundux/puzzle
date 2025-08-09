import { expect, type Locator, type Page } from "@playwright/test";
import { type PageFragment } from "../page-fragment";

export class ModalSolvePuzzleAgainFragment implements PageFragment {
  readonly page: Page;

  readonly getDialog: Locator;
  readonly getBackdrop: Locator;

  readonly getHeading: Locator;
  readonly getCancelButton: Locator;
  readonly getSolveAgainButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.getDialog = page.getByRole("dialog", { name: /want to solve the puzzle again\?/i });
    const base = this.getDialog;

    this.getBackdrop = base.getByLabel(/modal-backdrop/i);
    this.getHeading = base.getByRole("heading", { name: /want to solve the puzzle again\?/i });

    this.getCancelButton = base.getByRole("button", { name: /cancel/i });
    this.getSolveAgainButton = base.getByRole("button", { name: /solve again/i });
  }

  async isVisible() {
    await expect(this.getDialog).toBeVisible();

    await expect(this.getBackdrop).toBeVisible();

    await expect(this.getHeading).toBeVisible();
    await expect(this.getCancelButton).toBeVisible();
    await expect(this.getSolveAgainButton).toBeVisible();
  }

  async isNotVisible() {
    await expect(this.getDialog).not.toBeVisible();
  }
}

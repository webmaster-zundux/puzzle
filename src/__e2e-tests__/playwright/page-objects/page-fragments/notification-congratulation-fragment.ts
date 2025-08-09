import { expect, type Locator, type Page } from "@playwright/test";
import type { PageFragment } from "./page-fragment";

export class NotificationCongratulationFragment implements PageFragment {
  readonly page: Page;

  readonly getNotification: Locator;

  readonly getMessage: Locator;
  readonly getCloseButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.getNotification = page.getByRole("note", { name: /puzzle was solved/i });
    const base = this.getNotification;

    this.getCloseButton = base.getByRole("button", { name: /close/i });
    this.getMessage = base.getByRole("alert", { name: /puzzle was solved/i });
  }

  async isVisible(options: { timeout?: number } = { timeout: 50 }) {
    await expect(this.getNotification).toBeVisible({ timeout: options.timeout });
    await expect(this.getCloseButton).toBeVisible();
    await expect(this.getMessage).toBeVisible();
    await expect(this.getMessage).toHaveText("Congratulation! Puzzle was solved");
  }
}

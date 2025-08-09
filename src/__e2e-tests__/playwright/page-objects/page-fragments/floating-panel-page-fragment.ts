import { expect, type Locator, type Page } from "@playwright/test";
import { type PageFragment } from "./page-fragment";

export class FloatingPanelPageFragment implements PageFragment {
  readonly page: Page;
  readonly getFloatingPanel: Locator;
  readonly getButtons: Locator;
  readonly getShowAllPiecesButton: Locator;
  readonly getResetZoomButton: Locator;
  readonly getZoomOutButton: Locator;
  readonly getZoomInButton: Locator;
  readonly getEnterFullScreenButton: Locator;
  readonly getExitFullScreenButton: Locator;
  readonly getHideSidebarButton: Locator;
  readonly getShowSidebarButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getFloatingPanel = page.getByRole("toolbar", { name: /puzzle controls/i });

    this.getButtons = this.getFloatingPanel.getByRole("button");

    this.getShowAllPiecesButton = this.getFloatingPanel.getByRole("button", { name: /show all pieces/i });
    this.getResetZoomButton = this.getFloatingPanel.getByRole("button", { name: /reset zoom/i });
    this.getZoomOutButton = this.getFloatingPanel.getByRole("button", { name: /zoom out/i });
    this.getZoomInButton = this.getFloatingPanel.getByRole("button", { name: /zoom in/i });
    this.getEnterFullScreenButton = this.getFloatingPanel.getByRole("button", { name: /enter full screen/i });
    this.getExitFullScreenButton = this.getFloatingPanel.getByRole("button", { name: /exit full screen/i });
    this.getHideSidebarButton = this.getFloatingPanel.getByRole("button", { name: /hide side panel/i });
    this.getShowSidebarButton = this.getFloatingPanel.getByRole("button", { name: /show side panel/i });
  }

  async isVisible() {
    await expect(this.getFloatingPanel).toBeVisible();

    await expect(this.getButtons).toHaveCount(6);

    await expect(this.getShowAllPiecesButton).toBeVisible();
    await expect(this.getResetZoomButton).toBeVisible();
    await expect(this.getZoomOutButton).toBeVisible();
    await expect(this.getZoomInButton).toBeVisible();

    await expect(this.getEnterFullScreenButton.or(this.getExitFullScreenButton)).toBeVisible();
    await expect(this.getHideSidebarButton.or(this.getShowSidebarButton)).toBeVisible();
  }

  async hasDemoPuzzle7x4Data() {
    await expect(this.getEnterFullScreenButton).toBeVisible();
    await expect(this.getExitFullScreenButton).not.toBeVisible();

    await expect(this.getHideSidebarButton).toBeVisible();
    await expect(this.getShowSidebarButton).not.toBeVisible();
  }

  async hasDemoPuzzle2x1Data() {
    await expect(this.getEnterFullScreenButton).toBeVisible();
    await expect(this.getExitFullScreenButton).not.toBeVisible();

    await expect(this.getHideSidebarButton).toBeVisible();
    await expect(this.getShowSidebarButton).not.toBeVisible();
  }
}

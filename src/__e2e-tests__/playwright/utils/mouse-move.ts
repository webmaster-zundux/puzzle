import type { Locator, Page } from "@playwright/test";

export const mouseMove = async (page: Page, from: Locator, targetPoint: { x: number; y: number }) => {
  await from.hover();
  await page.mouse.down();
  await page.mouse.move(targetPoint.x, targetPoint.y);
  await page.mouse.up();
};

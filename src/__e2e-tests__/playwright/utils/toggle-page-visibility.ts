import type { Page } from "@playwright/test";

const setPageVisibility = async (page: Page, hidden = true) => {
  await page.evaluate((hidden) => {
    Object.defineProperty(document, "visibilityState", {
      value: hidden ? "hidden" : "visible",
      writable: true,
    });

    Object.defineProperty(document, "hidden", {
      value: hidden,
      writable: true,
    });

    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);
};

export const hidePage = async (page: Page) => {
  await setPageVisibility(page, true);
};

export const showPage = async (page: Page) => {
  await setPageVisibility(page, false);
};

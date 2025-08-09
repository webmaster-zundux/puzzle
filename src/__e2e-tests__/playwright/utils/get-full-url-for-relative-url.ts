import { type Page } from "@playwright/test";

export const getFullUrlForRelativeUrl = (page: Page, relativeUrl: string) => {
  const baseUrl = page.url();
  const rootPart = baseUrl.substring(0, baseUrl.length - 1);
  const relativePart = relativeUrl.substring(1);

  return `${rootPart}/${relativePart}`;
};

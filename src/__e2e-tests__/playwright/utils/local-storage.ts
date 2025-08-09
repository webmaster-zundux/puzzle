import { type Page } from "@playwright/test";

export async function setDataIntoLocalStorage(page: Page, localStorageItemKey: string, data: unknown) {
  await page.addInitScript(
    ({ localStorageItemKey, data }) => {
      window?.localStorage.setItem(localStorageItemKey, JSON.stringify(data));
    },
    { localStorageItemKey, data },
  );
}

export async function getDataFromLocalStorage(page: Page, itemKey: string) {
  return await page.evaluate((itemKey) => {
    let parsedData;
    try {
      parsedData = JSON.parse(window?.localStorage.getItem(itemKey) || "null");
    } catch (error) {
      console.error("json parse error", error);
      return null;
    }

    return parsedData;
  }, itemKey);
}

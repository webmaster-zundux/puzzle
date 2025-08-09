import { expect, test } from "@playwright/test";
import { PuzzlePageObject } from "../page-objects/puzzle-page";
import { addInitScript } from "../utils/add-init-script";
import { getDataFromLocalStorage, setDataIntoLocalStorage } from "../utils/local-storage";

test(`loading data into localStorage (from file)`, async ({ page }) => {
  await addInitScript(page, "./preload-example-data.js", import.meta.url);

  const puzzlePage = new PuzzlePageObject(page);
  await puzzlePage.goto();

  const data = await getDataFromLocalStorage(page, "test-data-preloaded-from-file");
  const expectedData = { id: "preloaded-from-file", params: [1, 2, 3, 4] };
  expect(data).toEqual(expectedData);
  expect(data).toStrictEqual(expectedData);
});

test(`loading data into/from localStorage (with helpers)`, async ({ page }) => {
  const savedData = { id: "test-data-from-function", params: [1, 2, 3, 4] };
  await setDataIntoLocalStorage(page, "test-data", savedData);

  const puzzlePage = new PuzzlePageObject(page);
  await puzzlePage.goto();

  const data = await getDataFromLocalStorage(page, "test-data");
  expect(data).toEqual(savedData);
  expect(data).toStrictEqual(savedData);
});

test(`loading data into localStorage`, async ({ page }) => {
  const testData = { id: "test-1", params: [1, 2, 3, 4] };
  await page.addInitScript((testData) => {
    window.localStorage["test-info"] = JSON.stringify(testData);
  }, testData);

  await page.goto("/");

  const data = await page.evaluate(() => {
    let parsedData;
    try {
      parsedData = JSON.parse(window.localStorage["test-info"] || "null");
    } catch (error) {
      console.error("json parse error", error);
      return null;
    }

    return parsedData;
  });
  expect(data).toEqual(testData);
  expect(data).toStrictEqual(testData);
});

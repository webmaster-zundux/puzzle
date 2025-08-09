import { test, test as setup } from "@playwright/test";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PuzzlePageObject } from "./page-objects/puzzle-page";

test.use({ storageState: { cookies: [], origins: [] } });

const getDemoPuzzle7x4Path = () => {
  return resolve(dirname(fileURLToPath(import.meta.url)), "./.setup/demo-puzzle-7x4.json");
};

setup(
  "initialize demo puzzle and save it in localStorage",
  {
    tag: "@setup",
  },
  async ({ page }) => {
    const puzzlePage = new PuzzlePageObject(page);
    await puzzlePage.goto();
    await puzzlePage.isVisible();

    await page.context().storageState({ path: getDemoPuzzle7x4Path() });
  },
);

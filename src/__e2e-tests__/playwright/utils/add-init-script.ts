import { type Page } from "@playwright/test";
import { getFilePath } from "./get-file-path";

/**
 * @param page - playwright.Page
 * @param relativePathToPreloadScript - (e.g. "./preload-data.js")
 * @param absoluteUrlOfTestFile - (e.g. import.meta.url)
 *
 * Example:
 * ```
        await addInitScript(page, "./init-script.js", import.meta.url);
   ```
 */
export async function addInitScript(page: Page, relativePathToPreloadScript: string, absoluteUrlOfTestFile: string) {
  const filePath = getFilePath(relativePathToPreloadScript, absoluteUrlOfTestFile);

  await page.addInitScript({ path: filePath });
}

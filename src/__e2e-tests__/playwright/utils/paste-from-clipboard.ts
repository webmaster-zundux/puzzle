import type { Locator } from "@playwright/test";
import { type Page } from "@playwright/test";
import { readFileSync } from "fs";
import os from "node:os";

export const pasteFromClipBoardAFileByLocator = async (
  page: Page,
  locator: Locator,
  filePath: string,
  fileName: string,
  fileType: string,
) => {
  const buffer = readFileSync(filePath).toString("base64");

  await page.evaluate(
    async ({ bufferData, localFileType }) => {
      const blobData = await fetch(bufferData).then((res) => res.blob());
      const item = new ClipboardItem({ [localFileType]: blobData });
      await navigator.clipboard.write([item]);
    },
    {
      bufferData: `data:${fileType};base64,${buffer}`,
      localFilePath: filePath,
      localFileName: fileName,
      localFileType: fileType,
    },
  );

  await locator.focus();
  await ctrlV(page);
};

export async function ctrlC(page: Page) {
  const isMac = os.platform() === "darwin";
  const modifier = isMac ? "Meta" : "Control";
  await page.keyboard.press(`${modifier}+KeyC`);
}

export async function ctrlV(page: Page) {
  const isMac = os.platform() === "darwin";
  const modifier = isMac ? "Meta" : "Control";
  await page.keyboard.press(`${modifier}+KeyV`);
}

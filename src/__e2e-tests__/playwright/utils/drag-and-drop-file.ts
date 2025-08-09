import type { Locator, Page } from "@playwright/test";
import { readFileSync } from "fs";

export const dragAndDropFileByLocator = async (
  page: Page,
  locator: Locator,
  filePath: string,
  fileName: string,
  fileType: string,
) => {
  const buffer = readFileSync(filePath).toString("base64");

  const dataTransfer = await page.evaluateHandle(
    async ({ bufferData, localFileName, localFileType }) => {
      const dt = new DataTransfer();
      const blobData = await fetch(bufferData).then((res) => res.blob());
      const file = new File([blobData], localFileName, { type: localFileType });
      dt.items.add(file);

      return dt;
    },
    {
      bufferData: `data:application/octet-stream;base64,${buffer}`,
      localFileName: fileName,
      localFileType: fileType,
    },
  );

  await locator.dispatchEvent("drop", { dataTransfer });
};

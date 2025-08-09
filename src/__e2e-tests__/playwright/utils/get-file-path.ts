import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * @param relativeFilePath - (e.g. "./image.png")
 * @param absoluteUrlOfTestFile - (e.g. import.meta.url)
 *
 * Example:
 * ```
        await getFilePath("./image.png", import.meta.url);
   ```
 */
export const getFilePath = (relativeFilePath: string, absoluteUrlOfTestFile: string) =>
  resolve(dirname(fileURLToPath(absoluteUrlOfTestFile)), relativeFilePath);

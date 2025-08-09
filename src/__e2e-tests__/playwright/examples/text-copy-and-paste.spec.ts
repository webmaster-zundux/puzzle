import { expect, test as it } from "@playwright/test";
import os from "node:os";

it(`text copy and paste (ctrl+c and ctrl+v)`, async ({ page }) => {
  const isMac = os.platform() === "darwin";
  const modifier = isMac ? "Meta" : "Control";
  await page.setContent(`<div contenteditable>123</div>`);
  await page.focus("div");
  await page.keyboard.press(`${modifier}+KeyA`);
  await page.keyboard.press(`${modifier}+KeyC`);
  await page.keyboard.press(`${modifier}+KeyV`);
  await page.keyboard.press(`${modifier}+KeyV`);
  expect(await page.evaluate(() => document.querySelector("div")!.textContent)).toBe("123123");
});

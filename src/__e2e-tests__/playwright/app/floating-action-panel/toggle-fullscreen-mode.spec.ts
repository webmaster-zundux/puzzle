import { expect, test as it, test, type ViewportSize } from "@playwright/test";
import { openPuzzlePageWithDemoPuzzle2x1Data } from "../../page-objects/puzzle-page";

test.describe("floating action panel", () => {
  test.describe("toggle fullscreen mode", () => {
    test.fixme(true, "should be executed as manual test only!");

    test.skip(({ headless, browserName }) => {
      return headless === true || browserName !== "chromium";
    }, "should be runned in chromium with headfull mode only!");

    it.fixme(`activates fullscreen mode when clicking on "enter full screen" button`, async ({ page }) => {
      console.log(it.info().project);

      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);

      const viewportSize: ViewportSize = { width: 1280, height: 720 };

      const subWindow = (await page.evaluate((viewportSize) => {
        const windowFeatures = [`width=${viewportSize.width}`, `height=${viewportSize.height}`].join(",");
        const subWindow = window.open(window.location.href, "subWindow", windowFeatures);
        // @ts-expect-error property does not exist on type 'Window & typeof globalThis'
        window.subWindowInstance = subWindow;
        return subWindow;
      }, viewportSize)) as Window;
      expect(subWindow).not.toBe(null);

      const initialViewportWidth = await page.evaluate(() => {
        //@ts-expect-error property does not exist on type 'Window & typeof globalThis'
        return window.subWindowInstance.innerWidth;
      });
      const initialViewportHeight = await page.evaluate(() => {
        //@ts-expect-error property does not exist on type 'Window & typeof globalThis'
        return window.subWindowInstance.innerHeight + 1;
      });
      expect(initialViewportWidth).toBe(viewportSize.width);
      expect(initialViewportHeight).toBe(viewportSize.height);
      const availableViewportWidth = await page.evaluate(() => {
        //@ts-expect-error property does not exist on type 'Window & typeof globalThis'
        return window.subWindowInstance.screen.availWidth;
      });
      const availableViewportHeight = await page.evaluate(() => {
        //@ts-expect-error property does not exist on type 'Window & typeof globalThis'
        return window.subWindowInstance.screen.availHeight;
      });
      await expect(puzzlePage.floatingPanel.getExitFullScreenButton).not.toBeVisible();

      await puzzlePage.floatingPanel.getEnterFullScreenButton.click();

      await expect(puzzlePage.floatingPanel.getExitFullScreenButton).toBeVisible();
      await expect(puzzlePage.floatingPanel.getEnterFullScreenButton).not.toBeVisible();
      const fullscreenViewportWidth = await page.evaluate(() => {
        //@ts-expect-error property does not exist on type 'Window & typeof globalThis'
        return window.subWindowInstance.innerWidth;
      });
      const fullscreenViewportHeight = await page.evaluate(() => {
        //@ts-expect-error property does not exist on type 'Window & typeof globalThis'
        return window.subWindowInstance.innerHeight + 1;
      });
      expect(fullscreenViewportWidth).toBe(availableViewportWidth);
      expect(fullscreenViewportHeight).toBe(availableViewportHeight);
      expect(fullscreenViewportWidth).toBeGreaterThan(initialViewportWidth);
      expect(fullscreenViewportHeight).toBeGreaterThan(initialViewportHeight);
    });

    it.fixme("activates fullscreen mode when pressing F11 key", async () => {});

    it.fixme(`deactivates fullscreen mode when clicking on "exit full screen" button`, async () => {});

    it.fixme("deactivates fullscreen mode when pressing F11 key", async () => {});

    it.fixme("deactivates fullscreen mode when pressing Esc key", async () => {});
  });
});

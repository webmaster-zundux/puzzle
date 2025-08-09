import type { Browser } from "@playwright/test";
import { chromium, expect, test as it, test } from "@playwright/test";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  openPuzzlePageWithDemoPuzzle2x1Data,
  openPuzzlePageWithDemoPuzzle7x4Data,
  PuzzlePageObject,
} from "../page-objects/puzzle-page";

test.use({ storageState: { cookies: [], origins: [] } });

const launchBrowser = async (
  options = {
    args: new Array<string>(),
  },
): Promise<Browser> => {
  const browser = await chromium.launch(options);

  return browser;
};

const closeBrowser = async (browser: Browser) => {
  await browser.close();
};

const openPuzzlePageInIncognitoMode = async (
  browser: Browser,
  options: Parameters<Browser["newPage"]>[0] = {
    storageState: { cookies: [], origins: [] },
  },
) => {
  const page = await browser.newPage(options);
  const puzzlePage = new PuzzlePageObject(page);
  await puzzlePage.goto();
  await puzzlePage.isVisible();

  return puzzlePage;
};

test.describe(
  "@smoke app (advanced start)",
  {
    tag: "@smoke",
  },
  () => {
    test.describe(
      "WITH access to localStorage",
      {
        tag: "@localStorage",
      },
      () => {
        test.describe("with demo puzzle 2x1 state data", () => {
          test.use({
            storageState: resolve(dirname(fileURLToPath(import.meta.url)), "../.setup/demo-puzzle-2x1.json"),
          });

          it(`starts with saved state of a puzzle`, async ({ page }) => {
            await openPuzzlePageWithDemoPuzzle2x1Data(page);
          });

          it(`preserves state of the puzzle on reload the page`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();

            await puzzlePage.reload();

            await puzzlePage.hasExactDemoPuzzle2x1Data();
            const puzzleSeed = await puzzlePage.getPuzzleSeed();
            expect(puzzleSeed).toBe(initialPuzzleSeed);
          });

          it(`preserves state of the puzzle on loads page by url`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();

            await puzzlePage.goto();

            await puzzlePage.hasExactDemoPuzzle2x1Data();
            const puzzleSeed = await puzzlePage.getPuzzleSeed();
            expect(puzzleSeed).toBe(initialPuzzleSeed);
          });
        });

        test.describe("with demo puzzle 7x4 state data", () => {
          test.use({
            storageState: resolve(dirname(fileURLToPath(import.meta.url)), "../.setup/demo-puzzle-7x4.json"),
          });

          it(`starts with saved state of a puzzle`, async ({ page }) => {
            await openPuzzlePageWithDemoPuzzle7x4Data(page);
          });

          it(`preserves state of the puzzle on reload the page`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle7x4Data(page);
            const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();

            await puzzlePage.reload();

            await puzzlePage.hasExactDemoPuzzle7x4Data();
            const puzzleSeed = await puzzlePage.getPuzzleSeed();
            expect(puzzleSeed).toBe(initialPuzzleSeed);
          });

          it(`preserves state of the puzzle on loads page by url`, async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle7x4Data(page);
            const initialPuzzleSeed = await puzzlePage.getPuzzleSeed();

            await puzzlePage.goto();

            await puzzlePage.hasExactDemoPuzzle7x4Data();
            const puzzleSeed = await puzzlePage.getPuzzleSeed();
            expect(puzzleSeed).toBe(initialPuzzleSeed);
          });
        });
      },
    );

    test.describe(
      "in INCOGNITO mode",
      {
        tag: ["@localStorage", "@incognito"],
      },
      () => {
        test.fixme(({ browserName }) => {
          return browserName !== "chromium";
        }, "tests supports only chromium for now");

        test.describe(`WITH access to localStorage`, () => {
          it(`starts without saved state of a puzzle with different pieces' cutting and its positions every time`, async () => {
            test.setTimeout(30_000);
            const browser = await launchBrowser();
            let puzzlePage;

            puzzlePage = await openPuzzlePageInIncognitoMode(browser);
            await puzzlePage.hasDemoPuzzle7x4Data();
            const seedOne = await puzzlePage.getPuzzleSeed();
            expect(seedOne).not.toBe("fcf87673-5264-4763-bdc3-092f29d9b05f");
            await puzzlePage.close();

            puzzlePage = await openPuzzlePageInIncognitoMode(browser);
            await puzzlePage.hasDemoPuzzle7x4Data();
            const seedTwo = await puzzlePage.getPuzzleSeed();
            expect(seedTwo).not.toBe(seedOne);
            await puzzlePage.close();

            puzzlePage = await openPuzzlePageInIncognitoMode(browser);
            await puzzlePage.hasDemoPuzzle7x4Data();
            const seedThree = await puzzlePage.getPuzzleSeed();
            expect(seedThree).not.toBe(seedOne);
            expect(seedThree).not.toBe(seedTwo);
            await puzzlePage.close();

            puzzlePage = await openPuzzlePageInIncognitoMode(browser);
            await puzzlePage.hasDemoPuzzle7x4Data();
            const seedFour = await puzzlePage.getPuzzleSeed();
            expect(seedFour).not.toBe(seedOne);
            expect(seedFour).not.toBe(seedTwo);
            expect(seedFour).not.toBe(seedThree);
            await puzzlePage.close();

            await closeBrowser(browser);
          });

          it(`preserves state of a puzzle on page reload`, async () => {
            test.setTimeout(30_000);
            const browser = await launchBrowser();
            let puzzlePage;

            puzzlePage = await openPuzzlePageInIncognitoMode(browser);
            await puzzlePage.hasDemoPuzzle7x4Data();
            const seedOne = await puzzlePage.getPuzzleSeed();
            expect(seedOne).not.toBe("fcf87673-5264-4763-bdc3-092f29d9b05f");

            await puzzlePage.reload();
            await puzzlePage.hasDemoPuzzle7x4Data();
            const seedTwo = await puzzlePage.getPuzzleSeed();
            expect(seedTwo).toBe(seedOne);

            await puzzlePage.reload();
            await puzzlePage.hasDemoPuzzle7x4Data();
            const seedThree = await puzzlePage.getPuzzleSeed();
            expect(seedThree).toBe(seedOne);

            await puzzlePage.reload();
            await puzzlePage.hasDemoPuzzle7x4Data();
            const seedFour = await puzzlePage.getPuzzleSeed();
            expect(seedFour).toBe(seedOne);

            await puzzlePage.close();
            await closeBrowser(browser);
          });

          it(`preserves state of a puzzle on page loads by url`, async () => {
            test.setTimeout(30_000);
            const browser = await launchBrowser();

            const puzzlePage = await openPuzzlePageInIncognitoMode(browser);
            await puzzlePage.hasDemoPuzzle7x4Data();
            const seedOne = await puzzlePage.getPuzzleSeed();
            expect(seedOne).not.toBe("fcf87673-5264-4763-bdc3-092f29d9b05f");

            await puzzlePage.goto();
            await puzzlePage.hasDemoPuzzle7x4Data();
            const seedTwo = await puzzlePage.getPuzzleSeed();
            expect(seedTwo).toBe(seedOne);

            await puzzlePage.goto();
            await puzzlePage.hasDemoPuzzle7x4Data();
            const seedThree = await puzzlePage.getPuzzleSeed();
            expect(seedThree).toBe(seedOne);

            await puzzlePage.goto();
            await puzzlePage.hasDemoPuzzle7x4Data();
            const seedFour = await puzzlePage.getPuzzleSeed();
            expect(seedFour).toBe(seedOne);

            await puzzlePage.close();
            await closeBrowser(browser);
          });
        });

        test.describe(
          `WITHOUT access to localStorage`,
          {
            tag: "@localStorage",
          },
          () => {
            test.fixme(({ browserName }) => {
              return browserName !== "chromium";
            }, "tests supports only chromium for now");

            it(`starts with demo puzzle 7x4 state when localStorage access is not available / restricted`, async () => {
              const browser = await launchBrowser({ args: ["--disable-local-storage"] });
              let puzzlePage;

              puzzlePage = await openPuzzlePageInIncognitoMode(browser);
              await puzzlePage.hasDemoPuzzle7x4Data();
              const seedOne = await puzzlePage.getPuzzleSeed();
              expect(seedOne).not.toBe("fcf87673-5264-4763-bdc3-092f29d9b05f");

              await puzzlePage.close();
              await closeBrowser(browser);
            });

            it(`starts with demo puzzle 7x4 state on every page reloads when localStorage access is not available / restricted`, async () => {
              test.setTimeout(30_000);
              const browser = await launchBrowser({ args: ["--disable-local-storage"] });
              let puzzlePage;

              puzzlePage = await openPuzzlePageInIncognitoMode(browser);
              await puzzlePage.hasDemoPuzzle7x4Data();
              const seedOne = await puzzlePage.getPuzzleSeed();
              expect(seedOne).not.toBe("fcf87673-5264-4763-bdc3-092f29d9b05f");

              await puzzlePage.reload();
              await puzzlePage.hasDemoPuzzle7x4Data();
              const seedTwo = await puzzlePage.getPuzzleSeed();
              expect(seedTwo).not.toBe(seedOne);

              await puzzlePage.reload();
              await puzzlePage.hasDemoPuzzle7x4Data();
              const seedThree = await puzzlePage.getPuzzleSeed();
              expect(seedThree).not.toBe(seedOne);
              expect(seedThree).not.toBe(seedTwo);

              await puzzlePage.reload();
              await puzzlePage.hasDemoPuzzle7x4Data();
              const seedFour = await puzzlePage.getPuzzleSeed();
              expect(seedFour).not.toBe(seedOne);
              expect(seedFour).not.toBe(seedTwo);
              expect(seedFour).not.toBe(seedThree);

              await puzzlePage.close();
              await closeBrowser(browser);
            });
          },
        );
      },
    );

    test.describe(
      `saving puzzle state into localStorage`,
      {
        tag: "@localStorage",
      },
      () => {
        test.fixme(({ browserName }) => {
          return browserName !== "chromium";
        }, "tests supports only chromium for now");

        it(
          `causes saving the demo puzzle state into localStorage when page loads without puzzle state in localStorage`,
          {
            tag: "@localStorage",
          },
          async () => {
            const browser = await launchBrowser();
            let puzzlePage;

            puzzlePage = await openPuzzlePageInIncognitoMode(browser);
            await puzzlePage.hasDemoPuzzle7x4Data();
            const seedOne = await puzzlePage.getPuzzleSeed();
            expect(seedOne).not.toBe("fcf87673-5264-4763-bdc3-092f29d9b05f");

            const initialPuzzleData = await puzzlePage.getPuzzleDataFromLocalStorage();
            const initialPuzzleSeed = initialPuzzleData.challengeId;
            const initialPuzzleDataWithoutPuzzleSeed = {
              ...initialPuzzleData,
            };
            delete initialPuzzleDataWithoutPuzzleSeed.challengeId;

            const expectedPuzzleSeed = "fcf87673-5264-4763-bdc3-092f29d9b05f";
            const expectedPuzzleDataWithoutPuzzleSeed = {
              name: "puzzle name",
              numberOfPiecesPerWidth: 7,
              numberOfPiecesPerHeight: 4,
              pieceWidth: 50,
              connectionActivationAreaSideSizeFractionFromPieceSideSize: 0.2,
              imageSrc: "/demo-images/demo-image-1920x1080.png",
              imageOriginalSize: {
                width: 0,
                height: 0,
              },
              boundaryPoints: {
                tl: {
                  x: 0,
                  y: 0,
                },
                br: {
                  x: 1890,
                  y: 1080,
                },
              },
              piecesPositions: [],
              timeSpent: 0,
              pieceSideShapeName: "UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_ERODED_HILL",
              isSidebarOpen: true,
              canvasBackgroundColor: "dark-slate-gray",
            };
            expect(initialPuzzleDataWithoutPuzzleSeed).toStrictEqual(expectedPuzzleDataWithoutPuzzleSeed);
            expect(initialPuzzleSeed).not.toBe(expectedPuzzleSeed);

            await puzzlePage.close();
            await closeBrowser(browser);
          },
        );
      },
    );
  },
);

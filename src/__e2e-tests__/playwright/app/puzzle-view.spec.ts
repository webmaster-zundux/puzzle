import { expect, test as it, test } from "@playwright/test";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { openPuzzlePageWithDemoPuzzle2x1Data, openPuzzlePageWithDemoPuzzle7x4Data } from "../page-objects/puzzle-page";

test.describe(`puzzle view`, () => {
  test.describe(`a single piece moving`, () => {
    it(`moving a single piece`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const viewBoundingBox = await puzzlePage.getPuzzleView.boundingBox();
      expect(viewBoundingBox).not.toBe(null);

      const origin = {
        x: viewBoundingBox!.width / 2,
        y: viewBoundingBox!.height / 2,
      };
      const target = {
        x: viewBoundingBox!.width / 2 + 200,
        y: viewBoundingBox!.height / 2 + 200,
      };
      await puzzlePage.movePieceToFromPointToPoint(origin, target);

      await expect(page).toHaveScreenshot({ timeout: 2_000 });
    });

    it(`does NOT select text around when moving a piece`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const pageBoundingBox = await puzzlePage.getDocumentBody.boundingBox();
      expect(pageBoundingBox).not.toBe(null);
      const viewBoundingBox = await puzzlePage.getPuzzleView.boundingBox();
      expect(viewBoundingBox).not.toBe(null);

      const origin = {
        x: viewBoundingBox!.width / 2,
        y: viewBoundingBox!.height / 2,
      };
      const target = {
        x: pageBoundingBox!.width,
        y: pageBoundingBox!.height,
      };
      await puzzlePage.movePieceToFromPointToPoint(origin, target, 3);

      const selectionText = await page.evaluate(() => document.getSelection()?.toString());
      expect(selectionText).toBe("");
      await expect(page).toHaveScreenshot({ timeout: 2_000 });
    });

    test.describe(
      `saving puzzle data into localStorage`,
      {
        tag: "@localStorage",
      },
      () => {
        it(
          `causes saving the puzzle data into localStorage when a piece was moved (and released)`,
          {
            tag: "@localStorage",
          },
          async ({ page }) => {
            const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
            const initialData = await puzzlePage.getPuzzleDataFromLocalStorage();

            await puzzlePage.solveDemoPuzzle2x1();

            const expectedPiecesPositions = [
              {
                id: "piece_1:0",
                position: { x: 59.5, y: 0 },
              },
              {
                id: "piece_0:0",
                position: { x: 9.5, y: 0 },
              },
            ];
            const alteredData = await puzzlePage.getPuzzleDataFromLocalStorage();
            expect(alteredData.piecesPositions).not.toStrictEqual(initialData.piecesPositions);
            expect(alteredData.piecesPositions).toStrictEqual(expectedPiecesPositions);
          },
        );
      },
    );
  });

  test.describe(`a group of pieces moving`, () => {
    test.describe("with demo puzzle 7x4 state data", () => {
      test.use({
        storageState: resolve(dirname(fileURLToPath(import.meta.url)), "../.setup/demo-puzzle-7x4.json"),
      });

      it(`moving a group of pieces`, async ({ page }) => {
        const puzzlePage = await openPuzzlePageWithDemoPuzzle7x4Data(page);
        const viewBoundingBox = await puzzlePage.getPuzzleView.boundingBox();
        expect(viewBoundingBox).not.toBe(null);
        const originOne = {
          x: 380,
          y: 390,
        };
        const targetOne = {
          x: 330,
          y: 550,
        };
        await puzzlePage.movePieceToFromPointToPoint(originOne, targetOne);

        const origin = {
          x: 330,
          y: 550,
        };
        const target = {
          x: 130,
          y: 200,
        };
        await puzzlePage.movePieceToFromPointToPoint(origin, target);

        await expect(page).toHaveScreenshot({ timeout: 2_000 });
      });

      test.describe(
        `saving puzzle data into localStorage`,
        {
          tag: "@localStorage",
        },
        () => {
          it(
            `causes saving the puzzle data into localStorage when a group of pieces was moved (and released)`,
            {
              tag: "@localStorage",
            },
            async ({ page }) => {
              const puzzlePage = await openPuzzlePageWithDemoPuzzle7x4Data(page);
              const initialData = await puzzlePage.getPuzzleDataFromLocalStorage();
              const originOne = {
                x: 380,
                y: 390,
              };
              const targetOne = {
                x: 330,
                y: 550,
              };
              await puzzlePage.movePieceToFromPointToPoint(originOne, targetOne);

              const origin = {
                x: 330,
                y: 550,
              };
              const target = {
                x: 130,
                y: 200,
              };
              await puzzlePage.movePieceToFromPointToPoint(origin, target);

              const expectedPiecesPositions = [
                {
                  id: "piece_6:3",
                  position: { x: -33, y: 1 },
                },
                {
                  id: "piece_6:2",
                  position: { x: -33, y: -49 },
                },
              ];
              const alteredData = await puzzlePage.getPuzzleDataFromLocalStorage();
              expect(alteredData.piecesPositions).not.toStrictEqual(initialData.piecesPositions);
              expect(alteredData.piecesPositions).toStrictEqual(expectedPiecesPositions);
            },
          );
        },
      );
    });
  });

  test.describe(`camera moving`, () => {
    it(`scene (with all pieces) moves when moving the camera`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const viewBoundingBox = await puzzlePage.getPuzzleView.boundingBox();
      expect(viewBoundingBox).not.toBe(null);

      const origin = {
        x: viewBoundingBox!.x,
        y: viewBoundingBox!.y,
      };
      const target = {
        x: viewBoundingBox!.x + 200,
        y: viewBoundingBox!.y + 200,
      };
      await puzzlePage.moveSceneFromPointToPoint(origin, target);

      await expect(page).toHaveScreenshot({ timeout: 2_000 });
    });

    it(`does NOT select text around when moving the camera`, async ({ page }) => {
      const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
      const pageBoundingBox = await puzzlePage.getDocumentBody.boundingBox();
      expect(pageBoundingBox).not.toBe(null);
      const viewBoundingBox = await puzzlePage.getPuzzleView.boundingBox();
      expect(viewBoundingBox).not.toBe(null);

      const origin = {
        x: viewBoundingBox!.width / 2,
        y: viewBoundingBox!.height / 2,
      };
      const target = {
        x: pageBoundingBox!.width,
        y: pageBoundingBox!.height,
      };
      await puzzlePage.moveSceneFromPointToPoint(origin, target, 3);

      const selectionText = await page.evaluate(() => document.getSelection()?.toString());
      expect(selectionText).toBe("");
      await expect(page).toHaveScreenshot({ timeout: 2_000 });
    });

    test.describe(
      `does NOT saving puzzle data into localStorage`,
      {
        tag: "@localStorage",
      },
      () => {
        it(`does NOT cause saving the puzzle data into localStorage when camera was moved (and released)`, async ({
          page,
        }) => {
          const puzzlePage = await openPuzzlePageWithDemoPuzzle2x1Data(page);
          const initialData = await puzzlePage.getPuzzleDataFromLocalStorage();
          const viewBoundingBox = await puzzlePage.getPuzzleView.boundingBox();
          expect(viewBoundingBox).not.toBe(null);

          const origin = {
            x: viewBoundingBox!.x,
            y: viewBoundingBox!.y,
          };
          const target = {
            x: viewBoundingBox!.x + 200,
            y: viewBoundingBox!.y + 200,
          };
          await puzzlePage.moveSceneFromPointToPoint(origin, target);

          const notAlteredData = await puzzlePage.getPuzzleDataFromLocalStorage();
          expect(notAlteredData.piecesPositions).toStrictEqual(initialData.piecesPositions);
        });
      },
    );
  });
});

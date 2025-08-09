import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { App } from "../../App";
import { urlToFile } from "../../modals/ChangeImageModal/utils/getFileFromBase64";
import * as Challenge from "../../models/Challenge";
import { renderIntoDocumentBody } from "../__tests-utils__/renderIntoDocumentBody";
import {
  changeMinimalNumberPiecesPerHeight,
  changeMinimalNumberPiecesPerWidth,
  dragAndDropControlPoint,
  image250x250Base64,
  isChooseMethodToCreatePuzzleDialogOpened,
  isPuzzleCreationDialogOpened,
  mockControlPointForSelectedAreaManipulation,
  mockSelectionAreaForManipulation,
  openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar,
} from "./modal-helpers";

describe(`modal dialog "puzzle creation"`, () => {
  describe(`changes it's visibility state`, () => {
    it.skip(`opens when clicking on "change number of pieces" button in the sidebar`, async () => {
      const { asFragment } = renderIntoDocumentBody(<App />);
      const renderWithoutDialog = asFragment();

      await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ isShortCheck: false });

      expect(renderWithoutDialog).toMatchDiffSnapshot(
        asFragment(),
        { aAnnotation: "without dialog", bAnnotation: "with dialog" },
        `"puzzle creation" dialog`,
      );
    });

    it.skip(`opens when clicking on "change piece shape" button in the sidebar`, async () => {
      const { asFragment } = renderIntoDocumentBody(<App />);
      const renderWithoutDialog = asFragment();
      const sidebar = screen.getByRole("complementary", { name: /sidebar/i });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      await userEvent.click(within(sidebar).getByRole("button", { name: /change piece shape/i }));
      await isPuzzleCreationDialogOpened({ isShortCheck: false });

      expect(renderWithoutDialog).toMatchDiffSnapshot(
        asFragment(),
        { aAnnotation: "without dialog", bAnnotation: "with dialog" },
        `"puzzle creation" dialog`,
      );
    });

    it("closes when clicking on the dialog backdrop", async () => {
      const { asFragment } = renderIntoDocumentBody(<App />);
      const renderWithoutDialog = asFragment();
      await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar();
      const dialog = screen.getByRole("dialog", { name: /puzzle creation/i });
      const backdrop = within(dialog).getByLabelText(/modal-backdrop/i);
      expect(backdrop).toBeInTheDocument();

      await userEvent.click(backdrop!);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(renderWithoutDialog).toMatchDiffSnapshot(asFragment(), undefined, `without dialog`);
    });

    it('closes when pressing on "esc" key', async () => {
      const { asFragment } = renderIntoDocumentBody(<App />);
      const renderWithoutDialog = asFragment();
      await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar();

      await userEvent.keyboard("{Escape}");

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(renderWithoutDialog).toMatchDiffSnapshot(asFragment(), undefined, `without dialog`);
    });

    it('closes when clicking on "close" button', async () => {
      vi.spyOn(Challenge, "generateChallengeId")
        .mockImplementationOnce(() => "b47663e4-95ab-4472-9344-0f165a6a7ff9")
        .mockImplementationOnce(() => "89e80c0c-186a-46db-b242-b147c88a2a3e");
      const { asFragment } = renderIntoDocumentBody(<App />);
      const renderWithoutDialog = asFragment();
      expect(Challenge.generateChallengeId).toHaveBeenCalledOnce();
      const initialChallengeSeed = screen.getByRole("note", { name: /challenge seed:/i }).textContent;
      expect(initialChallengeSeed).toBe("b47663e4-95ab-4472-9344-0f165a6a7ff9");
      const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar();

      await userEvent.click(within(dialog).getByRole("button", { name: /close/i }));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(renderWithoutDialog).toMatchDiffSnapshot(asFragment(), undefined, `without dialog`);
      expect(Challenge.generateChallengeId).toHaveBeenCalledOnce();
      const challengeSeedAfterCanceledRestartOfPuzzle = screen.getByRole("note", {
        name: /challenge seed:/i,
      }).textContent;
      expect(challengeSeedAfterCanceledRestartOfPuzzle).toBe(initialChallengeSeed);
    });

    it(`switches to "choose method to create a puzzle" dialog when clicking on "use another image" button`, async () => {
      renderIntoDocumentBody(<App />);
      const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar();

      await userEvent.click(within(dialog).getByRole("button", { name: /use another image/i }));
      await isChooseMethodToCreatePuzzleDialogOpened();

      expect(screen.queryByRole("dialog", { name: /puzzle creation/i })).not.toBeInTheDocument();
    });

    it.skip('closes and creates a new puzzle challenge when clicking on "solve again" button in the dialog', async () => {
      const user = userEvent;
      vi.spyOn(Challenge, "generateChallengeId")
        .mockImplementationOnce(() => "b47663e4-95ab-4472-9344-0f165a6a7ff9")
        .mockImplementationOnce(() => "89e80c0c-186a-46db-b242-b147c88a2a3e");
      const { asFragment } = renderIntoDocumentBody(<App />);
      const renderWithoutDialog = asFragment();
      const initialChallengeSeed = screen.getByRole("note", { name: /challenge seed:/i }).textContent;
      expect(Challenge.generateChallengeId).toHaveBeenCalledOnce();
      expect(initialChallengeSeed).toBe("b47663e4-95ab-4472-9344-0f165a6a7ff9");

      const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
      await user.click(within(dialog).getByRole("button", { name: /create puzzle/i }));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(Challenge.generateChallengeId).toHaveBeenCalledTimes(2);
      const secondChallengeSeed = screen.getByRole("note", { name: /challenge seed:/i }).textContent;
      expect(secondChallengeSeed).not.toBe(initialChallengeSeed);
      expect(renderWithoutDialog).toMatchDiffSnapshot(asFragment(), undefined, "the second puzzle challenge");
    });
  });

  describe(`changes of form's values`, async () => {
    it(`changes piece shape when clicking on "straight line" shape button`, async () => {
      renderIntoDocumentBody(<App />);
      const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar();

      await userEvent.click(within(dialog).getByRole("radio", { name: /straight line/i }));

      expect(within(dialog).getByRole("radio", { name: /straight line/i })).toBeChecked();
    });

    describe.skip("minimal number of pieces per side fields", () => {
      it(`changes total number of pieces when inputs "20" into minimal number of pieces per side (width)`, async () => {
        renderIntoDocumentBody(<App />);
        const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar();

        await changeMinimalNumberPiecesPerWidth({ dialog, piecesPerWidth: 20 });

        expect(within(dialog).getByRole("spinbutton", { name: /width/i })).toHaveValue(20);
        expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
          /total number of pieces: 220\(20x11\)/i,
        );
      });

      it(`changes total number of pieces when inputs "20" into minimal number of pieces per side (height)`, async () => {
        renderIntoDocumentBody(<App />);
        const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar();

        await changeMinimalNumberPiecesPerHeight({ dialog, piecesPerHeight: 20 });

        expect(within(dialog).getByRole("spinbutton", { name: /height/i })).toHaveValue(20);
        expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
          /total number of pieces: 700\(35x20\)/i,
        );
      });

      it(`does not change total number of pieces when inputing too big number into minimal number of pieces per side that leads into piece's side size being less than 50px`, async () => {
        renderIntoDocumentBody(<App />);
        const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar();

        await changeMinimalNumberPiecesPerWidth({ dialog, piecesPerWidth: 40 });
        await changeMinimalNumberPiecesPerHeight({ dialog, piecesPerHeight: 40 });

        expect(within(dialog).getByText(/side size of single piece:/i)).toHaveTextContent(
          /side size of single piece: 50px \(min 50px\)/i,
        );
      });
    });

    describe.skip("sets of recommended number of pieces", () => {
      it(`changes total number of pieces when clicking "6" pieces in the list "recommended number of pieces"`, async () => {
        renderIntoDocumentBody(<App />);
        const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar();

        await userEvent.click(within(dialog).getByRole("button", { name: /6 pieces/i }));

        expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
          /total number of pieces: 6\(3x2\)/i,
        );
      });

      it(`does not change total number of pieces when clicking on a set with too big number in the list "recommended number of pieces" that leads into piece's side size being less than 50px`, async () => {
        renderIntoDocumentBody(<App />);
        const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar();

        await userEvent.click(within(dialog).getByRole("button", { name: /1000 pieces/i }));

        expect(within(dialog).getByText(/side size of single piece:/i)).toHaveTextContent(
          /side size of single piece: 50px \(min 50px\)/i,
        );
      });
    });

    describe.skip("selected area", () => {
      describe("control points", () => {
        describe("corner control points", () => {
          describe("top left corner control point", () => {
            it(`descreases size of the selected area when moves top-left corner control point`, async () => {
              const user = userEvent;
              renderIntoDocumentBody(<App />);
              const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
              const controlPointElement = within(dialog).getByRole("button", {
                name: /top left corner control point/i,
              });
              await mockSelectionAreaForManipulation(dialog);
              await mockControlPointForSelectedAreaManipulation(controlPointElement, {
                x: 0,
                y: 0,
                width: 20,
                height: 20,
              });

              dragAndDropControlPoint(controlPointElement, { clientX: 1920 / 2, clientY: 0 });

              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 56\(7x8\)/i,
              );
            });
            it(`increases size of the selected area when moves top-left corner control point`, async () => {
              const user = userEvent;
              renderIntoDocumentBody(<App />);
              const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
              const controlPointElement = within(dialog).getByRole("button", {
                name: /top left corner control point/i,
              });
              await mockSelectionAreaForManipulation(dialog);
              await mockControlPointForSelectedAreaManipulation(controlPointElement, {
                x: 0,
                y: 0,
                width: 20,
                height: 20,
              });
              dragAndDropControlPoint(controlPointElement, { clientX: 1920 / 2, clientY: 0 });
              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 56\(7x8\)/i,
              );

              dragAndDropControlPoint(controlPointElement, { clientX: 1920 / 4, clientY: 0 });

              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 35\(7x5\)/i,
              );
            });
          });

          describe("top right corner control point", () => {
            it(`descreases size of the selected area when moves top-right corner control point`, async () => {
              const user = userEvent;
              renderIntoDocumentBody(<App />);
              const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
              const controlPointElement = within(dialog).getByRole("button", {
                name: /top right corner control point/i,
              });
              await mockSelectionAreaForManipulation(dialog);
              await mockControlPointForSelectedAreaManipulation(controlPointElement, {
                x: 1920,
                y: 0,
                width: 20,
                height: 20,
              });

              dragAndDropControlPoint(controlPointElement, { clientX: 1920 / 2, clientY: 0 });

              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 49\(7x7\)/i,
              );
            });

            it(`increases size of the selected area when moves top-right corner control point`, async () => {
              const user = userEvent;
              renderIntoDocumentBody(<App />);
              const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
              const controlPointElement = within(dialog).getByRole("button", {
                name: /top right corner control point/i,
              });
              await mockSelectionAreaForManipulation(dialog);
              await mockControlPointForSelectedAreaManipulation(controlPointElement, {
                x: 1920,
                y: 0,
                width: 20,
                height: 20,
              });
              dragAndDropControlPoint(controlPointElement, { clientX: 1920 / 2, clientY: 0 });
              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 49\(7x7\)/i,
              );

              dragAndDropControlPoint(controlPointElement, { clientX: 1920 / 2 + 1920 / 4, clientY: 0 });

              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 35\(7x5\)/i,
              );
            });
          });

          describe("bottom right corner control point", () => {
            it(`descreases size of the selected area when moves bottom-right corner control point`, async () => {
              const user = userEvent;
              renderIntoDocumentBody(<App />);
              const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
              const controlPointElement = within(dialog).getByRole("button", {
                name: /bottom right corner control point/i,
              });
              await mockSelectionAreaForManipulation(dialog);
              await mockControlPointForSelectedAreaManipulation(controlPointElement, {
                x: 1920,
                y: 1080,
                width: 20,
                height: 20,
              });

              dragAndDropControlPoint(controlPointElement, { clientX: 1920 / 2, clientY: 1080 });

              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 49\(7x7\)/i,
              );
            });

            it(`increases size of the selected area when moves bottom-right corner control point`, async () => {
              const user = userEvent;
              renderIntoDocumentBody(<App />);
              const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
              const controlPointElement = within(dialog).getByRole("button", {
                name: /bottom right corner control point/i,
              });
              await mockSelectionAreaForManipulation(dialog);
              await mockControlPointForSelectedAreaManipulation(controlPointElement, {
                x: 1920,
                y: 1080,
                width: 20,
                height: 20,
              });
              dragAndDropControlPoint(controlPointElement, { clientX: 1920 / 2, clientY: 1080 });
              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 49\(7x7\)/i,
              );

              dragAndDropControlPoint(controlPointElement, { clientX: 1920 / 2 + 1920 / 4, clientY: 1080 });

              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 35\(7x5\)/i,
              );
            });
          });

          describe("bottom left corner control point", () => {
            it(`descreases size of the selected area when moves bottom-left corner control point`, async () => {
              const user = userEvent;
              renderIntoDocumentBody(<App />);
              const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
              const controlPointElement = within(dialog).getByRole("button", {
                name: /bottom left corner control point/i,
              });
              await mockSelectionAreaForManipulation(dialog);
              await mockControlPointForSelectedAreaManipulation(controlPointElement, {
                x: 0,
                y: 1080,
                width: 20,
                height: 20,
              });

              dragAndDropControlPoint(controlPointElement, { clientX: 1920 / 2, clientY: 1080 });

              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 56\(7x8\)/i,
              );
            });
            it(`increases size of the selected area when moves bottom-left corner control point`, async () => {
              const user = userEvent;
              renderIntoDocumentBody(<App />);
              const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
              const controlPointElement = within(dialog).getByRole("button", {
                name: /bottom left corner control point/i,
              });
              await mockSelectionAreaForManipulation(dialog);
              await mockControlPointForSelectedAreaManipulation(controlPointElement, {
                x: 0,
                y: 1080,
                width: 20,
                height: 20,
              });
              dragAndDropControlPoint(controlPointElement, { clientX: 1920 / 2, clientY: 1080 });
              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 56\(7x8\)/i,
              );

              dragAndDropControlPoint(controlPointElement, { clientX: 1920 / 4, clientY: 1080 });

              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 35\(7x5\)/i,
              );
            });
          });
        });

        describe("side control points", () => {
          describe("top side control point", () => {
            it(`descreases size of the selected area when moves top side control point`, async () => {
              const user = userEvent;
              renderIntoDocumentBody(<App />);
              const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
              const controlPointElement = within(dialog).getByRole("button", { name: /top side control point/i });
              await mockSelectionAreaForManipulation(dialog);
              await mockControlPointForSelectedAreaManipulation(controlPointElement, {
                x: 0,
                y: 0,
                width: 32,
                height: 32,
              });

              dragAndDropControlPoint(controlPointElement, { clientX: 0, clientY: 1080 / 2 });

              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 56\(14x4\)/i,
              );
            });

            it(`increases size of the selected area when moves top side control point`, async () => {
              const user = userEvent;
              renderIntoDocumentBody(<App />);
              const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
              const controlPointElement = within(dialog).getByRole("button", { name: /top side control point/i });
              await mockSelectionAreaForManipulation(dialog);
              await mockControlPointForSelectedAreaManipulation(controlPointElement, {
                x: 0,
                y: 0,
                width: 32,
                height: 32,
              });
              dragAndDropControlPoint(controlPointElement, { clientX: 0, clientY: 1080 / 2 });
              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 56\(14x4\)/i,
              );

              dragAndDropControlPoint(controlPointElement, { clientX: 0, clientY: 1080 / 4 });

              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 36\(9x4\)/i,
              );
            });
          });

          describe("right side control", () => {
            it(`descreases size of the selected area when moves right side control point`, async () => {
              const user = userEvent;
              renderIntoDocumentBody(<App />);
              const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
              const controlPointElement = within(dialog).getByRole("button", { name: /right side control point/i });
              await mockSelectionAreaForManipulation(dialog);
              await mockControlPointForSelectedAreaManipulation(controlPointElement, {
                x: 1920,
                y: 0,
                width: 32,
                height: 32,
              });

              dragAndDropControlPoint(controlPointElement, { clientX: 1920 / 2, clientY: 0 });

              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 49\(7x7\)/i,
              );
            });

            it(`increases size of the selected area when moves right side control point`, async () => {
              const user = userEvent;
              renderIntoDocumentBody(<App />);
              const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
              const controlPointElement = within(dialog).getByRole("button", { name: /right side control point/i });
              await mockSelectionAreaForManipulation(dialog);
              await mockControlPointForSelectedAreaManipulation(controlPointElement, {
                x: 1920,
                y: 0,
                width: 32,
                height: 32,
              });
              dragAndDropControlPoint(controlPointElement, { clientX: 1920 / 2, clientY: 0 });
              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 49\(7x7\)/i,
              );

              dragAndDropControlPoint(controlPointElement, { clientX: 1920 / 2 + 1920 / 4, clientY: 0 });

              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 35\(7x5\)/i,
              );
            });
          });

          describe("bottom side control", () => {
            it(`descreases size of the selected area when moves bottom side control point`, async () => {
              const user = userEvent;
              renderIntoDocumentBody(<App />);
              const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
              const controlPointElement = within(dialog).getByRole("button", { name: /bottom side control point/i });
              await mockSelectionAreaForManipulation(dialog);
              await mockControlPointForSelectedAreaManipulation(controlPointElement, {
                x: 0,
                y: 1080,
                width: 32,
                height: 32,
              });

              dragAndDropControlPoint(controlPointElement, { clientX: 0, clientY: 1080 / 2 });

              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 56\(14x4\)/i,
              );
            });

            it(`increases size of the selected area when moves bottom side control point`, async () => {
              const user = userEvent;
              renderIntoDocumentBody(<App />);
              const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
              const controlPointElement = within(dialog).getByRole("button", { name: /bottom side control point/i });
              await mockSelectionAreaForManipulation(dialog);
              await mockControlPointForSelectedAreaManipulation(controlPointElement, {
                x: 0,
                y: 1080,
                width: 32,
                height: 32,
              });
              dragAndDropControlPoint(controlPointElement, { clientX: 0, clientY: 1080 / 2 });
              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 56\(14x4\)/i,
              );

              dragAndDropControlPoint(controlPointElement, { clientX: 0, clientY: 1080 / 2 + 1080 / 4 });

              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 36\(9x4\)/i,
              );
            });
          });

          describe("left side control", () => {
            it(`descreases size of the selected area when moves left side control point`, async () => {
              const user = userEvent;
              renderIntoDocumentBody(<App />);
              const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
              const controlPointElement = within(dialog).getByRole("button", { name: /left side control point/i });
              await mockSelectionAreaForManipulation(dialog);
              await mockControlPointForSelectedAreaManipulation(controlPointElement, {
                x: 0,
                y: 0,
                width: 32,
                height: 32,
              });

              dragAndDropControlPoint(controlPointElement, { clientX: 1920 / 2, clientY: 0 });

              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 56\(7x8\)/i,
              );
            });

            it(`increases size of the selected area when moves left side control point`, async () => {
              const user = userEvent;
              renderIntoDocumentBody(<App />);
              const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
              const controlPointElement = within(dialog).getByRole("button", { name: /left side control point/i });
              await mockSelectionAreaForManipulation(dialog);
              await mockControlPointForSelectedAreaManipulation(controlPointElement, {
                x: 0,
                y: 0,
                width: 32,
                height: 32,
              });
              dragAndDropControlPoint(controlPointElement, { clientX: 1920 / 2, clientY: 0 });
              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 56\(7x8\)/i,
              );

              dragAndDropControlPoint(controlPointElement, { clientX: 1920 / 4, clientY: 0 });

              expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
                /total number of pieces: 35\(7x5\)/i,
              );
            });
          });
        });
      });

      it(`changes positions of selected area control points when moves center control point of selected area`, async () => {
        const user = userEvent;
        const { asFragment } = renderIntoDocumentBody(<App />);
        const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
        const topSide = within(dialog).getByRole("button", { name: /top side control point/i });
        const rightSide = within(dialog).getByRole("button", { name: /right side control point/i });
        const bottomSide = within(dialog).getByRole("button", { name: /bottom side control point/i });
        const leftSide = within(dialog).getByRole("button", { name: /left side control point/i });
        const topLeftCorner = within(dialog).getByRole("button", { name: /top left corner control point/i });
        const topRightCorner = within(dialog).getByRole("button", { name: /top right corner control point/i });
        const bottomRightCorner = within(dialog).getByRole("button", { name: /bottom right corner control point/i });
        const bottomLeftCorner = within(dialog).getByRole("button", { name: /bottom left corner control point/i });
        const centerControlPoint = within(dialog).getByRole("button", { name: /center control point/i });
        await mockSelectionAreaForManipulation(dialog);

        await mockControlPointForSelectedAreaManipulation(topSide, { x: 1920 / 2, y: 0, width: 32, height: 32 });
        await mockControlPointForSelectedAreaManipulation(rightSide, { x: 1920, y: 1080 / 2, width: 32, height: 32 });
        await mockControlPointForSelectedAreaManipulation(bottomSide, { x: 1920 / 2, y: 1080, width: 26, height: 32 });
        await mockControlPointForSelectedAreaManipulation(leftSide, { x: 0, y: 1080 / 2, width: 32, height: 32 });

        await mockControlPointForSelectedAreaManipulation(topLeftCorner, { x: 0, y: 0, width: 20, height: 20 });
        await mockControlPointForSelectedAreaManipulation(topRightCorner, { x: 1920, y: 0, width: 20, height: 20 });
        await mockControlPointForSelectedAreaManipulation(bottomRightCorner, {
          x: 1920,
          y: 1080,
          width: 20,
          height: 20,
        });
        await mockControlPointForSelectedAreaManipulation(bottomLeftCorner, { x: 0, y: 1080, width: 20, height: 20 });

        await mockControlPointForSelectedAreaManipulation(centerControlPoint, {
          x: 1920 / 2,
          y: 1080 / 2,
          width: 26,
          height: 26,
        });

        dragAndDropControlPoint(topLeftCorner, { clientX: 1920 / 4, clientY: 1080 / 4 });
        dragAndDropControlPoint(bottomRightCorner, { clientX: 1920 / 2 + 1920 / 4, clientY: 1080 / 2 + 1080 / 4 });

        const renderBeforeMovementByCenterControlPoint = asFragment();

        dragAndDropControlPoint(centerControlPoint, { clientX: 1920 / 2 + 1920 / 4, clientY: 1080 / 2 + 1080 / 4 });

        expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
          /total number of pieces: 28\(7x4\)/i,
        );

        expect(renderBeforeMovementByCenterControlPoint).toMatchDiffSnapshot(
          asFragment(),
          { aAnnotation: "before", bAnnotation: "after movement" },
          "movement by center control point",
        );
      });

      describe("original image area limits", () => {
        it.skip(`selected area does not move away from "original image area" when central pointer moved`);
        it.skip(`selected area does not overflow "original image area" when area resizes`);
        it.skip(`selected area does not descrease less than minimal size of piece (50x50px)`);
      });

      it.skip(`sets whole area of "the original image area" as selected area when clicking on "reset selected area" button`, async () => {
        const user = userEvent;
        const { asFragment } = renderIntoDocumentBody(<App />);
        const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
        const firstRenderWithUsingOfFullOriginalImageAsSelectedArea = asFragment();
        const topLeftCorner = within(dialog).getByRole("button", { name: /top left corner control point/i });
        await mockSelectionAreaForManipulation(dialog);
        await mockControlPointForSelectedAreaManipulation(topLeftCorner, { x: 0, y: 0, width: 20, height: 20 });
        dragAndDropControlPoint(topLeftCorner, { clientX: 1920 / 2, clientY: 0 });
        expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
          /total number of pieces: 56\(7x8\)/i,
        );

        await userEvent.click(within(dialog).getByRole("button", { name: /reset selected area/i }));

        expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
          /total number of pieces: 28\(7x4\)/i,
        );
        expect(firstRenderWithUsingOfFullOriginalImageAsSelectedArea).toMatchDiffSnapshot(asFragment(), {
          aAnnotation: "initial render",
          bAnnotation: "render after reset",
        });
      });
    });
  });

  describe.skip(`changes image`, () => {
    it(`changes image when drag and drop an image file into browser window`, async () => {
      const user = userEvent;
      renderIntoDocumentBody(<App />);
      const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
      const imageFile = await urlToFile(image250x250Base64, "250x250.png", "image/png");
      const dataTransferItemList = [
        {
          kind: "file",
          type: "image/png",
          getAsFile: () => imageFile,
        },
      ];
      const documentBody = dialog.ownerDocument.body;

      fireEvent.drop(documentBody, { dataTransfer: { items: dataTransferItemList } });

      await waitFor(() => {
        expect(within(dialog).getByRole("img", { name: /preview of the puzzle cut into pieces/i })).toHaveAttribute(
          "src",
          image250x250Base64,
        );
      });
      await isPuzzleCreationDialogOpened({ isShortCheck: false });
    });

    it(`changes image when insert an image file from clipboard (hotkey: ctrl + v) into browser window`, async () => {
      const user = userEvent;
      renderIntoDocumentBody(<App />);
      const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
      const imageFile = await urlToFile(image250x250Base64, "250x250.png", "image/png");
      const dataTransferItemList = [
        {
          kind: "file",
          type: "image/png",
          getAsFile: () => imageFile,
        },
      ];
      const documentBody = dialog.ownerDocument.body;

      fireEvent.paste(documentBody, { clipboardData: { items: dataTransferItemList } });

      await waitFor(() => {
        expect(within(dialog).getByRole("img", { name: /preview of the puzzle cut into pieces/i })).toHaveAttribute(
          "src",
          image250x250Base64,
        );
      });
      await isPuzzleCreationDialogOpened({ isShortCheck: false });
    });
  });
});

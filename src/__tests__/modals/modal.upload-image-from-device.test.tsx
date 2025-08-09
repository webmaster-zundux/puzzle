import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { App } from "../../App";
import { renderIntoDocumentBody } from "../__tests-utils__/renderIntoDocumentBody";
import { urlToFile } from "../../modals/ChangeImageModal/utils/getFileFromBase64";
import * as Challenge from "../../models/Challenge";
import {
  image250x250Base64,
  isSelectingDemoImageDialogOpened,
  isLoadImageFromLinkDialogOpened,
  isPuzzleCreationDialogOpened,
  openUploadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog,
} from "./modal-helpers";

describe(`modal dialog "upload an image from device"`, () => {
  describe(`changes it's visibility state`, () => {
    it(`opens when clicking on "upload an image from device" button in "choose method to create puzzle" dialog`, async () => {
      const { asFragment } = renderIntoDocumentBody(<App />);
      const renderWithoutDialog = asFragment();

      await openUploadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog({
        isShortCheck: false,
      });

      expect(renderWithoutDialog).toMatchDiffSnapshot(
        asFragment(),
        {
          aAnnotation: "without dialog",
          bAnnotation: "with dialog",
        },
        `"upload an image from device" dialog`,
      );
    });

    it("closes when clicking on the dialog backdrop", async () => {
      const { asFragment } = renderIntoDocumentBody(<App />);
      const renderWithoutDialog = asFragment();
      const dialog = await openUploadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();
      const backdrop = within(dialog).getByLabelText(/modal-backdrop/i);
      expect(backdrop).toBeInTheDocument();

      await userEvent.click(backdrop!);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(renderWithoutDialog).toMatchDiffSnapshot(asFragment(), undefined, `without dialog`);
    });

    it('closes when pressing on "esc" key', async () => {
      const { asFragment } = renderIntoDocumentBody(<App />);
      const renderWithoutDialog = asFragment();
      await openUploadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

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
      const initialChallengeSeed = screen.getByRole("note", {
        name: /challenge seed:/i,
      }).textContent;
      expect(initialChallengeSeed).toBe("b47663e4-95ab-4472-9344-0f165a6a7ff9");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      const dialog = await openUploadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

      await userEvent.click(within(dialog).getByRole("button", { name: /close/i }));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(renderWithoutDialog).toMatchDiffSnapshot(asFragment(), undefined, `without dialog`);
      expect(Challenge.generateChallengeId).toHaveBeenCalledOnce();
      const challengeSeedAfterCanceledRestartOfPuzzle = screen.getByRole("note", {
        name: /challenge seed:/i,
      }).textContent;
      expect(challengeSeedAfterCanceledRestartOfPuzzle).toBe(initialChallengeSeed);
    });

    it(`switches to "load an image from a link" dialog when clicking on "load an image from a link" link`, async () => {
      renderIntoDocumentBody(<App />);

      const dialog = await openUploadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();
      await userEvent.click(within(dialog).getByRole("link", { name: /load an image from a link/i }));
      await isLoadImageFromLinkDialogOpened();

      expect(screen.queryByRole("dialog", { name: /upload an image from device/i })).not.toBeInTheDocument();
    });

    it(`switches to "choose a demo image to create a puzzle" dialog when clicking on "demo images" link`, async () => {
      renderIntoDocumentBody(<App />);

      const dialog = await openUploadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();
      await userEvent.click(within(dialog).getByRole("link", { name: /demo images/i }));
      await isSelectingDemoImageDialogOpened();

      expect(screen.queryByRole("dialog", { name: /choose method to create a puzzle/i })).not.toBeInTheDocument();
    });
  });

  describe(`selecting an image from device`, () => {
    it.skip(`switches to "puzzle creation" dialog when clicking on "choose file" button and selecting an image file in the device folder native dialog`, async () => {
      const user = userEvent;
      renderIntoDocumentBody(<App />);
      const dialog = await openUploadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog({
        user,
      });
      const imageFile = await urlToFile(image250x250Base64, "250x250.png", "image/png");
      const input = within(dialog).getByLabelText<HTMLInputElement>(/selected image:/i);

      await user.upload(input, imageFile);

      expect(input.files).toHaveLength(1);
      expect(input.files![0]).toBe(imageFile);
      expect(input.files!.item(0)).toBe(imageFile);
    });

    it(`opens device native "select a file" dialog when clicking on "choose file"`, async () => {
      const user = userEvent;
      renderIntoDocumentBody(<App />);
      const dialog = await openUploadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog({
        user,
      });
      const input = within(dialog).getByLabelText<HTMLInputElement>(/selected image:/i);
      const spyInputOnClick = vi.fn(() => undefined);
      input.addEventListener("click", spyInputOnClick);

      await user.click(input);

      expect(spyInputOnClick).toHaveBeenCalledOnce();
      input.removeEventListener("click", spyInputOnClick);
    });

    it(`opens device native "select a file" dialog when clicking on "click to select an image"`, async () => {
      const user = userEvent;
      renderIntoDocumentBody(<App />);
      const dialog = await openUploadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog({
        user,
      });
      const input = within(dialog).getByLabelText<HTMLInputElement>(/selected image:/i);
      const spyInputOnClick = vi.fn(() => undefined);
      input.addEventListener("click", spyInputOnClick);
      const clickToSelectAnImageButton = within(dialog).getByRole("button", {
        name: /click to select an image or drag and drop an image here or use ctrl \+ v \(to paste an image from clipboard\)/i,
      });

      await user.click(clickToSelectAnImageButton);

      expect(spyInputOnClick).toHaveBeenCalledOnce();
      input.removeEventListener("click", spyInputOnClick);
    });
  });

  describe.skip(`image upload`, () => {
    it(`switches to "puzzle creation" dialog when drag and drop an image file into browser window`, async () => {
      const user = userEvent;
      renderIntoDocumentBody(<App />);
      const dialog = await openUploadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog({
        user,
      });
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
      await isPuzzleCreationDialogOpened({ isShortCheck: true });
    });

    it(`switches to "puzzle creation" dialog when insert an image file from clipboard (hotkey: ctrl + v) into browser window`, async () => {
      const user = userEvent;
      renderIntoDocumentBody(<App />);
      const dialog = await openUploadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog({
        user,
      });
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
      await isPuzzleCreationDialogOpened({ isShortCheck: true });
    });
  });
});

import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { App } from "../../App";
import { urlToFile } from "../../modals/ChangeImageModal/utils/getFileFromBase64";
import * as Challenge from "../../models/Challenge";
import { renderIntoDocumentBody } from "../__tests-utils__/renderIntoDocumentBody";
import {
  image250x250Base64,
  isPuzzleCreationDialogOpened,
  isSelectingDemoImageDialogOpened,
  isUploadImageFromDeviceDialogOpened,
  openUploadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog,
} from "./modal-helpers";

import * as loadImageFromUrlOnTheSameDomainModule from "../../utils/loadImageFromUrlOnTheSameDomain";

describe(`modal dialog "load an image from a link"`, () => {
  describe(`changes it's visibility state`, () => {
    it(`opens when clicking on "load an image from a link" button in "choose method to create puzzle" dialog`, async () => {
      const { asFragment } = renderIntoDocumentBody(<App />);
      const renderWithoutDialog = asFragment();

      await openUploadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog({
        isShortCheck: false,
      });

      expect(renderWithoutDialog).toMatchDiffSnapshot(
        asFragment(),
        {
          aAnnotation: "without dialog",
          bAnnotation: "with dialog",
        },
        `"load an image from a link" dialog`,
      );
    });

    it("closes when clicking on the dialog backdrop", async () => {
      const { asFragment } = renderIntoDocumentBody(<App />);
      const renderWithoutDialog = asFragment();
      const dialog = await openUploadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();
      const backdrop = within(dialog).getByLabelText(/modal-backdrop/i);
      expect(backdrop).toBeInTheDocument();

      await userEvent.click(backdrop!);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(renderWithoutDialog).toMatchDiffSnapshot(asFragment(), undefined, `without dialog`);
    });

    it('closes when pressing on "esc" key', async () => {
      const { asFragment } = renderIntoDocumentBody(<App />);
      const renderWithoutDialog = asFragment();
      await openUploadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

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
      const dialog = await openUploadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();

      await userEvent.click(within(dialog).getByRole("button", { name: /close/i }));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(renderWithoutDialog).toMatchDiffSnapshot(asFragment(), undefined, `without dialog`);
      expect(Challenge.generateChallengeId).toHaveBeenCalledOnce();
      const challengeSeedAfterCanceledRestartOfPuzzle = screen.getByRole("note", {
        name: /challenge seed:/i,
      }).textContent;
      expect(challengeSeedAfterCanceledRestartOfPuzzle).toBe(initialChallengeSeed);
    });

    it(`switches to "load an image from device" dialog when clicking on "load an image from device" link`, async () => {
      renderIntoDocumentBody(<App />);

      const dialog = await openUploadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();
      await userEvent.click(within(dialog).getByRole("link", { name: /load an image from device/i }));
      await isUploadImageFromDeviceDialogOpened();

      expect(screen.queryByRole("dialog", { name: /load an image from a link/i })).not.toBeInTheDocument();
    });

    it(`switches to "choose a demo image to create a puzzle" dialog when clicking on "demo images" link`, async () => {
      renderIntoDocumentBody(<App />);

      const dialog = await openUploadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog();
      await userEvent.click(within(dialog).getByRole("link", { name: /demo images/i }));
      await isSelectingDemoImageDialogOpened();

      expect(screen.queryByRole("dialog", { name: /choose method to create a puzzle/i })).not.toBeInTheDocument();
    });
  });

  describe.skip(`inserting an image link`, () => {
    it(`switches to "puzzle creation" dialog when inserting a link into the related text field and pressing "load image" button`, async () => {
      const user = userEvent;
      renderIntoDocumentBody(<App />);
      const dialog = await openUploadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog({
        user,
      });
      const inputElement = within(dialog).getByRole<HTMLInputElement>("textbox", { name: /image-link/i });
      const imageLink = "http://localhost:8000/250x250.png";
      vi.spyOn(loadImageFromUrlOnTheSameDomainModule, "loadImageFromUrlOnTheSameDomain").mockImplementationOnce(
        (imageSrc) => {
          const image = new Image(250, 250);
          image.src = imageSrc;
          return Promise.resolve(image);
        },
      );

      await user.click(inputElement);
      fireEvent.change(inputElement, { target: { value: imageLink } });
      await waitFor(() => {
        expect(inputElement).toHaveValue(imageLink);
      });
      await user.click(within(dialog).getByRole("button", { name: /load image/i }));

      await waitFor(() => {
        expect(within(dialog).getByRole("img", { name: /preview of the puzzle cut into pieces/i })).toHaveAttribute(
          "src",
          imageLink,
        );
      });
      await isPuzzleCreationDialogOpened({ isShortCheck: true });
    });

    it(`switches to "puzzle creation" dialog when typing a link in the related text field and pressing "load image" button`, async () => {
      const user = userEvent;
      renderIntoDocumentBody(<App />);
      const dialog = await openUploadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog({
        user,
      });
      const inputElement = within(dialog).getByRole("textbox", { name: /image-link/i });
      const imageLink = "http://localhost:8000/250x250.png";
      vi.spyOn(loadImageFromUrlOnTheSameDomainModule, "loadImageFromUrlOnTheSameDomain").mockImplementationOnce(
        (imageSrc) => {
          const image = new Image(250, 250);
          image.src = imageSrc;
          return Promise.resolve(image);
        },
      );

      await user.click(inputElement);
      await user.type(inputElement, imageLink);
      await waitFor(() => {
        expect(inputElement).toHaveValue(imageLink);
      });
      await user.click(within(dialog).getByRole("button", { name: /load image/i }));

      await waitFor(() => {
        expect(within(dialog).getByRole("img", { name: /preview of the puzzle cut into pieces/i })).toHaveAttribute(
          "src",
          imageLink,
        );
      });
      await isPuzzleCreationDialogOpened({ isShortCheck: true });
    });
  });

  describe.skip(`image upload`, () => {
    it(`switches to "puzzle creation" dialog when drag and drop an image file into browser window`, async () => {
      const user = userEvent;
      renderIntoDocumentBody(<App />);
      const dialog = await openUploadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog({
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
      const dialog = await openUploadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog({
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

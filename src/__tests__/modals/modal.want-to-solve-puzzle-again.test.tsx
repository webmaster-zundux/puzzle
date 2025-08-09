import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { App } from "../../App";
import * as Challenge from "../../models/Challenge";
import { renderIntoDocumentBody } from "../__tests-utils__/renderIntoDocumentBody";
import {
  isSolvePuzzleAgainDialogOpened,
  openSolvePuzzleAgainDialogByClickOnSolvePuzzleAgainButtonInSidebar,
} from "./modal-helpers";

describe(`modal dialog "want to solve the puzzle again"`, () => {
  describe(`changes it's visibility state`, () => {
    it(`opens when clicking on "restart puzzle" button in the sidebar`, async () => {
      const user = userEvent;
      renderIntoDocumentBody(<App />);
      const sidebar = screen.getByRole("complementary", { name: /sidebar/i });
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      await user.click(screen.getByRole("application", { name: /puzzle view/i }));
      await waitFor(() => {
        expect(within(sidebar).getByRole("button", { name: /restart puzzle/i })).toBeEnabled();
      });

      await user.click(within(sidebar).getByRole("button", { name: /restart puzzle/i }));

      await isSolvePuzzleAgainDialogOpened({ isShortCheck: false });
    });

    it(`opens when clicking on "solve puzzle again" button in the sidebar`, async () => {
      renderIntoDocumentBody(<App />);

      await openSolvePuzzleAgainDialogByClickOnSolvePuzzleAgainButtonInSidebar({ isShortCheck: false });
    });

    it("closes when clicking on the dialog backdrop", async () => {
      const user = userEvent;
      const { asFragment } = renderIntoDocumentBody(<App />);
      const renderWithoutDialog = asFragment();
      const dialog = await openSolvePuzzleAgainDialogByClickOnSolvePuzzleAgainButtonInSidebar();
      const backdrop = within(dialog).getByLabelText(/modal-backdrop/i);
      expect(backdrop).toBeInTheDocument();

      await user.click(backdrop);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(renderWithoutDialog).toMatchDiffSnapshot(asFragment(), undefined, `without dialog`);
    });

    it('closes when pressing on "esc" key', async () => {
      const user = userEvent;
      renderIntoDocumentBody(<App />);
      await openSolvePuzzleAgainDialogByClickOnSolvePuzzleAgainButtonInSidebar();

      await user.keyboard("{Escape}");

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it('closes when clicking on "cancel" button', async () => {
      const user = userEvent;
      vi.spyOn(Challenge, "generateChallengeId")
        .mockImplementationOnce(() => "b47663e4-95ab-4472-9344-0f165a6a7ff9")
        .mockImplementationOnce(() => "89e80c0c-186a-46db-b242-b147c88a2a3e");
      renderIntoDocumentBody(<App />);
      expect(Challenge.generateChallengeId).toHaveBeenCalledOnce();
      const initialChallengeSeed = screen.getByRole("note", { name: /challenge seed:/i }).textContent;
      expect(initialChallengeSeed).toBe("b47663e4-95ab-4472-9344-0f165a6a7ff9");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      const dialog = await openSolvePuzzleAgainDialogByClickOnSolvePuzzleAgainButtonInSidebar({ user });

      await user.click(within(dialog).getByRole("button", { name: /cancel/i }));

      expect(Challenge.generateChallengeId).toHaveBeenCalledOnce();
      expect(screen.queryByRole("dialog", { name: /want to solve the puzzle again\?/i })).not.toBeInTheDocument();
      const challengeSeedAfterCanceledRestartOfPuzzle = screen.getByRole("note", {
        name: /challenge seed:/i,
      }).textContent;
      expect(challengeSeedAfterCanceledRestartOfPuzzle).toBe(initialChallengeSeed);
    });

    it('closes and creates a new puzzle challenge (changes only pieces positions and the cutting of the pieces) when clicking on "solve again" button in the dialog', async () => {
      const user = userEvent;
      vi.spyOn(Challenge, "generateChallengeId")
        .mockImplementationOnce(() => "b47663e4-95ab-4472-9344-0f165a6a7ff9")
        .mockImplementationOnce(() => "89e80c0c-186a-46db-b242-b147c88a2a3e");
      const { asFragment } = renderIntoDocumentBody(<App />);
      const firstRenderWithoutDialog = asFragment();
      const initialChallengeSeed = screen.getByRole("note", { name: /challenge seed:/i }).textContent;
      expect(Challenge.generateChallengeId).toHaveBeenCalledOnce();
      expect(initialChallengeSeed).toBe("b47663e4-95ab-4472-9344-0f165a6a7ff9");
      const dialog = await openSolvePuzzleAgainDialogByClickOnSolvePuzzleAgainButtonInSidebar({ user });

      await user.click(within(dialog).getByRole("button", { name: /solve again/i }));

      expect(Challenge.generateChallengeId).toHaveBeenCalledTimes(2);
      expect(screen.queryByRole("dialog", { name: /want to solve the puzzle again\?/i })).not.toBeInTheDocument();
      const secondChallengeSeed = screen.getByRole("note", { name: /challenge seed:/i }).textContent;
      expect(secondChallengeSeed).not.toBe(initialChallengeSeed);
      expect(firstRenderWithoutDialog).toMatchDiffSnapshot(asFragment(), undefined, "the second puzzle challenge");
    });
  });
});

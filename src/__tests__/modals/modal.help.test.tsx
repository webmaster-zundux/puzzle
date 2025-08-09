import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { App } from "../../App";
import * as Challenge from "../../models/Challenge";
import { renderIntoDocumentBody } from "../__tests-utils__/renderIntoDocumentBody";
import { openHelpDialogByClickOnHelpButtonInSidebar } from "./modal-helpers";

describe(`"help" dialog`, () => {
  describe(`changes it's visibility state`, () => {
    it(`opens when clicking on "help" button in the sidebar`, async () => {
      const { asFragment } = renderIntoDocumentBody(<App />);
      const renderWithoutDialog = asFragment();

      await openHelpDialogByClickOnHelpButtonInSidebar({ isShortCheck: false });

      expect(renderWithoutDialog).toMatchDiffSnapshot(
        asFragment(),
        { aAnnotation: "without dialog", bAnnotation: "with dialog" },
        `"help" dialog`,
      );
    });

    it("closes when clicking on the dialog backdrop", async () => {
      const { asFragment } = renderIntoDocumentBody(<App />);
      const renderWithoutDialog = asFragment();
      const dialog = await openHelpDialogByClickOnHelpButtonInSidebar();
      const backdrop = within(dialog).getByLabelText(/modal-backdrop/i);
      expect(backdrop).toBeInTheDocument();

      await userEvent.click(backdrop!);

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(renderWithoutDialog).toMatchDiffSnapshot(asFragment(), undefined, `without dialog`);
    });

    it('closes when pressing on "esc" key', async () => {
      const { asFragment } = renderIntoDocumentBody(<App />);
      const renderWithoutDialog = asFragment();
      await openHelpDialogByClickOnHelpButtonInSidebar();

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
      const dialog = await openHelpDialogByClickOnHelpButtonInSidebar();

      await userEvent.click(within(dialog).getByRole("button", { name: /close/i }));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(renderWithoutDialog).toMatchDiffSnapshot(asFragment(), undefined, `without dialog`);
      expect(Challenge.generateChallengeId).toHaveBeenCalledOnce();
      const challengeSeedAfterCanceledRestartOfPuzzle = screen.getByRole("note", {
        name: /challenge seed:/i,
      }).textContent;
      expect(challengeSeedAfterCanceledRestartOfPuzzle).toBe(initialChallengeSeed);
    });
  });
});

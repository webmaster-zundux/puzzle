import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, test, vi } from "vitest";

import { App } from "../App";
import { colord } from "../colord";
import * as Challenge from "../models/Challenge";

describe("sidebar", () => {
  describe("puzzle solving challenge timer", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(async () => {
      vi.clearAllTimers();
      vi.useRealTimers();
    });

    it("starts when clicking on the canvas", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<App />);
      const sidebar = screen.getByRole("complementary", { name: /sidebar/i });
      const timerTickTimeoutMs = 1000;

      await user.click(screen.getByRole("application", { name: /puzzle view/i }));
      await act(async () => {
        vi.advanceTimersByTime(timerTickTimeoutMs);
      });

      expect(within(sidebar).getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:0:01");
    });

    it("updates the puzzle elapsed time every second while the puzzle timer is running", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<App />);
      const timerTickTimeoutMs = 1000;

      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:0:00");
      await user.click(screen.getByRole("application", { name: /puzzle view/i }));

      await act(async () => {
        vi.advanceTimersByTime(timerTickTimeoutMs);
      });
      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:0:01");

      await act(async () => {
        vi.advanceTimersByTime(timerTickTimeoutMs);
      });
      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:0:02");
    });

    it("pauses when an user idles longer than 60 seconds", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<App />);
      const userInactivityTimeoutMs = 60000;

      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:0:00");
      await user.click(screen.getByRole("application", { name: /puzzle view/i }));

      await act(async () => {
        vi.advanceTimersByTime(userInactivityTimeoutMs);
      });
      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:1:00");

      await act(async () => {
        const tenSecondsInMs = 10000;
        vi.advanceTimersByTime(tenSecondsInMs);
      });
      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:1:00");
    });

    it("continues to run when an user becomes active after inactivity", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<App />);
      const timerTickTimeoutMs = 1000;
      const userInactivityTimeoutMs = 60000;

      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:0:00");
      await user.click(screen.getByRole("application", { name: /puzzle view/i }));
      await act(async () => {
        vi.advanceTimersByTime(userInactivityTimeoutMs);
      });
      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:1:00");

      await act(async () => {
        const tenSecondsInMs = 10000;
        vi.advanceTimersByTime(tenSecondsInMs);
      });
      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:1:00");

      await user.click(screen.getByRole("application", { name: /puzzle view/i }));
      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:1:00");

      await act(async () => {
        vi.advanceTimersByTime(timerTickTimeoutMs);
      });
      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:1:01");

      await act(async () => {
        vi.advanceTimersByTime(timerTickTimeoutMs);
      });
      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:1:02");
    });

    it.skip("stops when the puzzle challenge solved");
  });

  describe("challenge progress", () => {
    describe("value", () => {
      test.skip(`value increases when two puzzle's pieces connects`);
      test.skip(`value resets to 0% when a new puzzle created`);
      test.skip(`value equals to 100% when the puzzle challenge solved`);
    });

    describe(`button "restart challenge"`, () => {
      it("becomes enabled when the puzzle was touched", async () => {
        render(<App />);
        const sidebar = screen.getByRole("complementary", { name: /sidebar/i });

        const restartPuzzleButton = within(sidebar).getByRole("button", {
          name: /restart puzzle/i,
        });
        expect(restartPuzzleButton).toBeInTheDocument();
        expect(restartPuzzleButton).toBeDisabled();

        await userEvent.click(screen.getByRole("application", { name: /puzzle view/i }));
        await within(sidebar).findByRole("button", { name: /restart puzzle/i });

        await waitFor(() => {
          expect(within(sidebar).getByRole("button", { name: /restart puzzle/i })).toBeEnabled();
        });
      });

      it("becomes disabled when a new puzzle created", async () => {
        vi.spyOn(Challenge, "generateChallengeId")
          .mockImplementationOnce(() => "b47663e4-95ab-4472-9344-0f165a6a7ff9")
          .mockImplementationOnce(() => "89e80c0c-186a-46db-b242-b147c88a2a3e");

        render(<App />);

        const restartPuzzleButton = screen.getByRole("button", { name: /restart puzzle/i });
        expect(restartPuzzleButton).toBeInTheDocument();
        expect(restartPuzzleButton).toBeDisabled();

        await userEvent.click(screen.getByRole("application", { name: /puzzle view/i }));
        await waitFor(() => {
          expect(screen.getByRole("note", { name: /challenge seed/i })).toHaveTextContent(
            "b47663e4-95ab-4472-9344-0f165a6a7ff9",
          );
        });

        await waitFor(() => {
          expect(screen.getByRole("button", { name: /restart puzzle/i })).toBeEnabled();
        });

        await userEvent.click(screen.getByRole("button", { name: /restart puzzle/i }));
        await screen.findByRole("dialog", { name: /want to solve the puzzle again\?/i });

        const dialog = screen.getByRole("dialog", {
          name: /want to solve the puzzle again\?/i,
        });
        await userEvent.click(within(dialog).getByRole("button", { name: /solve again/i }));
        await waitFor(() => {
          expect(screen.getByRole("note", { name: /challenge seed/i })).toHaveTextContent(
            "89e80c0c-186a-46db-b242-b147c88a2a3e",
          );
        });

        await waitFor(() => {
          expect(screen.getByRole("button", { name: /restart puzzle/i })).toBeDisabled();
        });
      });
    });
  });

  describe("background color selector", () => {
    it("changes the canvas background color when clicking on any not selected color", async () => {
      const { asFragment } = render(<App />);
      const firstRender = asFragment();

      expect(screen.getByRole("main")).toHaveStyle({
        "background-color": colord("darkslategray").toRgbString(),
      });
      await userEvent.click(screen.getByRole("radio", { name: /white/i }));
      await waitFor(() => {
        expect(screen.getByRole("main")).toHaveStyle({
          "background-color": colord("white").toRgbString(),
        });
      });

      expect(screen.getByRole("radio", { name: /dark slate gray/i })).not.toBeChecked();
      expect(screen.getByRole("radio", { name: /white/i })).toBeChecked();
      expect(firstRender).toMatchDiffSnapshot(asFragment());
    });
  });
});

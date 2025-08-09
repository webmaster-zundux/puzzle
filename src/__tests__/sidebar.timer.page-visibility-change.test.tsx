import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, vi } from "vitest";

import { App } from "../App";

describe("sidebar", () => {
  describe("puzzle solving challenge timer", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(async () => {
      vi.clearAllTimers();
    });

    it.sequential("pauses when an user hides the page", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);
      const timerTickTimeoutMs = 1000;

      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:0:00");
      await user.click(screen.getByRole("application", { name: /puzzle view/i }));
      await act(async () => {
        vi.advanceTimersByTime(timerTickTimeoutMs);
      });
      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:0:01");

      Object.defineProperty(container.ownerDocument, "visibilityState", {
        value: "hidden",
        writable: true,
      });
      fireEvent(container.ownerDocument, new Event("visibilitychange"));
      await act(async () => {
        const tenSecondsInMs = 10000;
        vi.advanceTimersByTime(tenSecondsInMs);
      });

      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:0:01");

      Object.defineProperty(container.ownerDocument, "visibilityState", {
        value: "visible",
        writable: true,
      });
    });

    it.sequential("continues when an user focuses on the page after the page was hidden", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { container } = render(<App />);
      const timerTickTimeoutMs = 1000;

      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:0:00");
      await user.click(screen.getByRole("application", { name: /puzzle view/i }));
      await act(async () => {
        vi.advanceTimersByTime(timerTickTimeoutMs);
      });
      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:0:01");

      Object.defineProperty(container.ownerDocument, "visibilityState", {
        value: "hidden",
        writable: true,
      });
      fireEvent(container.ownerDocument, new Event("visibilitychange"));
      await act(async () => {
        const tenSecondsInMs = 10000;
        vi.advanceTimersByTime(tenSecondsInMs);
      });
      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:0:01");

      Object.defineProperty(container.ownerDocument, "visibilityState", {
        value: "visible",
        writable: true,
      });
      fireEvent(container.ownerDocument, new Event("visibilitychange"));
      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:0:01");
      await act(async () => {
        vi.advanceTimersByTime(timerTickTimeoutMs);
      });

      expect(screen.getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:0:02");
    });
  });
});

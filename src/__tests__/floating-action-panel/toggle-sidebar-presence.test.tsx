import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../../App";

describe("floating action panel", () => {
  describe(`toggle sidebar presence`, () => {
    it(`hides the sidebar when clicking on "hide side panel" button`, async () => {
      const { asFragment } = render(<App />);
      const visibleSidebarRender = asFragment();

      await userEvent.click(screen.getByRole("button", { name: /hide side panel/i }));
      await waitFor(() => {
        expect(screen.queryByRole("complementary", { name: /sidebar/i })).not.toBeInTheDocument();
      });

      const hiddenSidebarRender = asFragment();
      expect(screen.queryByRole("button", { name: /hide side panel/i })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: /show side panel/i })).toBeInTheDocument();
      expect(visibleSidebarRender).toMatchDiffSnapshot(
        hiddenSidebarRender,
        { aAnnotation: "with visible sidebar", bAnnotation: "with hidden sidebar" },
        `hidden sidebar`,
      );
    });

    it(`shows the sidebar when clicking on "show side panel" button`, async () => {
      const { asFragment } = render(<App />);
      const initialSidebarRender = asFragment();

      await userEvent.click(screen.getByRole("button", { name: /hide side panel/i }));
      await waitForElementToBeRemoved(() => screen.queryByRole("complementary", { name: /sidebar/i }));
      const hiddenSidebarRender = asFragment();

      await userEvent.click(screen.getByRole("button", { name: /show side panel/i }));
      await screen.findByRole("complementary", { name: /sidebar/i });

      const visibleSidebarRender = asFragment();
      expect(screen.getByRole("button", { name: /hide side panel/i })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /show side panel/i })).not.toBeInTheDocument();
      expect(hiddenSidebarRender).toMatchDiffSnapshot(
        visibleSidebarRender,
        { aAnnotation: "with hidden sidebar", bAnnotation: "with visible sidebar" },
        `visible sidebar`,
      );
      expect(initialSidebarRender).toMatchDiffSnapshot(
        visibleSidebarRender,
        {
          aAnnotation: "initial render with visible sidebar",
          bAnnotation: "shown again sidebar",
        },
        `initial and shown again sidebar renders`,
      );
    });
  });
});

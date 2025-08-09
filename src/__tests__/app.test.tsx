import { render, screen, within } from "@testing-library/react";
import { App } from "../App";
import { colord } from "../colord";
import { expect, test, describe } from "vitest";

test("test", () => {
  expect(typeof window).not.toBe("undefined");
});

describe("demo puzzle", () => {
  test("app starts with the demo puzzle", async () => {
    render(<App />);

    expect(screen.getByRole("main")).toHaveStyle({
      "background-color": colord("darkslategray").toRgbString(),
    });

    expect(screen.getByRole("application", { name: /puzzle view/i })).toBeInTheDocument();

    expect(screen.getByRole("note", { name: /zoom/i })).toBeInTheDocument();
    expect(screen.getByRole("note", { name: /zoom/i })).toHaveTextContent("1.00x");

    const puzzleControls = screen.getByRole("toolbar", { name: /puzzle controls/i });
    expect(puzzleControls).toBeInTheDocument();
    expect(within(puzzleControls).getAllByRole("button").length).toBe(6);
    expect(within(puzzleControls).getByRole("button", { name: /show all pieces/i })).toBeInTheDocument();
    expect(within(puzzleControls).getByRole("button", { name: /reset zoom/i })).toBeInTheDocument();
    expect(within(puzzleControls).getByRole("button", { name: /zoom out/i })).toBeInTheDocument();
    expect(within(puzzleControls).getByRole("button", { name: /zoom in/i })).toBeInTheDocument();
    expect(within(puzzleControls).getByRole("button", { name: /enter full screen/i })).toBeInTheDocument();
    expect(within(puzzleControls).queryByRole("button", { name: /exit full screen/i })).not.toBeInTheDocument();
    expect(within(puzzleControls).getByRole("button", { name: /hide side panel/i })).toBeInTheDocument();
    expect(within(puzzleControls).queryByRole("button", { name: /show side panel/i })).not.toBeInTheDocument();

    const sidebar = screen.getByRole("complementary", { name: /sidebar/i });
    expect(sidebar).toBeInTheDocument();

    expect(within(sidebar).getByTitle("puzzle preview")).toBeInTheDocument();
    expect(within(sidebar).getByText("28 pieces (7x4)")).toBeInTheDocument();

    expect(within(sidebar).getByRole("note", { name: "elapsed time" })).toHaveTextContent("Time:0:00");
    expect(within(sidebar).getByRole("note", { name: "challenge progress" })).toHaveTextContent("Progress:0%");
    const restartPuzzleButton = within(sidebar).getByRole("button", {
      name: /restart puzzle/i,
    });
    expect(restartPuzzleButton).toBeInTheDocument();
    expect(restartPuzzleButton).toBeDisabled();

    expect(within(sidebar).getByText("Background color")).toBeInTheDocument();
    const backgroundColorSelector = within(sidebar).getByRole("list", {
      name: /background color/i,
    });
    expect(backgroundColorSelector).toBeInTheDocument();
    expect(within(backgroundColorSelector).getAllByRole("radio").length).toBe(7);
    expect(within(sidebar).getByRole("radio", { name: /dark slate gray/i })).toBeChecked();

    expect(within(sidebar).getByText("Solve puzzle again")).toBeInTheDocument();
    expect(within(sidebar).getByText("Change number of pieces")).toBeInTheDocument();
    expect(within(sidebar).getByText("Change image")).toBeInTheDocument();
    expect(within(sidebar).getByText("Change piece shape")).toBeInTheDocument();
    expect(within(sidebar).getByText("Help")).toBeInTheDocument();

    expect(within(sidebar).getByText("Debug Settings")).toBeInTheDocument();

    expect(screen.getByRole("note", { name: /challenge seed:/i })).toHaveTextContent(
      "364bf6d0-6686-4892-be7d-618ac2fcdcc7",
    );
  });
});

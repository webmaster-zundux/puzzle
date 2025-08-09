import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { App } from "../App";
import * as Challenge from "../models/Challenge";
import { Point } from "../models/Point";
import * as getCameraScaleAndCameraPositionToFitAllPiecesOnScreenModule from "../utils-camera/getCameraScaleAndCameraPositionToFitAllPiecesOnScreen";
import * as screenToWorldCoordinatesModule from "../utils-camera/screenToWorldCoordinates";
import * as loadImageFromUrlOnTheSameDomainModule from "../utils/loadImageFromUrlOnTheSameDomain";
import { renderIntoDocumentBody } from "./__tests-utils__/renderIntoDocumentBody";
import {
  dragAndDropPuzzlePiece,
  openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar,
  openSolvePuzzleAgainDialogByClickOnSolvePuzzleAgainButtonInSidebar,
} from "./modals/modal-helpers";

const isCongratulationNotificationDisplaying = async ({ isShortCheck } = { isShortCheck: true }) => {
  await screen.findByRole("alert", { name: /puzzle was solved/i });

  const note = screen.getByRole("note", { name: /puzzle was solved/i });
  expect(note).toBeInTheDocument();
  if (isShortCheck) {
    return note;
  }

  const alert = screen.getByRole("alert", { name: /puzzle was solved/i });
  expect(alert).toHaveTextContent(/Congratulation! Puzzle was solved/i);

  expect(within(note).getByRole("button", { name: /close/i })).toBeInTheDocument();

  return note;
};

const mockSavedPuzzleState = () => {
  const LOCAL_STORAGE_KEY_NAME_PUZZLE_INFORMATION = "puzzleInformation";
  return vi.spyOn(localStorage, "getItem").mockImplementation((key: string) => {
    if (key === LOCAL_STORAGE_KEY_NAME_PUZZLE_INFORMATION) {
      return JSON.stringify({
        name: "puzzle name",
        challengeId: "364bf6d0-6686-4892-be7d-618ac2fcdcc7",
        numberOfPiecesPerWidth: 2,
        numberOfPiecesPerHeight: 1,
        pieceWidth: 50,
        connectionActivationAreaSideSizeFractionFromPieceSideSize: 0.2,
        imageSrc: "/demo-images/demo-image-1920x1080.png",
        imageOriginalSize: { width: 1920, height: 1080 },
        boundaryPoints: {
          tl: { x: 0, y: 0 },
          br: { x: 1914, y: 960 },
        },
        piecesPositions: [
          { id: "piece_0:0", position: { x: 0, y: 0 } },
          { id: "piece_1:0", position: { x: 200, y: 0 } },
        ],
        timeSpent: 0,
        pieceSideShapeName: "UNDERGROUND_RIVER_CIRCLE_BOTTOM_IN_ERODED_HILL",
        isSidebarOpen: true,
        canvasBackgroundColor: "dark-slate-gray",
      });
    }

    return null;
  });
};

const mockLoadedImageInstance = () => {
  vi.spyOn(loadImageFromUrlOnTheSameDomainModule, "loadImageFromUrlOnTheSameDomain").mockImplementation((imageSrc) => {
    console.log("mock loadImageFromUrlOnTheSameDomain", { imageSrc });

    let image;
    if (imageSrc === "/demo-images/demo-image-1920x1080.png") {
      image = new Image(1920, 1080);
    } else {
      image = new Image(250, 250);
    }
    image.src = imageSrc;
    return Promise.resolve(image);
  });
};

const mockCameraPosition = () => {
  vi.spyOn(screenToWorldCoordinatesModule, "screenToWorldCoordinates").mockImplementation(
    (point: Point, scale: number, worldOriginPoint: Point) => {
      console.log("mock screenToWorldCoordinates - params: ", {
        params: { point: point, scale, worldOriginPoint },
        "returns point as is": { x: point.x, y: point.y },
      });
      return point;
    },
  );
};

const mockGetCameraScaleAndCameraPositionToFitAllPiecesOnScreen = () => {
  return vi
    .spyOn(
      getCameraScaleAndCameraPositionToFitAllPiecesOnScreenModule,
      "getCameraScaleAndCameraPositionToFitAllPiecesOnScreen",
    )
    .mockImplementation(() => {
      console.log("mock getCameraScaleAndCameraPositionToFitAllPiecesOnScreen");
      return {
        scale: 1,
        position: new Point(0, 0),
      };
    });
};

const solvePuzzle = async () => {
  const puzzleView = screen.getByRole<HTMLCanvasElement>("application", { name: /puzzle view/i });
  expect(puzzleView).toBeInTheDocument();
  console.log("test-helper call - solvePuzzle", { boundingClientRect: puzzleView.getBoundingClientRect() });

  await dragAndDropPuzzlePiece(puzzleView, { clientX: 200, clientY: 0 }, { clientX: 50, clientY: 0 });
};

const initPuzzle = async () => {
  mockSavedPuzzleState();
  mockLoadedImageInstance();
  mockCameraPosition();
  const spyFitAllPieceOnScreen = mockGetCameraScaleAndCameraPositionToFitAllPiecesOnScreen();
  const { asFragment } = renderIntoDocumentBody(<App />);

  await waitFor(() => {
    expect(spyFitAllPieceOnScreen).toHaveBeenCalledOnce();
  });

  return {
    asFragment,
  };
};

describe(`"congratulation" notification`, () => {
  describe.sequential(`changes it's visibility state`, async () => {
    it("displays when a puzzle becomes solved", async () => {
      const { asFragment } = await initPuzzle();
      const renderWithoutDialog = asFragment();

      await solvePuzzle();

      await isCongratulationNotificationDisplaying({ isShortCheck: false });
      const sidebar = screen.getByRole("complementary", { name: /sidebar/i });
      expect(within(sidebar).getByRole("note", { name: /challenge progress/i })).toHaveTextContent(/progress:100%/i);

      expect(renderWithoutDialog).toMatchDiffSnapshot(
        asFragment(),
        { aAnnotation: "without notification", bAnnotation: "with notification" },
        `"congratulation" notification`,
      );
    });

    it(`hides when clicking on "close" button`, async () => {
      vi.spyOn(Challenge, "generateChallengeId")
        .mockImplementationOnce(() => "b47663e4-95ab-4472-9344-0f165a6a7ff9")
        .mockImplementationOnce(() => "89e80c0c-186a-46db-b242-b147c88a2a3e");
      const { asFragment } = await initPuzzle();
      const renderWithoutAlert = asFragment();
      expect(Challenge.generateChallengeId).not.toHaveBeenCalled();
      const initialChallengeSeed = screen.getByRole("note", { name: /challenge seed:/i }).textContent;
      expect(initialChallengeSeed).toBe("364bf6d0-6686-4892-be7d-618ac2fcdcc7");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      await solvePuzzle();
      const alert = await isCongratulationNotificationDisplaying();

      await userEvent.click(within(alert).getByRole("button", { name: /close/i }));

      const sidebar = screen.getByRole("complementary", { name: /sidebar/i });
      expect(within(sidebar).getByRole("note", { name: /challenge progress/i })).toHaveTextContent(/progress:100%/i);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(renderWithoutAlert).toMatchDiffSnapshot(asFragment(), undefined, `without notification`);
      expect(Challenge.generateChallengeId).not.toHaveBeenCalledOnce();
      const challengeSeedAfterCanceledRestartOfPuzzle = screen.getByRole("note", {
        name: /challenge seed:/i,
      }).textContent;
      expect(challengeSeedAfterCanceledRestartOfPuzzle).toBe(initialChallengeSeed);
    });

    it("hides when a puzzle restarts", async () => {
      const user = userEvent;
      vi.spyOn(Challenge, "generateChallengeId")
        .mockImplementationOnce(() => "b47663e4-95ab-4472-9344-0f165a6a7ff9")
        .mockImplementationOnce(() => "89e80c0c-186a-46db-b242-b147c88a2a3e");
      const { asFragment } = await initPuzzle();
      const renderWithoutDialog = asFragment();
      const initialChallengeSeed = screen.getByRole("note", { name: /challenge seed:/i }).textContent;
      expect(Challenge.generateChallengeId).not.toHaveBeenCalled();
      expect(initialChallengeSeed).toBe("364bf6d0-6686-4892-be7d-618ac2fcdcc7");
      await solvePuzzle();
      await isCongratulationNotificationDisplaying();

      const dialog = await openSolvePuzzleAgainDialogByClickOnSolvePuzzleAgainButtonInSidebar({ user });
      await user.click(within(dialog).getByRole("button", { name: /solve again/i }));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(Challenge.generateChallengeId).toHaveBeenCalledOnce();
      const secondChallengeSeed = screen.getByRole("note", { name: /challenge seed:/i }).textContent;
      expect(secondChallengeSeed).not.toBe(initialChallengeSeed);
      expect(secondChallengeSeed).toBe("b47663e4-95ab-4472-9344-0f165a6a7ff9");
      const sidebar = screen.getByRole("complementary", { name: /sidebar/i });
      expect(within(sidebar).getByRole("note", { name: /challenge progress/i })).toHaveTextContent(/progress:0%/i);

      expect(renderWithoutDialog).toMatchDiffSnapshot(asFragment(), undefined, `without notification`);
    });

    it.skip("hides when a new puzzle creates", async () => {
      const user = userEvent;
      vi.spyOn(Challenge, "generateChallengeId")
        .mockImplementationOnce(() => "b47663e4-95ab-4472-9344-0f165a6a7ff9")
        .mockImplementationOnce(() => "89e80c0c-186a-46db-b242-b147c88a2a3e");
      const { asFragment } = await initPuzzle();
      const renderWithoutDialog = asFragment();
      await solvePuzzle();
      await isCongratulationNotificationDisplaying();

      const dialog = await openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar({ user });
      await user.click(within(dialog).getByRole("button", { name: /create puzzle/i }));

      const sidebar = screen.getByRole("complementary", { name: /sidebar/i });
      expect(within(sidebar).getByRole("note", { name: /challenge progress/i })).toHaveTextContent(/progress:0%/i);

      expect(renderWithoutDialog).toMatchDiffSnapshot(asFragment(), undefined, `without notification`);
    });
  });
});

import { act, fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, vi } from "vitest";
import { MOUSE_BUTTON_CODE_PRESSED_PRIMARY_BUTTON } from "../../constants/MouseButtons";
import type { UserEventOrUserEventFromSetup } from "../__tests-utils__/UserEventOrUserEventFromSetup";

export const image250x250Base64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6BAMAAAB6wkcOAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAADUExURf///6fEG8gAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA2SURBVHja7cGBAAAAAMOg+VNf4AhVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcNUAewwAAbU7lLAAAAAASUVORK5CYII=";

export type HTMLElementRect = { x: number; y: number; width: number; height: number };

export const mockControlPointForSelectedAreaManipulation = async (
  controlPointElement: HTMLElement,
  rect: HTMLElementRect,
) => {
  expect(controlPointElement).toBeInTheDocument();
  vi.spyOn(controlPointElement, "getBoundingClientRect").mockImplementation(() => {
    const { x, y, width, height } = rect;
    return {
      x,
      y,
      width,
      height,
      top: x,
      left: y,
      right: x + width,
      bottom: y + height,
      toJSON: vi.fn(),
    };
  });
};

export const mockSelectionAreaForManipulation = async (dialog: HTMLElement) => {
  const svgElement = within(dialog).getByRole("application", { name: /preview of the puzzle cut into pieces/i });
  vi.spyOn(svgElement, "getBoundingClientRect").mockImplementation(() => {
    const x = 0;
    const y = 0;
    const width = 1920;
    const height = 1080;
    return {
      x,
      y,
      width,
      height,
      top: x,
      left: y,
      right: x + width,
      bottom: y + height,
      toJSON: vi.fn(),
    };
  });
};

export type MousePositionOnScreen = { clientX: number; clientY: number };

export const dragAndDropControlPoint = (controlPoint: HTMLElement, to: MousePositionOnScreen) => {
  fireEvent.mouseDown(controlPoint, { button: MOUSE_BUTTON_CODE_PRESSED_PRIMARY_BUTTON });
  fireEvent.mouseMove(controlPoint, { button: MOUSE_BUTTON_CODE_PRESSED_PRIMARY_BUTTON, ...to });
  fireEvent.mouseUp(controlPoint, { button: MOUSE_BUTTON_CODE_PRESSED_PRIMARY_BUTTON });
};

export const dragAndDropPuzzlePiece = async (
  canvas: HTMLCanvasElement,
  from: MousePositionOnScreen,
  to: MousePositionOnScreen,
) => {
  await act(async () => {
    fireEvent.mouseDown(canvas, { button: MOUSE_BUTTON_CODE_PRESSED_PRIMARY_BUTTON, ...from });
  });
  await act(async () => {
    fireEvent.mouseMove(canvas, { button: MOUSE_BUTTON_CODE_PRESSED_PRIMARY_BUTTON, ...to });
  });
  await act(async () => {
    fireEvent.mouseUp(canvas, { button: MOUSE_BUTTON_CODE_PRESSED_PRIMARY_BUTTON, ...to });
  });
};

export const isPuzzleCreationDialogOpened = async ({ isShortCheck } = { isShortCheck: true }): Promise<HTMLElement> => {
  await screen.findByRole("dialog", { name: /puzzle creation/i });
  await screen.findByRole("heading", { name: /puzzle creation/i });

  const dialog = screen.getByRole("dialog", { name: /puzzle creation/i });
  expect(dialog).toBeInTheDocument();
  if (isShortCheck) {
    return dialog;
  }

  expect(within(dialog).getByLabelText(/modal-backdrop/i)).toBeInTheDocument();
  expect(within(dialog).getByRole("heading", { name: /puzzle creation/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("button", { name: /reset selected area/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("button", { name: /use another image/i })).toBeInTheDocument();
  const createPuzzleButton = within(dialog).getByRole("button", { name: /create puzzle/i });
  expect(createPuzzleButton).toBeInTheDocument();
  await waitFor(() => {
    expect(createPuzzleButton).not.toBeDisabled();
  });

  expect(within(dialog).getByRole("img", { name: /preview of the puzzle cut into pieces/i })).toBeInTheDocument();
  expect(within(dialog).getByText(/available to select area of image/i)).toBeInTheDocument();
  expect(within(dialog).getByRole("img", { name: /selected area border/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("img", { name: /pieces borders/i })).toBeInTheDocument();

  expect(within(dialog).getByRole("button", { name: /top left corner control point/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("button", { name: /top right corner control point/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("button", { name: /bottom right corner control point/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("button", { name: /bottom left corner control point/i })).toBeInTheDocument();

  expect(within(dialog).getByRole("button", { name: /top side control point/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("button", { name: /right side control point/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("button", { name: /bottom side control point/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("button", { name: /left side control point/i })).toBeInTheDocument();

  expect(within(dialog).getByRole("button", { name: /center control point/i })).toBeInTheDocument();

  expect(within(dialog).getByText(/side size of single piece:/i)).toHaveTextContent(
    /side size of single piece: 270px \(min 50px\)/i,
  );
  expect(within(dialog).getByText(/image size:/i)).toHaveTextContent(/image size: 1920x1080px/i);
  expect(within(dialog).getByRole("note", { name: /quick way to change the image/i })).toHaveTextContent(
    "To quick change the image: drag and drop an image here or use ctrl + v (to paste an image from clipboard)",
  );

  expect(within(dialog).getByRole("heading", { name: /piece shape/i })).toBeInTheDocument();
  const availableShapesList = within(dialog).getByRole("list", { name: "available shapes" });
  expect(availableShapesList).toBeInTheDocument();
  expect(within(availableShapesList).getAllByRole("radio").length).toBe(9);
  expect(
    within(availableShapesList).getByRole("radio", { name: /underground river circle bottom in eroded hill/i }),
  ).toBeChecked();

  expect(within(dialog).getByRole("heading", { name: /minimal number of pieces per side/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("spinbutton", { name: /width/i })).toHaveValue(7);
  expect(within(dialog).getByText(/width/i)).toBeInTheDocument();
  expect(within(dialog).getByRole("spinbutton", { name: /height/i })).toHaveValue(4);
  expect(within(dialog).getByText(/height/i)).toBeInTheDocument();

  within(dialog).getByRole("heading", { name: /recommended number of pieces/i });
  const recommendedSizesList = within(dialog).getByRole("list", { name: /recommended sizes/i });
  expect(recommendedSizesList).toBeInTheDocument();
  expect(within(recommendedSizesList).getAllByRole("button", { name: /pieces/i }).length).toBe(12);

  expect(within(dialog).getByRole("note", { name: /total number of pieces:/i })).toHaveTextContent(
    /total number of pieces: 28\(7x4\)/i,
  );

  return dialog;
};

export const openPuzzleCreationDialogByClickOnChangeNumberOfPiecesButtonInSidebar = async (
  options: Partial<{ user: UserEventOrUserEventFromSetup; isShortCheck: boolean }> = {},
) => {
  const defaultOptions = {
    user: userEvent,
    isShortCheck: true,
  };
  const { user, isShortCheck } = {
    ...defaultOptions,
    ...options,
  };

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  const sidebar = screen.getByRole("complementary", { name: /sidebar/i });
  await user.click(within(sidebar).getByRole("button", { name: /change number of pieces/i }));

  return await isPuzzleCreationDialogOpened({ isShortCheck });
};

export const isChooseMethodToCreatePuzzleDialogOpened = async (
  { isShortCheck } = { isShortCheck: true },
): Promise<HTMLElement> => {
  await screen.findByRole("dialog", { name: /choose method to create a puzzle/i });
  await screen.findByRole("heading", { name: /choose method to create a puzzle/i });

  const dialog = screen.getByRole("dialog", { name: /choose method to create a puzzle/i });
  expect(dialog).toBeInTheDocument();
  if (isShortCheck) {
    return dialog;
  }

  expect(within(dialog).getByLabelText(/modal-backdrop/i)).toBeInTheDocument();
  expect(within(dialog).getByRole("heading", { name: /choose method to create a puzzle/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("button", { name: /close/i })).toBeInTheDocument();

  expect(
    within(dialog).getByRole("button", {
      name: /upload an image from device or drag and drop an image here or use ctrl \+ v \(to paste an image from clipboard\)/i,
    }),
  ).toBeInTheDocument();

  expect(within(dialog).getByRole("button", { name: /load an image from a link/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("note", { name: /alternative way to create a puzzle/i })).toHaveTextContent(
    /also you can use demo images/i,
  );
  expect(within(dialog).getByRole("link", { name: /demo images/i })).toHaveTextContent(/demo images/i);

  return dialog;
};

export const openChooseMethodToCreatePuzzleDialogByClickOnChangeImageButtonInSidebar = async (
  options: Partial<{ user: UserEventOrUserEventFromSetup; isShortCheck: boolean }> = {},
) => {
  const defaultOptions = {
    user: userEvent,
    isShortCheck: true,
  };
  const { user, isShortCheck } = {
    ...defaultOptions,
    ...options,
  };

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  const sidebar = screen.getByRole("complementary", { name: /sidebar/i });
  await user.click(within(sidebar).getByRole("button", { name: /change image/i }));

  return await isChooseMethodToCreatePuzzleDialogOpened({ isShortCheck });
};

export const isUploadImageFromDeviceDialogOpened = async (
  { isShortCheck } = { isShortCheck: true },
): Promise<HTMLElement> => {
  await screen.findByRole("dialog", { name: /upload an image from device/i });
  await screen.findByRole("heading", { name: /upload an image from device/i });

  const dialog = screen.getByRole("dialog", { name: /upload an image from device/i });
  expect(dialog).toBeInTheDocument();
  if (isShortCheck) {
    return dialog;
  }

  expect(within(dialog).getByLabelText(/modal-backdrop/i)).toBeInTheDocument();
  expect(within(dialog).getByRole("heading", { name: /upload an image from device/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("button", { name: /close/i })).toBeInTheDocument();

  expect(within(dialog).getByLabelText(/selected image:/i)).toBeInTheDocument();
  expect(
    within(dialog).getByRole("button", {
      name: /click to select an image or drag and drop an image here or use ctrl \+ v \(to paste an image from clipboard\)/i,
    }),
  ).toBeInTheDocument();

  expect(within(dialog).getByRole("link", { name: /load an image from a link/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("link", { name: /demo images/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("note", { name: /alternative way to load an image/i })).toHaveTextContent(
    /also you can load an image from a link or use one of demo images/i,
  );

  return dialog;
};

export const openUploadImageFromDeviceDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog = async (
  options: Partial<{
    user: UserEventOrUserEventFromSetup;
    isShortCheck: boolean;
  }> = {},
) => {
  const defaultOptions = {
    user: userEvent,
    isShortCheck: true,
  };
  const { user, isShortCheck } = {
    ...defaultOptions,
    ...options,
  };

  const chooseMethodToCreatePuzzleDialog =
    await openChooseMethodToCreatePuzzleDialogByClickOnChangeImageButtonInSidebar();
  await user.click(
    within(chooseMethodToCreatePuzzleDialog).getByRole("button", { name: /upload an image from device/i }),
  );
  const dialog = await isUploadImageFromDeviceDialogOpened({ isShortCheck });

  return dialog;
};

export const isLoadImageFromLinkDialogOpened = async (
  { isShortCheck } = { isShortCheck: true },
): Promise<HTMLElement> => {
  await screen.findByRole("dialog", { name: /load an image from a link/i });
  await screen.findByRole("heading", { name: /load an image from a link/i });

  const dialog = screen.getByRole("dialog", { name: /load an image from a link/i });
  expect(dialog).toBeInTheDocument();
  if (isShortCheck) {
    return dialog;
  }

  expect(within(dialog).getByLabelText(/modal-backdrop/i)).toBeInTheDocument();
  expect(within(dialog).getByRole("heading", { name: /load an image from a link/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("button", { name: /close/i })).toBeInTheDocument();

  expect(within(dialog).getByRole("textbox", { name: /image-link/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("button", { name: /load image/i })).toBeInTheDocument();

  expect(within(dialog).getByRole("link", { name: /upload an image from device/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("link", { name: /demo images/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("note", { name: /alternative way to load an image/i })).toHaveTextContent(
    /also you can upload an image from device or use one of demo images/i,
  );

  return dialog;
};

export const openUploadImageFromLinkDialogByClickOnRelatedButtonInChooseMethodToCreatePuzzleDialog = async (
  options: Partial<{
    user: UserEventOrUserEventFromSetup;
    isShortCheck: boolean;
  }> = {},
) => {
  const defaultOptions = {
    user: userEvent,
    isShortCheck: true,
  };
  const { user, isShortCheck } = {
    ...defaultOptions,
    ...options,
  };

  const chooseMethodToCreatePuzzleDialog =
    await openChooseMethodToCreatePuzzleDialogByClickOnChangeImageButtonInSidebar();
  await user.click(
    within(chooseMethodToCreatePuzzleDialog).getByRole("button", { name: /load an image from a link/i }),
  );
  const dialog = await isLoadImageFromLinkDialogOpened({ isShortCheck });

  return dialog;
};

export const isSelectingDemoImageDialogOpened = async (
  { isShortCheck } = { isShortCheck: true },
): Promise<HTMLElement> => {
  await screen.findByRole("dialog", { name: /choose a demo image/i });
  await screen.findByRole("heading", { name: /choose a demo image/i });

  const dialog = screen.getByRole("dialog", { name: /choose a demo image/i });
  expect(dialog).toBeInTheDocument();
  if (isShortCheck) {
    return dialog;
  }

  expect(within(dialog).getByLabelText(/modal-backdrop/i)).toBeInTheDocument();
  expect(within(dialog).getByRole("heading", { name: /choose a demo image/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("button", { name: /close/i })).toBeInTheDocument();

  const demoImageList = within(dialog).getByRole("list");
  expect(demoImageList).toBeInTheDocument();
  expect(within(demoImageList).getAllByRole("listitem").length).toBe(2);
  expect(within(demoImageList).getAllByRole("button").length).toBe(2);
  expect(within(demoImageList).getAllByRole("link").length).toBe(2);

  const firstListItem = within(demoImageList).getAllByRole("listitem")[0];
  expect(firstListItem).toHaveTextContent(/demo image 1920x1080Image link: \/demo-images\/demo-image-1920x1080\.png/i);
  expect(
    within(firstListItem).getByRole("button", { name: /\/demo-images\/demo-image-1920x1080\.png/i }),
  ).toBeInTheDocument();
  expect(
    within(firstListItem).getByRole("img", { name: /\/demo-images\/demo-image-1920x1080\.png/i }),
  ).toBeInTheDocument();
  expect(
    within(firstListItem).getByRole("link", { name: /\/demo-images\/demo-image-1920x1080\.png/i }),
  ).toBeInTheDocument();

  const secondListItem = within(demoImageList).getAllByRole("listitem")[1];
  expect(secondListItem).toHaveTextContent(/demo image 1080x1920Image link: \/demo-images\/demo-image-1080x1920\.png/i);
  expect(
    within(secondListItem).getByRole("button", { name: /\/demo-images\/demo-image-1080x1920\.png/i }),
  ).toBeInTheDocument();
  expect(
    within(secondListItem).getByRole("img", { name: /\/demo-images\/demo-image-1080x1920\.png/i }),
  ).toBeInTheDocument();
  expect(
    within(secondListItem).getByRole("link", { name: /\/demo-images\/demo-image-1080x1920\.png/i }),
  ).toBeInTheDocument();

  expect(within(dialog).getByRole("button", { name: /choose another image/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("button", { name: /use selected image/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("button", { name: /use selected image/i })).toBeDisabled();

  expect(within(dialog).getByRole("link", { name: /upload an image from device/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("link", { name: /load an image from a link/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("note", { name: /alternative way to load an image/i })).toHaveTextContent(
    /also you can upload an image from device or load an image from a link/i,
  );

  return dialog;
};

export const openChooseDemoImageDialogByClickOnRelatedLinkInChooseMethodToCreatePuzzleDialog = async (
  options: Partial<{
    user: UserEventOrUserEventFromSetup;
    isShortCheck: boolean;
  }> = {},
) => {
  const defaultOptions = {
    user: userEvent,
    isShortCheck: true,
  };
  const { user, isShortCheck } = {
    ...defaultOptions,
    ...options,
  };

  const chooseMethodToCreatePuzzleDialog =
    await openChooseMethodToCreatePuzzleDialogByClickOnChangeImageButtonInSidebar();
  await user.click(within(chooseMethodToCreatePuzzleDialog).getByRole("link", { name: /demo images/i }));
  const dialog = await isSelectingDemoImageDialogOpened({ isShortCheck });

  return dialog;
};

export const isHelpDialogOpened = async ({ isShortCheck } = { isShortCheck: true }): Promise<HTMLElement> => {
  await screen.findByRole("dialog", { name: /help/i });
  await screen.findByRole("heading", { name: /help/i });

  const dialog = screen.getByRole("dialog", { name: /help/i });
  expect(dialog).toBeInTheDocument();
  if (isShortCheck) {
    return dialog;
  }

  expect(within(dialog).getByLabelText(/modal-backdrop/i)).toBeInTheDocument();
  expect(within(dialog).getByRole("heading", { name: /help/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("button", { name: /close/i })).toBeInTheDocument();

  expect(within(dialog).getByText(/legend label for screenshot/i)).toBeInTheDocument();
  expect(within(dialog).getByRole("img", { name: /animated puzzle solving gif/i })).toBeInTheDocument();

  return dialog;
};

export const openHelpDialogByClickOnHelpButtonInSidebar = async (
  options: Partial<{
    user: UserEventOrUserEventFromSetup;
    isShortCheck: boolean;
  }> = {},
) => {
  const defaultOptions = {
    user: userEvent,
    isShortCheck: true,
  };
  const { user, isShortCheck } = {
    ...defaultOptions,
    ...options,
  };

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  const sidebar = screen.getByRole("complementary", { name: /sidebar/i });
  await user.click(within(sidebar).getByRole("button", { name: /help/i }));

  return await isHelpDialogOpened({ isShortCheck });
};

export const isSolvePuzzleAgainDialogOpened = async (
  { isShortCheck } = { isShortCheck: true },
): Promise<HTMLElement> => {
  await screen.findByRole("dialog", { name: /want to solve the puzzle again\?/i });

  const dialog = screen.getByRole("dialog", { name: /want to solve the puzzle again\?/i });
  expect(dialog).toBeInTheDocument();
  if (isShortCheck) {
    return dialog;
  }

  expect(within(dialog).getByRole("heading", { name: /want to solve the puzzle again\?/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  expect(within(dialog).getByRole("button", { name: /solve again/i })).toBeInTheDocument();

  return dialog;
};

export const openSolvePuzzleAgainDialogByClickOnSolvePuzzleAgainButtonInSidebar = async (
  options: Partial<{
    user: UserEventOrUserEventFromSetup;
    isShortCheck: boolean;
  }> = {},
): Promise<HTMLElement> => {
  const defaultOptions = {
    user: userEvent,
    isShortCheck: true,
  };
  const { user, isShortCheck } = {
    ...defaultOptions,
    ...options,
  };

  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  const sidebar = screen.getByRole("complementary", { name: /sidebar/i });
  await user.click(within(sidebar).getByRole("button", { name: /solve puzzle again/i }));

  return await isSolvePuzzleAgainDialogOpened({ isShortCheck });
};

export const sleep = (timeoutMs = 0) => new Promise((resolve) => setTimeout(resolve, timeoutMs));

export const changeMinimalNumberPiecesPerWidth = async ({
  dialog,
  piecesPerWidth,
}: {
  dialog: HTMLElement;
  piecesPerWidth: number;
}) => {
  expect(dialog).toBeInTheDocument();
  const widthInputElement = within(dialog).getByRole("spinbutton", { name: /width/i });
  await userEvent.pointer([{ target: widthInputElement, offset: 0, keys: "[MouseLeft>]" }, { offset: 1 }]);
  await userEvent.keyboard(`${piecesPerWidth}`);
  await userEvent.pointer({ keys: "[/MouseLeft]" });

  expect(widthInputElement).toHaveValue(piecesPerWidth);
};

export const changeMinimalNumberPiecesPerHeight = async ({
  dialog,
  piecesPerHeight,
}: {
  dialog: HTMLElement;
  piecesPerHeight: number;
}) => {
  expect(dialog).toBeInTheDocument();
  const widthInputElement = within(dialog).getByRole("spinbutton", { name: /height/i });
  await userEvent.pointer([{ target: widthInputElement, offset: 0, keys: "[MouseLeft>]" }, { offset: 1 }]);
  await userEvent.keyboard(`${piecesPerHeight}`);
  await userEvent.pointer({ keys: "[/MouseLeft]" });

  expect(widthInputElement).toHaveValue(piecesPerHeight);
};

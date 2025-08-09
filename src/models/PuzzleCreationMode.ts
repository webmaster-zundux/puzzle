export const PUZZLE_CREATION_MODES = {
  choosing: undefined,
  uploadFromFile: "upload-image-from-file" as const,
  enterImageUrl: "enter-image-url" as const,
  selectingFromDemoImages: "selectingFromDemoImages" as const,
  previewingImage: "previewing-image" as const,
};

export type PuzzleCreationMode = (typeof PUZZLE_CREATION_MODES)[keyof typeof PUZZLE_CREATION_MODES];

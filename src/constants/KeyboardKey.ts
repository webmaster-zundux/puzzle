export const KeyboardKey = {
  Escape: "Escape" as const,
};

export type KeyboardKey = (typeof KeyboardKey)[keyof typeof KeyboardKey];

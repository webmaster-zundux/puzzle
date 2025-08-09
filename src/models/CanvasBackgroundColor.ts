export const CANVAS_BACKGROUND_COLORS = {
  white: "white",
  "mint-cream": "mint cream",
  teal: "teal",
  "dim-grey": "dim grey",
  "slate-grey": "slate grey",
  "dark-slate-gray": "dark slate gray",
  black: "black",
};

export type CanvasBackgroundColor = keyof typeof CANVAS_BACKGROUND_COLORS;

export const CANVAS_BACKGROUND_COLOR_NAMES_FOR_SCENE_CANVAS = Object.keys(
  CANVAS_BACKGROUND_COLORS,
) as CanvasBackgroundColor[];

export const CANVAS_BACKGROUND_COLORS_CSS_NAMES = {
  white: "white",
  "mint-cream": "mintcream",
  teal: "teal",
  "dim-grey": "dimgrey",
  "slate-grey": "slategrey",
  "dark-slate-gray": "darkslategray",
  black: "black",
};

export const getCssColorNameForCanvasBackgroundColor = (colorName: CanvasBackgroundColor) =>
  CANVAS_BACKGROUND_COLORS_CSS_NAMES[colorName];

export const HIGHLIGHT_COLORS_FOR_CANVAS_BACKGROUND_COLOR: {
  [key in CanvasBackgroundColor]: "white" | "black";
} = {
  white: "black",
  "mint-cream": "black",
  teal: "white",
  "dim-grey": "white",
  "slate-grey": "white",
  "dark-slate-gray": "white",
  black: "white",
};

export const DEFAULT_BACKGROUND_COLOR_NAME_FOR_SCENE_CANVAS: CanvasBackgroundColor = "dark-slate-gray";

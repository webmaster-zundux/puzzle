export const BEVEL_EFFECT_HIGHLIGHT = "highlight" as const;
export const BEVEL_EFFECT_SHADOW = "shadow" as const;

export type BEVEL_EFFECT_TYPE = typeof BEVEL_EFFECT_SHADOW | typeof BEVEL_EFFECT_HIGHLIGHT;

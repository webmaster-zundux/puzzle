export const CANVAS_SCALE_STEP = 0.1;

export const CANVAS_SCALE_MIN = 0.5;
export const CANVAS_SCALE_MAX = 2;

export const CANVAS_SCALE_DEFAULT_VALUE = 1.0;

export const limitScaleByRange = (scale: number, min: number, max: number): number => {
  if (scale < min) {
    return min;
  }

  if (scale > max) {
    return max;
  }

  return scale;
};

export const getNextZoomInValue = (originalScale: number): number => {
  const newScale = parseFloat((originalScale + CANVAS_SCALE_STEP).toFixed(3));

  return limitScaleByRange(newScale, CANVAS_SCALE_MIN, CANVAS_SCALE_MAX);
};

export const getNextZoomOutValue = (originalScale: number): number => {
  const newScale = parseFloat((originalScale - CANVAS_SCALE_STEP).toFixed(3));

  return limitScaleByRange(newScale, CANVAS_SCALE_MIN, CANVAS_SCALE_MAX);
};

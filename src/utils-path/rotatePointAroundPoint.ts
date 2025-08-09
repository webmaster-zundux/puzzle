/**
 * Rotates target point around origin point
 *
 * (sx, sy) - origin point
 *
 * (ex, ey) - target point
 * @param sx number
 * @param sy number
 * @param ex number
 * @param ey number
 * @param angleInDegree number
 * @returns Object {x, y}
 */
export const rotatePointAroundPoint = (sx = 0, sy = 0, ex = 0, ey = 0, angleInDegree = 0) => {
  const angleInRadians = (angleInDegree * Math.PI) / 180;
  const cos = Math.cos(angleInRadians);
  const sin = Math.sin(angleInRadians);

  const nx = cos * (ex - sx) - sin * (ey - sy) + sx;
  const ny = cos * (ey - sy) + sin * (ex - sx) + sy;

  return { x: nx, y: ny };
};

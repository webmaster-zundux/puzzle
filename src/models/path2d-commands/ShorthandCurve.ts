import type { PathDataItem } from "svgo/lib/path";
import { AXIS_X, AXIS_Y } from "../../utils-path/getSideShapes";
import { rotatePointAroundPoint } from "../../utils-path/rotatePointAroundPoint";
import type { IPath2dCommand, MirrorAxis, Path2dCommand, RotationAngle } from "./Path2dCommand";

export class ShorthandCurveRelativeCoordinates implements IPath2dCommand {
  tag = "s" as const;

  constructor(
    public dx2: number,
    public dy2: number,
    public dx: number,
    public dy: number,
  ) {}

  mirror(axis: MirrorAxis): ShorthandCurveRelativeCoordinates {
    let { dx2, dy2, dx, dy } = this;

    if (axis === AXIS_X) {
      dy2 *= -1;
      dy *= -1;
    } else if (axis === AXIS_Y) {
      dx2 *= -1;
      dx *= -1;
    }

    return new ShorthandCurveRelativeCoordinates(dx2, dy2, dx, dy);
  }

  rotate(angleInDegree: RotationAngle): ShorthandCurveRelativeCoordinates {
    const { dx2: sdx2, dy2: sdy2, dx: sdx, dy: sdy } = this;

    const { x: dx2, y: dy2 } = rotatePointAroundPoint(0, 0, sdx2, sdy2, angleInDegree);
    const { x: dx, y: dy } = rotatePointAroundPoint(0, 0, sdx, sdy, angleInDegree);

    return new ShorthandCurveRelativeCoordinates(dx2, dy2, dx, dy);
  }

  scale(scaleX: number, scaleY: number): ShorthandCurveRelativeCoordinates {
    const { dx2: sdx2, dy2: sdy2, dx: sdx, dy: sdy } = this;

    const dx2 = sdx2 * scaleX;
    const dy2 = sdy2 * scaleY;

    const dx = sdx * scaleX;
    const dy = sdy * scaleY;

    return new ShorthandCurveRelativeCoordinates(dx2, dy2, dx, dy);
  }

  moveOnDelta(shiftX: number, shiftY: number): ShorthandCurveRelativeCoordinates {
    const { dx2: sdx2, dy2: sdy2, dx: sdx, dy: sdy } = this;

    const dx2 = sdx2 + shiftX;
    const dy2 = sdy2 + shiftY;

    const dx = sdx + shiftX;
    const dy = sdy + shiftY;

    return new ShorthandCurveRelativeCoordinates(dx2, dy2, dx, dy);
  }

  toPathDataItem(): PathDataItem {
    const { tag, dx2, dy2, dx, dy } = this;

    // `s dx2 dy2, dx dy`
    return {
      command: tag,
      args: [dx2, dy2, dx, dy],
    };
  }

  toString(decimalsAfterPoint = 3) {
    let { tag, dx2, dy2, dx, dy } = this;

    [dx2, dy2, dx, dy] = [dx2, dy2, dx, dy].map((v) => Number.parseFloat(v.toFixed(decimalsAfterPoint)));

    return `${tag} ${dx2} ${dy2}, ${dx} ${dy}`;
  }
}

export class ShorthandCurveAbsoluteCoordinates implements IPath2dCommand {
  tag = "S" as const;

  constructor(
    public x2: number,
    public y2: number,
    public x: number,
    public y: number,
  ) {}

  mirror(axis: MirrorAxis): ShorthandCurveAbsoluteCoordinates {
    let { x2, y2, x, y } = this;

    if (axis === AXIS_X) {
      y2 *= -1;
      y *= -1;
    } else if (axis === AXIS_Y) {
      x2 *= -1;
      x *= -1;
    }

    return new ShorthandCurveAbsoluteCoordinates(x2, y2, x, y);
  }

  rotate(angleInDegree: RotationAngle): ShorthandCurveAbsoluteCoordinates {
    const { x2: sx2, y2: sy2, x: sx, y: sy } = this;

    const { x: x2, y: y2 } = rotatePointAroundPoint(0, 0, sx2, sy2, angleInDegree);
    const { x: x, y: y } = rotatePointAroundPoint(0, 0, sx, sy, angleInDegree);

    return new ShorthandCurveAbsoluteCoordinates(x2, y2, x, y);
  }

  scale(scaleX: number, scaleY: number): ShorthandCurveAbsoluteCoordinates {
    const { x2: sx2, y2: sy2, x: sx, y: sy } = this;

    const x2 = sx2 * scaleX;
    const y2 = sy2 * scaleY;

    const x = sx * scaleX;
    const y = sy * scaleY;

    return new ShorthandCurveAbsoluteCoordinates(x2, y2, x, y);
  }

  moveOnDelta(shiftX: number, shiftY: number): ShorthandCurveAbsoluteCoordinates {
    const { x2: sx2, y2: sy2, x: sx, y: sy } = this;

    const x2 = sx2 + shiftX;
    const y2 = sy2 + shiftY;

    const x = sx + shiftX;
    const y = sy + shiftY;

    return new ShorthandCurveAbsoluteCoordinates(x2, y2, x, y);
  }

  toPathDataItem(): PathDataItem {
    const { tag, x2, y2, x, y } = this;

    // `S x2 y2, x y`
    return {
      command: tag,
      args: [x2, y2, x, y],
    };
  }

  toString(decimalsAfterPoint = 3) {
    let { tag, x2, y2, x, y } = this;

    [x2, y2, x, y] = [x2, y2, x, y].map((v) => Number.parseFloat(v.toFixed(decimalsAfterPoint)));

    return `${tag} ${x2} ${y2}, ${x} ${y}`;
  }
}

export type ShorthandCurve = ShorthandCurveRelativeCoordinates | ShorthandCurveAbsoluteCoordinates;

export function assertIsPath2dCommandShorthandCurve(value: unknown): asserts value is Path2dCommand {
  if (
    !(value instanceof ShorthandCurveRelativeCoordinates) &&
    !(value instanceof ShorthandCurveAbsoluteCoordinates) //
  ) {
    throw TypeError("value is not a Path2d command ShorthandCurve");
  }
}

export function testIsPath2dCommandShorthandCurve(value: unknown): value is Path2dCommand {
  return (
    value instanceof ShorthandCurveRelativeCoordinates || //
    value instanceof ShorthandCurveAbsoluteCoordinates
  );
}

export const createShorthandCurveFromPathDataItem = ({
  command,
  args,
}: {
  command: "s" | "S";
  args: number[];
}): ShorthandCurve => {
  if (command === "s") {
    // `s dx2 dy2, dx dy`
    const [dx2, dy2, dx, dy] = args;

    return new ShorthandCurveRelativeCoordinates(dx2, dy2, dx, dy);
  } else if (command === "S") {
    // `S x2 y2, x y`
    const [x2, y2, x, y] = args;

    return new ShorthandCurveAbsoluteCoordinates(x2, y2, x, y);
  }

  throw new Error("Unknown path 2d command");
};

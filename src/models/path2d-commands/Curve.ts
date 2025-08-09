import type { PathDataItem } from "svgo/lib/path";
import { AXIS_X, AXIS_Y } from "../../utils-path/getSideShapes";
import { rotatePointAroundPoint } from "../../utils-path/rotatePointAroundPoint";
import type { IPath2dCommand, MirrorAxis, Path2dCommand, RotationAngle } from "./Path2dCommand";

export class CurveRelativeCoordinates implements IPath2dCommand {
  tag = "c" as const;

  constructor(
    public dx1: number,
    public dy1: number,
    public dx2: number,
    public dy2: number,
    public dx: number,
    public dy: number,
  ) {}

  mirror(axis: MirrorAxis): CurveRelativeCoordinates {
    let { dx1, dy1, dx2, dy2, dx, dy } = this;

    if (axis === AXIS_X) {
      dy1 *= -1;
      dy2 *= -1;
      dy *= -1;
    } else if (axis === AXIS_Y) {
      dx1 *= -1;
      dx2 *= -1;
      dx *= -1;
    }

    return new CurveRelativeCoordinates(dx1, dy1, dx2, dy2, dx, dy);
  }

  rotate(angleInDegree: RotationAngle): CurveRelativeCoordinates {
    const { dx1: sdx1, dy1: sdy1, dx2: sdx2, dy2: sdy2, dx: sdx, dy: sdy } = this;

    const { x: dx1, y: dy1 } = rotatePointAroundPoint(0, 0, sdx1, sdy1, angleInDegree);
    const { x: dx2, y: dy2 } = rotatePointAroundPoint(0, 0, sdx2, sdy2, angleInDegree);
    const { x: dx, y: dy } = rotatePointAroundPoint(0, 0, sdx, sdy, angleInDegree);

    return new CurveRelativeCoordinates(dx1, dy1, dx2, dy2, dx, dy);
  }

  scale(scaleX: number, scaleY: number): CurveRelativeCoordinates {
    const { dx1: sdx1, dy1: sdy1, dx2: sdx2, dy2: sdy2, dx: sdx, dy: sdy } = this;

    const dx1 = sdx1 * scaleX;
    const dy1 = sdy1 * scaleY;

    const dx2 = sdx2 * scaleX;
    const dy2 = sdy2 * scaleY;

    const dx = sdx * scaleX;
    const dy = sdy * scaleY;

    return new CurveRelativeCoordinates(dx1, dy1, dx2, dy2, dx, dy);
  }

  moveOnDelta(shiftX: number, shiftY: number): CurveRelativeCoordinates {
    const { dx1: sdx1, dy1: sdy1, dx2: sdx2, dy2: sdy2, dx: sdx, dy: sdy } = this;

    const dx1 = sdx1 + shiftX;
    const dy1 = sdy1 + shiftY;

    const dx2 = sdx2 + shiftX;
    const dy2 = sdy2 + shiftY;

    const dx = sdx + shiftX;
    const dy = sdy + shiftY;

    return new CurveRelativeCoordinates(dx1, dy1, dx2, dy2, dx, dy);
  }

  toPathDataItem(): PathDataItem {
    const { tag, dx1, dy1, dx2, dy2, dx, dy } = this;

    // `c dx1 dy1, dx2 dy2, dx dy`
    return {
      command: tag,
      args: [dx1, dy1, dx2, dy2, dx, dy],
    };
  }

  toString(decimalsAfterPoint = 3) {
    let { tag, dx1, dy1, dx2, dy2, dx, dy } = this;

    [dx1, dy1, dx2, dy2, dx, dy] = [dx1, dy1, dx2, dy2, dx, dy].map((v) =>
      Number.parseFloat(v.toFixed(decimalsAfterPoint)),
    );

    return `${tag} ${dx1} ${dy1}, ${dx2} ${dy2}, ${dx} ${dy}`;
  }
}

export class CurveAbsoluteCoordinates implements IPath2dCommand {
  tag = "C" as const;

  constructor(
    public x1: number,
    public y1: number,
    public x2: number,
    public y2: number,
    public x: number,
    public y: number,
  ) {}

  mirror(axis: MirrorAxis): CurveAbsoluteCoordinates {
    let { x1, y1, x2, y2, x, y } = this;

    if (axis === AXIS_X) {
      y1 *= -1;
      y2 *= -1;
      y *= -1;
    } else if (axis === AXIS_Y) {
      x1 *= -1;
      x2 *= -1;
      x *= -1;
    }

    return new CurveAbsoluteCoordinates(x1, y1, x2, y2, x, y);
  }

  rotate(angleInDegree: RotationAngle): CurveAbsoluteCoordinates {
    const { x1: sx1, y1: sy1, x2: sx2, y2: sy2, x: sx, y: sy } = this;

    const { x: x1, y: y1 } = rotatePointAroundPoint(0, 0, sx1, sy1, angleInDegree);
    const { x: x2, y: y2 } = rotatePointAroundPoint(0, 0, sx2, sy2, angleInDegree);
    const { x: x, y: y } = rotatePointAroundPoint(0, 0, sx, sy, angleInDegree);

    return new CurveAbsoluteCoordinates(x1, y1, x2, y2, x, y);
  }

  scale(scaleX: number, scaleY: number): CurveAbsoluteCoordinates {
    const { x1: sx1, y1: sy1, x2: sx2, y2: sy2, x: sx, y: sy } = this;

    const x1 = sx1 * scaleX;
    const y1 = sy1 * scaleY;

    const x2 = sx2 * scaleX;
    const y2 = sy2 * scaleY;

    const x = sx * scaleX;
    const y = sy * scaleY;

    return new CurveAbsoluteCoordinates(x1, y1, x2, y2, x, y);
  }

  moveOnDelta(shiftX: number, shiftY: number): CurveAbsoluteCoordinates {
    const { x1: sx1, y1: sy1, x2: sx2, y2: sy2, x: sx, y: sy } = this;

    const x1 = sx1 + shiftX;
    const y1 = sy1 + shiftY;

    const x2 = sx2 + shiftX;
    const y2 = sy2 + shiftY;

    const x = sx + shiftX;
    const y = sy + shiftY;

    return new CurveAbsoluteCoordinates(x1, y1, x2, y2, x, y);
  }

  toPathDataItem(): PathDataItem {
    const { tag, x1, y1, x2, y2, x, y } = this;

    // `C x1 y1, x2 y2, x y`
    return {
      command: tag,
      args: [x1, y1, x2, y2, x, y],
    };
  }

  toString(decimalsAfterPoint = 3) {
    let { tag, x1, y1, x2, y2, x, y } = this;

    [x1, y1, x2, y2, x, y] = [x1, y1, x2, y2, x, y].map((v) => Number.parseFloat(v.toFixed(decimalsAfterPoint)));

    return `${tag} ${x1} ${y1}, ${x2} ${y2}, ${x} ${y}`;
  }
}

export type Curve = CurveRelativeCoordinates | CurveAbsoluteCoordinates;

export function assertIsPath2dCommandCurve(value: unknown): asserts value is Path2dCommand {
  if (
    !(value instanceof CurveRelativeCoordinates) &&
    !(value instanceof CurveAbsoluteCoordinates) //
  ) {
    throw TypeError("value is not a Path2d command Curve");
  }
}

export function testIsPath2dCommandCurve(value: unknown): value is Path2dCommand {
  return (
    value instanceof CurveRelativeCoordinates || //
    value instanceof CurveAbsoluteCoordinates
  );
}

export const createCurveFromPathDataItem = ({ command, args }: { command: "c" | "C"; args: number[] }): Curve => {
  if (command === "c") {
    // `c dx1 dy1, dx2 dy2, dx dy`
    const [dx1, dy1, dx2, dy2, dx, dy] = args;

    return new CurveRelativeCoordinates(dx1, dy1, dx2, dy2, dx, dy);
  } else if (command === "C") {
    // `C x1 y1, x2 y2, x y`
    const [x1, y1, x2, y2, x, y] = args;

    return new CurveAbsoluteCoordinates(x1, y1, x2, y2, x, y);
  }

  throw new Error("Unknown path 2d command");
};

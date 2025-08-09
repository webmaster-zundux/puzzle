import type { PathDataItem } from "svgo/lib/path";
import { AXIS_X, AXIS_Y } from "../../utils-path/getSideShapes";
import { rotatePointAroundPoint } from "../../utils-path/rotatePointAroundPoint";
import type { IPath2dCommand, MirrorAxis, Path2dCommand, RotationAngle } from "./Path2dCommand";

export class QuadraticCurveRelativeCoordinates implements IPath2dCommand {
  tag = "q" as const;

  constructor(
    public dx1: number,
    public dy1: number,
    public dx: number,
    public dy: number,
  ) {}

  mirror(axis: MirrorAxis): QuadraticCurveRelativeCoordinates {
    let { dx1, dy1, dx, dy } = this;

    if (axis === AXIS_X) {
      dy1 *= -1;
      dy *= -1;
    } else if (axis === AXIS_Y) {
      dx1 *= -1;
      dx *= -1;
    }

    return new QuadraticCurveRelativeCoordinates(dx1, dy1, dx, dy);
  }

  rotate(angleInDegree: RotationAngle): QuadraticCurveRelativeCoordinates {
    const { dx1: sdx1, dy1: sdy1, dx: sdx, dy: sdy } = this;

    const { x: dx1, y: dy1 } = rotatePointAroundPoint(0, 0, sdx1, sdy1, angleInDegree);
    const { x: dx, y: dy } = rotatePointAroundPoint(0, 0, sdx, sdy, angleInDegree);

    return new QuadraticCurveRelativeCoordinates(dx1, dy1, dx, dy);
  }

  scale(scaleX: number, scaleY: number): QuadraticCurveRelativeCoordinates {
    const { dx1: sdx1, dy1: sdy1, dx: sdx, dy: sdy } = this;

    const dx1 = sdx1 * scaleX;
    const dy1 = sdy1 * scaleY;

    const dx = sdx * scaleX;
    const dy = sdy * scaleY;

    return new QuadraticCurveRelativeCoordinates(dx1, dy1, dx, dy);
  }

  moveOnDelta(shiftX: number, shiftY: number): QuadraticCurveRelativeCoordinates {
    const { dx1: sdx1, dy1: sdy1, dx: sdx, dy: sdy } = this;

    const dx1 = sdx1 + shiftX;
    const dy1 = sdy1 + shiftY;

    const dx = sdx + shiftX;
    const dy = sdy + shiftY;

    return new QuadraticCurveRelativeCoordinates(dx1, dy1, dx, dy);
  }

  toPathDataItem(): PathDataItem {
    const { tag, dx1, dy1, dx, dy } = this;

    // `q dx1 dy1, dx dy`
    return {
      command: tag,
      args: [dx1, dy1, dx, dy],
    };
  }

  toString(decimalsAfterPoint = 3) {
    let { tag, dx1, dy1, dx, dy } = this;

    [dx1, dy1, dx, dy] = [dx1, dy1, dx, dy].map((v) => Number.parseFloat(v.toFixed(decimalsAfterPoint)));

    return `${tag} ${dx1} ${dy1}, ${dx} ${dy}`;
  }
}

export class QuadraticCurveAbsoluteCoordinates implements IPath2dCommand {
  tag = "Q" as const;

  constructor(
    public x1: number,
    public y1: number,
    public x: number,
    public y: number,
  ) {}

  mirror(axis: MirrorAxis): QuadraticCurveAbsoluteCoordinates {
    let { x1, y1, x, y } = this;

    if (axis === AXIS_X) {
      y1 *= -1;
      y *= -1;
    } else if (axis === AXIS_Y) {
      x1 *= -1;
      x *= -1;
    }

    return new QuadraticCurveAbsoluteCoordinates(x1, y1, x, y);
  }

  rotate(angleInDegree: RotationAngle): QuadraticCurveAbsoluteCoordinates {
    const { x1: sx1, y1: sy1, x: sx, y: sy } = this;

    const { x: x1, y: y1 } = rotatePointAroundPoint(0, 0, sx1, sy1, angleInDegree);
    const { x: x, y: y } = rotatePointAroundPoint(0, 0, sx, sy, angleInDegree);

    return new QuadraticCurveAbsoluteCoordinates(x1, y1, x, y);
  }

  scale(scaleX: number, scaleY: number): QuadraticCurveAbsoluteCoordinates {
    const { x1: sx1, y1: sy1, x: sx, y: sy } = this;

    const x1 = sx1 * scaleX;
    const y1 = sy1 * scaleY;

    const x = sx * scaleX;
    const y = sy * scaleY;

    return new QuadraticCurveAbsoluteCoordinates(x1, y1, x, y);
  }

  moveOnDelta(shiftX: number, shiftY: number): QuadraticCurveAbsoluteCoordinates {
    const { x1: sx1, y1: sy1, x: sx, y: sy } = this;

    const x1 = sx1 + shiftX;
    const y1 = sy1 + shiftY;

    const x = sx + shiftX;
    const y = sy + shiftY;

    return new QuadraticCurveAbsoluteCoordinates(x1, y1, x, y);
  }

  toPathDataItem(): PathDataItem {
    const { tag, x1, y1, x, y } = this;

    // `Q x1 y1, x y`
    return {
      command: tag,
      args: [x1, y1, x, y],
    };
  }

  toString(decimalsAfterPoint = 3) {
    let { tag, x1, y1, x, y } = this;

    [x1, y1, x, y] = [x1, y1, x, y].map((v) => Number.parseFloat(v.toFixed(decimalsAfterPoint)));

    return `${tag} ${x1} ${y1}, ${x} ${y}`;
  }
}

export type QuadraticCurve = QuadraticCurveRelativeCoordinates | QuadraticCurveAbsoluteCoordinates;

export function assertIsPath2dCommandQuadraticCurve(value: unknown): asserts value is Path2dCommand {
  if (
    !(value instanceof QuadraticCurveRelativeCoordinates) &&
    !(value instanceof QuadraticCurveAbsoluteCoordinates) //
  ) {
    throw TypeError("value is not a Path2d command QuadraticCurve");
  }
}

export function testIsPath2dCommandQuadraticCurve(value: unknown): value is Path2dCommand {
  return (
    value instanceof QuadraticCurveRelativeCoordinates || //
    value instanceof QuadraticCurveAbsoluteCoordinates
  );
}

export const createQuadraticCurveFromPathDataItem = ({
  command,
  args,
}: {
  command: "q" | "Q";
  args: number[];
}): QuadraticCurve => {
  if (command === "q") {
    // `q dx1 dy1, dx dy`
    const [dx1, dy1, dx, dy] = args;

    return new QuadraticCurveRelativeCoordinates(dx1, dy1, dx, dy);
  } else if (command === "Q") {
    // `Q x1 y1, x y`
    const [x1, y1, x, y] = args;

    return new QuadraticCurveAbsoluteCoordinates(x1, y1, x, y);
  }

  throw new Error("Unknown path 2d command");
};

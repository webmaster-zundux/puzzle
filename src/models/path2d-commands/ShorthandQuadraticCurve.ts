import type { PathDataItem } from "svgo/lib/path";
import { AXIS_X, AXIS_Y } from "../../utils-path/getSideShapes";
import { rotatePointAroundPoint } from "../../utils-path/rotatePointAroundPoint";
import type { IPath2dCommand, MirrorAxis, Path2dCommand, RotationAngle } from "./Path2dCommand";

export class ShorthandQuadraticCurveRelativeCoordinates implements IPath2dCommand {
  tag = "t" as const;

  constructor(
    public dx: number,
    public dy: number,
  ) {}

  mirror(axis: MirrorAxis): ShorthandQuadraticCurveRelativeCoordinates {
    let { dx, dy } = this;

    if (axis === AXIS_X) {
      dy *= -1;
    } else if (axis === AXIS_Y) {
      dx *= -1;
    }

    return new ShorthandQuadraticCurveRelativeCoordinates(dx, dy);
  }

  rotate(angleInDegree: RotationAngle): ShorthandQuadraticCurveRelativeCoordinates {
    const { dx: sdx, dy: sdy } = this;
    const { x: dx, y: dy } = rotatePointAroundPoint(0, 0, sdx, sdy, angleInDegree);

    return new ShorthandQuadraticCurveRelativeCoordinates(dx, dy);
  }

  scale(scaleX: number, scaleY: number): ShorthandQuadraticCurveRelativeCoordinates {
    const { dx: sdx, dy: sdy } = this;

    const dx = sdx * scaleX;
    const dy = sdy * scaleY;

    return new ShorthandQuadraticCurveRelativeCoordinates(dx, dy);
  }

  moveOnDelta(shiftX: number, shiftY: number): ShorthandQuadraticCurveRelativeCoordinates {
    const { dx: sdx, dy: sdy } = this;

    const dx = sdx + shiftX;
    const dy = sdy + shiftY;

    return new ShorthandQuadraticCurveRelativeCoordinates(dx, dy);
  }

  toPathDataItem(): PathDataItem {
    const { tag, dx, dy } = this;

    // `t dx dy`
    return {
      command: tag,
      args: [dx, dy],
    };
  }

  toString(decimalsAfterPoint = 3) {
    let { tag, dx, dy } = this;

    [dx, dy] = [dx, dy].map((v) => Number.parseFloat(v.toFixed(decimalsAfterPoint)));

    return `${tag} ${dx} ${dy}`;
  }
}

export class ShorthandQuadraticCurveAbsoluteCoordinates implements IPath2dCommand {
  tag = "T" as const;

  constructor(
    public x: number,
    public y: number,
  ) {}

  mirror(axis: MirrorAxis): ShorthandQuadraticCurveAbsoluteCoordinates {
    let { x, y } = this;

    if (axis === AXIS_X) {
      y *= -1;
    } else if (axis === AXIS_Y) {
      x *= -1;
    }

    return new ShorthandQuadraticCurveAbsoluteCoordinates(x, y);
  }

  rotate(angleInDegree: RotationAngle): ShorthandQuadraticCurveAbsoluteCoordinates {
    const { x: sx, y: sy } = this;
    const { x: x, y: y } = rotatePointAroundPoint(0, 0, sx, sy, angleInDegree);

    return new ShorthandQuadraticCurveAbsoluteCoordinates(x, y);
  }

  scale(scaleX: number, scaleY: number): ShorthandQuadraticCurveAbsoluteCoordinates {
    const { x: sx, y: sy } = this;

    const x = sx * scaleX;
    const y = sy * scaleY;

    return new ShorthandQuadraticCurveAbsoluteCoordinates(x, y);
  }

  moveOnDelta(shiftX: number, shiftY: number): ShorthandQuadraticCurveAbsoluteCoordinates {
    const { x: sx, y: sy } = this;

    const x = sx + shiftX;
    const y = sy + shiftY;

    return new ShorthandQuadraticCurveAbsoluteCoordinates(x, y);
  }

  toPathDataItem(): PathDataItem {
    const { tag, x, y } = this;

    // `T x y`
    return {
      command: tag,
      args: [x, y],
    };
  }

  toString(decimalsAfterPoint = 3) {
    let { tag, x, y } = this;

    [x, y] = [x, y].map((v) => Number.parseFloat(v.toFixed(decimalsAfterPoint)));

    return `${tag} ${x} ${y}`;
  }
}

export type ShorthandQuadraticCurve =
  | ShorthandQuadraticCurveRelativeCoordinates
  | ShorthandQuadraticCurveAbsoluteCoordinates;

export function assertIsPath2dCommandShorthandQuadraticCurve(value: unknown): asserts value is Path2dCommand {
  if (
    !(value instanceof ShorthandQuadraticCurveRelativeCoordinates) &&
    !(value instanceof ShorthandQuadraticCurveAbsoluteCoordinates) //
  ) {
    throw TypeError("value is not a Path2d command ShorthandQuadraticCurve");
  }
}

export function testIsPath2dCommandShorthandQuadraticCurve(value: unknown): value is Path2dCommand {
  return (
    value instanceof ShorthandQuadraticCurveRelativeCoordinates || //
    value instanceof ShorthandQuadraticCurveAbsoluteCoordinates
  );
}

export const createShorthandQuadraticCurveFromPathDataItem = ({
  command,
  args,
}: {
  command: "t" | "T";
  args: number[];
}): ShorthandQuadraticCurve => {
  if (command === "t") {
    // `t dx dy`
    const [dx, dy] = args;

    return new ShorthandQuadraticCurveRelativeCoordinates(dx, dy);
  } else if (command === "T") {
    // `T x y`
    const [x, y] = args;

    return new ShorthandQuadraticCurveAbsoluteCoordinates(x, y);
  }

  throw new Error("Unknown path 2d command");
};

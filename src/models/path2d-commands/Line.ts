import type { PathDataItem } from "svgo/lib/path";
import { AXIS_X, AXIS_Y } from "../../utils-path/getSideShapes";
import { rotatePointAroundPoint } from "../../utils-path/rotatePointAroundPoint";
import type { IPath2dCommand, MirrorAxis, Path2dCommand, RotationAngle } from "./Path2dCommand";

export class LineRelatveCoordinates implements IPath2dCommand {
  tag = "l" as const;

  constructor(
    public dx: number,
    public dy: number,
  ) {}

  mirror(axis: MirrorAxis): LineRelatveCoordinates {
    let { dx, dy } = this;

    if (axis === AXIS_X) {
      dy *= -1;
    } else if (axis === AXIS_Y) {
      dx *= -1;
    }

    return new LineRelatveCoordinates(dx, dy);
  }

  rotate(angleInDegree: RotationAngle): LineRelatveCoordinates {
    const { dx: sdx, dy: sdy } = this;
    const { x: dx, y: dy } = rotatePointAroundPoint(0, 0, sdx, sdy, angleInDegree);

    return new LineRelatveCoordinates(dx, dy);
  }

  scale(scaleX: number, scaleY: number): LineRelatveCoordinates {
    const { dx: sdx, dy: sdy } = this;

    const dx = sdx * scaleX;
    const dy = sdy * scaleY;

    return new LineRelatveCoordinates(dx, dy);
  }

  moveOnDelta(shiftX: number, shiftY: number): LineRelatveCoordinates {
    const { dx: sdx, dy: sdy } = this;
    const dx = sdx + shiftX;
    const dy = sdy + shiftY;

    return new LineRelatveCoordinates(dx, dy);
  }

  toPathDataItem(): PathDataItem {
    const { tag, dx, dy } = this;

    // `l dx dy`
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

export class LineAbsoluteCoordinates implements IPath2dCommand {
  tag = "L" as const;

  constructor(
    public x: number,
    public y: number,
  ) {}

  mirror(axis: MirrorAxis): LineAbsoluteCoordinates {
    let { x, y } = this;

    if (axis === AXIS_X) {
      y *= -1;
    } else if (axis === AXIS_Y) {
      x *= -1;
    }

    return new LineAbsoluteCoordinates(x, y);
  }

  rotate(angleInDegree: RotationAngle): LineAbsoluteCoordinates {
    const { x: sx, y: sy } = this;
    const { x: x, y: y } = rotatePointAroundPoint(0, 0, sx, sy, angleInDegree);

    return new LineAbsoluteCoordinates(x, y);
  }

  scale(scaleX: number, scaleY: number): LineAbsoluteCoordinates {
    const { x: sx, y: sy } = this;

    const x = sx * scaleX;
    const y = sy * scaleY;

    return new LineAbsoluteCoordinates(x, y);
  }

  moveOnDelta(shiftX: number, shiftY: number): LineAbsoluteCoordinates {
    const { x: sx, y: sy } = this;
    const x = sx + shiftX;
    const y = sy + shiftY;

    return new LineAbsoluteCoordinates(x, y);
  }

  toPathDataItem(): PathDataItem {
    const { tag, x, y } = this;

    // `L x y`
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

export type Line = LineRelatveCoordinates | LineAbsoluteCoordinates;

export function assertIsPath2dCommandLine(value: unknown): asserts value is Path2dCommand {
  if (
    !(value instanceof LineRelatveCoordinates) &&
    !(value instanceof LineAbsoluteCoordinates) //
  ) {
    throw TypeError("value is not a Path2d command Line");
  }
}

export function testIsPath2dCommandLine(value: unknown): value is Path2dCommand {
  return (
    value instanceof LineRelatveCoordinates || //
    value instanceof LineAbsoluteCoordinates
  );
}

export const createLineFromPathDataItem = ({ command, args }: { command: "l" | "L"; args: number[] }): Line => {
  if (command === "l") {
    // `l dx dy`
    const [dx, dy] = args;

    return new LineRelatveCoordinates(dx, dy);
  } else if (command === "L") {
    // `L x y`
    const [x, y] = args;

    return new LineAbsoluteCoordinates(x, y);
  }

  throw new Error("Unknown path 2d command");
};

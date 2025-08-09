import type { PathDataItem } from "svgo/lib/path";
import { AXIS_X, AXIS_Y } from "../../utils-path/getSideShapes";
import { rotatePointAroundPoint } from "../../utils-path/rotatePointAroundPoint";
import type { IPath2dCommand, MirrorAxis, Path2dCommand, RotationAngle } from "./Path2dCommand";

export class MoveRelativeCoordinates implements IPath2dCommand {
  tag = "m" as const;

  constructor(
    public dx: number,
    public dy: number,
  ) {}

  mirror(axis: MirrorAxis): MoveRelativeCoordinates {
    let { dx, dy } = this;

    if (axis === AXIS_X) {
      dy *= -1;
    } else if (axis === AXIS_Y) {
      dx *= -1;
    }

    return new MoveRelativeCoordinates(dx, dy);
  }

  rotate(angleInDegree: RotationAngle): MoveRelativeCoordinates {
    const { dx: sdx, dy: sdy } = this;
    const { x: dx, y: dy } = rotatePointAroundPoint(0, 0, sdx, sdy, angleInDegree);

    return new MoveRelativeCoordinates(dx, dy);
  }

  scale(scaleX: number, scaleY: number): MoveRelativeCoordinates {
    const { dx: sdx, dy: sdy } = this;

    const dx = sdx * scaleX;
    const dy = sdy * scaleY;

    return new MoveRelativeCoordinates(dx, dy);
  }

  moveOnDelta(shiftX: number, shiftY: number): MoveRelativeCoordinates {
    const { dx: sdx, dy: sdy } = this;
    const dx = sdx + shiftX;
    const dy = sdy + shiftY;

    return new MoveRelativeCoordinates(dx, dy);
  }

  toPathDataItem(): PathDataItem {
    const { tag, dx, dy } = this;

    // `m dx dy`
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

export function assertIsPath2dCommandMoveRelativeCoordinates(value: unknown): asserts value is MoveRelativeCoordinates {
  if (!(value instanceof MoveRelativeCoordinates)) {
    throw TypeError("value is not a Path2d command MoveRelativeCoordinates");
  }
}

export function testIsPath2dCommandMoveRelativeCoordinates(value: unknown): value is MoveRelativeCoordinates {
  return value instanceof MoveRelativeCoordinates;
}

export class MoveAbsoluteCoordinates implements IPath2dCommand {
  tag = "M" as const;

  constructor(
    public x: number,
    public y: number,
  ) {}

  mirror(axis: MirrorAxis): MoveAbsoluteCoordinates {
    let { x, y } = this;

    if (axis === AXIS_X) {
      y *= -1;
    } else if (axis === AXIS_Y) {
      x *= -1;
    }

    return new MoveAbsoluteCoordinates(x, y);
  }

  rotate(angleInDegree: RotationAngle): MoveAbsoluteCoordinates {
    const { x: sx, y: sy } = this;
    const { x: x, y: y } = rotatePointAroundPoint(0, 0, sx, sy, angleInDegree);

    return new MoveAbsoluteCoordinates(x, y);
  }

  scale(scaleX: number, scaleY: number): MoveAbsoluteCoordinates {
    const { x: sx, y: sy } = this;

    const x = sx * scaleX;
    const y = sy * scaleY;

    return new MoveAbsoluteCoordinates(x, y);
  }

  moveOnDelta(shiftX: number, shiftY: number): MoveAbsoluteCoordinates {
    const { x: sx, y: sy } = this;
    const x = sx + shiftX;
    const y = sy + shiftY;

    return new MoveAbsoluteCoordinates(x, y);
  }

  toPathDataItem(): PathDataItem {
    const { tag, x, y } = this;

    // `M x y`
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

export function assertIsPath2dCommandMoveAbsoluteCoordinates(value: unknown): asserts value is MoveAbsoluteCoordinates {
  if (!(value instanceof MoveAbsoluteCoordinates)) {
    throw TypeError("value is not a Path2d command MoveAbsoluteCoordinates");
  }
}

export function testIsPath2dCommandMoveAbsoluteCoordinates(value: unknown): value is MoveAbsoluteCoordinates {
  return value instanceof MoveAbsoluteCoordinates;
}

export type Move = MoveRelativeCoordinates | MoveAbsoluteCoordinates;

export function assertIsPath2dCommandMove(value: unknown): asserts value is Path2dCommand {
  if (
    !(value instanceof MoveRelativeCoordinates) &&
    !(value instanceof MoveAbsoluteCoordinates) //
  ) {
    throw TypeError("value is not a Path2d command Move");
  }
}

export function testIsPath2dCommandMove(value: unknown): value is Path2dCommand {
  return (
    value instanceof MoveRelativeCoordinates || //
    value instanceof MoveAbsoluteCoordinates
  );
}

export const createMoveFromPathDataItem = ({ command, args }: { command: "m" | "M"; args: number[] }): Move => {
  if (command === "m") {
    // `m dx dy`
    const [dx, dy] = args;

    return new MoveRelativeCoordinates(dx, dy);
  } else if (command === "M") {
    // `M x y`
    const [x, y] = args;

    return new MoveAbsoluteCoordinates(x, y);
  }

  throw new Error("Unknown path 2d command");
};

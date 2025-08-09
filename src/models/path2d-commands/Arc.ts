import type { PathDataItem } from "svgo/lib/path";
import { AXIS_X, AXIS_Y } from "../../utils-path/getSideShapes";
import { rotatePointAroundPoint } from "../../utils-path/rotatePointAroundPoint";
import type { IPath2dCommand, MirrorAxis, Path2dCommand, RotationAngle } from "./Path2dCommand";
import { DEGREES_IN_HALF_OF_CIRCLE, MAX_DEGREES_IN_CIRCLE } from "./Path2dCommand";

export class ArcRelativeCoordinates implements IPath2dCommand {
  tag = "a" as const;

  constructor(
    public rx: number,
    public ry: number,
    public xAxisRotation: number,
    public largeArcFlag: boolean = false,
    public sweepFlag: boolean = false,
    public dx: number,
    public dy: number,
  ) {}

  mirror(axis: MirrorAxis): ArcRelativeCoordinates {
    let { rx, ry, xAxisRotation, largeArcFlag, sweepFlag, dx, dy } = this;

    if (axis === AXIS_X) {
      dy *= -1;
      xAxisRotation = Math.sign(xAxisRotation) * (DEGREES_IN_HALF_OF_CIRCLE - Math.abs(xAxisRotation));
    } else if (axis === AXIS_Y) {
      dx *= -1;
      xAxisRotation = Math.sign(xAxisRotation) * (DEGREES_IN_HALF_OF_CIRCLE - Math.abs(xAxisRotation));
    }

    return new ArcRelativeCoordinates(rx, ry, xAxisRotation, largeArcFlag, !sweepFlag, dx, dy);
  }

  rotate(angleInDegree: RotationAngle): ArcRelativeCoordinates {
    let { rx, ry, xAxisRotation, largeArcFlag, sweepFlag, dx: sdx, dy: sdy } = this;
    const { x: dx, y: dy } = rotatePointAroundPoint(0, 0, sdx, sdy, angleInDegree);

    xAxisRotation += angleInDegree;
    if (xAxisRotation >= MAX_DEGREES_IN_CIRCLE) {
      xAxisRotation %= MAX_DEGREES_IN_CIRCLE;
    } else if (xAxisRotation <= -MAX_DEGREES_IN_CIRCLE) {
      xAxisRotation %= MAX_DEGREES_IN_CIRCLE;
    }

    return new ArcRelativeCoordinates(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, dx, dy);
  }

  scale(scaleX: number, scaleY: number): ArcRelativeCoordinates {
    const { rx: srx, ry: sry, xAxisRotation, largeArcFlag, sweepFlag, dx: sdx, dy: sdy } = this;

    const rx = srx * scaleX;
    const ry = sry * scaleY;

    const dx = sdx * scaleX;
    const dy = sdy * scaleY;

    return new ArcRelativeCoordinates(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, dx, dy);
  }

  moveOnDelta(shiftX: number, shiftY: number): ArcRelativeCoordinates {
    const { rx, ry, xAxisRotation, largeArcFlag, sweepFlag, dx: sdx, dy: sdy } = this;
    const dx = sdx + shiftX;
    const dy = sdy + shiftY;

    return new ArcRelativeCoordinates(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, dx, dy);
  }

  toPathDataItem(): PathDataItem {
    const { tag, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, dx, dy } = this;

    return {
      command: tag,
      args: [rx, ry, xAxisRotation, largeArcFlag ? 1 : 0, sweepFlag ? 1 : 0, dx, dy],
    };
  }

  toString(decimalsAfterPoint = 3) {
    let { tag, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, dx, dy } = this;

    [rx, ry, dx, dy] = [rx, ry, dx, dy].map((v) => Number.parseFloat(v.toFixed(decimalsAfterPoint)));

    return `${tag} ${rx} ${ry} ${xAxisRotation} ${largeArcFlag ? "1" : "0"} ${sweepFlag ? "1" : "0"} ${dx} ${dy}`;
  }
}

export class ArcAbsoluteCoordinates implements IPath2dCommand {
  tag = "A" as const;

  constructor(
    public rx: number,
    public ry: number,
    public xAxisRotation: number,
    public largeArcFlag: boolean = false,
    public sweepFlag: boolean = false,
    public x: number,
    public y: number,
  ) {}

  mirror(axis: MirrorAxis): ArcAbsoluteCoordinates {
    let { rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y } = this;

    if (axis === AXIS_X) {
      y *= -1;
      xAxisRotation = Math.sign(xAxisRotation) * (DEGREES_IN_HALF_OF_CIRCLE - Math.abs(xAxisRotation));
      sweepFlag = !sweepFlag;
    } else if (axis === AXIS_Y) {
      x *= -1;
      xAxisRotation = Math.sign(xAxisRotation) * (DEGREES_IN_HALF_OF_CIRCLE - Math.abs(xAxisRotation));
      sweepFlag = !sweepFlag;
    }

    return new ArcAbsoluteCoordinates(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y);
  }

  rotate(angleInDegree: RotationAngle): ArcAbsoluteCoordinates {
    let { rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x: sx, y: sy } = this;
    const { x, y } = rotatePointAroundPoint(0, 0, sx, sy, angleInDegree);

    xAxisRotation += angleInDegree;
    if (xAxisRotation >= MAX_DEGREES_IN_CIRCLE) {
      xAxisRotation %= MAX_DEGREES_IN_CIRCLE;
    } else if (xAxisRotation <= -MAX_DEGREES_IN_CIRCLE) {
      xAxisRotation %= MAX_DEGREES_IN_CIRCLE;
    }

    return new ArcAbsoluteCoordinates(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y);
  }

  scale(scaleX: number, scaleY: number): ArcAbsoluteCoordinates {
    const { rx: srx, ry: sry, xAxisRotation, largeArcFlag, sweepFlag, x: sx, y: sy } = this;

    const rx = srx * scaleX;
    const ry = sry * scaleY;

    const x = sx * scaleX;
    const y = sy * scaleY;

    return new ArcAbsoluteCoordinates(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y);
  }

  moveOnDelta(shiftX: number, shiftY: number): ArcAbsoluteCoordinates {
    const { rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x: sx, y: sy } = this;
    const x = sx + shiftX;
    const y = sy + shiftY;

    return new ArcAbsoluteCoordinates(rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y);
  }

  toPathDataItem(): PathDataItem {
    const { tag, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y } = this;

    return {
      command: tag,
      args: [rx, ry, xAxisRotation, largeArcFlag ? 1 : 0, sweepFlag ? 1 : 0, x, y],
    };
  }

  toString(decimalsAfterPoint = 3) {
    let { tag, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y } = this;

    [rx, ry, x, y] = [rx, ry, x, y].map((v) => Number.parseFloat(v.toFixed(decimalsAfterPoint)));

    return `${tag} ${rx} ${ry} ${xAxisRotation} ${largeArcFlag ? "1" : "0"} ${sweepFlag ? "1" : "0"} ${x} ${y}`;
  }
}

export type Arc = ArcRelativeCoordinates | ArcAbsoluteCoordinates;

export function assertIsPath2dCommandArc(value: unknown): asserts value is Path2dCommand {
  if (!(value instanceof ArcRelativeCoordinates) && !(value instanceof ArcAbsoluteCoordinates)) {
    throw TypeError("value is not a Path2d command Arc");
  }
}

export function testIsPath2dCommandArc(value: unknown): value is Path2dCommand {
  return value instanceof ArcRelativeCoordinates || value instanceof ArcAbsoluteCoordinates;
}

export const createArcFromPathDataItem = ({ command, args }: { command: "a" | "A"; args: number[] }): Arc => {
  if (command === "a") {
    const [rx, ry, xAxisRotation, largeArcFlag, sweepFlag, dx, dy] = args;

    return new ArcRelativeCoordinates(rx, ry, xAxisRotation, largeArcFlag === 1, sweepFlag === 1, dx, dy);
  } else if (command === "A") {
    const [rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y] = args;

    return new ArcAbsoluteCoordinates(rx, ry, xAxisRotation, largeArcFlag === 1, sweepFlag === 1, x, y);
  }

  throw new Error("Unknown path 2d command");
};

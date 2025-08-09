import type { PathDataItem } from "svgo/lib/path";
import { AXIS_X, AXIS_Y } from "../../utils-path/getSideShapes";
import { rotatePointAroundPoint } from "../../utils-path/rotatePointAroundPoint";
import { HorizontalLineAbsoluteCoordinates, HorizontalLineRelativeCoordinates } from "./HorizontalLine";
import type { IPath2dCommand, MirrorAxis, Path2dCommand, RotationAngle } from "./Path2dCommand";

export class VerticalLineRelativeCoordinates implements IPath2dCommand {
  tag = "v" as const;

  constructor(
    public dy: number, //
  ) {}

  mirror(axis: MirrorAxis): VerticalLineRelativeCoordinates {
    let { dy } = this;

    if (axis === AXIS_X) {
      dy *= -1;
    } else if (axis === AXIS_Y) {
      //noop
    }

    return new VerticalLineRelativeCoordinates(dy);
  }

  rotate(angleInDegree: RotationAngle): VerticalLineRelativeCoordinates | HorizontalLineRelativeCoordinates {
    const { dy: sdy } = this;

    if (angleInDegree === 0 || angleInDegree === 180) {
      const { y: dy } = rotatePointAroundPoint(0, 0, 0, sdy, angleInDegree);
      return new VerticalLineRelativeCoordinates(dy);
    } else if (angleInDegree === 90 || angleInDegree === 270) {
      const { x: dx } = rotatePointAroundPoint(0, 0, 0, sdy, angleInDegree);
      return new HorizontalLineRelativeCoordinates(dx);
    }

    const errorMessage = "Unsupported rotation angle";
    console.error("failure to rotate the vertical line with relative coordinates", errorMessage);
    throw new Error(errorMessage);
  }

  scale(_scaleX: number, scaleY: number): VerticalLineRelativeCoordinates {
    const { dy: sdy } = this;
    const dy = sdy * scaleY;

    return new VerticalLineRelativeCoordinates(dy);
  }

  moveOnDelta(_shiftX: number, shiftY: number): VerticalLineRelativeCoordinates {
    const { dy: sdy } = this;
    const dy = sdy + shiftY;

    return new VerticalLineRelativeCoordinates(dy);
  }

  toPathDataItem(): PathDataItem {
    const { tag, dy } = this;

    // `v dy`
    return {
      command: tag,
      args: [dy],
    };
  }

  toString(decimalsAfterPoint = 3) {
    let { tag, dy } = this;

    [dy] = [dy].map((v) => Number.parseFloat(v.toFixed(decimalsAfterPoint)));

    return `${tag} ${dy}`;
  }
}

export class VerticalLineAbsoluteCoordinates implements IPath2dCommand {
  tag = "V" as const;

  constructor(
    public y: number, //
  ) {}

  mirror(axis: MirrorAxis): VerticalLineAbsoluteCoordinates {
    let { y } = this;

    if (axis === AXIS_X) {
      y *= -1;
    } else if (axis === AXIS_Y) {
      //noop
    }

    return new VerticalLineAbsoluteCoordinates(y);
  }

  rotate(angleInDegree: RotationAngle): VerticalLineAbsoluteCoordinates | HorizontalLineAbsoluteCoordinates {
    const { y: sy } = this;

    if (angleInDegree === 0 || angleInDegree === 180) {
      const { y } = rotatePointAroundPoint(0, 0, 0, sy, angleInDegree);
      return new VerticalLineAbsoluteCoordinates(y);
    } else if (angleInDegree === 90 || angleInDegree === 270) {
      const { x } = rotatePointAroundPoint(0, 0, 0, sy, angleInDegree);
      return new HorizontalLineAbsoluteCoordinates(x);
    }

    const errorMessage = "Unsupported rotation angle";
    console.error("failure to rotate the vertical line with absolute coordinates", errorMessage);
    throw new Error(errorMessage);
  }

  scale(_scaleX: number, scaleY: number): VerticalLineAbsoluteCoordinates {
    const { y: sy } = this;
    const y = sy * scaleY;

    return new VerticalLineAbsoluteCoordinates(y);
  }

  moveOnDelta(_shiftX: number, shiftY: number): VerticalLineAbsoluteCoordinates {
    const { y: sy } = this;
    const y = sy + shiftY;

    return new VerticalLineAbsoluteCoordinates(y);
  }

  toPathDataItem(): PathDataItem {
    const { tag, y } = this;

    // `V y`
    return {
      command: tag,
      args: [y],
    };
  }

  toString(decimalsAfterPoint = 3) {
    let { tag, y } = this;

    [y] = [y].map((v) => Number.parseFloat(v.toFixed(decimalsAfterPoint)));

    return `${tag} ${y}`;
  }
}

export type VerticalLine = VerticalLineRelativeCoordinates | VerticalLineAbsoluteCoordinates;

export function assertIsPath2dCommandVerticalLine(value: unknown): asserts value is Path2dCommand {
  if (
    !(value instanceof VerticalLineRelativeCoordinates) &&
    !(value instanceof VerticalLineAbsoluteCoordinates) //
  ) {
    throw TypeError("value is not a Path2d command VerticalLine");
  }
}

export function testIsPath2dCommandVerticalLine(value: unknown): value is Path2dCommand {
  return (
    value instanceof VerticalLineRelativeCoordinates || //
    value instanceof VerticalLineAbsoluteCoordinates
  );
}

export const createVerticalLineFromPathDataItem = ({
  command,
  args,
}: {
  command: "v" | "V";
  args: number[];
}): VerticalLine => {
  if (command === "v") {
    // `v dy`
    const [dy] = args;

    return new VerticalLineRelativeCoordinates(dy);
  } else if (command === "V") {
    // `V y`
    const [y] = args;

    return new VerticalLineAbsoluteCoordinates(y);
  }

  throw new Error("Unknown path 2d command");
};

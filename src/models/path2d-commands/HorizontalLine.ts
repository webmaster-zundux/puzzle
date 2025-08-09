import type { PathDataItem } from "svgo/lib/path";
import { AXIS_X, AXIS_Y } from "../../utils-path/getSideShapes";
import { rotatePointAroundPoint } from "../../utils-path/rotatePointAroundPoint";
import type { IPath2dCommand, MirrorAxis, Path2dCommand, RotationAngle } from "./Path2dCommand";
import { VerticalLineAbsoluteCoordinates, VerticalLineRelativeCoordinates } from "./VerticalLine";

export class HorizontalLineRelativeCoordinates implements IPath2dCommand {
  tag = "h" as const;

  constructor(
    public dx: number, //
  ) {}

  mirror(axis: MirrorAxis): HorizontalLineRelativeCoordinates {
    let { dx } = this;

    if (axis === AXIS_X) {
      //noop
    } else if (axis === AXIS_Y) {
      dx *= -1;
    }

    return new HorizontalLineRelativeCoordinates(dx);
  }

  rotate(angleInDegree: RotationAngle): HorizontalLineRelativeCoordinates | VerticalLineRelativeCoordinates {
    const { dx: sdx } = this;

    if (angleInDegree === 0 || angleInDegree === 180) {
      const { x: dx } = rotatePointAroundPoint(0, 0, sdx, 0, angleInDegree);
      return new HorizontalLineRelativeCoordinates(dx);
    } else if (angleInDegree === 90 || angleInDegree === 270) {
      const { y: dy } = rotatePointAroundPoint(0, 0, sdx, 0, angleInDegree);
      return new VerticalLineRelativeCoordinates(dy);
    }

    const errorMessage = "Unsupported rotation angle";
    console.error("failure to rotate the horizontal line with relative coordinates", errorMessage);
    throw new Error(errorMessage);
  }

  scale(scaleX: number, _scaleY: number): HorizontalLineRelativeCoordinates {
    const { dx: sdx } = this;
    const dx = sdx * scaleX;

    return new HorizontalLineRelativeCoordinates(dx);
  }

  moveOnDelta(shiftX: number, _shiftY: number): HorizontalLineRelativeCoordinates {
    const { dx: sdx } = this;
    const dx = sdx + shiftX;

    return new HorizontalLineRelativeCoordinates(dx);
  }

  toPathDataItem(): PathDataItem {
    const { tag, dx } = this;

    // `h dx`
    return {
      command: tag,
      args: [dx],
    };
  }

  toString(decimalsAfterPoint = 3) {
    let { tag, dx } = this;

    [dx] = [dx].map((v) => Number.parseFloat(v.toFixed(decimalsAfterPoint)));

    return `${tag} ${dx}`;
  }
}

export class HorizontalLineAbsoluteCoordinates implements IPath2dCommand {
  tag = "H" as const;

  constructor(
    public x: number, //
  ) {}

  mirror(axis: MirrorAxis): HorizontalLineAbsoluteCoordinates {
    let { x } = this;

    if (axis === AXIS_X) {
      //noop
    } else if (axis === AXIS_Y) {
      x *= -1;
    }

    return new HorizontalLineAbsoluteCoordinates(x);
  }

  rotate(angleInDegree: RotationAngle): HorizontalLineAbsoluteCoordinates | VerticalLineAbsoluteCoordinates {
    const { x: sx } = this;

    if (angleInDegree === 0 || angleInDegree === 180) {
      const { x } = rotatePointAroundPoint(0, 0, sx, 0, angleInDegree);
      return new HorizontalLineAbsoluteCoordinates(x);
    } else if (angleInDegree === 90 || angleInDegree === 270) {
      const { y } = rotatePointAroundPoint(0, 0, sx, 0, angleInDegree);
      return new VerticalLineAbsoluteCoordinates(y);
    }

    const errorMessage = "Unsupported rotation angle";
    console.error("failure to rotate the horizontal line with absolute coordinates", errorMessage);
    throw new Error(errorMessage);
  }

  scale(scaleX: number, _scaleY: number): HorizontalLineAbsoluteCoordinates {
    const { x: sx } = this;
    const x = sx * scaleX;

    return new HorizontalLineAbsoluteCoordinates(x);
  }

  moveOnDelta(shiftX: number, _shiftY: number): HorizontalLineAbsoluteCoordinates {
    const { x: sx } = this;
    const x = sx + shiftX;

    return new HorizontalLineAbsoluteCoordinates(x);
  }

  toPathDataItem(): PathDataItem {
    const { tag, x } = this;

    // `H x`
    return {
      command: tag,
      args: [x],
    };
  }

  toString(decimalsAfterPoint = 3) {
    let { tag, x } = this;

    [x] = [x].map((v) => Number.parseFloat(v.toFixed(decimalsAfterPoint)));

    return `${tag} ${x}`;
  }
}

export type HorizontalLine = HorizontalLineRelativeCoordinates | HorizontalLineAbsoluteCoordinates;

export function assertIsPath2dCommandHorizontalLine(value: unknown): asserts value is Path2dCommand {
  if (
    !(value instanceof HorizontalLineRelativeCoordinates) &&
    !(value instanceof HorizontalLineAbsoluteCoordinates) //
  ) {
    throw TypeError("value is not a Path2d command HorizontalLine");
  }
}

export function testIsPath2dCommandHorizontalLine(value: unknown): value is Path2dCommand {
  return (
    value instanceof HorizontalLineRelativeCoordinates || //
    value instanceof HorizontalLineAbsoluteCoordinates
  );
}

export const createHorizontalLineFromPathDataItem = ({
  command,
  args,
}: {
  command: "h" | "H";
  args: number[];
}): HorizontalLine => {
  if (command === "h") {
    // `h dx`
    const [dx] = args;

    return new HorizontalLineRelativeCoordinates(dx);
  } else if (command === "H") {
    // `H x`
    const [x] = args;

    return new HorizontalLineAbsoluteCoordinates(x);
  }

  throw new Error("Unknown path 2d command");
};

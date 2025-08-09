import type { PathDataItem } from "svgo/lib/path";
import type { IPath2dCommand, MirrorAxis, Path2dCommand, RotationAngle } from "./Path2dCommand";

export class ClosePathRelativeCoordinates implements IPath2dCommand {
  tag = "z" as const;

  mirror(_axis: MirrorAxis): ClosePathRelativeCoordinates {
    return new ClosePathRelativeCoordinates();
  }

  rotate(_angleInDegree: RotationAngle): ClosePathRelativeCoordinates {
    return new ClosePathRelativeCoordinates();
  }

  scale(_scaleX: number, _scaleY: number): ClosePathRelativeCoordinates {
    return new ClosePathRelativeCoordinates();
  }

  moveOnDelta(_shiftX: number, _shiftY: number): ClosePathRelativeCoordinates {
    return new ClosePathRelativeCoordinates();
  }

  toPathDataItem(): PathDataItem {
    const { tag } = this;

    // `z`
    return {
      command: tag,
      args: [],
    };
  }

  toString() {
    const { tag } = this;

    return `${tag}`;
  }
}

export class ClosePathAbsoluteCoordinates implements IPath2dCommand {
  tag = "Z" as const;

  mirror(_axis: MirrorAxis): ClosePathAbsoluteCoordinates {
    return new ClosePathAbsoluteCoordinates();
  }

  rotate(_angleInDegree: RotationAngle): ClosePathAbsoluteCoordinates {
    return new ClosePathAbsoluteCoordinates();
  }

  scale(_scaleX: number, _scaleY: number): ClosePathAbsoluteCoordinates {
    return new ClosePathAbsoluteCoordinates();
  }

  moveOnDelta(_shiftX: number, _shiftY: number): ClosePathAbsoluteCoordinates {
    return new ClosePathAbsoluteCoordinates();
  }

  toPathDataItem(): PathDataItem {
    const { tag } = this;

    // `Z`
    return {
      command: tag,
      args: [],
    };
  }

  toString() {
    const { tag } = this;

    return `${tag}`;
  }
}

export type ClosePath = ClosePathRelativeCoordinates | ClosePathAbsoluteCoordinates;

export function assertIsPath2dCommandClosePath(value: unknown): asserts value is Path2dCommand {
  if (
    !(value instanceof ClosePathRelativeCoordinates) &&
    !(value instanceof ClosePathAbsoluteCoordinates) //
  ) {
    throw TypeError("value is not a Path2d command ClosePath");
  }
}

export function testIsPath2dCommandClosePath(value: unknown): value is Path2dCommand {
  return (
    value instanceof ClosePathRelativeCoordinates || //
    value instanceof ClosePathAbsoluteCoordinates
  );
}

export const createClosePathFromPathDataItem = ({ command }: { command: "z" | "Z" }): ClosePath => {
  if (command === "z") {
    // `z`
    return new ClosePathRelativeCoordinates();
  } else if (command === "Z") {
    // `Z`
    return new ClosePathAbsoluteCoordinates();
  }

  throw new Error("Unknown path 2d command");
};

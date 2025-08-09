import type { PathDataItem } from "svgo/lib/path";
import { parsePathData, stringifyPathData } from "svgo/lib/path";
import type { AXIS_X, AXIS_Y } from "../../utils-path/getSideShapes";
import type { Arc } from "./Arc";
import { assertIsPath2dCommandArc, createArcFromPathDataItem, testIsPath2dCommandArc } from "./Arc";
import type { ClosePath } from "./ClosePath";
import {
  assertIsPath2dCommandClosePath,
  createClosePathFromPathDataItem,
  testIsPath2dCommandClosePath,
} from "./ClosePath";
import type { Curve } from "./Curve";
import { assertIsPath2dCommandCurve, createCurveFromPathDataItem, testIsPath2dCommandCurve } from "./Curve";
import type { HorizontalLine } from "./HorizontalLine";
import {
  assertIsPath2dCommandHorizontalLine,
  createHorizontalLineFromPathDataItem,
  testIsPath2dCommandHorizontalLine,
} from "./HorizontalLine";
import type { Line } from "./Line";
import { assertIsPath2dCommandLine, createLineFromPathDataItem, testIsPath2dCommandLine } from "./Line";
import type { Move } from "./Move";
import { assertIsPath2dCommandMove, createMoveFromPathDataItem, testIsPath2dCommandMove } from "./Move";
import type { QuadraticCurve } from "./QuadraticCurve";
import {
  assertIsPath2dCommandQuadraticCurve,
  createQuadraticCurveFromPathDataItem,
  testIsPath2dCommandQuadraticCurve,
} from "./QuadraticCurve";
import type { ShorthandCurve } from "./ShorthandCurve";
import {
  assertIsPath2dCommandShorthandCurve,
  createShorthandCurveFromPathDataItem,
  testIsPath2dCommandShorthandCurve,
} from "./ShorthandCurve";
import type { ShorthandQuadraticCurve } from "./ShorthandQuadraticCurve";
import {
  assertIsPath2dCommandShorthandQuadraticCurve,
  createShorthandQuadraticCurveFromPathDataItem,
  testIsPath2dCommandShorthandQuadraticCurve,
} from "./ShorthandQuadraticCurve";
import type { VerticalLine } from "./VerticalLine";
import {
  assertIsPath2dCommandVerticalLine,
  createVerticalLineFromPathDataItem,
  testIsPath2dCommandVerticalLine,
} from "./VerticalLine";

export type MirrorAxis = typeof AXIS_X | typeof AXIS_Y;
export const DEGREES_IN_HALF_OF_CIRCLE = 180;
export const MAX_DEGREES_IN_CIRCLE = 360;

export type RotationAngle = 0 | 90 | 180 | 270;

export function assertIsRotationAngle(value: unknown): asserts value is RotationAngle {
  if (
    !(value === 0) && //
    !(value === 90) &&
    !(value === 180) &&
    !(value === 270)
  ) {
    throw TypeError("value is not a rotation angle. Value should be equal to 0, 90, 180 or 270");
  }
}

export function testIsRotationAngle(value: unknown): value is RotationAngle {
  return (
    value === 0 || //
    value === 90 ||
    value === 180 ||
    value === 270
  );
}

export interface IPath2dCommand {
  mirror(axis: MirrorAxis): Path2dCommand;
  rotate(angleInDegree: RotationAngle): Path2dCommand;
  scale(scaleX: number, scaleY: number): Path2dCommand;
  moveOnDelta(shiftX: number, shiftY: number): Path2dCommand;
  toPathDataItem(): PathDataItem;
}

export type Path2dCommand =
  | Arc
  | ClosePath
  | Curve
  | HorizontalLine
  | Line
  | Move
  | QuadraticCurve
  | ShorthandCurve
  | ShorthandQuadraticCurve
  | VerticalLine;

export function assertIsPath2dCommand(value: unknown): asserts value is Path2dCommand {
  assertIsPath2dCommandArc(value);
  assertIsPath2dCommandClosePath(value);
  assertIsPath2dCommandCurve(value);
  assertIsPath2dCommandHorizontalLine(value);
  assertIsPath2dCommandLine(value);
  assertIsPath2dCommandMove(value);
  assertIsPath2dCommandQuadraticCurve(value);
  assertIsPath2dCommandShorthandCurve(value);
  assertIsPath2dCommandShorthandQuadraticCurve(value);
  assertIsPath2dCommandVerticalLine(value);
}

export function testIsPath2dCommand(value: unknown): value is Path2dCommand {
  return (
    testIsPath2dCommandArc(value) ||
    testIsPath2dCommandClosePath(value) ||
    testIsPath2dCommandCurve(value) ||
    testIsPath2dCommandHorizontalLine(value) ||
    testIsPath2dCommandLine(value) ||
    testIsPath2dCommandMove(value) ||
    testIsPath2dCommandQuadraticCurve(value) ||
    testIsPath2dCommandShorthandCurve(value) ||
    testIsPath2dCommandShorthandQuadraticCurve(value) ||
    testIsPath2dCommandVerticalLine(value)
  );
}

export function parsePath2dCommandsFromString(path2dCommandsString: string): Path2dCommand[] {
  const pathDateItemsWithAnyCoordinatesRelativeness: PathDataItem[] = parsePathData(path2dCommandsString);
  const pathDateItems = convertPathDataItemsWithAnyCoordinatesToPathDataItemsWithRelativeCoordinates(
    pathDateItemsWithAnyCoordinatesRelativeness,
  );

  const path2dCommands: Path2dCommand[] = [];

  pathDateItems.forEach(({ command, args }) => {
    if (command === "a" || command === "A") {
      const c = createArcFromPathDataItem({ command, args });
      path2dCommands.push(c);
      return;
    } else if (command === "z" || command === "Z") {
      const c = createClosePathFromPathDataItem({ command });
      path2dCommands.push(c);
      return;
    } else if (command === "c" || command === "C") {
      const c = createCurveFromPathDataItem({ command, args });
      path2dCommands.push(c);
      return;
    } else if (command === "h" || command === "H") {
      const c = createHorizontalLineFromPathDataItem({ command, args });
      path2dCommands.push(c);
      return;
    } else if (command === "l" || command === "L") {
      const c = createLineFromPathDataItem({ command, args });
      path2dCommands.push(c);
      return;
    } else if (command === "m" || command === "M") {
      const c = createMoveFromPathDataItem({ command, args });
      path2dCommands.push(c);
      return;
    } else if (command === "q" || command === "Q") {
      const c = createQuadraticCurveFromPathDataItem({ command, args });
      path2dCommands.push(c);
      return;
    } else if (command === "s" || command === "S") {
      const c = createShorthandCurveFromPathDataItem({ command, args });
      path2dCommands.push(c);
      return;
    } else if (command === "t" || command === "T") {
      const c = createShorthandQuadraticCurveFromPathDataItem({
        command,
        args,
      });
      path2dCommands.push(c);
      return;
    } else if (command === "v" || command === "V") {
      const c = createVerticalLineFromPathDataItem({ command, args });
      path2dCommands.push(c);
      return;
    }

    console.error(`Unknown path 2d command ${command}`);
  });

  return path2dCommands;
}

export function stringifyPath2dCommands(path2dCommands: Path2dCommand[]): string {
  const pathData = path2dCommands.map((c) => c.toPathDataItem());

  return stringifyPathData({
    pathData,
    precision: 3,
  });
}

export function convertPathDataItemsWithAnyCoordinatesToPathDataItemsWithRelativeCoordinates(
  pathDataItems: PathDataItem[],
): PathDataItem[] {
  let cursorPoint = [0, 0];

  const pathDataItemWithRelativeCoordinates: PathDataItem[] = pathDataItems.map((c, index) => {
    const { command, args } = c;
    switch (command) {
      case "z": {
        return c;
      }
      case "Z": {
        return c;
      }
      case "m": {
        if (index === 0) {
          const [x, y] = args;
          const relativeCommand = {
            command: "m",
            args: [x, y],
          } satisfies PathDataItem;
          cursorPoint = [x, y];
          return relativeCommand;
        } else {
          const [x, y] = args;
          const relativeCommand = {
            command: "m",
            args: [x, y],
          } satisfies PathDataItem;
          cursorPoint = [cursorPoint[0] + x, cursorPoint[1] + y];
          return relativeCommand;
        }
      }
      case "M": {
        if (index === 0) {
          const [x, y] = args;
          const relativeCommand = {
            command: "m",
            args: [x, y],
          } satisfies PathDataItem;
          cursorPoint = [x, y];
          return relativeCommand;
        } else {
          const [x, y] = args;
          const relativeCommand = {
            command: "m",
            args: [x - cursorPoint[0], y - cursorPoint[1]],
          } satisfies PathDataItem;
          cursorPoint = [x, y];
          return relativeCommand;
        }
      }
      case "l": {
        const [x, y] = args;
        const relativeCommand = {
          command: "l",
          args: [x, y],
        } satisfies PathDataItem;
        cursorPoint = [cursorPoint[0] + x, cursorPoint[1] + y];
        return relativeCommand;
      }
      case "L": {
        const [x, y] = args;
        const relativeCommand = {
          command: "l",
          args: [x - cursorPoint[0], y - cursorPoint[1]],
        } satisfies PathDataItem;
        cursorPoint = [x, y];
        return relativeCommand;
      }
      case "h": {
        const [x] = args;
        const relativeCommand = {
          command: "h",
          args: [x],
        } satisfies PathDataItem;
        cursorPoint = [cursorPoint[0] + x, cursorPoint[1]];
        return relativeCommand;
      }
      case "H": {
        const [x] = args;
        const relativeCommand = {
          command: "h",
          args: [x - cursorPoint[0]],
        } satisfies PathDataItem;
        cursorPoint = [x, cursorPoint[1]];
        return relativeCommand;
      }
      case "v": {
        const [y] = args;
        const relativeCommand = {
          command: "v",
          args: [y],
        } satisfies PathDataItem;
        cursorPoint = [cursorPoint[0], cursorPoint[1] + y];
        return relativeCommand;
      }
      case "V": {
        const [y] = args;
        const relativeCommand = {
          command: "v",
          args: [y - cursorPoint[1]],
        } satisfies PathDataItem;
        cursorPoint = [cursorPoint[0], y];
        return relativeCommand;
      }
      case "c": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "c",
          args: [args[0], args[1], args[2], args[3], x, y],
        } satisfies PathDataItem;
        cursorPoint = [cursorPoint[0] + x, cursorPoint[1] + y];
        return relativeCommand;
      }
      case "C": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "c",
          args: [
            args[0] - cursorPoint[0],
            args[1] - cursorPoint[1], //
            args[2] - cursorPoint[0],
            args[3] - cursorPoint[1], //
            x - cursorPoint[0],
            y - cursorPoint[1],
          ],
        } satisfies PathDataItem;
        cursorPoint = [x, y];
        return relativeCommand;
      }
      case "s": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "s",
          args: [args[0], args[1], x, y],
        } satisfies PathDataItem;
        cursorPoint = [cursorPoint[0] + x, cursorPoint[1] + y];
        return relativeCommand;
      }
      case "S": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "s",
          args: [
            args[0] - cursorPoint[0],
            args[1] - cursorPoint[1], //
            x - cursorPoint[0],
            y - cursorPoint[1], //
          ],
        } satisfies PathDataItem;
        cursorPoint = [x, y];
        return relativeCommand;
      }
      case "q": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "q",
          args: [args[0], args[1], x, y],
        } satisfies PathDataItem;
        cursorPoint = [cursorPoint[0] + x, cursorPoint[1] + y];
        return relativeCommand;
      }
      case "Q": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "q",
          args: [
            args[0] - cursorPoint[0],
            args[1] - cursorPoint[1], //
            x - cursorPoint[0],
            y - cursorPoint[1], //
          ],
        } satisfies PathDataItem;
        cursorPoint = [x, y];
        return relativeCommand;
      }
      case "t": {
        const [x, y] = args;
        const relativeCommand = {
          command: "t",
          args: [x, y],
        } satisfies PathDataItem;
        cursorPoint = [cursorPoint[0] + x, cursorPoint[1] + y];
        return relativeCommand;
      }
      case "T": {
        const [x, y] = args;
        const relativeCommand = {
          command: "t",
          args: [x - cursorPoint[0], y - cursorPoint[1]],
        } satisfies PathDataItem;
        cursorPoint = [x, y];
        return relativeCommand;
      }
      case "a": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "a",
          args: [args[0], args[1], args[2], args[3], args[4], x, y],
        } satisfies PathDataItem;
        cursorPoint = [cursorPoint[0] + x, cursorPoint[1] + y];
        return relativeCommand;
      }
      case "A": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "a",
          args: [
            args[0],
            args[1],
            args[2],
            args[3],
            args[4],
            x - cursorPoint[0],
            y - cursorPoint[1], //
          ],
        } satisfies PathDataItem;
        cursorPoint = [x, y];
        return relativeCommand;
      }
      default: {
        throw new Error("unknown svg path d command");
      }
    }
  });

  return pathDataItemWithRelativeCoordinates;
}

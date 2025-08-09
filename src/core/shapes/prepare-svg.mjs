/* eslint-disable @typescript-eslint/no-unused-vars */
import { parseSvg } from "svgo/lib/parser.js";
import { parsePathData, stringifyPathData } from "svgo/lib/path.js";
import { stringifySvg } from "svgo/lib/stringifier.js";
import { optimize } from "svgo/lib/svgo.js";

let debug = false;

/**
 * Snippet to collect all turned on plugins from svgo playground site (https://jakearchibald.github.io/svgomg/)
 */
function collectTurnedOnPluginsNames() {
  const turnedInPlugins = [];
  document.querySelectorAll(".plugins input").forEach((el) => {
    if (!el.checked) {
      return;
    }

    turnedInPlugins.push(el.name);
  });
  console.log(`"${turnedInPlugins.join('","')}"`);
}

const createDimensionsExtractor = () => {
  const dimensions = {};
  const plugin = {
    type: "visitor",
    name: "extract-dimensions",
    fn() {
      return {
        element: {
          // Node, parentNode
          enter({ name, attributes }, { type }) {
            if (name === "svg" && type === "root") {
              if (attributes.width !== undefined && attributes.height !== undefined) {
                dimensions.width = Number.parseFloat(attributes.width);
                dimensions.height = Number.parseFloat(attributes.height);
              } else if (attributes.viewBox !== undefined) {
                const viewBox = attributes.viewBox.split(/,\s*|\s+/);
                dimensions.width = Number.parseFloat(viewBox[2]);
                dimensions.height = Number.parseFloat(viewBox[3]);
              }
            }
          },
        },
      };
    },
  };

  return [dimensions, plugin];
};
const [dimensions, extractDimensionsPlugin] = createDimensionsExtractor();
const optimizeConfig = {
  multipass: true,
  // js2svg: {
  //   indent: 2,
  //   pretty: true,
  // },
  plugins: [
    "preset-default", //svgo package default plugins preset

    // "cleanupAttrs",
    // "cleanupEnableBackground",
    // // "cleanupIDs", //unknown plugin
    // "cleanupListOfValues",
    // "cleanupNumericValues",
    // "collapseGroups",
    // "convertColors",
    // "convertEllipseToCircle",
    // "convertPathData",
    // "convertShapeToPath",
    "convertStyleToAttrs", ///////////    <<<--------------
    // convertStyleToAttrs,
    // "convertTransform",///////////
    // "inlineStyles",
    // "mergePaths",
    // "mergeStyles",
    // "minifyStyles",
    // "moveElemsAttrsToGroup",
    // "moveGroupAttrsToElems",
    // "removeComments",
    // "removeDesc",
    // "removeDoctype",
    // "removeEditorsNSData",
    // "removeEmptyAttrs",
    // "removeEmptyContainers",
    // "removeEmptyText",
    // "removeHiddenElems",
    // "removeMetadata",
    // "removeNonInheritableGroupAttrs",
    // "removeOffCanvasPaths",
    // "removeRasterImages",
    // "removeScriptElement",
    // "removeStyleElement",
    // "removeTitle",
    // "removeUnknownsAndDefaults",
    // "removeUnusedNS",
    // "removeUselessDefs",
    // "removeUselessStrokeAndFill",
    // "removeViewBox",
    // "removeXMLProcInst",
    // "reusePaths",
    // "sortAttrs",
    // "sortDefsChildren",

    extractDimensionsPlugin,
  ],
};

/**
 * @typedef {import('svgo/lib/types').PathDataItem} PathDataItem
 * @typedef {import('svgo/lib/types').PathDataCommand} PathDataCommand
 * @typedef {import('svgo/lib/types').XastElement} XastElement
 */

/**
 * @type {(pathDCommands:PathDataItem[], debug:boolean) => PathDataItem[]}
 */
function convertSvgPathDCommandsToCommandsWithAbsoluteCoordinates(pathDCommands, debug = false) {
  throw new Error("// todo");
  // todo
}

/**
 * @type {(pathDCommands:PathDataItem[], debug:boolean) => PathDataItem[]}
 */
function convertSvgPathDCommandsToCommandsWithRelativeCoordinates(pathDCommands, debug = false) {
  let cursorPoint = [0, 0];
  return pathDCommands.map((c, index) => {
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
          };
          cursorPoint = [x, y];
          return relativeCommand;
        } else {
          const [x, y] = args;
          const relativeCommand = {
            command: "m",
            args: [x, y],
          };
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
          };
          cursorPoint = [x, y];
          return relativeCommand;
        } else {
          const [x, y] = args;
          const relativeCommand = {
            command: "m",
            args: [x - cursorPoint[0], y - cursorPoint[1]],
          };
          cursorPoint = [x, y];
          return relativeCommand;
        }
      }
      case "l": {
        const [x, y] = args;
        const relativeCommand = {
          command: "l",
          args: [x, y],
        };
        cursorPoint = [cursorPoint[0] + x, cursorPoint[1] + y];
        return relativeCommand;
      }
      case "L": {
        const [x, y] = args;
        const relativeCommand = {
          command: "l",
          args: [x - cursorPoint[0], y - cursorPoint[1]],
        };
        cursorPoint = [x, y];
        return relativeCommand;
      }
      case "h": {
        const [x] = args;
        const relativeCommand = {
          command: "h",
          args: [x],
        };
        cursorPoint = [cursorPoint[0] + x, cursorPoint[1]];
        return relativeCommand;
      }
      case "H": {
        const [x] = args;
        const relativeCommand = {
          command: "h",
          args: [x - cursorPoint[0]],
        };
        cursorPoint = [x, cursorPoint[1]];
        return relativeCommand;
      }
      case "v": {
        const [y] = args;
        const relativeCommand = {
          command: "v",
          args: [y],
        };
        cursorPoint = [cursorPoint[0], cursorPoint[1] + y];
        return relativeCommand;
      }
      case "V": {
        const [y] = args;
        const relativeCommand = {
          command: "v",
          args: [y - cursorPoint[1]],
        };
        cursorPoint = [cursorPoint[0], y];
        return relativeCommand;
      }
      case "c": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "c",
          args: [args[0], args[1], args[2], args[3], x, y],
        };
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
        };
        cursorPoint = [x, y];
        return relativeCommand;
      }
      case "s": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "s",
          args: [args[0], args[1], x, y],
        };
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
        };
        cursorPoint = [x, y];
        return relativeCommand;
      }
      case "q": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "q",
          args: [args[0], args[1], x, y],
        };
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
        };
        cursorPoint = [x, y];
        return relativeCommand;
      }
      case "t": {
        const [x, y] = args;
        const relativeCommand = {
          command: "t",
          args: [x, y],
        };
        cursorPoint = [cursorPoint[0] + x, cursorPoint[1] + y];
        return relativeCommand;
      }
      case "T": {
        const [x, y] = args;
        const relativeCommand = {
          command: "t",
          args: [x - cursorPoint[0], y - cursorPoint[1]],
        };
        cursorPoint = [x, y];
        return relativeCommand;
      }
      case "a": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "a",
          args: [args[0], args[1], args[2], args[3], args[4], x, y],
        };
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
        };
        cursorPoint = [x, y];
        return relativeCommand;
      }
      default: {
        throw new Error("unknown svg path d command");
      }
    }
  });
}

/**
 * @type {(pathObj:XastElement, debug:boolean) => XastElement}
 */
function applyTransformOriginToPathWithRelativeCommands(pathObj, debug = false) {
  const dString = pathObj.attributes.d;
  debug && console.log("5 pathAttributeD (string)", dString);

  const pathDCommands = parsePathData(dString);
  debug && console.log("6 pathAttributeD", pathDCommands);

  const pathDCommandsWithRelativeCoordinates = convertSvgPathDCommandsToCommandsWithRelativeCoordinates(
    pathDCommands,
    debug,
  );

  debug && console.log("6.1 pathAttributeD with relative commands", pathDCommandsWithRelativeCoordinates);

  if (!["m", "M"].includes(pathDCommandsWithRelativeCoordinates[0].command)) {
    throw new Error("Svg path attribute d should start from MoveTo command (M or m)");
  }

  const firstPathDCommandObj = {
    command: "m",
    args: [0, 0],
  };
  pathDCommandsWithRelativeCoordinates.shift();
  pathDCommandsWithRelativeCoordinates.unshift(firstPathDCommandObj);

  debug && console.log(" 7 updated pathAttributeD", pathDCommandsWithRelativeCoordinates);
  debug && console.log("---");
  debug && console.log("---");
  const updatedDString = stringifyPathData({
    pathData: pathDCommandsWithRelativeCoordinates,
  });
  debug && console.log("8 updatedDString", updatedDString);

  pathObj.attributes.d = updatedDString;
  delete pathObj.attributes["transform-origin"];

  return pathObj;
}

/**
 * @type {(pathObj:XastElement, debug:boolean) => {x:number, y:number, w:number, h:number}}
 */
function calculateBoundariesByPoints(pathObj, debug = false) {
  const dString = pathObj.attributes.d;
  const pathDCommands = parsePathData(dString);

  if (!["m", "M"].includes(pathDCommands[0].command)) {
    throw new Error("Svg path attribute d should start from MoveTo command (M or m)");
  }

  let cursorPoint = [0, 0];
  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;

  /**
   * @param {number} x
   * @param {number} y
   */
  function expandBoundaries(x, y) {
    if (x < minX) {
      minX = x;
    }
    if (x > maxX) {
      maxX = x;
    }
    if (y < minY) {
      minY = y;
    }
    if (y > maxY) {
      maxY = y;
    }
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  function setBoundariesFirstPoint(x, y) {
    minX = x;
    maxX = x;
    minY = y;
    maxY = y;
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  function setCursor(x, y, init = false) {
    cursorPoint = [x, y];

    if (init) {
      setBoundariesFirstPoint(x, y);
    } else {
      expandBoundaries(x, y);
    }
  }

  pathDCommands.forEach((c, index) => {
    const { command, args } = c;
    switch (command) {
      case "z": {
        return;
      }
      case "Z": {
        return;
      }
      case "m": {
        if (index === 0) {
          const [x, y] = args;
          setCursor(x, y, true);
          return;
        } else {
          const [x, y] = args; // relative x and y coordinates
          const ax = cursorPoint[0] + x; // absolute x coordinate
          const ay = cursorPoint[1] + y; // absolute y coordinate
          setCursor(ax, ay);
          return;
        }
      }
      case "M": {
        if (index === 0) {
          const [x, y] = args;
          setCursor(x, y, true);
          return;
        } else {
          const [x, y] = args;
          setCursor(x, y);
          return;
        }
      }
      case "l": {
        const [x, y] = args;
        const ax = cursorPoint[0] + x;
        const ay = cursorPoint[1] + y;
        setCursor(ax, ay);
        return;
      }
      case "L": {
        const [x, y] = args;
        setCursor(x, y);
        return;
      }
      case "h": {
        const [x] = args;
        const ax = cursorPoint[0] + x;
        const ay = cursorPoint[1];
        setCursor(ax, ay);
        return;
      }
      case "H": {
        const [x] = args;
        setCursor(x, cursorPoint[1]);
        return;
      }
      case "v": {
        const [y] = args;
        const ax = cursorPoint[0];
        const ay = cursorPoint[1] + y;
        setCursor(ax, ay);
        return;
      }
      case "V": {
        const [y] = args;
        setCursor(cursorPoint[0], y);
        return;
      }
      case "c": {
        const [x, y] = args.slice(-2);
        const ax = cursorPoint[0] + x;
        const ay = cursorPoint[1] + y;
        setCursor(ax, ay);
        return;
      }
      case "C": {
        const [x, y] = args.slice(-2);
        setCursor(x, y);
        return;
      }
      case "s": {
        const [x, y] = args.slice(-2);
        const ax = cursorPoint[0] + x;
        const ay = cursorPoint[1] + y;
        setCursor(ax, ay);
        return;
      }
      case "S": {
        const [x, y] = args.slice(-2);
        setCursor(x, y);
        return;
      }
      case "q": {
        const [x, y] = args.slice(-2);
        const ax = cursorPoint[0] + x;
        const ay = cursorPoint[1] + y;
        setCursor(ax, ay);
        return;
      }
      case "Q": {
        const [x, y] = args.slice(-2);
        setCursor(x, y);
        return;
      }
      case "t": {
        const [x, y] = args;
        const ax = cursorPoint[0] + x;
        const ay = cursorPoint[1] + y;
        setCursor(ax, ay);
        return;
      }
      case "T": {
        const [x, y] = args;
        setCursor(x, y);
        return;
      }
      case "a": {
        const [x, y] = args.slice(-2);
        const ax = cursorPoint[0] + x;
        const ay = cursorPoint[1] + y;
        setCursor(ax, ay);
        return;
      }
      case "A": {
        const [x, y] = args.slice(-2);
        setCursor(x, y);
        return;
      }
      default: {
        throw new Error("unknown svg path d command");
      }
    }
  });

  return {
    x: minX,
    y: minY,
    w: maxX - minX,
    h: maxY - minY,
  };
}

/**
 * @type {(pathObj:XastElement, widthCoefficient:number, hCoefficient:number, debug:boolean) => XastElement}
 */
function applyScaleToPathWithCommands(pathObj, widthCoefficient, hCoefficient, debug = false) {
  const dString = pathObj.attributes.d;
  debug && console.log("6.2.0", { widthCoefficient, hCoefficient }, dString);

  const pathDCommands = parsePathData(dString);
  debug && console.log("6.2.1", pathDCommands);

  if (!["m", "M"].includes(pathDCommands[0].command)) {
    throw new Error("Svg path attribute d should start from MoveTo command (M or m)");
  }

  const wc = widthCoefficient;
  const hc = hCoefficient;
  // let cursorPoint = [0, 0];
  const updatedPathDCommands = pathDCommands.map((c, index) => {
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
            args: [x * wc, y * hc],
          };
          return relativeCommand;
        } else {
          const [x, y] = args;
          const relativeCommand = {
            command: "m",
            args: [x * wc, y * hc],
          };
          return relativeCommand;
        }
      }
      case "M": {
        if (index === 0) {
          const [x, y] = args;
          const relativeCommand = {
            command: "M",
            args: [x * wc, y * hc],
          };
          return relativeCommand;
        } else {
          const [x, y] = args;
          const relativeCommand = {
            command: "M",
            args: [x * wc, y * hc],
          };
          return relativeCommand;
        }
      }
      case "l": {
        const [x, y] = args;
        const relativeCommand = {
          command: "l",
          args: [x * wc, y * hc],
        };
        return relativeCommand;
      }
      case "L": {
        const [x, y] = args;
        const relativeCommand = {
          command: "L",
          args: [x * wc, y * hc],
        };
        return relativeCommand;
      }
      case "h": {
        const [x] = args;
        const relativeCommand = {
          command: "h",
          args: [x * wc],
        };
        return relativeCommand;
      }
      case "H": {
        const [x] = args;
        const relativeCommand = {
          command: "H",
          args: [x * wc],
        };
        return relativeCommand;
      }
      case "v": {
        const [y] = args;
        const relativeCommand = {
          command: "v",
          args: [y * hc],
        };
        return relativeCommand;
      }
      case "V": {
        const [y] = args;
        const relativeCommand = {
          command: "V",
          args: [y * hc],
        };
        return relativeCommand;
      }
      case "c": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "c",
          args: [
            args[0] * wc,
            args[1] * hc, //
            args[2] * wc,
            args[3] * hc, //
            x * wc,
            y * hc, //
          ],
        };
        return relativeCommand;
      }
      case "C": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "C",
          args: [
            args[0] * wc,
            args[1] * hc, //
            args[2] * wc,
            args[3] * hc, //
            x * wc,
            y * hc,
          ],
        };
        return relativeCommand;
      }
      case "s": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "s",
          args: [
            args[0] * wc,
            args[1] * hc, //
            x * wc,
            y * hc, //
          ],
        };
        return relativeCommand;
      }
      case "S": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "S",
          args: [
            args[0] * wc,
            args[1] * hc, //
            x * wc,
            y * hc, //
          ],
        };
        return relativeCommand;
      }
      case "q": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "q",
          args: [
            args[0] * wc,
            args[1] * hc, //
            x * wc,
            y * hc, //
          ],
        };
        return relativeCommand;
      }
      case "Q": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "Q",
          args: [
            args[0] * wc,
            args[1] * hc, //
            x * wc,
            y * hc, //
          ],
        };
        return relativeCommand;
      }
      case "t": {
        const [x, y] = args;
        const relativeCommand = {
          command: "t",
          args: [
            x * wc,
            y * hc, //
          ],
        };
        return relativeCommand;
      }
      case "T": {
        const [x, y] = args;
        const relativeCommand = {
          command: "T",
          args: [
            x * wc,
            y * hc, //
          ],
        };
        return relativeCommand;
      }
      case "a": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "a",
          args: [
            args[0] * wc,
            args[1] * wc, //* hc, //
            args[2],
            args[3],
            args[4],
            x * wc,
            y * hc, //
          ],
        };
        return relativeCommand;
      }
      case "A": {
        const [x, y] = args.slice(-2);
        const relativeCommand = {
          command: "A",
          args: [
            args[0] * wc,
            args[1] * wc, //* hc, //
            args[2],
            args[3],
            args[4],
            x * wc,
            y * hc, //
          ],
        };
        return relativeCommand;
      }
      default: {
        throw new Error("unknown svg path d command");
      }
    }
  });

  const updatedDString = stringifyPathData({ pathData: updatedPathDCommands });
  debug && console.log("6.2.2 updatedDString", updatedDString);

  pathObj.attributes.d = updatedDString;

  return pathObj;
}

/**
 * Rotates target point around origin point
 *
 * (sx, sy) - origin point
 *
 * (ex, ey) - target point
 * @param sx number
 * @param sy number
 * @param ex number
 * @param ey number
 * @param angleInDegree number
 * @returns Object {x, y}
 */
const rotatePointAroundPoint = (sx = 0, sy = 0, ex = 0, ey = 0, angleInDegree = 0) => {
  const angleInRadians = (angleInDegree * Math.PI) / 180;
  const cos = Math.cos(angleInRadians);
  const sin = Math.sin(angleInRadians);

  const nx = cos * (ex - sx) - sin * (ey - sy) + sx;
  const ny = cos * (ey - sy) + sin * (ex - sx) + sy;

  return { x: nx, y: ny };
};

/**
 * @param {number} x
 * @param {number} y
 * @returns [number, number]
 */
function rotateOnAngle90(x, y) {
  const result = rotatePointAroundPoint(0, 0, x, y, 90);
  debug && console.log("rotateOnAngle180", x, y, result);
  return [result.x, result.y];
}

/**
 * @param {number} x
 * @param {number} y
 * @returns [number, number]
 */
function rotateOnAngle180(x, y) {
  const result = rotatePointAroundPoint(0, 0, x, y, 180);
  debug && console.log("rotateOnAngle180", x, y, result);
  return [result.x, result.y];
}

/**
 * @param {number} x
 * @param {number} y
 * @returns [number, number]
 */
function rotateOnAngle270(x, y) {
  const result = rotatePointAroundPoint(0, 0, x, y, 270);
  debug && console.log("rotateOnAngle180", x, y, result);
  return [result.x, result.y];
}

/**
 * @type {(pathObj:XastElement, debug:boolean) => XastElement}
 */
function applyRotateOn180PathWithCommands(pathObj, debug = false) {
  const dString = pathObj.attributes.d;
  debug && console.log("6.3.0", { angleInDegree: 180 }, dString);

  const pathDCommands = parsePathData(dString);
  debug && console.log("6.3.1", pathDCommands);

  if (!["m", "M"].includes(pathDCommands[0].command)) {
    throw new Error("Svg path attribute d should start from MoveTo command (M or m)");
  }

  const updatedPathDCommands = pathDCommands.map((c, index) => {
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
          const rotated = rotateOnAngle180(x, y);
          const relativeCommand = {
            command: "m",
            args: [rotated[0], rotated[1]],
          };
          return relativeCommand;
        } else {
          const [x, y] = args;
          const rotated = rotateOnAngle180(x, y);
          const relativeCommand = {
            command: "m",
            args: [rotated[0], rotated[1]],
          };
          return relativeCommand;
        }
      }
      case "M": {
        if (index === 0) {
          const [x, y] = args;
          const rotated = rotateOnAngle180(x, y);
          const relativeCommand = {
            command: "M",
            args: [rotated[0], rotated[1]],
          };
          return relativeCommand;
        } else {
          const [x, y] = args;
          const rotated = rotateOnAngle180(x, y);
          const relativeCommand = {
            command: "M",
            args: [rotated[0], rotated[1]],
          };
          return relativeCommand;
        }
      }
      case "l": {
        const [x, y] = args;
        const rotated = rotateOnAngle180(x, y);
        const relativeCommand = {
          command: "l",
          args: [rotated[0], rotated[1]],
        };
        return relativeCommand;
      }
      case "L": {
        const [x, y] = args;
        const rotated = rotateOnAngle180(x, y);
        const relativeCommand = {
          command: "L",
          args: [rotated[0], rotated[1]],
        };
        return relativeCommand;
      }
      case "h": {
        const [x] = args;
        const rotated = rotateOnAngle180(x, 0);
        const relativeCommand = {
          command: "h",
          args: [rotated[0]],
        };
        return relativeCommand;
      }
      case "H": {
        const [x] = args;
        const rotated = rotateOnAngle180(x, 0);
        const relativeCommand = {
          command: "H",
          args: [rotated[0]],
        };
        return relativeCommand;
      }
      case "v": {
        const [y] = args;
        const rotated = rotateOnAngle180(0, y);
        const relativeCommand = {
          command: "v",
          args: [rotated[1]],
        };
        return relativeCommand;
      }
      case "V": {
        const [y] = args;
        const rotated = rotateOnAngle180(0, y);
        const relativeCommand = {
          command: "V",
          args: [rotated[1]],
        };
        return relativeCommand;
      }
      case "c": {
        const [x, y] = args.slice(-2);
        const rotatedA = rotateOnAngle180(args[0], args[1]);
        const rotatedB = rotateOnAngle180(args[2], args[3]);
        const rotated = rotateOnAngle180(x, y);
        const relativeCommand = {
          command: "c",
          args: [
            rotatedA[0],
            rotatedA[1], //
            rotatedB[0],
            rotatedB[1], //
            rotated[0],
            rotated[1], //
          ],
        };
        return relativeCommand;
      }
      case "C": {
        const [x, y] = args.slice(-2);
        const rotatedA = rotateOnAngle180(args[0], args[1]);
        const rotatedB = rotateOnAngle180(args[2], args[3]);
        const rotated = rotateOnAngle180(x, y);
        const relativeCommand = {
          command: "C",
          args: [
            rotatedA[0],
            rotatedA[1], //
            rotatedB[0],
            rotatedB[1], //
            rotated[0],
            rotated[1], //
          ],
        };
        return relativeCommand;
      }
      case "s": {
        const [x, y] = args.slice(-2);
        const rotatedA = rotateOnAngle180(args[0], args[1]);
        const rotated = rotateOnAngle180(x, y);
        const relativeCommand = {
          command: "s",
          args: [
            rotatedA[0],
            rotatedA[1], //
            rotated[0],
            rotated[1], //
          ],
        };
        return relativeCommand;
      }
      case "S": {
        const [x, y] = args.slice(-2);
        const rotatedA = rotateOnAngle180(args[0], args[1]);
        const rotated = rotateOnAngle180(x, y);
        const relativeCommand = {
          command: "S",
          args: [
            rotatedA[0],
            rotatedA[1], //
            rotated[0],
            rotated[1], //
          ],
        };
        return relativeCommand;
      }
      case "q": {
        const [x, y] = args.slice(-2);
        const rotatedA = rotateOnAngle180(args[0], args[1]);
        const rotated = rotateOnAngle180(x, y);
        const relativeCommand = {
          command: "q",
          args: [
            rotatedA[0],
            rotatedA[1], //
            rotated[0],
            rotated[1], //
          ],
        };
        return relativeCommand;
      }
      case "Q": {
        const [x, y] = args.slice(-2);
        const rotatedA = rotateOnAngle180(args[0], args[1]);
        const rotated = rotateOnAngle180(x, y);
        const relativeCommand = {
          command: "Q",
          args: [
            rotatedA[0],
            rotatedA[1], //
            rotated[0],
            rotated[1], //
          ],
        };
        return relativeCommand;
      }
      case "t": {
        const [x, y] = args;
        const rotated = rotateOnAngle180(x, y);
        const relativeCommand = {
          command: "t",
          args: [rotated[0], rotated[1]],
        };
        return relativeCommand;
      }
      case "T": {
        const [x, y] = args;
        const rotated = rotateOnAngle180(x, y);
        const relativeCommand = {
          command: "T",
          args: [rotated[0], rotated[1]],
        };
        return relativeCommand;
      }
      case "a": {
        const [x, y] = args.slice(-2);
        const rotated = rotateOnAngle180(x, y);
        const relativeCommand = {
          command: "a",
          args: [
            args[0],
            args[1],
            args[2],
            args[3],
            args[4],
            rotated[0],
            rotated[1], //
          ],
        };
        return relativeCommand;
      }
      case "A": {
        const [x, y] = args.slice(-2);
        const rotated = rotateOnAngle180(x, y);
        const relativeCommand = {
          command: "A",
          args: [
            args[0],
            args[1],
            args[2],
            args[3],
            args[4],
            rotated[0],
            rotated[1], //
          ],
        };
        return relativeCommand;
      }
      default: {
        throw new Error("unknown svg path d command");
      }
    }
  });

  debug && console.log("6.3.2.1 updatedDString", updatedPathDCommands);

  const updatedDString = stringifyPathData({ pathData: updatedPathDCommands });
  debug && console.log("6.3.2.2 updatedDString", updatedDString);

  pathObj.attributes.d = updatedDString;

  return pathObj;
}

/**
 * @param {string} str - SVG String
 * @param {number} newWidth - new width for svg element
 * @param {boolean} debug - turn on console.log calls with debug information
 * @returns
 */
function prepareSvgStringOfOfEdgeSideOfSquare(str, newWidth = 1.0, debug = false) {
  let svgRootObj = parseSvg(str);
  debug && console.log("-2 svg root element", svgRootObj);

  /**
   * @type {XastElement}
   */
  const svgObj = svgRootObj.children[0];
  debug && console.log("-1 svg element", svgObj);

  /**
   * @type {XastElement}
   */
  let pathObj = svgObj.children[0];
  debug && console.log("- 0 path", pathObj);
  debug && console.log("- 1 svg-element_attributes", svgObj.attributes);
  debug && console.log("- 2 path-element_attributes", pathObj.attributes);

  pathObj = applyTransformOriginToPathWithRelativeCommands(pathObj, debug);
  svgObj.children[0] = pathObj;

  {
    const { x, y, w, h } = calculateBoundariesByPoints(pathObj, debug);
    debug && console.log("- 5 boundaries", { x, y, w, h });

    // scale down(or up) path to size 1 by width
    const wCoefficient = 1 / w;
    const hCoefficient = wCoefficient;
    pathObj = applyScaleToPathWithCommands(pathObj, wCoefficient, hCoefficient, debug);
    svgObj.children[0] = pathObj;
    debug && console.log("- 6 scaled down to 1.0 size of width", pathObj);
  }

  {
    const { x, y, w, h } = calculateBoundariesByPoints(pathObj, debug);
    debug && console.log("- 7 boundaries", { x, y, w, h });

    if (x < 0) {
      // rotate on 180 degrees around point [0,0]
      pathObj = applyRotateOn180PathWithCommands(pathObj, debug);
    }
  }

  {
    const { x, y, w, h } = calculateBoundariesByPoints(pathObj, debug);
    debug && console.log("- 8 boundaries", { x, y, w, h });
  }

  delete svgObj.attributes["viewBox"];
  delete svgObj.attributes["width"];
  delete svgObj.attributes["height"];

  svgRootObj.children[0] = svgObj;
  const resultSvgRootString = stringifySvg(svgRootObj);

  debug && console.log("- 9 spaceholder");
  debug && console.log(10, { resultSvgRootString });

  return resultSvgRootString;
}

/**
 * Process svg string by svgo to optimize svg content
 *
 * @param {string} originalSvgAsString
 * @param {boolean} debug - turn on logs
 * @param {boolean} debug2 - turn on additional logs
 */
export function main(originalSvgAsString, debug = false, debug2 = false) {
  debug && console.log("");
  debug && console.log(" 01 original svg (string)", { data: originalSvgAsString });

  const { data: svgStringOnceOptimized } = optimize(originalSvgAsString, optimizeConfig);

  debug && console.log("");
  debug &&
    console.log(" 02 once optimized svg (string)", {
      data: svgStringOnceOptimized,
    });

  const processedSvgString = prepareSvgStringOfOfEdgeSideOfSquare(
    svgStringOnceOptimized,
    1024, // new width
    debug2, // print debug logs
  );

  debug && console.log(" 03 processedSvgString", { data: processedSvgString });

  debug && console.log("===");
  debug && console.log("===");

  const { data: svgStringTwiceOptimized } = optimize(processedSvgString, optimizeConfig);

  debug && console.log(" 04 optimize call 2", { data: svgStringTwiceOptimized });
  debug && console.log("");

  console.log("processed svg string", { data: svgStringTwiceOptimized });
}

const a1 = `
<?xml version="1.0" encoding="utf-8"?>
<svg
viewBox="209.648 95.213 4.042 1.057"
width="209.648"
height="95.213"
xmlns="http://www.w3.org/2000/svg">
  <path
  d="M 213.69 95.735 L 212.7 95.735 C 212.697 95.446 212.462 95.213 212.172 95.213 C 211.882 95.213 211.646 95.446 211.643 95.735 C 211.643 95.738 211.643 95.739 211.643 95.741 C 211.643 95.742 211.643 95.742 211.643 95.742 C 211.643 96.034 211.406 96.27 211.114 96.27 C 210.822 96.27 210.586 96.033 210.586 95.741 C 210.586 95.739 210.586 95.738 210.586 95.735 L 209.648 95.735"
  style="stroke: rgb(0, 0, 0); fill: rgb(49, 254, 1); fill-opacity: 0.6; stroke-width: 0.1px; transform-origin: 211.669px 97.495px;"
   transform="matrix(1, 0, 0, 1, 0, 2e-12)"
   ></path>
</svg>
`;

const a2 = `
<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="215.856 105.397 4.034 0.2854" width="215.856" height="105.397" xmlns="http://www.w3.org/2000/svg">
  <path style="stroke: rgb(0, 0, 0); fill: rgb(49, 254, 1); fill-opacity: 0.6; stroke-width: 0.1px;" d="M 215.856 105.397 L 216.384 105.397 L 216.639 105.68 C 216.965 105.682 217.294 105.68 217.294 105.68 L 217.547 105.397 L 217.873 105.398 L 218.2 105.399 L 218.453 105.682 C 218.781 105.683 219.108 105.682 219.108 105.682 L 219.362 105.399 L 219.89 105.399" transform="matrix(1, 0, 0, 1, 0, 1.4210854715202004e-14)"/>
</svg>
`;

const a3 = `
<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="222.409 95.56 4.358 0.621" width="222.409" height="95.56" xmlns="http://www.w3.org/2000/svg">
  <path d="M 222.409 95.56 L 223.371 95.56 C 223.428 95.56 223.471 95.576 223.499 95.606 C 223.854 95.994 223.983 96.134 223.983 96.134 C 224.011 96.165 224.054 96.181 224.11 96.181 L 225.072 96.181 C 225.129 96.181 225.172 96.165 225.2 96.134 C 225.341 95.979 225.677 95.611 225.677 95.611 C 225.705 95.581 225.748 95.565 225.804 95.565 L 226.767 95.565" style="stroke: rgb(0, 0, 0); fill-opacity: 0.6; fill: rgb(49, 254, 1); stroke-width: 0.1px;" transform="matrix(1, 0, 0, 1, 0, 1.4210854715202004e-14)"></path>
</svg>
`;

const a4 = `
<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="216.035 95.638 4.014 0.5133" width="216.035" height="95.638" xmlns="http://www.w3.org/2000/svg">
  <path style="stroke: rgb(0, 0, 0); fill: rgb(49, 254, 1); fill-opacity: 0.6; stroke-width: 0.1px;" d="M 216.035 95.638 L 216.991 95.638 L 217.45 96.15 C 218.042 96.153 218.635 96.15 218.635 96.15 L 219.094 95.638 L 220.049 95.638" transform="matrix(1, 0, 0, 1, 0, 1.4210854715202004e-14)"></path>
</svg>
`;

const a5 = `
<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="195.887 95.519 4.058 1.777" width="195.887" height="95.519" xmlns="http://www.w3.org/2000/svg">
  <path d="M 199.945 95.519 C 199.902 95.519 198.9 95.519 198.9 95.519 L 198.9 95.86 C 199.011 95.931 199.085 96.055 199.085 96.196 C 199.085 96.415 198.907 96.593 198.688 96.593 C 198.469 96.593 198.291 96.415 198.291 96.196 C 198.291 96.054 198.365 95.93 198.477 95.86 L 198.477 95.519 L 197.589 95.519 L 197.589 96.385 C 197.704 96.479 197.778 96.623 197.778 96.783 C 197.778 97.066 197.548 97.296 197.265 97.296 C 196.982 97.296 196.752 97.066 196.752 96.783 C 196.752 96.622 196.826 96.478 196.942 96.384 L 196.942 95.519 C 195.935 95.519 195.887 95.519 195.887 95.519" style="stroke: rgb(0, 0, 0); stroke-width: 0.1px; fill: rgb(49, 254, 1); fill-opacity: 0.6; transform-origin: 197.919px 96.407px;" transform="matrix(1, 0, 0, 1, 0, 2e-12)"/>
</svg>
`;

const a = `
<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="236.524 95.544 4.095 0.7827" width="236.524" height="95.544" xmlns="http://www.w3.org/2000/svg">
  <path style="stroke: rgb(0, 0, 0); fill: rgb(49, 254, 1); fill-opacity: 0.6; stroke-width: 0.1px; transform-origin: 237.681px 95.935px;" d="M 240.619 95.549 C 240.619 95.549 239.301 95.545 239.068 95.545 C 238.835 95.544 239.016 95.692 239.235 95.952 C 239.454 96.212 239.237 96.337 239.08 96.326 C 238.571 96.323 238.062 96.325 238.062 96.325 C 237.906 96.337 237.689 96.212 237.908 95.952 C 238.126 95.692 238.308 95.543 238.075 95.544 C 237.842 95.545 236.524 95.549 236.524 95.549" transform="matrix(1, 0, 0, 1, 0, 2e-12)"></path>
</svg>
`;

console.log(" >>> processing svg");
main(a1);
main(a2);
main(a3);
main(a4, true, true);
main(a5, true);

main(a);

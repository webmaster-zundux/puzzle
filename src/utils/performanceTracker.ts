import { log } from "../utils-logs/printToConsole";
import { limitNumberToInteger } from "./limitNumberToInteger";

const marks = new Map<string, number>();
const START_SYMBOL = "start";
const END_SYMBOL = "end";

export type TemplateFunc = (timeMs: number) => string;

export const performancePrintPassedTime = (tag: string, templateFunc?: TemplateFunc, delayed: boolean = true): void => {
  const startKey = `${tag}-${START_SYMBOL}`;
  const endKey = `${tag}-${END_SYMBOL}`;

  const start = marks.get(startKey);
  if (typeof start === "undefined") {
    log(`Warning. Start timemark is undefined. Can not print passed time for tag ${tag}.`);

    return;
  }

  const end = marks.get(endKey);
  if (typeof end === "undefined") {
    log(`Warning. End timemark is undefined. Can not print passed time for tag ${tag}. `);

    return;
  }

  if (start > end) {
    log(`Warning. Start timemark older than end timemark. Can not print passed time for tag ${tag}. `);

    return;
  }

  const timeMs = limitNumberToInteger(end - start);

  marks.delete(startKey);
  marks.delete(endKey);

  const defaultMessage = `${timeMs} ms passed`;

  let message = defaultMessage;
  if (typeof templateFunc === "function") {
    message = templateFunc(timeMs);
  }

  if (delayed) {
    setTimeout(() => {
      log(message);
    }, 0);

    return;
  }

  log(message);
};

export const performanceStartMark = (tag: string): number => {
  const timemark = performance.now();
  marks.set(`${tag}-${START_SYMBOL}`, timemark);

  return timemark;
};

export const performanceEndMark = (tag: string, print = false): number => {
  const timemark = performance.now();
  marks.set(`${tag}-${END_SYMBOL}`, timemark);

  if (print) {
    performancePrintPassedTime(tag, undefined, false);
  }

  return timemark;
};

function printLogToConsole(...args: unknown[]) {
  console.log(...args);
}

export const log = (first: unknown, ...rest: unknown[]) => {
  // @ts-expect-error Property does not exist on type 'Window & typeof globalThis'.
  const logFilterString = window?.logFilterString;
  const logFilterRegExp = new RegExp(logFilterString, "gi");
  const logFilter = (value: unknown) => {
    if (!logFilterString) {
      return false;
    }

    return logFilterRegExp.test(String(value));
  };

  if (typeof first === "function") {
    const result = first();
    if (!logFilter(first)) {
      return;
    }
    printLogToConsole(result, ...rest);
    return;
  }

  if (!logFilter(first)) {
    return;
  }

  printLogToConsole(first, ...rest);
};

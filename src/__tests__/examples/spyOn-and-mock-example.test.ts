import { vi, afterEach, describe, test, expect } from "vitest";

import { main } from "./main";
import * as sumModule from "./sum";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("spyOn and mock example", () => {
  test.skip('main() prints string "sum(12, 22) is 34"', () => {
    const spyConsoleLog = vi.spyOn(console, "log").mockImplementation(() => undefined);

    // const spySum =
    vi.spyOn(sumModule, "sum") // works only for math().sum (but does not work for math.sum)
      .mockImplementation(() => 34);

    main();

    // expect(spySum).toHaveBeenCalledOnce()
    // expect(spySum).toHaveBeenLastCalledWith(12, 22)
    // or
    expect(sumModule.sum).toHaveBeenCalledOnce();
    expect(sumModule.sum).toHaveBeenLastCalledWith(12, 22);

    expect(spyConsoleLog).toHaveBeenCalledOnce();
    expect(spyConsoleLog).toHaveBeenLastCalledWith(34, "sum(12, 22) is 34", 4004);
  });
});

import { describe, test, vi } from "vitest";
import { read, write } from "./localStorage";

describe.skip("localStorage isolation example ALPHA", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  test("read and writes to localStorage in time period of 1 second", () => {
    console.log("write at initialization", write("some data to write ALPHA-at-initial-time"));

    setTimeout(() => {
      console.log("write at 0", write("some data to write ALPHA-after-zero"));
    }, 0);

    setTimeout(() => {
      console.log("write at 100", write("some data to write ALPHA-100"));
    }, 100);

    setTimeout(() => {
      console.log("A-reader after 0", read());
    }, 0);
    setTimeout(() => {
      console.log("A-reader after 100", read());
    }, 100);
    setTimeout(() => {
      console.log("A-reader after 200", read());
    }, 200);
    setTimeout(() => {
      console.log("A-reader after 300", read());
    }, 300);
    setTimeout(() => {
      console.log("A-reader after 400", read());
    }, 400);
    setTimeout(() => {
      console.log("A-reader after 500", read());
    }, 500);

    vi.advanceTimersByTime(2000);
  });
});

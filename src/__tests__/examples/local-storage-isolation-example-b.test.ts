import { read, write } from "./localStorage";

describe.skip("localStorage isolation example BETA", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  test("read and writes to localStorage in time period of 1 second", () => {
    console.log("write", write("some data to write BETA-at-initial-time"));

    setTimeout(() => {
      console.log("write at 0", write("some data to write BETA-after-zero"));
    }, 0);

    setTimeout(() => {
      console.log("write at 50", write("some data to write BETA-after-50"));
    }, 50);

    setTimeout(() => {
      console.log("B-reader after 0", read());
    }, 0);
    setTimeout(() => {
      console.log("B-reader after 150", read());
    }, 150);
    setTimeout(() => {
      console.log("B-reader after 250", read());
    }, 250);
    setTimeout(() => {
      console.log("B-reader after 350", read());
    }, 350);
    setTimeout(() => {
      console.log("B-reader after 450", read());
    }, 450);
    setTimeout(() => {
      console.log("B-reader after 550", read());
    }, 550);

    vi.advanceTimersByTime(4000);
  });
});

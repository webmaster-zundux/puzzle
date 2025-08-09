import { vi } from "vitest";

function executeAfterTwoHours(func: () => void) {
  setTimeout(func, 1000 * 60 * 60 * 2); // 2 hours
}

function executeEveryMinute(func: () => void) {
  setInterval(func, 1000 * 60); // 1 minute
}

function executeAfterTwoSeconds(func: () => void) {
  setTimeout(func, 1000 * 2); // 2 seconds
}

const mock = vi.fn(() => console.log("executed"));

describe.skip("delayed execution", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should execute the function", () => {
    executeAfterTwoHours(mock);
    vi.runAllTimers();
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it("should not execute the function", () => {
    executeAfterTwoHours(mock);
    // advancing by 2ms won't trigger the func
    vi.advanceTimersByTime(2);
    expect(mock).not.toHaveBeenCalled();
  });

  it("should execute every minute", () => {
    executeEveryMinute(mock);
    vi.advanceTimersToNextTimer();
    expect(mock).toHaveBeenCalledTimes(1);
    vi.advanceTimersToNextTimer();
    expect(mock).toHaveBeenCalledTimes(2);
  });

  it("should execute the function after 2 seconds", () => {
    executeAfterTwoSeconds(mock);
    expect(mock).toHaveBeenCalledTimes(0);
    vi.advanceTimersByTime(1000);
    expect(mock).toHaveBeenCalledTimes(0);
    vi.advanceTimersByTime(3000);
    expect(mock).toHaveBeenCalledTimes(1);
  });
});

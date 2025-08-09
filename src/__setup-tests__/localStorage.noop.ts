import { vi } from "vitest";

const localStorageMock = {
  getItem: vi.fn().mockImplementation(() => null),
  setItem: vi.fn().mockImplementation(() => undefined),
  removeItem: vi.fn().mockImplementation(() => undefined),
  clear: vi.fn().mockImplementation(() => undefined),
  length: vi.fn().mockImplementation(() => 0),
  key: vi.fn().mockImplementation(() => null),
  valueOf: vi.fn().mockImplementation(() => {}),
  toString: vi.fn().mockImplementation(() => "[object Storage]"),
};
vi.stubGlobal("localStorage", localStorageMock);

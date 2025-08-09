import "@testing-library/jest-dom/vitest";
import "vitest-canvas-mock";
import { expect } from "vitest";
import * as jestExtendedMatchers from "jest-extended";
import "snapshot-diff/extend-expect";
import crypto from "crypto";

expect.extend(jestExtendedMatchers);

Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => crypto.randomUUID(),
  },
});

vi.mock("react-svg");
vi.mock("./models/Challenge");
vi.mock("./hooks/useElementResize");
vi.mock("./hooks/useCanvasResize");
vi.mock("../modals/ChangeImageModal/hooks/useLoadImageForPreview");

import "./__setup-tests__/localStorage.noop.ts";

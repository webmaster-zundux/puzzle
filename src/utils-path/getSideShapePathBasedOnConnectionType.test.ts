import { describe, expect, it } from "vitest";
import { parsePath2dCommandsFromString } from "../models/path2d-commands/Path2dCommand";
import { getPlugSideShape } from "./getPlugSideShape";
import { getSocketSideShape, path2dCommandsToString } from "./getSocketSideShape";

describe.skip("get straight line side shape", () => {
  it.skip("of top side", () => {});
  it.skip("of right side", () => {});
  it.skip("of bottom side", () => {});
  it.skip("of left side", () => {});
});

describe("shape: two big pins", () => {
  const edgeShapeTwoPinsBiggerPath2d = `m 0 0 h 0.258 v 0.084 a 0.098 0.098 90 1 0 0.104 0 v -0.084 h 0.218 v 0.213 a 0.127 0.127 90 1 0 0.159 0 v -0.213 h 0.261`;
  const sideShapeAsSocket = parsePath2dCommandsFromString(edgeShapeTwoPinsBiggerPath2d);

  const expectedTopSideSocketString = `m 0 0 h 0.258 v 0.084 a 0.098 0.098 90 1 0 0.104 0 v -0.084 h 0.218 v 0.213 a 0.127 0.127 90 1 0 0.159 0 v -0.213 h 0.261`;
  const expectedRightSideSocketString = `m 0 0 v 0.258 h -0.084 a 0.098 0.098 180 1 0 0 0.104 h 0.084 v 0.218 h -0.213 a 0.127 0.127 180 1 0 0 0.159 h 0.213 v 0.261`;
  const expectedBottomSideSocketString = `m 0 0 h -0.258 v -0.084 a 0.098 0.098 270 1 0 -0.104 0 v 0.084 h -0.218 v -0.213 a 0.127 0.127 270 1 0 -0.159 0 v 0.213 h -0.261`;
  const expectedLeftSideSocketString = `m 0 0 v -0.258 h 0.084 a 0.098 0.098 0 1 0 0 -0.104 h -0.084 v -0.218 h 0.213 a 0.127 0.127 0 1 0 0 -0.159 h -0.213 v -0.261`;

  const expectedTopSidePlugString = `m 0 0 h 0.258 v -0.084 a 0.098 0.098 90 1 1 0.104 0 v 0.084 h 0.218 v -0.213 a 0.127 0.127 90 1 1 0.159 0 v 0.213 h 0.261`;
  const expectedRightSidePlugString = `m 0 0 v 0.258 h 0.084 a 0.098 0.098 180 1 1 0 0.104 h -0.084 v 0.218 h 0.213 a 0.127 0.127 180 1 1 0 0.159 h -0.213 v 0.261`;
  const expectedBottomSidePlugString = `m 0 0 h -0.258 v 0.084 a 0.098 0.098 270 1 1 -0.104 0 v -0.084 h -0.218 v 0.213 a 0.127 0.127 270 1 1 -0.159 0 v -0.213 h -0.261`;
  const expectedLeftSidePlugString = `m 0 0 v -0.258 h -0.084 a 0.098 0.098 0 1 1 0 -0.104 h 0.084 v -0.218 h -0.213 a 0.127 0.127 0 1 1 0 -0.159 h 0.213 v -0.261`;

  describe("get socket side shape", () => {
    it("of top side", () => {
      const topSideShapeAsSocket = getSocketSideShape(0, sideShapeAsSocket);
      const topSideShapeAsSocketString = path2dCommandsToString(topSideShapeAsSocket);

      expect(topSideShapeAsSocketString).toBe(expectedTopSideSocketString);
    });

    it("of right side", () => {
      const rightSideShapeAsSocket = getSocketSideShape(90, sideShapeAsSocket);
      const rightSideShapeAsSocketString = path2dCommandsToString(rightSideShapeAsSocket);

      expect(rightSideShapeAsSocketString).toBe(expectedRightSideSocketString);
    });

    it("of bottom side", () => {
      const bottomSideShapeAsSocket = getSocketSideShape(180, sideShapeAsSocket);
      const bottomSideShapeAsSocketString = path2dCommandsToString(bottomSideShapeAsSocket);

      expect(bottomSideShapeAsSocketString).toBe(expectedBottomSideSocketString);
    });

    it("of left side", () => {
      const leftSideShapeAsSocket = getSocketSideShape(270, sideShapeAsSocket);
      const leftSideShapeAsSocketString = path2dCommandsToString(leftSideShapeAsSocket);

      expect(leftSideShapeAsSocketString).toBe(expectedLeftSideSocketString);
    });
  });

  describe("get plug side shape", () => {
    it("of top side", () => {
      const topSideShapeAsPlug = getPlugSideShape(0, sideShapeAsSocket);
      const topSideShapeAsPlugString = path2dCommandsToString(topSideShapeAsPlug);

      expect(topSideShapeAsPlugString).toBe(expectedTopSidePlugString);
    });

    it("of right side", () => {
      const rightSideShapeAsPlug = getPlugSideShape(90, sideShapeAsSocket);
      const rightSideShapeAsPlugString = path2dCommandsToString(rightSideShapeAsPlug);

      expect(rightSideShapeAsPlugString).toBe(expectedRightSidePlugString);
    });

    it("of bottom side", () => {
      const bottomSideShapeAsPlug = getPlugSideShape(180, sideShapeAsSocket);
      const bottomSideShapeAsPlugString = path2dCommandsToString(bottomSideShapeAsPlug);

      expect(bottomSideShapeAsPlugString).toBe(expectedBottomSidePlugString);
    });

    it("of left side", () => {
      const leftSideShapeAsPlug = getPlugSideShape(270, sideShapeAsSocket);
      const leftSideShapeAsPlugString = path2dCommandsToString(leftSideShapeAsPlug);

      expect(leftSideShapeAsPlugString).toBe(expectedLeftSidePlugString);
    });
  });
});

describe("shape: underground river circle bottom in hill", () => {
  const edgeShapeUndergroundRiverCircleBottomInHillPath2d = `m 0 0 s 0.372 -0.061, 0.397 -0.067 s 0.043 0.014, 0.017 0.04 a 0.13 0.13 90 0 0 -0.046 0.1 a 0.13 0.13 90 0 0 0.132 0.13 a 0.13 0.13 90 0 0 0.086 -0.23 c -0.026 -0.025, -0.008 -0.045, 0.017 -0.039 s 0.397 0.066, 0.397 0.066`;
  const sideShapeAsSocket = parsePath2dCommandsFromString(edgeShapeUndergroundRiverCircleBottomInHillPath2d);

  const expectedTopSideSocketString = `m 0 0 s 0.372 -0.061, 0.397 -0.067 s 0.043 0.014, 0.017 0.04 a 0.13 0.13 90 0 0 -0.046 0.1 a 0.13 0.13 90 0 0 0.132 0.13 a 0.13 0.13 90 0 0 0.086 -0.23 c -0.026 -0.025, -0.008 -0.045, 0.017 -0.039 s 0.397 0.066, 0.397 0.066`;
  const expectedRightSideSocketString = `m 0 0 s 0.061 0.372, 0.067 0.397 s -0.014 0.043, -0.04 0.017 a 0.13 0.13 180 0 0 -0.1 -0.046 a 0.13 0.13 180 0 0 -0.13 0.132 a 0.13 0.13 180 0 0 0.23 0.086 c 0.025 -0.026, 0.045 -0.008, 0.039 0.017 s -0.066 0.397, -0.066 0.397`;
  const expectedBottomSideSocketString = `m 0 0 s -0.372 0.061, -0.397 0.067 s -0.043 -0.014, -0.017 -0.04 a 0.13 0.13 270 0 0 0.046 -0.1 a 0.13 0.13 270 0 0 -0.132 -0.13 a 0.13 0.13 270 0 0 -0.086 0.23 c 0.026 0.025, 0.008 0.045, -0.017 0.039 s -0.397 -0.066, -0.397 -0.066`;
  const expectedLeftSideSocketString = `m 0 0 s -0.061 -0.372, -0.067 -0.397 s 0.014 -0.043, 0.04 -0.017 a 0.13 0.13 0 0 0 0.1 0.046 a 0.13 0.13 0 0 0 0.13 -0.132 a 0.13 0.13 0 0 0 -0.23 -0.086 c -0.025 0.026, -0.045 0.008, -0.039 -0.017 s 0.066 -0.397, 0.066 -0.397`;

  const expectedTopSidePlugString = `m 0 0 s 0.372 0.061, 0.397 0.067 s 0.043 -0.014, 0.017 -0.04 a 0.13 0.13 90 0 1 -0.046 -0.1 a 0.13 0.13 90 0 1 0.132 -0.13 a 0.13 0.13 90 0 1 0.086 0.23 c -0.026 0.025, -0.008 0.045, 0.017 0.039 s 0.397 -0.066, 0.397 -0.066`;
  const expectedRightSidePlugString = `m 0 0 s -0.061 0.372, -0.067 0.397 s 0.014 0.043, 0.04 0.017 a 0.13 0.13 180 0 1 0.1 -0.046 a 0.13 0.13 180 0 1 0.13 0.132 a 0.13 0.13 180 0 1 -0.23 0.086 c -0.025 -0.026, -0.045 -0.008, -0.039 0.017 s 0.066 0.397, 0.066 0.397`;
  const expectedBottomSidePlugString = `m 0 0 s -0.372 -0.061, -0.397 -0.067 s -0.043 0.014, -0.017 0.04 a 0.13 0.13 270 0 1 0.046 0.1 a 0.13 0.13 270 0 1 -0.132 0.13 a 0.13 0.13 270 0 1 -0.086 -0.23 c 0.026 -0.025, 0.008 -0.045, -0.017 -0.039 s -0.397 0.066, -0.397 0.066`;
  const expectedLeftSidePlugString = `m 0 0 s 0.061 -0.372, 0.067 -0.397 s -0.014 -0.043, -0.04 -0.017 a 0.13 0.13 0 0 1 -0.1 0.046 a 0.13 0.13 0 0 1 -0.13 -0.132 a 0.13 0.13 0 0 1 0.23 -0.086 c 0.025 0.026, 0.045 0.008, 0.039 -0.017 s -0.066 -0.397, -0.066 -0.397`;

  describe("get socket side shape", () => {
    it("of top side", () => {
      const topSideShapeAsSocket = getSocketSideShape(0, sideShapeAsSocket);
      const topSideShapeAsSocketString = path2dCommandsToString(topSideShapeAsSocket);

      expect(topSideShapeAsSocketString).toBe(expectedTopSideSocketString);
    });

    it("of right side", () => {
      const rightSideShapeAsSocket = getSocketSideShape(90, sideShapeAsSocket);
      const rightSideShapeAsSocketString = path2dCommandsToString(rightSideShapeAsSocket);

      expect(rightSideShapeAsSocketString).toBe(expectedRightSideSocketString);
    });

    it("of bottom side", () => {
      const bottomSideShapeAsSocket = getSocketSideShape(180, sideShapeAsSocket);
      const bottomSideShapeAsSocketString = path2dCommandsToString(bottomSideShapeAsSocket);

      expect(bottomSideShapeAsSocketString).toBe(expectedBottomSideSocketString);
    });

    it("of left side", () => {
      const leftSideShapeAsSocket = getSocketSideShape(270, sideShapeAsSocket);
      const leftSideShapeAsSocketString = path2dCommandsToString(leftSideShapeAsSocket);

      expect(leftSideShapeAsSocketString).toBe(expectedLeftSideSocketString);
    });
  });

  describe("get plug side shape", () => {
    it("of top side", () => {
      const topSideShapeAsPlug = getPlugSideShape(0, sideShapeAsSocket);
      const topSideShapeAsPlugString = path2dCommandsToString(topSideShapeAsPlug);

      expect(topSideShapeAsPlugString).toBe(expectedTopSidePlugString);
    });

    it("of right side", () => {
      const rightSideShapeAsPlug = getPlugSideShape(90, sideShapeAsSocket);
      const rightSideShapeAsPlugString = path2dCommandsToString(rightSideShapeAsPlug);

      expect(rightSideShapeAsPlugString).toBe(expectedRightSidePlugString);
    });

    it("of bottom side", () => {
      const bottomSideShapeAsPlug = getPlugSideShape(180, sideShapeAsSocket);
      const bottomSideShapeAsPlugString = path2dCommandsToString(bottomSideShapeAsPlug);

      expect(bottomSideShapeAsPlugString).toBe(expectedBottomSidePlugString);
    });

    it("of left side", () => {
      const leftSideShapeAsPlug = getPlugSideShape(270, sideShapeAsSocket);
      const leftSideShapeAsPlugString = path2dCommandsToString(leftSideShapeAsPlug);

      expect(leftSideShapeAsPlugString).toBe(expectedLeftSidePlugString);
    });
  });
});

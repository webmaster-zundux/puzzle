import { sum } from "./sum";

test.skip("sum(1, 1) returns 2", () => {
  expect(sum(1, 1)).toEqual(2);
});

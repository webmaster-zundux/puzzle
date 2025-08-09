import { render } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { Demo } from "./Demo";
import * as IdFactory from "./IdFactory";

test.skip("findOne fetches data from the API endpoint", async () => {
  const id100 = "id: 100";
  const id200 = "id: 200";
  const id300 = "id: 300";

  const spyGenerateId = vi
    .spyOn(IdFactory, "getId")
    .mockImplementationOnce(() => id100)
    .mockImplementationOnce(() => id200)
    .mockImplementationOnce(() => id300);

  render(<Demo />);
  expect(spyGenerateId).toHaveBeenCalledTimes(1);
  expect(spyGenerateId).toHaveBeenCalledWith();
  expect(spyGenerateId).toHaveLastReturnedWith(id100);

  render(<Demo />);
  expect(spyGenerateId).toHaveLastReturnedWith(id200);

  render(<Demo />);
  expect(spyGenerateId).toHaveLastReturnedWith(id300);
});

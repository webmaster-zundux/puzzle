import { expect, test, vi } from "vitest";
import * as IdFactory from "./IdFactory";
import { generateId } from "./generateId";

test.skip("findOne fetches data from the API endpoint", async () => {
  const id100 = "id: 100";
  const id200 = "id: 200";
  const id300 = "id: 300";

  const spyGenerateId = vi
    .spyOn(IdFactory, "getId")
    .mockImplementationOnce(() => "id: 100")
    .mockImplementationOnce(() => "id: 200")
    .mockImplementationOnce(() => "id: 300");

  await generateId();
  expect(spyGenerateId).toHaveBeenCalledTimes(1);
  expect(spyGenerateId).toHaveBeenCalledWith();
  expect(spyGenerateId).toHaveLastReturnedWith(id100);

  await generateId();
  expect(spyGenerateId).toHaveLastReturnedWith(id200);

  await generateId();
  expect(spyGenerateId).toHaveLastReturnedWith(id300);
});

test.skip("findOne returns what axios get returns", async () => {
  // IdFactory.getId = vi.fn().mockResolvedValue('id: 8000'); // ts error - Cannot assign to 'getId' because it is a read-only property
  Object.defineProperty(IdFactory, "getId", {
    value: vi.fn().mockReturnValue("id: 8000"),
  });

  const id = generateId();
  expect(id).toBe("id: 8000");
});

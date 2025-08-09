import * as axios from "./axios";
import { expect, test, vi } from "vitest";
import { findOne } from "./userService";

test.skip("findOne returns a user", async () => {
  const user = await findOne(1);
  expect(user).toHaveProperty("id", 1);
  expect(user).toHaveProperty("name", "Leanne Graham");
});

test.skip("findOne fetches data from the API endpoint", async () => {
  const sam = { data: { id: 1, name: "Sam" } };
  const tim = { data: { id: 2, name: "Tim" } };
  const jim = { data: { id: 3, name: "Jim" } };
  const spyGet = vi
    .spyOn(axios, "get")
    .mockResolvedValueOnce(sam)
    .mockResolvedValueOnce(tim)
    .mockResolvedValueOnce(jim);

  await findOne(1);
  expect(spyGet).toHaveBeenCalledTimes(1);
  expect(spyGet).toHaveBeenCalledWith(`https://jsonplaceholder.typicode.com/users/1`);
  expect(spyGet).toHaveLastReturnedWith(sam);

  await findOne(2);
  expect(spyGet).toHaveLastReturnedWith(tim);

  await findOne(3);
  expect(spyGet).toHaveLastReturnedWith(jim);
});

test.skip("findOne returns what axios get returns", async () => {
  // @ts-expect-error - Cannot assign to 'get' because it is a read-only property.ts(2540)
  axios.get = vi.fn().mockResolvedValue({
    data: {
      id: 1,
      name: "Dale Seo",
    },
  });

  const user = await findOne(1);
  expect(user).toHaveProperty("id", 1);
  expect(user).toHaveProperty("name", "Dale Seo");
});

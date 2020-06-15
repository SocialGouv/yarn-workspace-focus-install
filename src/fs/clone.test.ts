import { copy } from "fs-extra";

import { cloneFolders } from "./clone";

jest.mock("fs-extra");

test.concurrent("clone the qux", async () => {
  const cloneFromFooToBar = cloneFolders("foo", "bar");
  await cloneFromFooToBar("qux");
  expect(copy).toHaveBeenCalledWith("foo/qux", "bar/qux");
});

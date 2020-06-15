import { removeKeys } from "src/pkg/removeKeys";

import { removeUnnecessaryDependencies } from "./removeUnnecessaryWorkspaces";

jest.mock("src/pkg/removeKeys");

test("shouldn't remove self dependencies", async () => {
  await removeUnnecessaryDependencies(
    "/root",
    {
      foo: {
        location: "packages/foo",
        workspaceDependencies: [],
      },
    },
    "packages/foo"
  );
  expect(removeKeys).not.toHaveBeenCalled();
});

test("removes unnecessary workspaces", async () => {
  await removeUnnecessaryDependencies(
    "/root",
    {
      bar: {
        location: "packages/bar",
        workspaceDependencies: [],
      },
      foo: {
        location: "packages/foo",
        workspaceDependencies: ["bar"],
      },
      lol: {
        location: "packages/lol",
        workspaceDependencies: [],
      },
    },
    "packages/foo"
  );
  expect(removeKeys).toHaveBeenCalledWith("/root/packages/lol", [
    "dependencies",
    "devDependencies",
  ]);
});

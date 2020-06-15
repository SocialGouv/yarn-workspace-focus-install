import { AssertionError } from "assert";

import { nameFromLocation } from "./nameFromLocation";

test("returns the mathing workspace name location", () => {
  const workspaces = {
    bar: {
      location: "root/bar",
      workspaceDependencies: [],
    },
    foo: {
      location: "root/foo",
      workspaceDependencies: [],
    },
  };
  expect(nameFromLocation(workspaces, "root/foo")).toBe("foo");
});

test("throw if no math", () => {
  expect(() => nameFromLocation({}, "root/foo")).toThrow();
});

test("throw package not found from location", () => {
  expect(() => nameFromLocation({}, "foo")).toThrowError(
    new AssertionError({ message: "foo is not in the workspace tree" })
  );
});

test("get focus package name from location", () => {
  expect(
    nameFromLocation(
      {
        foo: {
          location: "packages/foo",
          workspaceDependencies: [],
        },
      },
      "packages/foo"
    )
  ).toBe("foo");
});

test("get focus package name from location (windows like)", () => {
  expect(
    nameFromLocation(
      {
        foo: {
          location: "packages/foo",
          workspaceDependencies: [],
        },
      },
      "packages\\foo"
    )
  ).toBe("foo");
});

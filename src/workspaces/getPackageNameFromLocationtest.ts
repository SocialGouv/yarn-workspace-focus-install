import { AssertionError } from "assert";

import { getFocusPackageNameFromLocation } from "./getPackageNameFromLocation";

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
  expect(getFocusPackageNameFromLocation(workspaces, "root/foo")).toBe("foo");
});

test("throw if no math", () => {
  expect(() => getFocusPackageNameFromLocation({}, "root/foo")).toThrow();
});

test("throw package not found from location", () => {
  expect(() => getFocusPackageNameFromLocation({}, "foo")).toThrowError(
    new AssertionError({ message: "foo is not in the workspace tree" })
  );
});

test("get focus package name from location", () => {
  expect(
    getFocusPackageNameFromLocation(
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
    getFocusPackageNameFromLocation(
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

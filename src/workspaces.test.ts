import { AssertionError } from "assert";

import {
  getFocusPackageNameFromLocation,
  listInternalWorkspaceDependencies,
} from "./workspaces";

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

test("list internal dependencies", () => {
  expect(
    listInternalWorkspaceDependencies(
      {
        bar: {
          location: "root/bar",
          workspaceDependencies: [],
        },
        foo: {
          location: "root/foo",
          workspaceDependencies: ["bar"],
        },
      },
      "foo"
    )
  ).toEqual(new Set(["bar"]));
});

test("list no internal dependencies", () => {
  expect(
    listInternalWorkspaceDependencies(
      {
        bar: {
          location: "root/bar",
          workspaceDependencies: [],
        },
        foo: {
          location: "root/foo",
          workspaceDependencies: [],
        },
      },
      "foo"
    )
  ).toEqual(new Set());
});

test("list many internal dependencies", () => {
  expect(
    listInternalWorkspaceDependencies(
      {
        bar: {
          location: "root/bar",
          workspaceDependencies: ["qux", "quz"],
        },
        foo: {
          location: "root/foo",
          workspaceDependencies: ["bar"],
        },
        lol: {
          location: "root/lol",
          workspaceDependencies: ["lol"],
        },
        lul: {
          location: "root/lul",
          workspaceDependencies: [],
        },
        qoo: {
          location: "root/qoo",
          workspaceDependencies: [],
        },
        qux: {
          location: "root/qux",
          workspaceDependencies: ["qoo"],
        },
        quz: {
          location: "root/quz",
          workspaceDependencies: ["qoo"],
        },
      },
      "foo"
    )
  ).toEqual(new Set(["bar", "qoo", "qux", "quz"]));
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
          location: "root/foo",
          workspaceDependencies: [],
        },
      },
      "root/foo"
    )
  ).toBe("foo");
});

test("get focus package name from location (windows like)", () => {
  expect(
    getFocusPackageNameFromLocation(
      {
        foo: {
          location: "root/foo",
          workspaceDependencies: [],
        },
      },
      "root\\foo"
    )
  ).toBe("foo");
});

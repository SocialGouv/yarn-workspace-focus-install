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

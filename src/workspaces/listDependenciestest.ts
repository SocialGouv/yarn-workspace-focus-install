import { listDependencies } from "./listDependencies";

test("list bar dependency", () => {
  expect(
    listDependencies(
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

test("list no dependencies", () => {
  expect(
    listDependencies(
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

test("list many dependencies", () => {
  expect(
    listDependencies(
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

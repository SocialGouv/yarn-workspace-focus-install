import { AssertionError } from "assert";

import { unnecessaryDependencies } from "./unnecessaryDependencies";

test("shouldn't remove self dependencies", () => {
  expect(
    unnecessaryDependencies(
      {
        foo: {
          location: "packages/foo",
          workspaceDependencies: [],
        },
      },
      "foo"
    )
  ).toStrictEqual({});
});

test("fail with bar not found", () => {
  expect(() =>
    unnecessaryDependencies(
      {
        foo: {
          location: "packages/foo",
          workspaceDependencies: [],
        },
      },
      "bar"
    )
  ).toThrowError(new AssertionError({ message: "bar workspace not found" }));
});

test("removes unnecessary workspaces", () => {
  expect(
    unnecessaryDependencies(
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
      "foo"
    )
  ).toStrictEqual({
    lol: {
      location: "packages/lol",
      workspaceDependencies: [],
    },
  });
});

import { mapLocations } from "./mapLocations";

test("should map nothing", () => {
  expect(mapLocations({}, (location) => location)).toStrictEqual([]);
});

test("should map location in workspace", () => {
  expect(
    mapLocations(
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
      (location) => location
    )
  ).toStrictEqual(["root/bar", "root/foo"]);
});

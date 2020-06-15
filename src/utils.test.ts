import { uniqueUnion } from "./utils";

test("returns empty set", () => {
  expect(uniqueUnion([])).toEqual(new Set());
});

test("returns a b c set", () => {
  expect(uniqueUnion(["a", "b", "c"])).toEqual(new Set(["a", "b", "c"]));
});

test("returns unique a b c set", () => {
  expect(uniqueUnion(["a", "a", "b", "b", "b", "c"])).toEqual(
    new Set(["a", "b", "c"])
  );
});

test("returns unique a b c d e f set from multiple args", () => {
  expect(
    uniqueUnion(
      ["a", "a", "b"],
      new Set(["b", "b", "c"]),
      ["a", "c", "d"],
      new Set(["b", "e", "f"])
    )
  ).toEqual(new Set(["a", "b", "c", "d", "e", "f"]));
});

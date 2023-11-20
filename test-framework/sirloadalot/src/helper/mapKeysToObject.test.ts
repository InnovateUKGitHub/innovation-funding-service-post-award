import { mapKeysToObject } from "./mapKeysToObject";

describe("mapKeysToObject", () => {
  test.each([
    ["be empty", [] as const, () => null, {}],
    [
      "map from key to key",
      ["abcad", "hedges"] as const,
      (key: string) => key.toUpperCase(),
      { abcad: "ABCAD", hedges: "HEDGES" },
    ],
    [
      "map from key to obj",
      ["a", "b", "c", "d"] as const,
      (key: string): { [key: string]: string } => ({ key }),
      { a: { key: "a" }, b: { key: "b" }, c: { key: "c" }, d: { key: "d" } },
    ],
  ])("object should %s", (_, keys, fn, expected) => {
    expect(mapKeysToObject<(typeof keys)[number], ReturnType<typeof fn>>(keys, fn)).toMatchObject(expected);
  });
});

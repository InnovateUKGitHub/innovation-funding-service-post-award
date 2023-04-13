import { mapStringInObject } from "./mapStringInObject";

describe("mapStringInObject", () => {
  it.each([
    ["an object", { nicole: "hedges", count: 1 }],
    ["an array", ["hello", "world"]],
    ["a matrix", [[[[[[["matrix"]]], "citrix"]]], "hello"]],
    [
      "nested strings in array and object",
      { key: "value", array: ["hello", { nicole: "hedges", count: { min: 2, reason: "test" } }, 2] },
    ],
  ])("should uppercase all strings values in %s", (name, object) => {
    expect(mapStringInObject(object, input => input.toUpperCase())).toMatchSnapshot(name);
  });
});

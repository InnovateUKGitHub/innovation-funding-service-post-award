import { batch } from "./batch";

describe("batch", () => {
  test("batch works for small sizes", () => {
    expect(batch(["a", "b", "c"])).toMatchObject([["a", "b", "c"]]);
  });

  test("batch splitting works", () => {
    expect(batch(["a", "b", "c"], 2)).toMatchObject([["a", "b"], ["c"]]);
  });
});

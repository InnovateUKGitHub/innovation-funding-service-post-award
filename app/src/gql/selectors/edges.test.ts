import { getDefinedEdges, getFirstEdge } from "./edges";

describe("Edges", () => {
  describe("getDefinedEdges", () => {
    test.each`
      name                                       | input                                                         | result
      ${"null"}                                  | ${null}                                                       | ${[]}
      ${"undefined"}                             | ${undefined}                                                  | ${[]}
      ${"empty array"}                           | ${[]}                                                         | ${[]}
      ${"array with null and undefined"}         | ${[null, undefined, null, null]}                              | ${[]}
      ${"array with mix of null/undefined/data"} | ${[null, { node: "Hedges" }, undefined]}                      | ${[{ node: "Hedges" }]}
      ${"array with data"}                       | ${[{ node: "Nicole" }, { node: "Hedges" }, { node: "GmbH" }]} | ${[{ node: "Nicole" }, { node: "Hedges" }, { node: "GmbH" }]}
    `("with $name input", ({ input, result }) => {
      expect(getDefinedEdges(input)).toEqual(result);
    });
  });

  describe("getFirstEdge", () => {
    test.each`
      name                               | input
      ${"null"}                          | ${null}
      ${"undefined"}                     | ${undefined}
      ${"empty array"}                   | ${[]}
      ${"undefined array"}               | ${[, , ,]}
      ${"array with null and undefined"} | ${[null, undefined, null, null]}
      ${"array with more than one edge"} | ${[{ node: "Nicole" }, { node: "Hedges" }, { node: "GmbH" }]}
    `("with $name to throw", ({ input }) => {
      expect(() => {
        getFirstEdge(input);
      }).toThrow();
    });

    test.each`
      name                                       | input                                    | result
      ${"array with mix of null/undefined/data"} | ${[null, { node: "Hedges" }, undefined]} | ${{ node: "Hedges" }}
      ${"array with single edge"}                | ${[{ node: "Ledges" }]}                  | ${{ node: "Ledges" }}
    `("with $name to return first value", ({ input, result }) => {
      expect(getFirstEdge(input)).toEqual(result);
    });
  });
});

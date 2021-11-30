import { isEmpty } from "@ui/helpers/is-empty";

describe("isEmpty()", () => {
  describe("@returns", () => {
    test.each`
      name                                                         | valueToCheck                                                  | expectedResult
      ${"when null"}                                               | ${null}                                                       | ${true}
      ${"when undefined"}                                          | ${undefined}                                                  | ${true}
      ${"when true"}                                               | ${true}                                                       | ${false}
      ${"when false"}                                              | ${false}                                                      | ${false}
      ${"with empty string"}                                       | ${""}                                                         | ${false}
      ${"with defined string"}                                     | ${"I_SHOULD_BE_DEFINED"}                                      | ${false}
      ${"with zero number"}                                        | ${0}                                                          | ${false}
      ${"with positive number"}                                    | ${10}                                                         | ${false}
      ${"with negative number"}                                    | ${-5}                                                         | ${false}
      ${"with bigint"}                                             | ${BigInt(1)}                                                  | ${false}
      ${"with Symbol"}                                             | ${Symbol("unique_id")}                                        | ${false}
      ${"with function returns true"}                              | ${() => true}                                                 | ${false}
      ${"with function returns false"}                             | ${() => false}                                                | ${false}
      ${"with function returns null"}                              | ${() => null}                                                 | ${true}
      ${"with function returns undefined"}                         | ${() => undefined}                                            | ${true}
      ${"with function returns array"}                             | ${() => []}                                                   | ${false}
      ${"with function returns array with boolean"}                | ${() => [true]}                                               | ${false}
      ${"with function returns object with properties"}            | ${() => ({ hello: "world" })}                                 | ${false}
      ${"with function returns object without properties"}         | ${() => ({})}                                                 | ${true}
      ${"with empty array"}                                        | ${[]}                                                         | ${false}
      ${"with array of boolean's"}                                 | ${[true, false]}                                              | ${false}
      ${"with array of numbers's"}                                 | ${[0, 1, 3]}                                                  | ${false}
      ${"with array of strings's"}                                 | ${["", "1", "2"]}                                             | ${false}
      ${"with array of nested arrays"}                             | ${[[0], [1], [2]]}                                            | ${false}
      ${"with array of empty nested arrays"}                       | ${[[], [], []]}                                               | ${false}
      ${"with object with properties"}                             | ${{ hello: "world" }}                                         | ${false}
      ${"with object with no properties"}                          | ${{}}                                                         | ${true}
      ${"with object with nested properties without values"}       | ${{ noChildObj: {} }}                                         | ${true}
      ${"with object with nested properties with values"}          | ${{ childObj: { hello: "world" } }}                           | ${false}
      ${"with object with nested properties with mixed values"}    | ${{ childObj: { hello: "world", emptyObj: {} } }}             | ${true}
      ${"with object with nested properties with null properties"} | ${{ childObj: { hello: "world", nullProperty: null } }}       | ${false}
      ${"with object with nested properties with date properties"} | ${{ childObj: { hello: "world", dateProperty: new Date() } }} | ${false}
    `("$name", ({ valueToCheck, expectedResult }) => {
      const result = isEmpty(valueToCheck);

      expect(result).toBe(expectedResult);
    });
  });
});

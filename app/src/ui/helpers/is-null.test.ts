import isNull from "./is-null";

describe("isNull", () => {
  test.each`
    input        | expected
    ${null}      | ${true}
    ${undefined} | ${false}
    ${0}         | ${false}
    ${""}        | ${false}
    ${false}     | ${false}
    ${[]}        | ${false}
    ${{}}        | ${false}
    ${"hello"}   | ${false}
  `("it should return $expected when isNull is called with $input", ({ input, expected }) => {
    expect(isNull(input)).toBe(expected);
  });
});

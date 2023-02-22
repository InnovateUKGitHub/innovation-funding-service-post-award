import {
  calcPercentage,
  diffAsPercentage,
  isNumber,
  parseNumber,
  roundCurrency,
  sumBy,
  withinRange,
} from "@framework/util/numberHelper";

describe("numberHelper", () => {
  describe("isNumber()", () => {
    test.each`
      name                            | inputValue   | expectedValue
      ${"with zero"}                  | ${0}         | ${true}
      ${"with positive"}              | ${50}        | ${true}
      ${"with positive decimal"}      | ${0.587}     | ${true}
      ${"with negative"}              | ${-100}      | ${true}
      ${"with negative decimal"}      | ${-0.587}    | ${true}
      ${"with undefined"}             | ${undefined} | ${false}
      ${"with null"}                  | ${null}      | ${false}
      ${"with number as string"}      | ${"four"}    | ${false}
      ${"with NaN"}                   | ${NaN}       | ${false}
      ${"with positive boolean true"} | ${true}      | ${false}
      ${"with negative boolean true"} | ${false}     | ${false}
    `("$name value", ({ inputValue, expectedValue }) => {
      const value = isNumber(inputValue);

      expect(value).toBe(expectedValue);
    });
  });

  describe("roundCurrency()", () => {
    describe("capture edge cases", () => {
      test.each`
        name                         | edgeCaseValue        | expectedValue
        ${"positive trailing digit"} | ${1.005}             | ${1.01}
        ${"negative trailing digit"} | ${-1.005}            | ${-1}
        ${"positive zero"}           | ${0}                 | ${0}
        ${"negative zero"}           | ${-0}                | ${0}
        ${"resolves to neg zero"}    | ${-0.0004}           | ${0}
        ${"very large"}              | ${418_679_600.005}   | ${418_679_600.01}
        ${"upper support limit"}     | ${1_000_000_000.005} | ${1_000_000_000.01}
      `("with a $name number", ({ edgeCaseValue, expectedValue }) => {
        const roundedNumber = roundCurrency(edgeCaseValue);

        expect(roundedNumber).toBe(expectedValue);
      });
    });

    const testCases = test.each`
      name               | inputValue    | expectedValue
      ${"whole"}         | ${10}         | ${10}
      ${"short decimal"} | ${12.1312}    | ${12.13}
      ${"long decimal"}  | ${17.9873424} | ${17.99}
    `;

    describe("positive currency value", () => {
      testCases("with a $name number", ({ inputValue, expectedValue }) => {
        const roundedNumber = roundCurrency(inputValue);

        expect(roundedNumber).toBe(expectedValue);
      });
    });

    describe("negative currency value", () => {
      testCases("with a $name number", ({ inputValue, expectedValue }) => {
        const negativeInputValue = -inputValue;
        const negativeExpectedValue = -expectedValue;
        const roundedNumber = roundCurrency(negativeInputValue);

        expect(roundedNumber).toBe(negativeExpectedValue);
      });
    });
  });

  describe("diffAsPercentage()", () => {
    test.each`
      name                                      | startingValue | secondValue | expectedValue
      ${"with no difference"}                   | ${15}         | ${15}       | ${0}
      ${"with percentage is negative"}          | ${40000}      | ${27000}    | ${-32.5}
      ${"with numbers as floats"}               | ${5000}       | ${20000}    | ${300}
      ${"with numbers as integers"}             | ${40000}      | ${17123.78} | ${-57.19}
      ${"with 100% increase"}                   | ${2100}       | ${4200}     | ${100}
      ${"with common js rounding bug"}          | ${0.1}        | ${0.2}      | ${100}
      ${"with common js rounding bug inverted"} | ${0.2}        | ${0.1}      | ${-50}
      ${"with negative difference"}             | ${2100}       | ${0}        | ${-100}
      ${"with incalculable difference"}         | ${0}          | ${100}      | ${0}
    `("$name value", ({ startingValue, secondValue, expectedValue }) => {
      const value = diffAsPercentage(startingValue, secondValue);

      expect(value).toBe(expectedValue);
    });
  });

  describe("parseNumber()", () => {
    test.each`
      name                                                       | inputValue   | expectedValue
      ${"with null"}                                             | ${null}      | ${null}
      ${"with undefined"}                                        | ${undefined} | ${null}
      ${"with empty string"}                                     | ${""}        | ${null}
      ${"with string containing a single space"}                 | ${" "}       | ${null}
      ${"with string which contains a string"}                   | ${"abc"}     | ${null}
      ${"with string mixed with spaces which contains a string"} | ${"  abc  "} | ${null}
      ${"with number as string"}                                 | ${"20"}      | ${20}
      ${"with number as string with unneeded spaces"}            | ${"  20  "}  | ${20}
      ${"with number"}                                           | ${10}        | ${10}
      ${"with number as zero"}                                   | ${0}         | ${0}
      ${"with mixed up number and string as value"}              | ${"1x"}      | ${null}
      ${"with hexadecimal input"}                                | ${"0x10"}    | ${16}
    `("$name value", ({ inputValue, expectedValue }) => {
      const value = parseNumber(inputValue);

      expect(value).toBe(expectedValue);
    });
  });

  describe("sum()", () => {
    test.each`
      name                                           | inputValue                        | valueFn                              | expectedValue
      ${"returns zero with empty array"}             | ${[]}                             | ${(x: number) => x}                  | ${0}
      ${"returns total array with numbers"}          | ${[1, 2, 3, 4]}                   | ${(x: number) => x}                  | ${10}
      ${"returns total using property within array"} | ${[{ value: 10 }, { value: 20 }]} | ${(x: { value: number }) => x.value} | ${30}
    `("$name", ({ inputValue, valueFn, expectedValue }) => {
      const totalSum = sumBy(inputValue, valueFn);

      expect(totalSum).toBe(expectedValue);
    });
  });

  describe("withinRange()", () => {
    test.each`
      name                                   | inputValue | startValue | endValue | expectedValue
      ${"when value is within tolerance"}    | ${5}       | ${1}       | ${10}    | ${true}
      ${"when value is within start range"}  | ${1}       | ${1}       | ${10}    | ${true}
      ${"when value is within end range"}    | ${10}      | ${1}       | ${10}    | ${true}
      ${"when value is outside start range"} | ${0}       | ${1}       | ${10}    | ${false}
      ${"when value is outside end range"}   | ${11}      | ${1}       | ${10}    | ${false}
    `("$name", ({ inputValue, startValue, endValue, expectedValue }) => {
      const isWithinRange = withinRange(inputValue, startValue, endValue);

      expect(isWithinRange).toBe(expectedValue);
    });
  });

  describe("calcPercentage", () => {
    test.each`
      total        | amount | expected
      ${null}      | ${10}  | ${null}
      ${undefined} | ${10}  | ${null}
      ${0}         | ${10}  | ${null}
      ${100}       | ${10}  | ${10}
      ${50}        | ${10}  | ${20}
    `(
      "it should return $expected when called with $total and $amount",
      ({ total, amount, expected }: { total: Nullable<number>; amount: number; expected: number }) => {
        expect(calcPercentage(total, amount)).toBe(expected);
      },
    );
  });
});

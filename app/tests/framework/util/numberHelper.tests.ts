// tslint:disable: no-duplicate-string no-identical-functions
import { isNumber, parseNumber, roundCurrency, sum } from "@framework/util/numberHelper";

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
    const testCases = test.each`
      name               | inputValue    | expectedValue
      ${"whole"}         | ${10}         | ${10}
      ${"short decimal"} | ${12.1312}    | ${12.13}
      ${"long decimal"}  | ${17.9873424} | ${17.99}
    `;

    describe("capture edge cases", () => {
      test.each`
        name                         | inputValue | expectedValue
        ${"positive trailing digit"} | ${1.005}   | ${1.01}
        ${"negative trailing digit"} | ${-1.005}  | ${-1}
      `("with a $name number", ({ inputValue, expectedValue }) => {
        const roundedNumber = roundCurrency(inputValue);

        expect(roundedNumber).toBe(expectedValue);
      });
    });

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
      name                                           | inputValue                        | valueFn                | expectedValue
      ${"returns zero with empty array"}             | ${[]}                             | ${(x: any) => x}       | ${0}
      ${"returns total array with numbers"}          | ${[1, 2, 3, 4]}                   | ${(x: any) => x}       | ${10}
      ${"returns total using property within array"} | ${[{ value: 10 }, { value: 20 }]} | ${(x: any) => x.value} | ${30}
    `("$name", ({ inputValue, valueFn, expectedValue }) => {
      const totalSum = sum(inputValue, valueFn);

      expect(totalSum).toBe(expectedValue);
    });
  });
});

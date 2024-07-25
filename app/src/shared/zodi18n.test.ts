import { convertCopyKeyToArrayType, flattenCopyString, generatePossibleCopyStrings } from "./zodi18n";

describe("zodi18n", () => {
  describe("flattenCopyString", () => {
    test.each([
      [["key", ["value", "apple"]], "key.value.apple"],
      [["key", "valued", "workers"], "key.valued.workers"],
      [[["what", "is", "love"]], "what.is.love"],
      [["orbits", "orbit", "blockberry"], "orbits.orbit.blockberry"],
      [["space", "", "gap"], "space.gap"],
    ])("should flatten values", (item, key) => {
      expect(flattenCopyString(item)).toEqual(key);
    });
  });

  describe("convertCopyKeyToArrayType", () => {
    test.each([
      [
        ["my", "nice", "0", "error"],
        ["my", "nice", "arrayType", "error"],
      ],
      [
        ["my", "nice", "untouched", "error"],
        ["my", "nice", "untouched", "error"],
      ],
    ])("should flatten values", (input, output) => {
      expect(convertCopyKeyToArrayType(input)).toEqual(output);
    });
  });

  describe("generatePossibleCopyStrings", () => {
    test.each([
      [
        {
          namespace: "namespace",
          fullKey: ["key1", "key2", "key3"],
          issueCodes: ["issueCode1", "issueCode2"],
          issueType: "issueType",
        },
      ],
      [
        {
          namespace: "forms",
          fullKey: ["pcr", "financialVirements", "costCategoryLevel", "virements", "6", "newEligibleCosts"],
          issueCodes: ["errors.generic.currency.required"],
          issueType: undefined,
        },
      ],
    ])("create all possible copy content selectors", args => {
      expect(generatePossibleCopyStrings(args)).toMatchSnapshot();
    });
  });
});

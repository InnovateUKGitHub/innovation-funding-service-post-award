import {
  emptyStringToUndefinedValidation,
  partnerIdValidation,
  periodIdValidation,
  projectIdValidation,
} from "./helperValidators.zod";

describe("helperValidators", () => {
  describe("projectIdValidation", () => {
    test.each([
      ["decline empty string", "", false],
      ["accept project id", "a0E2600000olswLEAQ", true],
      ["decline project participant id", "a0D2600000zXrAIEA0", false],
      ["decline account id", "0012600001amaskAAA", false],
    ])("%s", (name, input, accept) => {
      const parse = projectIdValidation.safeParse(input);
      expect(parse.success).toBe(accept);
      expect(parse as unknown).toMatchSnapshot();
    });
  });

  describe("partnerIdValidation", () => {
    test.each([
      ["decline empty string", "", false],
      ["decline project id", "a0E2600000olswLEAQ", false],
      ["accept project participant id", "a0D2600000zXrAIEA0", true],
      ["decline account id", "0012600001amaskAAA", false],
    ])("%s", (name, input, accept) => {
      const parse = partnerIdValidation.safeParse(input);
      expect(parse.success).toBe(accept);
      expect(parse as unknown).toMatchSnapshot();
    });
  });

  describe("emptyStringToUndefinedValidation", () => {
    test.each([
      ["accept empty string", "", true],
      ["accept undefined", undefined, true],
      ["decline filled string", "hello world!", false],
      ["decline number", 1.43e99, false],
    ])("%s", (name, input, accept) => {
      const parse = emptyStringToUndefinedValidation.safeParse(input);
      expect(parse.success).toBe(accept);
      expect(parse as unknown).toMatchSnapshot();
    });
  });

  describe("periodIdValidation", () => {
    test.each([
      ["decline 0", 0, false],
      ["accept 1", 1, true],
      ["accept 2", 2, true],
      ["accept 3", 3, true],
      ["accept 5", 5, true],
      ["decline decimal", 1.01, false],
      ["accept string int", "4", true],
      ["decline absurd number", 500, false],
      ["decline infinity", Infinity, false],
    ])("%s", (name, input, accept) => {
      const parse = periodIdValidation.safeParse(input);
      expect(parse.success).toBe(accept);
      expect(parse as unknown).toMatchSnapshot();
    });
  });
});

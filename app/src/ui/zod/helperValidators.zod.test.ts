import { IFileWrapper } from "@framework/types/fileWapper";
import { TestConfig } from "@tests/test-utils/testConfig";
import {
  currencyValidation,
  emptyStringToUndefinedValidation,
  getSingleFileValidation,
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

  describe("getSingleFileValidation", () => {
    const testConfig = new TestConfig();
    const singleFileValidation = getSingleFileValidation(testConfig.options);

    test.each([
      // Valid files
      ["standard file", { fileName: "awoo.png", size: 120 }, true],

      // Bad prefixes
      [".tar.gz", { fileName: "awoo.tar.gz", size: 12442 }, false],
      [".webm", { fileName: "awoo.webm", size: 12442 }, false],
      [".docm", { fileName: "awoo.docm", size: 12442 }, false],

      // Invalid size files
      ["zero sized file", { fileName: "awoo.png", size: 0 }, false],
      ["very big sized file", { fileName: "awoo.png", size: 908172862 }, false],

      // Invalid name files
      ["no prefix file", { fileName: "jjajangmyeon", size: 4353 }, false],
      ["Linux/UNIX hidden file", { fileName: ".gitignore", size: 4353 }, false],
      ["no basename file", { fileName: ".pptx", size: 4353 }, false],
      ["crazy characters file", { fileName: '*&"£&.pptx', size: 4353 }, false],
    ])("%s", (name, input: IFileWrapper, accept) => {
      const parse = singleFileValidation.safeParse(input);
      expect(parse.success).toBe(accept);
      expect(parse as unknown).toMatchSnapshot();
    });
  });

  describe("currencyValidation", () => {
    test.each([
      ["accept 0", "0", true],
      ["accept 1", "1", true],
      ["accept 2", "2", true],
      ["accept 3", "3", true],
      ["accept 5", "5", true],
      ["accept 1.01", "1.01", true],
      ["accept 500", "500", true],
      ["accept £0", "£0", true],
      ["accept £1", "£1", true],
      ["accept £2", "£2", true],
      ["accept £3", "£3", true],
      ["accept £5", "£5", true],
      ["accept £1.01", "£1.01", true],
      ["accept £500", "£500", true],
      ["decline infinity", Infinity, false],
      ["decline bad input", "IUK MO Company", false],
      ["decline too big", "£999999999999999999999999", false],
      ["decline too little", "-9999999999999999999999999", false],
      ["decline too many dp", "£12,345.777", false],
      ["accept too few dp", "£12.2", true],
      ["strip out extra chars", "    ££££12,,,3.3,,,,£££", true],
    ])("%s", (name, input, accept) => {
      const parse = currencyValidation.safeParse(input);
      expect(parse.success).toBe(accept);
      expect(parse as unknown).toMatchSnapshot();
    });
  });
});

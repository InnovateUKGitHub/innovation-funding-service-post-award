import { IFileWrapper } from "@framework/types/fileWrapper";
import { TestConfig } from "@tests/test-utils/testConfig";
import {
  emptyStringToUndefinedValidation,
  evaluateObject,
  getSingleFileValidation,
  partnerIdValidation,
  periodIdValidation,
  projectIdValidation,
} from "./helperValidators.zod";
import { z } from "zod";

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

  describe("evaluateObject", () => {
    test.each([
      ["Valid 'marked as complete'", { something: "APPLE", markedAsComplete: true }, true],
      ["Invalid 'marked as complete'", { something: "APPLE", markedAsComplete: false }, false],
      ["Invalid 'NOT marked as complete'", { something: "BANANA", markedAsComplete: true }, false],
      ["Valid 'NOT marked as complete'", { something: "BANANA", markedAsComplete: false }, true],
      ["Invalid", { something: "DURIAN", markedAsComplete: true }, false],
      ["Mal", { something: "DURIAN", markedAsComplete: false }, false],
    ])("%s", (name, objectToValidate, accept) => {
      type ValidationData = { markedAsComplete: boolean; something: string };

      const schema = evaluateObject((data: ValidationData) => ({
        something: data.markedAsComplete ? z.literal("APPLE") : z.literal("BANANA"),
        markedAsComplete: z.boolean(),
      }));

      const markedAsCompleteResult = schema.safeParse(objectToValidate);

      expect(markedAsCompleteResult.success).toBe(accept);
      expect(markedAsCompleteResult as unknown).toMatchSnapshot();
    });
  });
});

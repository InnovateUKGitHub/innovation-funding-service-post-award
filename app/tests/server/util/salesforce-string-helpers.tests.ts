import { parseSfLongTextArea } from "@server/util/salesforce-string-helpers";

describe("SalesForce string helpers", () => {
  describe("parseSfLongTextArea()", () => {
    test.each`
      name                                         | unparsedString                             | expectedValue
      ${"with simple 1 line"}                      | ${"Hello world :)"}                        | ${["Hello world :)"]}
      ${"with multiple lines"}                     | ${"Line 1\r\nLine 2\r\nLine 3"}            | ${["Line 1", "Line 2", "Line 3"]}
      ${"with multiple lines with breaks between"} | ${"Break 1\r\n\r\nBreak 2\r\n\r\nBreak 3"} | ${["Break 1", "Break 2", "Break 3"]}
      ${"with quoted content"}                     | ${'I am a "quote", value!'}                | ${['I am a "quote", value!']}
    `("$name", ({ unparsedString, expectedValue }) => {
      const parsedValue = parseSfLongTextArea(unparsedString);

      expect(parsedValue).toStrictEqual(expectedValue);
    });
  });
});

import { soql, parseSfLongTextArea, sss } from "@server/util/salesforce-string-helpers";

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

  describe("sss (Salesforce SQL Sanitiser)", () => {
    it("should throw with invalid numbers", () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
        sss(1e999);
      }).toThrow();

      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
        sss(-1e999);
      }).toThrow();
    });

    test.each`
      name                           | input                                                              | expected
      ${"valid number"}              | ${123}                                                             | ${"123"}
      ${"valid string"}              | ${"a0E2600000kQe5lEAC"}                                            | ${"a0E2600000kQe5lEAC"}
      ${"SQL injection attack"}      | ${"a0E2600000kQe5lEAC' OR Acc_ProjectId__c = 'a0E2600000kQeGwEAK"} | ${"a0E2600000kQe5lEAC\\' OR Acc_ProjectId__c = \\'a0E2600000kQeGwEAK"}
      ${"string with single quotes"} | ${"I am 'happy' today"}                                            | ${"I am \\'happy\\' today"}
    `("it should sanitise a $name", ({ input, expected }) => {
      const parsedValue = sss(input);

      expect(parsedValue).toStrictEqual(expected);
    });
  });

  describe("apex (JavaScript Apex Variable Injector)", () => {
    const testString = "stub-string";
    const testNumber = 321;
    const testDate = new Date("2022-04-11T23:00:00.000Z");

    test.each`
      name                            | input                                       | expected
      ${"no injection"}               | ${soql`The quick brown fox`}                | ${"The quick brown fox"}
      ${"string"}                     | ${soql`${testString}`}                      | ${"'stub-string'"}
      ${"number"}                     | ${soql`${testNumber}`}                      | ${"321"}
      ${"testDate"}                   | ${soql`${testDate}`}                        | ${"date.valueOf('2022-04-11 23:00:00')"}
      ${"string around other string"} | ${soql`String testString = ${testString};`} | ${"String testString = 'stub-string';"}
    `("properly injects with $name input(s)", ({ input, expected }) => {
      expect(input.trim()).toBe(expected);
    });

    test.each`
      name                       | input
      ${"string array in query"} | ${soql`SELECT Id FROM Acc_Claims__c WHERE Id in ${["a", "b", "c"]}`}
      ${"int array in query"}    | ${soql`SELECT Id FROM Acc_Claims__c WHERE Id in ${[1, 2, 3]}`}
      ${"id in query"}           | ${soql`SELECT Id FROM Acc_Claims__c WHERE Id = ${"a0E-something"}`}
      ${"whitespace in query"}   | ${soql`\n\nSELECT \nId \n         FROM \n\nAcc_Claims__c WHERE Id = \n\n${"a0E-something"}`}
    `("properly injects $name", ({ input, name }) => {
      expect(input).toMatchSnapshot(name);
    });
  });
});

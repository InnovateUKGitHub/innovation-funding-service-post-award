import { Clock } from "./clock";

describe("Clock class", () => {

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2022, 3, 1));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const clock = new Clock();
  const sfDate = "2022-06-12";
  const jsDate = new Date(2022, 5, 12);

  it("should return the current (mocked as 1 Apr 2022) date when the now method is called", () => {
    expect(clock.now()).toEqual(new Date(2022, 3, 1));
  });

  describe("parseOptionalSalesforceDate", () => {
    it("should return a JS date from a salesforce formatted date", () => {
      expect(clock.parseOptionalSalesforceDate(sfDate)).toEqual(jsDate);
    });

    it("should throw an error if the value is invalid", () => {
      expect(() => clock.parseOptionalSalesforceDate("NONSENSE_DATE")).toThrow("Invalid Date: NONSENSE_DATE");
    });

    it("should return null if falsy value passed in", () => {
      expect(clock.parseOptionalSalesforceDate("")).toBeNull();
    });
  });

  describe("formatOptionalSalesforceDate", () => {
    it("should generate a Salesforce date from a javascript date", () => {
      expect(clock.formatOptionalSalesforceDate(jsDate)).toEqual(sfDate);
    });

    it("should return null if no date object is passed in", () => {
      expect(clock.formatOptionalSalesforceDate(null)).toBeNull();
    });
  });

  describe("formatRequiredSalesforceDate", () => {
    it("should generate a Salesforce date from a javascript date, and not accept a null date", () => {
      // @ts-expect-error "must accept only a valid date object"
      clock.formatRequiredSalesforceDate(null);

      expect(clock.formatRequiredSalesforceDate( jsDate)).toEqual(sfDate);
    });
  });

  describe("parseRequiredSalesforceDate", () => {
    it("should parse the salesforce date", () => {
      expect(clock.parseRequiredSalesforceDate(sfDate)).toEqual(jsDate);
    });

    it("should throw if there is no valid date", () => {
      // @ts-expect-error "testing if in runtime a null arg has been passed in"
      expect(() => clock.parseRequiredSalesforceDate(null)).toThrow("Invalid Date: empty");
    });
  });

  describe("parseOptionalSalesforceDateTime", () => {
    it("should parse the salesforce date", () => {
      expect(clock.parseOptionalSalesforceDateTime(sfDate)).toEqual(jsDate);
    });

    it("should return null if no value passed in", () => {
      expect(clock.parseOptionalSalesforceDateTime(null)).toBeNull();
    });

    it("should throw if an invalid date is passed in", () => {
      expect(() => clock.parseOptionalSalesforceDateTime("First of April")).toThrow("Invalid DateTime: First of April");
    });
  });

  describe("parseRequiredSalesforceDateTime", () => {
    it("should parse the salesforceDateTime", () => {
      expect(clock.parseRequiredSalesforceDateTime(sfDate)).toEqual(jsDate);
    });

    it("should throw an error if null is passed in", () => {
      // @ts-expect-error "testing if in runtime a null arg has been passed in"
      expect(() => clock.parseRequiredSalesforceDateTime(null)).toThrow("Invalid DateTime: empty");
    });
  });

  // commented out because the time is resolving differently between when running locally and when running in the pipeline
  // TODO: make this test consistent
  // describe("parse", () => {
  //   it("should return a jsDate from a valid string and formatter", () => {
  //     expect(clock.parse(sfDate, "yyyy-MM-dd")).toEqual(jsDate);
  //   });

  //   it("should return null if no value passed in", () => {
  //     expect(clock.parse("", "yyyy-MM-dd")).toBeNull();
  //   });
  // });
});

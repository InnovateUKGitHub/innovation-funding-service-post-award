import { isValidMonth, isValidYear, endDateIsBeforeStart, isEmptyDate } from "./date";

describe("date validation helpers", () => {
  describe("isEmptyDate", () => {
    it("should return true if both date inputs are empty strings", () => {
      expect(isEmptyDate("", "")).toBe(true);
    });

    it("should return true if both date inputs are undefined", () => {
      expect(isEmptyDate(undefined, undefined)).toBe(true);
    });

    it("should return true if called with no inputs", () => {
      expect(isEmptyDate()).toBe(true);
    });

    it("should return false if the second arg has a value", () => {
      expect(isEmptyDate("", "2023")).toBe(false);
    });

    it("should return false if the first field has a value", () => {
      expect(isEmptyDate("2", "")).toBe(false);
    });

    it("should return false if both fields have a value", () => {
      expect(isEmptyDate("2", "2023")).toBe(false);
    });
  });

  describe("isValidMonth", () => {
    it("should return true if the month is valid", () => {
      expect(isValidMonth("10")).toBe(true);
    });

    it("should return true if month is 1", () => {
      expect(isValidMonth("1")).toBe(true);
    });

    it("should return true if month is 12", () => {
      expect(isValidMonth("12")).toBe(true);
    });

    it("should return false if month is less than 1", () => {
      expect(isValidMonth("0")).toBe(false);
    });

    it("should return false if month is not an integer", () => {
      expect(isValidMonth("2.4")).toBe(false);
    });

    it("should return false if month is more than 12", () => {
      expect(isValidMonth("13")).toBe(false);
    });

    it("should return false if month is not cast-able as a number", () => {
      expect(isValidMonth("rabbit")).toBe(false);
    });
  });

  describe("isValidYear", () => {
    it("should return true if the year is valid", () => {
      expect(isValidYear("2023")).toBe(true);
    });

    it("should return true if year is 2000", () => {
      expect(isValidYear("2000")).toBe(true);
    });

    it("should return true if year is 2200", () => {
      expect(isValidYear("2200")).toBe(true);
    });

    it("should return false if year is less than 2000", () => {
      expect(isValidYear("1900")).toBe(false);
    });

    it("should return false if year is more than 2200", () => {
      expect(isValidYear("2201")).toBe(false);
    });

    it("should return false if year is not an integer", () => {
      expect(isValidMonth("2023.5")).toBe(false);
    });

    it("should return false if year is not cast-able as a number", () => {
      expect(isValidYear("rabbit")).toBe(false);
    });
  });

  describe("endDateIsBeforeStart", () => {
    it("should return true if the end date is before the start", () => {
      expect(endDateIsBeforeStart("6", "2023", "4", "2022")).toBe(true);
    });

    it("should return true if the end date year is before the start year", () => {
      expect(endDateIsBeforeStart("6", "2023", "6", "2022")).toBe(true);
    });

    it("should return true if the end date month is before the start month when the year is the same", () => {
      expect(endDateIsBeforeStart("6", "2023", "4", "2023")).toBe(true);
    });

    it("should return false if the dates are the same", () => {
      expect(endDateIsBeforeStart("6", "2023", "6", "2023")).toBe(false);
    });

    it("should return false if the years are the same but the end the month is later", () => {
      expect(endDateIsBeforeStart("6", "2023", "8", "2023")).toBe(false);
    });

    it("should return false if the end year is later", () => {
      expect(endDateIsBeforeStart("6", "2023", "6", "2024")).toBe(false);
    });
  });
});

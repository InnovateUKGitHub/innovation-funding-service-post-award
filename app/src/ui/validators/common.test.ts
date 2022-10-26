import { DateTime } from "luxon";
import * as Validators from "@ui/validators/common";
import { Results } from "@ui/validation";

describe("common validators", () => {
  describe("date", () => {
    it("should validate against invalid dates", () => {
      const date = new Date("invalid date");

      expect(Validators.isDate(new Results({}, true), date).isValid).toBe(false);
    });

    it("should validate against incomplete dates", () => {
      const date = new Date("Oct 25 0202");

      expect(Validators.isDate(new Results({}, true), date).isValid).toBe(false);
    });
  });

  describe("isBeforeOrSameDay", () => {
    it("should be valid when a date is not entered", () => {
      expect(Validators.isBeforeOrSameDay(new Results({}, true), null, new Date()).isValid).toBe(true);
    });
    it("should be valid when the date is before the test date", () => {
      const date = DateTime.local().minus({ day: 1 }).toJSDate();
      const test = DateTime.local().toJSDate();
      expect(Validators.isBeforeOrSameDay(new Results({}, true), date, test).isValid).toBe(true);
    });
    it("should be invalid when the date is after the test date", () => {
      const date = DateTime.local().plus({ day: 1 }).toJSDate();
      const test = DateTime.local().toJSDate();
      expect(Validators.isBeforeOrSameDay(new Results({}, true), date, test).isValid).toBe(false);
    });
    it("should be valid when the date is the same as the test date", () => {
      const date = DateTime.local().toJSDate();
      const test = DateTime.local().toJSDate();
      expect(Validators.isBeforeOrSameDay(new Results({}, true), date, test).isValid).toBe(true);
    });
  });

  describe("isUnchanged", () => {
    it("validates that two dates are the same", () => {
      const dateA = new Date(2019, 3, 1, 0, 0, 0, 0);
      const dateB = new Date(2019, 3, 1, 0, 0, 0, 0);
      expect(Validators.isUnchanged(new Results({}, true), dateA, dateB).isValid).toBe(true);
      expect(Validators.isUnchanged(new Results({}, true), null, null).isValid).toBe(true);
    });
    it("fails validation for different dates", () => {
      const dateA = new Date(2019, 3, 1, 0, 0, 0, 0);
      const dateB = new Date(2019, 3, 1, 0, 0, 0, 1);
      const dateC = new Date(2019, 3, 1, 0, 0, 1, 0);
      const dateD = new Date(2020, 3, 1, 0, 1, 0, 0);
      expect(Validators.isUnchanged(new Results({}, true), dateA, null).isValid).toBe(false);
      expect(Validators.isUnchanged(new Results({}, true), null, dateA).isValid).toBe(false);
      expect(Validators.isUnchanged(new Results({}, true), dateA, dateB).isValid).toBe(false);
      expect(Validators.isUnchanged(new Results({}, true), dateA, dateC).isValid).toBe(false);
      expect(Validators.isUnchanged(new Results({}, true), dateA, dateD).isValid).toBe(false);
    });
    it("validates that two strings are the same", () => {
      expect(Validators.isUnchanged(new Results({}, true), "", "").isValid).toBe(true);
      expect(Validators.isUnchanged(new Results({}, true), null, null).isValid).toBe(true);
      expect(Validators.isUnchanged(new Results({}, true), "hello", "hello").isValid).toBe(true);
    });
    it("fails validation for different strings", () => {
      expect(Validators.isUnchanged(new Results({}, true), "hello", null).isValid).toBe(false);
      expect(Validators.isUnchanged(new Results({}, true), null, "hello").isValid).toBe(false);
      expect(Validators.isUnchanged(new Results({}, true), "hello", "goodbye").isValid).toBe(false);
    });
    it("fails validation for different types", () => {
      expect(Validators.isUnchanged(new Results({}, true), "hello", new Date()).isValid).toBe(false);
    });
  });

  describe("isPositiveFloat", () => {
    describe("@returns", () => {
      test.each`
        name           | inputValue | expected
        ${"when null"} | ${null}    | ${true}
        ${"when 0"}    | ${0}       | ${true}
      `("$expected $name", ({ inputValue, expected }) => {
        const { isValid } = Validators.isPositiveFloat(new Results({}, true), inputValue);
        expect(isValid).toBe(expected);
      });

      describe("given positive integer", () => {
        test.each`
          name                          | inputValue      | expected
          ${"with no decimals"}         | ${3}            | ${true}
          ${"with two decimal places"}  | ${3.63}         | ${true}
          ${"with many decimal places"} | ${12.538295004} | ${true}
        `("$expected $name", ({ inputValue, expected }) => {
          const { isValid } = Validators.isPositiveFloat(new Results({}, true), inputValue);
          expect(isValid).toBe(expected);
        });
      });

      describe("given negative integer", () => {
        test.each`
          name                          | inputValue       | expected
          ${"with no decimals"}         | ${-3}            | ${false}
          ${"with two decimal places"}  | ${-3.63}         | ${false}
          ${"with many decimal places"} | ${-12.538295004} | ${false}
        `("$expected $name", ({ inputValue, expected }) => {
          const { isValid } = Validators.isPositiveFloat(new Results({}, true), inputValue);
          expect(isValid).toBe(expected);
        });
      });
    });
  });
});

import { isUnchanged } from "@ui/validators/common";
import { Results } from "@ui/validation";

describe("common validators", () => {
  describe("isUnchanged", () => {
    it("validates that two dates are the same", () => {
      const dateA = new Date(2019, 3, 1, 0, 0, 0, 0);
      const dateB = new Date(2019, 3, 1, 0, 0, 0, 0);
      expect(isUnchanged(new Results({}, true), dateA, dateB).isValid).toBe(true);
      expect(isUnchanged(new Results({}, true), null, null).isValid).toBe(true);
    });
    it("fails validation for different dates", () => {
      const dateA = new Date(2019, 3, 1, 0, 0, 0, 0);
      const dateB = new Date(2019, 3, 1, 0, 0, 0, 1);
      const dateC = new Date(2019, 3, 1, 0, 0, 1, 0);
      const dateD = new Date(2020, 3, 1, 0, 1, 0, 0);
      expect(isUnchanged(new Results({}, true), dateA, null).isValid).toBe(false);
      expect(isUnchanged(new Results({}, true), null, dateA).isValid).toBe(false);
      expect(isUnchanged(new Results({}, true), dateA, dateB).isValid).toBe(false);
      expect(isUnchanged(new Results({}, true), dateA, dateC).isValid).toBe(false);
      expect(isUnchanged(new Results({}, true), dateA, dateD).isValid).toBe(false);
    });
    it("validates that two strings are the same", () => {
      expect(isUnchanged(new Results({}, true), "", "").isValid).toBe(true);
      expect(isUnchanged(new Results({}, true), null, null).isValid).toBe(true);
      expect(isUnchanged(new Results({}, true), "hello", "hello").isValid).toBe(true);
    });
    it("fails validation for different strings", () => {
      expect(isUnchanged(new Results({}, true), "hello", null).isValid).toBe(false);
      expect(isUnchanged(new Results({}, true), null, "hello").isValid).toBe(false);
      expect(isUnchanged(new Results({}, true), "hello", "goodbye").isValid).toBe(false);
    });
    it("fails validation for different types", () => {
      expect(isUnchanged(new Results({}, true), "hello", new Date()).isValid).toBe(false);
    });
  });
});

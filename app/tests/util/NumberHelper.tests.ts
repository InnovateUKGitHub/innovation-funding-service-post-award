
import { isNumber } from "@framework/util";

describe("isNumber", () => {
    it("should return true if value is a number", () => {
        expect(isNumber(0)).toEqual(true);
        expect(isNumber(-100)).toEqual(true);
        expect(isNumber(-100.87)).toEqual(true);
        expect(isNumber(0.587)).toEqual(true);
        expect(isNumber(50)).toEqual(true);
    });

    it("should return false if value is not a number", () => {
        expect(isNumber(undefined as any)).toEqual(false);
        expect(isNumber(null)).toEqual(false);
        expect(isNumber("four" as any)).toEqual(false);
        expect(isNumber(NaN)).toEqual(false);
        expect(isNumber(true as any)).toEqual(false);
    });
});

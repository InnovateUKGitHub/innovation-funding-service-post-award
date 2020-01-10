import { DateTime } from "luxon";
import { dayComparator } from "@framework/util";

const dateFormat = "dd/MM/yyyy HH:mm";
describe("dayComparator", () => {
  it("should return zero when the days are the same", () => {
    const dateA = DateTime.fromFormat("01/01/2010 01:11", dateFormat).toJSDate();
    const dateB = DateTime.fromFormat("01/01/2010 02:12", dateFormat).toJSDate();
    expect(dayComparator(dateA, dateB)).toBe(0);
  });

  it("should return greater than zero when day A is after day B", () => {
    const dateA = DateTime.fromFormat("01/01/2012 01:11", dateFormat).toJSDate();
    const dateB = DateTime.fromFormat("01/01/2010 02:12", dateFormat).toJSDate();
    expect(dayComparator(dateA, dateB)).toBeGreaterThan(0);
  });

  it("should return less than zero when day A is before day B", () => {
    const dateA = DateTime.fromFormat("01/01/2010 01:11", dateFormat).toJSDate();
    const dateB = DateTime.fromFormat("02/01/2010 02:12", dateFormat).toJSDate();
    expect(dayComparator(dateA, dateB)).toBeLessThan(0);
  });
});

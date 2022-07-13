import { DateFormat } from "@framework/constants";
import { convertDateAndTime, formatDate } from "./dateHelpers";

describe("dateHelpers", () => {
  describe("convertDateAndTime", () => {
    it("should convert a javascript date for london timezone", () => {
      // using snapshot because string comparison is serializing to the same value
      expect(convertDateAndTime(new Date("2022-04-01T18:30:00.000+06:00"))).toMatchSnapshot();
    });

    it("should return null if null passed in", () => {
      expect(convertDateAndTime(null)).toBeNull();
    });
  });

  describe("formatDate", () => {
    const testDate = new Date("2022-04-01T18:30:00.000+01:00");
    const testDateAm = new Date("2022-04-01T08:30:00.000+01:00");
    const badDate = new Date("2022/13/13");
    test.each`
      date          | format                           | expected
      ${null}       | ${DateFormat.FULL_DATE}          | ${null}
      ${badDate}    | ${DateFormat.FULL_DATE}          | ${"INVALID DATE FORMAT"}
      ${testDate}   | ${DateFormat.FULL_DATE}          | ${"1 April 2022"}
      ${testDate}   | ${DateFormat.FULL_NUMERIC_DATE}  | ${"01/04/2022"}
      ${testDate}   | ${DateFormat.SHORT_DATE}         | ${"1 Apr 2022"}
      ${testDate}   | ${DateFormat.FULL_DATE_TIME}     | ${"1 April 2022, 6:30pm"}
      ${testDateAm} | ${DateFormat.FULL_DATE_TIME}     | ${"1 April 2022, 8:30am"}
      ${testDate}   | ${DateFormat.SHORT_DATE_TIME}    | ${"1 Apr 2022, 6:30pm"}
      ${testDateAm} | ${DateFormat.SHORT_DATE_TIME}    | ${"1 Apr 2022, 8:30am"}
      ${testDate}   | ${DateFormat.SHORT_MONTH}        | ${"Apr"}
      ${testDate}   | ${DateFormat.DAY_AND_LONG_MONTH} | ${"1 April"}
      ${testDate}   | ${DateFormat.LONG_YEAR}          | ${"2022"}
      ${testDate}   | ${DateFormat.MONTH_YEAR}         | ${"April 2022"}
      ${testDate}   | ${"UNKNOWN"}                     | ${"INVALID DATE FORMAT"}
    `("it should return $expected when the date is $date and the format is $format", ({ date, format, expected }) => {
      expect(formatDate(date, format)).toEqual(expected);
    });
  });
});

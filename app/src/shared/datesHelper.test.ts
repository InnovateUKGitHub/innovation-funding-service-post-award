import { calendarMonthNames, monthDifference, totalCalendarMonths } from "@shared/date-helpers";

describe("Date helpers", () => {
  test("calendarMonthNames", () => {
    expect(calendarMonthNames).toMatchSnapshot();
  });

  test("totalCalendarMonths", () => {
    expect(totalCalendarMonths).toBe(12);
  });

  describe("monthDifference", () => {
    const setUtcDate = (year: number, month: number): Date => new Date(Date.UTC(year, month - 1));

    test.each`
      name                                                   | fromDate                | toDate                  | expectedMonthDiff
      ${"with no change"}                                    | ${setUtcDate(2021, 12)} | ${setUtcDate(2021, 12)} | ${0}
      ${"with 1 month positive"}                             | ${setUtcDate(2021, 11)} | ${setUtcDate(2021, 12)} | ${1}
      ${"with 2 months positive"}                            | ${setUtcDate(2021, 10)} | ${setUtcDate(2021, 12)} | ${2}
      ${"with 1 month negative"}                             | ${setUtcDate(2021, 12)} | ${setUtcDate(2021, 11)} | ${-1}
      ${"with 2 months negative"}                            | ${setUtcDate(2021, 12)} | ${setUtcDate(2021, 10)} | ${-2}
      ${"with date returning positive number between years"} | ${setUtcDate(2021, 12)} | ${setUtcDate(2023, 1)}  | ${13}
      ${"with date returning negative number between years"} | ${setUtcDate(2023, 12)} | ${setUtcDate(2021, 1)}  | ${-35}
    `("$name", ({ fromDate, toDate, expectedMonthDiff }) => {
      expect(monthDifference(fromDate, toDate)).toBe(expectedMonthDiff);
    });
  });
});

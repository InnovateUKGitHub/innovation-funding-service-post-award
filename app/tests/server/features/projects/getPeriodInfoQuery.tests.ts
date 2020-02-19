// tslint:disable:no-identical-functions no-duplicate-string no-big-function
import { TestContext } from "../../testContextProvider";
import { GetPeriodInfoQuery } from "@server/features/projects/getPeriodInfoQuery";
import { ClaimFrequency } from "@framework/types";

const mapTestData = (data: { [key: string]: any }[]) => {
  return data.map(item => Object.keys(item).map((k) => item[k]));
};

describe("GetCurrentPeriodQuery", () => {

  const monthlyPeriodTestData: { startDate: string, endDate: string, now: string, current: number, total: number }[] = [
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "1999/12/31", current: 0, total: 24 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2000/01/01", current: 1, total: 24 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2000/01/31", current: 1, total: 24 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2000/02/01", current: 2, total: 24 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2000/02/28", current: 2, total: 24 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2001/02/28", current: 14, total: 24 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2001/07/25", current: 19, total: 24 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2001/07/31", current: 19, total: 24 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2001/12/01", current: 24, total: 24 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2002/01/01", current: 24, total: 24 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2002/06/01", current: 24, total: 24 },
  ];

  test.each(mapTestData(monthlyPeriodTestData))("For monthly project starting on %s ending %s when it is %s then period should be %i of %i", async (startDate: string, endDate: string, now: string, current: number, total: number) => {
    const context = new TestContext();

    const projectStart = context.clock.dateTime(startDate, "yyyy/MM/dd");
    const projectEnd = context.clock.dateTime(endDate, "yyyy/MM/dd");
    const frequency = ClaimFrequency.Monthly;

    context.clock.setDate(now);

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    expect(result.current).toEqual(current);
    expect(result.total).toEqual(total);

    if (current === 0) {
      expect(result.startDate).toBeNull();
      expect(result.endDate).toBeNull();
    }
    else {
      expect(result.startDate).toEqual(projectStart.plus({ months: current - 1 }).toJSDate());
      expect(result.endDate).toEqual(projectStart.plus({ months: current}).minus({day: 1}).toJSDate());
    }
  });

  const quartlerlyPeriodTestData: { startDate: string, endDate: string, now: string, current: number, total: number }[] = [
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "1999/12/31", current: 0, total: 8 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2000/01/01", current: 1, total: 8 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2000/01/31", current: 1, total: 8 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2000/02/01", current: 1, total: 8 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2000/02/28", current: 1, total: 8 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2000/03/31", current: 1, total: 8 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2000/04/01", current: 2, total: 8 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2000/12/31", current: 4, total: 8 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2001/01/01", current: 5, total: 8 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2001/07/25", current: 7, total: 8 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2001/07/31", current: 7, total: 8 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2001/12/01", current: 8, total: 8 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2002/01/01", current: 8, total: 8 },
    { startDate: "2000/01/01", endDate: "2001/12/31", now: "2002/06/01", current: 8, total: 8 },
  ];

  test.each(mapTestData(quartlerlyPeriodTestData))("For quartlery project starting on %s ending %s when it is %s then period should be %i of %i", async (startDate: string, endDate: string, now: string, current: number, total: number) => {
    const context = new TestContext();

    const projectStart = context.clock.dateTime(startDate, "yyyy/MM/dd");
    const projectEnd = context.clock.dateTime(endDate, "yyyy/MM/dd");
    const frequency = ClaimFrequency.Quarterly;

    context.clock.setDate(now);

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    expect(result.current).toEqual(current);
    expect(result.total).toEqual(total);

    if (current === 0) {
      expect(result.startDate).toBeNull();
      expect(result.endDate).toBeNull();
    }
    else {
      expect(result.startDate).toEqual(projectStart.plus({ months: (current - 1) * 3 }).toJSDate());
      expect(result.endDate).toEqual(projectStart.plus({ months: (current * 3)}).minus({day: 1}).toJSDate());
    }
  });

  const monthlyClaimWindowTestData: { startDate: string, endDate: string, now: string, expectClaimWindow: string | null }[] = [
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "1999/12/31", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/01/01", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/01/31", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/02/01", expectClaimWindow: "2000/02/01" },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/02/28", expectClaimWindow: "2000/02/01" },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/03/01", expectClaimWindow: "2000/03/01" },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/03/02", expectClaimWindow: "2000/03/01" },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/03/03", expectClaimWindow: "2000/03/01" },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/03/30", expectClaimWindow: "2000/03/01" },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/03/31", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/12/31", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2001/01/01", expectClaimWindow: "2001/01/01" },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2001/01/30", expectClaimWindow: "2001/01/01" },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2001/01/31", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2001/02/01", expectClaimWindow: null },
  ];

  test.each(mapTestData(monthlyClaimWindowTestData))("For monthly project starting on %s ending %s when it is %s then claim window start should be %s", async (startDate: string, endDate: string, now: string, expectClaimWindow: string | null) => {
    const context = new TestContext();

    const projectStart = context.clock.dateTime(startDate, "yyyy/MM/dd");
    const projectEnd = context.clock.dateTime(endDate, "yyyy/MM/dd");
    const frequency = ClaimFrequency.Monthly;

    context.clock.setDate(now);

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    if (expectClaimWindow) {
      const expectedStart = context.clock.dateTime(expectClaimWindow, "yyyy/MM/dd");
      const expectedEnd = expectedStart.plus({ days: 30, minutes: -1 });

      expect(result.currentClaimWindowStart).toEqual(expectedStart.toJSDate());
      expect(result.currentClaimWindowEnd).toEqual(expectedEnd.toJSDate());
    }
    else {
      expect(result.currentClaimWindowStart).toBeNull();
      expect(result.currentClaimWindowEnd).toBeNull();
    }
  });

  const quarterlyClaimWindowTestData: { startDate: string, endDate: string, now: string, expectClaimWindow: string | null }[] = [
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "1999/12/31", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/01/01", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/01/31", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/02/01", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/03/31", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/04/01", expectClaimWindow: "2000/04/01" },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/04/30", expectClaimWindow: "2000/04/01" },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/05/01", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/07/31", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/06/30", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/07/01", expectClaimWindow: "2000/07/01" },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/07/30", expectClaimWindow: "2000/07/01" },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/07/31", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/09/30", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/10/01", expectClaimWindow: "2000/10/01" },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/10/30", expectClaimWindow: "2000/10/01" },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/10/31", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2000/12/31", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2001/01/01", expectClaimWindow: "2001/01/01" },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2001/01/30", expectClaimWindow: "2001/01/01" },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2001/01/31", expectClaimWindow: null },
    { startDate: "2000/01/01", endDate: "2000/12/31", now: "2002/01/31", expectClaimWindow: null },
  ];

  test.each(mapTestData(quarterlyClaimWindowTestData))("For quarterly project starting on %s ending %s when it is %s then claim window start should be %s", async (startDate: string, endDate: string, now: string, expectClaimWindow: string | null) => {
    const context = new TestContext();

    const projectStart = context.clock.dateTime(startDate, "yyyy/MM/dd");
    const projectEnd = context.clock.dateTime(endDate, "yyyy/MM/dd");
    const frequency = ClaimFrequency.Quarterly;

    context.clock.setDate(now);

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    if (expectClaimWindow) {
      const expectedStart = context.clock.dateTime(expectClaimWindow, "yyyy/MM/dd");
      const expectedEnd = expectedStart.plus({ days: 30, minutes: -1 });

      expect(result.currentClaimWindowStart).toEqual(expectedStart.toJSDate());
      expect(result.currentClaimWindowEnd).toEqual(expectedEnd.toJSDate());
    }
    else {
      expect(result.currentClaimWindowStart).toBeNull();
      expect(result.currentClaimWindowEnd).toBeNull();
    }
  });

  test("if project does not have claim frequency returns zero period", async () => {
    const context = new TestContext();

    const projectStart = context.clock.asLuxon().set({ day: 1, minute: 1, second: 1, millisecond: 1 });
    const projectEnd = projectStart.plus({ month: 1 });
    const frequency = ClaimFrequency.Unknown;

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    expect(result).toEqual({
      current: 0,
      total: null,
      startDate: null,
      endDate: null,
      currentClaimWindowStart: null,
      currentClaimWindowEnd: null
    });

  });
});

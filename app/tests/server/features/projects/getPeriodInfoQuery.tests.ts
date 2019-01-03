// tslint:disable:no-identical-functions no-duplicate-string no-big-function
import { TestContext } from "../../testContextProvider";
import { GetPeriodInfoQuery } from "../../../../src/server/features/projects/getPeriodInfoQuery";
import { ClaimFrequency } from "../../../../src/types";
import { DateTime } from "luxon";

describe("GetCurrentPeriodQuery", () => {
  it("when current date before start date returns 0", async () => {

    const context = new TestContext();
    context.clock.setDate("2012/05/01");

    const now = context.clock.asLuxon();
    const projectStart = now.plus({ days: 1 });
    const projectEnd = projectStart.plus({ years: 1 });
    const frequency = ClaimFrequency.Monthly;

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    expect(result.current).toBe(0);
  });

  it("when current date is start date returns 1", async () => {

    const context = new TestContext();

    context.clock.setDate("2012/05/01");

    const now = context.clock.asLuxon();
    const projectStart = now.set({});
    const projectEnd = projectStart.plus({ years: 1 });
    const frequency = ClaimFrequency.Monthly;

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    expect(result.current).toBe(1);
  });

  it("when current date is month after start date and frequency is monthly returns 2", async () => {

    const context = new TestContext();

    context.clock.setDate("2012/05/01");

    const now = context.clock.asLuxon();
    const projectStart = now.minus({ months: 1 });
    const projectEnd = projectStart.plus({ years: 1 });
    const frequency = ClaimFrequency.Monthly;

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    expect(result.current).toBe(2);
  });

  it("when current date is year after start date and frequency is monthly returns 13", async () => {

    const context = new TestContext();

    context.clock.setDate("2012/05/01");
    const now = context.clock.asLuxon();
    const projectStart = now.minus({ years: 1 });
    const projectEnd = projectStart.plus({ years: 2 });
    const frequency = ClaimFrequency.Monthly;

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    expect(result.current).toBe(13);
  });

  it("when current date is month after start date and frequency is quarterly returns 1", async () => {

    const context = new TestContext();

    context.clock.setDate("2012/05/01");
    const now = context.clock.asLuxon();
    const projectStart = now.minus({ months: 1 });
    const projectEnd = projectStart.plus({ years: 1 });
    const frequency = ClaimFrequency.Quarterly;

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    expect(result.current).toBe(1);
  });

  it("when current date is 4 months after start date and frequency is quarterly returns 2", async () => {

    const context = new TestContext();

    context.clock.setDate("2012/05/01");
    const now = context.clock.asLuxon();
    const projectStart = now.minus({ months: 4 });
    const projectEnd = projectStart.plus({ years: 1 });
    const frequency = ClaimFrequency.Quarterly;

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    expect(result.current).toBe(2);
  });

  it("when current date is year after start date and frequency is quartly returns 5", async () => {

    const context = new TestContext();

    context.clock.setDate("2012/05/01");
    const now = context.clock.asLuxon();
    const projectStart = now.minus({ years: 1 });
    const projectEnd = projectStart.plus({ years: 2 });
    const frequency = ClaimFrequency.Quarterly;

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    expect(result.current).toBe(5);
  });

  it("when current date is year after start date and max number is 6 returns 6", async () => {

    const context = new TestContext();

    context.clock.setDate("2012/05/01");
    const now = context.clock.asLuxon();
    const projectStart = now.minus({ years: 1 });
    const projectEnd = projectStart.plus({ months: 6 });
    const frequency = ClaimFrequency.Monthly;

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    expect(result.current).toBe(6);
  });

  it("when project ends 1 year after it starts and frequency is monthly then total periods is 12", async () => {

    const context = new TestContext();

    const projectStart = context.clock.asLuxon();
    const projectEnd = projectStart.plus({years:1});
    const frequency = ClaimFrequency.Monthly;

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    expect(result.total).toBe(12);
  });

  it("when project ends 1 year after it starts and frequency is quartlery then total periods is 4", async () => {

    const context = new TestContext();

    const projectStart = context.clock.asLuxon();
    const projectEnd = projectStart.plus({years:1});
    const frequency = ClaimFrequency.Quarterly;

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    expect(result.total).toBe(4);
  });

  it("when project ends 1 year minus a day after it starts and frequency is monthly then total periods is 12", async () => {

    const context = new TestContext();

    const projectStart = context.clock.asLuxon();
    const projectEnd = projectStart.plus({years:1}).minus({days: 1});
    const frequency = ClaimFrequency.Monthly;

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    expect(result.total).toBe(12);
  });

  it("when project ends 1 year and a day after it starts and frequency is monthly then total periods is 13", async () => {

    const context = new TestContext();

    const projectStart = context.clock.asLuxon();
    const projectEnd = projectStart.plus({years:1, days: 1});
    const frequency = ClaimFrequency.Monthly;

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    expect(result.total).toBe(13);
  });

  it("when project is in period and frequency is monthly then start date and end date are correct", async () => {
    const context = new TestContext();

    context.clock.setDate("2000/05/01");

    const projectStart = context.clock.asLuxon().set({hour:0, minute: 0, second: 0}).minus({months: 1});
    const projectEnd = projectStart.plus({years:1});
    const frequency = ClaimFrequency.Monthly;

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    expect(result.startDate!.toISOString()).toBe(DateTime.fromFormat("2000/05/01", "yyyy/MM/dd").toJSDate().toISOString());
    expect(result.endDate!.toISOString()).toBe(DateTime.fromFormat("2000/05/31", "yyyy/MM/dd").toJSDate().toISOString());
  });

  it("when project is in period and frequency is quartley then start date and end date are correct", async () => {
    const context = new TestContext();

    context.clock.setDate("2000/05/01");

    const projectStart = context.clock.asLuxon().set({hour:0, minute: 0, second: 0}).minus({months: 1});
    const projectEnd = projectStart.plus({years:1});
    const frequency = ClaimFrequency.Quarterly;

    const query = new GetPeriodInfoQuery(projectStart.toJSDate(), projectEnd.toJSDate(), frequency);
    const result = await context.runSyncQuery(query);

    expect(result.startDate!.toISOString()).toBe(DateTime.fromFormat("2000/04/01", "yyyy/MM/dd").toJSDate().toISOString());
    expect(result.endDate!.toISOString()).toBe(DateTime.fromFormat("2000/06/30", "yyyy/MM/dd").toJSDate().toISOString());
  });
});

// tslint:disable: no-duplicate-string no-big-function

import { DateTime } from "luxon";
import { TestContext } from "../../testContextProvider";
import { GetMonitoringReportsForProject } from "@server/features/monitoringReports/getMonitoringReportsForProject";
import { MonitoringReportStatus } from "@framework/constants";

describe("GetMonitoringReportsForProject", () => {
  it("returns an object of the right shape", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const project = testData.createProject();
    const periodId = 1;
    const header = testData.createMonitoringReportHeader(project, periodId);

    const query = new GetMonitoringReportsForProject(project.Id);
    const result = await context.runQuery(query);
    expect(result[0].headerId).toBe(header.Id);
    expect(result[0].status).toBe(MonitoringReportStatus.Draft);
    expect(result[0].periodId).toBe(periodId);
    expect(result[0].startDate).toEqual(DateTime.fromFormat(header.Acc_PeriodStartDate__c, "yyyy-MM-dd").toJSDate());
    expect(result[0].endDate).toEqual(DateTime.fromFormat(header.Acc_PeriodEndDate__c, "yyyy-MM-dd").toJSDate());
  });

  it("returns the correct number of objects", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const project = testData.createProject();
    testData.createMonitoringReportHeader(project, 1);
    testData.createMonitoringReportHeader(project, 2);

    const query = new GetMonitoringReportsForProject(project.Id);
    const result = await context.runQuery(query);
    expect(result.length).toEqual(2);
  });

  it("should sort by period id", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const project = testData.createProject();
    testData.createMonitoringReportHeader(project, 1);
    testData.createMonitoringReportHeader(project, 2);
    testData.createMonitoringReportHeader(project, 3);

    const query = new GetMonitoringReportsForProject(project.Id);
    const result = await context.runQuery(query);
    expect(result[0].periodId).toEqual(3);
    expect(result[2].periodId).toEqual(1);
  });
});

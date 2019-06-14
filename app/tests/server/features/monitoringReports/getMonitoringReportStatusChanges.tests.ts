import { TestContext } from "../../testContextProvider";
import { GetMonitoringReportStatusChanges } from "@server/features/monitoringReports/getMonitoringReportStatusChanges";
import { DateTime } from "luxon";

describe("GetMonitoringReportStatusChanges", () => {
  it("returns an object of the right shape", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const project = testData.createProject();
    const report = testData.createMonitoringReportHeader(project, 1);
    const statusChange = testData.createMonitoringReportStatusChange(report);

    const query = new GetMonitoringReportStatusChanges(project.Id, report.Id);
    const result = await context.runQuery(query);

    expect(result[0].previousStatus).toBe(statusChange.Acc_PreviousMonitoringReportStatus__c);
    expect(result[0].newStatus).toBe(statusChange.Acc_NewMonitoringReportStatus__c);
    expect(result[0].monitoringReport).toBe(report.Id);
    expect(result[0].createdDate).toEqual(DateTime.fromISO(statusChange.CreatedDate).toJSDate());
  });

  it("returns the correct number of status changes", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const project = testData.createProject();
    const report = testData.createMonitoringReportHeader(project, 1);
    testData.createMonitoringReportStatusChange(report);
    testData.createMonitoringReportStatusChange(report);

    const query = new GetMonitoringReportStatusChanges(project.Id, report.Id);
    const result = await context.runQuery(query);
    expect(result.length).toEqual(2);
  });
});

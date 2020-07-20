import { TestContext } from "../../testContextProvider";
import { GetMonitoringReportStatusChanges } from "@server/features/monitoringReports/getMonitoringReportStatusChanges";
import { DateTime } from "luxon";
import { MonitoringReportStatus } from "@framework/types";

describe("GetMonitoringReportStatusChanges", () => {
  it("returns an object of the right shape", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const project = testData.createProject();
    const report = testData.createMonitoringReportHeader(project, 1);
    const statusChange = testData.createMonitoringReportStatusChange(report);
    statusChange.Acc_PreviousMonitoringReportStatus__c = "Draft";
    statusChange.Acc_NewMonitoringReportStatus__c = "Approved";
    statusChange.Acc_ExternalComment__c = "Test comment";

    const query = new GetMonitoringReportStatusChanges(project.Id, report.Id);
    const result = await context.runQuery(query);

    expect(result[0].previousStatus).toBe(MonitoringReportStatus.Draft);
    expect(result[0].previousStatusLabel).toBe("Draft");
    expect(result[0].newStatus).toBe(MonitoringReportStatus.Approved);
    expect(result[0].newStatusLabel).toBe("Approved");
    expect(result[0].monitoringReport).toBe(report.Id);
    expect(result[0].createdDate).toEqual(DateTime.fromISO(statusChange.CreatedDate).toJSDate());
    expect(result[0].comments).toEqual("Test comment");
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

  it("uses option labels lookup", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const report = context.testData.createMonitoringReportHeader(project, 1);
    const statusChange = context.testData.createMonitoringReportStatusChange(report);
    statusChange.Acc_PreviousMonitoringReportStatus__c = "Draft";
    statusChange.Acc_NewMonitoringReportStatus__c = "Approved";

    context.caches.optionsLookup
      .addMonitoringReportItem(MonitoringReportStatus.Draft, "Custom Draft")
      .addMonitoringReportItem(MonitoringReportStatus.Approved, "Custom Approved")
      ;

    const query = new GetMonitoringReportStatusChanges(project.Id, report.Id);
    const result = (await context.runQuery(query))[0];

    expect(result.previousStatusLabel).toBe("Custom Draft");
    expect(result.newStatusLabel).toBe("Custom Approved");

  });
});

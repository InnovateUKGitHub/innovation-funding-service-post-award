import { TestContext } from "../../testContextProvider";
import { DeleteMonitoringReportCommand } from "@server/features/monitoringReports/deleteMonitoringReport";
import {BadRequestError} from "@server/features/common";

describe("DeleteMonitoringReportCommand", () => {
  it("should delete a monitoring report in draft status", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const report = context.testData.createMonitoringReportHeader(project, 1, {Acc_MonitoringReportStatus__c: "Draft"});
    expect(context.repositories.monitoringReportHeader.Items).toHaveLength(1);

    const deleteCommand = new DeleteMonitoringReportCommand(project.Id, report.Id);
    await context.runCommand(deleteCommand);
    expect(context.repositories.monitoringReportHeader.Items).toHaveLength(0);
  });

  type notAllowedStatuses = ("New" | "Awaiting IUK Approval" | "Approved" | "IUK Queried");
  const statuses: notAllowedStatuses[] = [
      "New",
      "Awaiting IUK Approval",
      "Approved",
      "IUK Queried"
  ];

  it.each(statuses)("should not delete a monitoring report in %s status", async (status: notAllowedStatuses) => {
      const context = new TestContext();
      const project = context.testData.createProject();
      const report = context.testData.createMonitoringReportHeader(project, 1, {Acc_MonitoringReportStatus__c: status});

      const deleteCommand = new DeleteMonitoringReportCommand(project.Id, report.Id);
      await expect(context.runCommand(deleteCommand)).rejects.toThrow(BadRequestError);
  });
});

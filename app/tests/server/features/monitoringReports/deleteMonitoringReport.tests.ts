import { TestContext } from "../../testContextProvider";
import { DeleteMonitoringReportCommand } from "@server/features/monitoringReports/deleteMonitoringReport";

describe("DeleteMonitoringReportCommand", () => {
  it("should upload and then delete a monitoring report", async () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    const report = context.testData.createMonitoringReportHeader(project);
    expect(context.repositories.monitoringReportHeader.Items).toHaveLength(1);

    const deleteCommand = new DeleteMonitoringReportCommand(project.Id, report.Id);
    await context.runCommand(deleteCommand);
    expect(context.repositories.monitoringReportHeader.Items).toHaveLength(0);
  });
});

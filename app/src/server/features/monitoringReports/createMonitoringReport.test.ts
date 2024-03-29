import { MonitoringReportStatus } from "@framework/constants/monitoringReportStatus";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { CreateMonitoringReportCommand } from "@server/features/monitoringReports/createMonitoringReport";
import { GetMonitoringReportActiveQuestions } from "@server/features/monitoringReports/getMonitoringReportActiveQuestions";
import { TestContext } from "@tests/test-utils/testContextProvider";

describe("createMonitoringReports", () => {
  it("should create new", async () => {
    const context = new TestContext();

    const dto = await getCreateDto(context, "2018-01-02", "2018-03-04");

    expect(context.repositories.monitoringReportHeader.Items.length).toBe(0);

    const result = await context.runCommand(new CreateMonitoringReportCommand(dto, false));

    expect(context.repositories.monitoringReportHeader.Items.length).toBe(1);
    expect(context.repositories.monitoringReportHeader.Items[0].Acc_PeriodStartDate__c).toBe("2018-01-02");
    expect(context.repositories.monitoringReportHeader.Items[0].Acc_PeriodEndDate__c).toBe("2018-03-04");
    expect(context.repositories.monitoringReportHeader.Items[0].Acc_AddComments__c).toBe("");
    expect(result).toEqual(context.repositories.monitoringReportHeader.Items[0].Id);
  });

  it("should create Draft report if specified", async () => {
    const context = new TestContext();

    const dto = await getCreateDto(context);

    await context.runCommand(new CreateMonitoringReportCommand(dto, false));

    expect(context.repositories.monitoringReportHeader.Items[0].Acc_MonitoringReportStatus__c).toEqual("Draft");
  });

  it("should create Submitted report if specified", async () => {
    const context = new TestContext();

    const dto = await getCreateDto(context);

    await context.runCommand(new CreateMonitoringReportCommand(dto, true));

    expect(context.repositories.monitoringReportHeader.Items[0].Acc_MonitoringReportStatus__c).toEqual(
      "Awaiting IUK Approval",
    );
  });

  it("should create a status change for draft if the report is created", async () => {
    const context = new TestContext();

    const dto = await getCreateDto(context);
    const headerId = await context.runCommand(new CreateMonitoringReportCommand(dto, false));
    expect(
      context.repositories.monitoringReportStatusChange.Items.filter(x => x.Acc_MonitoringReport__c === headerId),
    ).toHaveLength(1);
  });

  it("should create a status change for awaiting approval if the report is submitted", async () => {
    const context = new TestContext();

    const dto = await getCreateDto(context);
    const headerId = await context.runCommand(new CreateMonitoringReportCommand(dto, true));
    expect(
      context.repositories.monitoringReportStatusChange.Items.filter(x => x.Acc_MonitoringReport__c === headerId),
    ).toHaveLength(2);
  });
});

/**
 * helper function that returns a Monitoring Report Dto promise
 */
async function getCreateDto(context: TestContext, startDate?: string, endDate?: string): Promise<MonitoringReportDto> {
  const questions = await context.runQuery(new GetMonitoringReportActiveQuestions());
  const project = context.testData.createProject(x => {
    x.Acc_CurrentPeriodNumber__c = 1;
  });
  const partner = context.testData.createPartner(project);
  context.testData.createProfileTotalPeriod(
    partner,
    1,
    undefined,
    x => (
      startDate && (x.Acc_ProjectPeriodStartDate__c = startDate), endDate && (x.Acc_ProjectPeriodEndDate__c = endDate)
    ),
  );

  return {
    projectId: project.Id,
    headerId: "" as MonitoringReportId,
    status: MonitoringReportStatus.Draft,
    statusName: "Draft",
    startDate: null,
    endDate: null,
    periodId: 1 as PeriodId,
    lastUpdated: null,
    questions,
    addComments: "",
  };
}

// tslint:disable
import { TestContext } from "../../testContextProvider";
import { CreateMonitoringReportCommand } from "@server/features/monitoringReports/createMonitoringReport";
import { GetMonitoringReportActiveQuestions } from "@server/features/monitoringReports/getMonitoringReportActiveQuestions";
import { MonitoringReportDto } from "@framework/types";
import { MonitoringReportStatus } from "@framework/constants";

describe("createMonitoringReports", () => {

  it("should create new", async () => {
    const context = new TestContext();

    const dto = await getCreateDto(context, "2018-01-02", "2018-03-04");

    expect(context.repositories.monitoringReportHeader.Items.length).toBe(0);

    const result = await context.runCommand(new CreateMonitoringReportCommand(dto, false));

    expect(context.repositories.monitoringReportHeader.Items.length).toBe(1);
    expect(context.repositories.monitoringReportHeader.Items[0].Acc_PeriodStartDate__c).toBe("2018-01-02");
    expect(context.repositories.monitoringReportHeader.Items[0].Acc_PeriodEndDate__c).toBe("2018-03-04");
    expect(result).toEqual(context.repositories.monitoringReportHeader.Items[0].Id);
  });

  it("should create Draft report if specified", async () => {
    const context = new TestContext();

    const dto = await getCreateDto(context);

    await context.runCommand(new CreateMonitoringReportCommand(dto, false));

    expect(context.repositories.monitoringReportHeader.Items[0].Acc_MonitoringReportStatus__c).toEqual("Draft");
  });

  it("should create new with all answered questions", async () => {
    const context = new TestContext();

    const questionOptions = context.testData.range(3, seed => context.testData.createMonitoringReportQuestionSet(seed, 3));

    const dto = await getCreateDto(context);

    dto.questions[0].optionId = questionOptions[0][0].Id;
    dto.questions[0].comments = "Question 1 Comments";

    dto.questions[2].optionId = questionOptions[2][2].Id;
    dto.questions[2].comments = "Question 3 Comments";

    expect(context.repositories.monitoringReportResponse.Items.length).toBe(0);

    const headerId = await context.runCommand(new CreateMonitoringReportCommand(dto, false));

    expect(context.repositories.monitoringReportResponse.Items.length).toBe(2);
    expect(context.repositories.monitoringReportResponse.Items.map(x => x.Acc_MonitoringHeader__c)).toEqual([headerId, headerId]);
    expect(context.repositories.monitoringReportResponse.Items.map(x => x.Acc_QuestionComments__c)).toEqual(["Question 1 Comments", "Question 3 Comments"]);
    expect(context.repositories.monitoringReportResponse.Items.map(x => x.Acc_Question__c)).toEqual([questionOptions[0][0].Id, questionOptions[2][2].Id]);
  });

  it("should create Submitted report if specified", async () => {
    const context = new TestContext();

    const dto = await getCreateDto(context);

    await context.runCommand(new CreateMonitoringReportCommand(dto, true));

    expect(context.repositories.monitoringReportHeader.Items[0].Acc_MonitoringReportStatus__c).toEqual("Awaiting IUK Approval");
  });

  it("should create a status change for draft if the report is created", async () => {
    const context = new TestContext();

    const dto = await getCreateDto(context);
    const headerId = await context.runCommand(new CreateMonitoringReportCommand(dto, false));
    expect(context.repositories.monitoringReportStatusChange.Items.filter(x => x.Acc_MonitoringReport__c === headerId)).toHaveLength(1);
  });

  it("should create a status change for awaiting approval if the report is submitted", async () => {
    const context = new TestContext();

    const dto = await getCreateDto(context);
    const headerId = await context.runCommand(new CreateMonitoringReportCommand(dto, true));
    expect(context.repositories.monitoringReportStatusChange.Items.filter(x => x.Acc_MonitoringReport__c === headerId)).toHaveLength(2);
  });
});

async function getCreateDto(context: TestContext, startDate?: string, endDate?: string): Promise<MonitoringReportDto> {
  const questions = await context.runQuery(new GetMonitoringReportActiveQuestions());
  const project = context.testData.createProject((x) => {
    x.Acc_CurrentPeriodNumber__c = 1;
  });
  const partner = context.testData.createPartner(project);
  context.testData.createProfileTotalPeriod(partner, 1, x => {
    startDate && (x.Acc_ProjectPeriodStartDate__c = startDate);
    endDate && (x.Acc_ProjectPeriodEndDate__c = endDate);
  });

  return {
    projectId: project.Id,
    headerId: "",
    status: MonitoringReportStatus.Draft,
    statusName: "Draft",
    startDate: null,
    endDate: null,
    periodId: 1,
    lastUpdated: null,
    questions
  };
}

// tslint:disable
import { TestContext } from "../../testContextProvider";
import { CreateMonitoringReport } from "@server/features/monitoringReports/createMonitoringReport";
import { ISalesforceProject } from "@server/repositories";
import { MonitoringReportDto } from "@framework/types";
import { GetMonitoringReportActiveQuestions } from "@server/features/monitoringReports/getMonitoringReportActiveQuestions";
import { MonitoringReportStatus } from "@framework/types/constants/monitoringReportStatus";

describe("createMonitoringReports", () => {

  it("should create new", async () => {
    const context = new TestContext();

    const project = context.testData.createProject((x) => {
      x.Acc_StartDate__c = "2018-01-01";
      x.Acc_EndDate__c = "2030-01-01";
      x.Acc_ClaimFrequency__c = "Monthly";
    });

    const dto = await getCreateDto(context, project);

    expect(context.repositories.monitoringReportHeader.Items.length).toBe(0);

    const result = await context.runCommand(new CreateMonitoringReport(dto, false));

    expect(context.repositories.monitoringReportHeader.Items.length).toBe(1);
    expect(result).toEqual(context.repositories.monitoringReportHeader.Items[0].Id);
  });

  it("should create Draft report if specified", async () => {
    const context = new TestContext();

    const project = context.testData.createProject((x) => {
      x.Acc_StartDate__c = "2018-01-01";
      x.Acc_EndDate__c = "2030-01-01";
      x.Acc_ClaimFrequency__c = "Monthly";
    });

    const dto = await getCreateDto(context, project);

    await context.runCommand(new CreateMonitoringReport(dto, false));

    expect(context.repositories.monitoringReportHeader.Items[0].Acc_MonitoringReportStatus__c).toEqual("Draft");
  });

  it("should create new with all answered questions", async () => {
    const context = new TestContext();

    const project = context.testData.createProject((x) => {
      x.Acc_StartDate__c = "2018-01-01";
      x.Acc_EndDate__c = "2030-01-01";
      x.Acc_ClaimFrequency__c = "Monthly";
    });

    const questionOptions = context.testData.range(3, seed => context.testData.createMonitoringReportQuestionSet(seed, 3));

    const dto = await getCreateDto(context, project);

    dto.questions[0].optionId = questionOptions[0][0].Id;
    dto.questions[0].comments = "Question 1 Comments";

    dto.questions[2].optionId = questionOptions[2][2].Id;
    dto.questions[2].comments = "Question 3 Comments";

    expect(context.repositories.monitoringReportResponse.Items.length).toBe(0);

    const headerId = await context.runCommand(new CreateMonitoringReport(dto, false));

    expect(context.repositories.monitoringReportResponse.Items.length).toBe(2);
    expect(context.repositories.monitoringReportResponse.Items.map(x => x.Acc_MonitoringHeader__c)).toEqual([headerId, headerId]);
    expect(context.repositories.monitoringReportResponse.Items.map(x => x.Acc_QuestionComments__c)).toEqual(["Question 1 Comments", "Question 3 Comments"]);
    expect(context.repositories.monitoringReportResponse.Items.map(x => x.Acc_Question__c)).toEqual([questionOptions[0][0].Id, questionOptions[2][2].Id]);
  });

  it("should create Submitted report if specified", async () => {
    const context = new TestContext();

    const project = context.testData.createProject((x) => {
      x.Acc_StartDate__c = "2018-01-01";
      x.Acc_EndDate__c = "2030-01-01";
      x.Acc_ClaimFrequency__c = "Monthly";
    });

    const dto = await getCreateDto(context, project);

    await context.runCommand(new CreateMonitoringReport(dto, true));

    expect(context.repositories.monitoringReportHeader.Items[0].Acc_MonitoringReportStatus__c).toEqual("Awaiting IUK Approval");
  });

});

async function getCreateDto(context: TestContext, project: ISalesforceProject): Promise<MonitoringReportDto> {
  const questions = await context.runQuery(new GetMonitoringReportActiveQuestions());

  return {
    projectId: project.Id,
    headerId: "",
    title: "The test report",
    status: MonitoringReportStatus.Draft,
    statusName: "Draft",
    startDate: null,
    endDate: null,
    periodId: 1,
    lastUpdated: null,
    questions
  };
}

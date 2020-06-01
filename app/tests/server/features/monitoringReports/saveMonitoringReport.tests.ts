// tslint:disable:no-duplicate-string no-big-function
import { TestContext } from "../../testContextProvider";
import { SaveMonitoringReport } from "@server/features/monitoringReports/saveMonitoringReport";
import { BadRequestError, ValidationError } from "@server/features/common";
import { ISalesforceMonitoringReportHeader } from "@server/repositories";
import { GetMonitoringReportById } from "@server/features/monitoringReports/getMonitoringReport";
import { MonitoringReportDto } from "@framework/dtos";

describe("saveMonitoringReports", () => {
  it("should not save responses without an option id", async () => {
    const context = new TestContext();

    // create a question
    context.testData.createMonitoringReportQuestionSet(1, 3);

    const report = context.testData.createMonitoringReportHeader();

    const dto = await getDto(context, report);

    const command = new SaveMonitoringReport(dto, false);
    await context.runCommand(command);

    expect(context.repositories.monitoringReportResponse.Items).toEqual([]);
  });

  it("should save all new responses", async () => {
    const context = new TestContext();

    const question1Options = context.testData.createMonitoringReportQuestionSet(1, 3);
    const question1Answer = question1Options[2];
    const question2Options = context.testData.createMonitoringReportQuestionSet(2, 3);
    const question2Answer = question2Options[1];

    const report = context.testData.createMonitoringReportHeader();

    const dto = await getDto(context, report);

    dto.questions[0].optionId = question1Answer.Id;
    dto.questions[0].comments = "Question 1 comments";

    dto.questions[1].optionId = question2Answer.Id;
    dto.questions[1].comments = "Question 2 comments";

    const command = new SaveMonitoringReport(dto, false);
    await context.runCommand(command);

    expect(context.repositories.monitoringReportResponse.Items.length).toEqual(2);

    expect(context.repositories.monitoringReportResponse.Items[0].Acc_QuestionComments__c).toEqual("Question 1 comments");
    expect(context.repositories.monitoringReportResponse.Items[0].Acc_Question__c).toEqual(question1Answer.Id);

    expect(context.repositories.monitoringReportResponse.Items[1].Acc_QuestionComments__c).toEqual("Question 2 comments");
    expect(context.repositories.monitoringReportResponse.Items[1].Acc_Question__c).toEqual(question2Answer.Id);
  });

  it("should update existing responses", async () => {
    const context = new TestContext();

    const question1Options = context.testData.createMonitoringReportQuestionSet(1, 3);
    const question1NewAnswer = question1Options[2];
    const question2Options = context.testData.createMonitoringReportQuestionSet(2, 3);
    const question2Answer = question2Options[1];

    const report = context.testData.createMonitoringReportHeader();

    const responseQuestion1 = context.testData.createMonitoringReportResponse(report, question1Options[0], { Acc_QuestionComments__c: "Question 1 - old answer" });
    const responseQuestion2 = context.testData.createMonitoringReportResponse(report, question2Answer, { Acc_QuestionComments__c: "Question 2 comments" });

    const dto = await getDto(context, report);

    dto.questions[0].optionId = question1NewAnswer.Id;
    dto.questions[0].comments = "Question 1 new comments";

    const command = new SaveMonitoringReport(dto, false);
    await context.runCommand(command);

    expect(context.repositories.monitoringReportResponse.Items.map(x => x.Id)).toEqual([responseQuestion1.Id, responseQuestion2.Id]);

    expect(responseQuestion1.Acc_QuestionComments__c).toEqual("Question 1 new comments");
    expect(responseQuestion1.Acc_Question__c).toEqual(question1NewAnswer.Id);

    expect(responseQuestion2.Acc_QuestionComments__c).toEqual("Question 2 comments");
    expect(responseQuestion2.Acc_Question__c).toEqual(question2Answer.Id);
  });

  it("should remove ommitted responses", async () => {
    const context = new TestContext();

    const question1Options = context.testData.createMonitoringReportQuestionSet(1, 3);
    const question2Options = context.testData.createMonitoringReportQuestionSet(2, 3);

    const report = context.testData.createMonitoringReportHeader();
    const responseQuestion1 = context.testData.createMonitoringReportResponse(report, question1Options[0], { Acc_QuestionComments__c: "Question 1 - old answer" });
    const responseQuestion2 = context.testData.createMonitoringReportResponse(report, question2Options[0], { Acc_QuestionComments__c: "Question 2 - old answer" });

    const dto = await getDto(context, report);

    dto.questions[0].responseId = null;
    dto.questions[0].optionId = null;
    dto.questions[0].comments = null;

    expect(context.repositories.monitoringReportResponse.Items).toEqual([responseQuestion1, responseQuestion2]);

    const command = new SaveMonitoringReport(dto, false);
    await context.runCommand(command);

    expect(context.repositories.monitoringReportResponse.Items).toEqual([responseQuestion2]);
  });

  it("should not change the report status from draft if it has not been submitted", async () => {
    const context = new TestContext();

    const report = context.testData.createMonitoringReportHeader(undefined, 1, { Acc_MonitoringReportStatus__c: "Draft" });

    const dto = await getDto(context, report);

    await context.runCommand(new SaveMonitoringReport(dto, false));

    expect(report.Acc_MonitoringReportStatus__c).toBe("Draft");

  });

  it("should save the report with submitted status if it is submitted", async () => {
    const context = new TestContext();

    const report = context.testData.createMonitoringReportHeader(undefined, 1, { Acc_MonitoringReportStatus__c: "Draft" });

    const dto = await getDto(context, report);

    await context.runCommand(new SaveMonitoringReport(dto, true));

    expect(report.Acc_MonitoringReportStatus__c).toBe("Awaiting IUK Approval");
  });

  it("should create a status change if the report is submitted", async () => {
    const context = new TestContext();
    const report = context.testData.createMonitoringReportHeader(undefined, 1, { Acc_MonitoringReportStatus__c: "Draft" });

    const dto = await getDto(context, report);

    await context.runCommand(new SaveMonitoringReport(dto, true));
    expect(context.repositories.monitoringReportStatusChange.Items.find(x => x.Acc_MonitoringReport__c === dto.headerId)).toBeDefined();
  });

  it("should not create a status change if the report is not submitted", async () => {
    const context = new TestContext();
    const report = context.testData.createMonitoringReportHeader(undefined, 1, { Acc_MonitoringReportStatus__c: "Draft" });

    const dto = await getDto(context, report);

    await context.runCommand(new SaveMonitoringReport(dto, false));
    expect(context.repositories.monitoringReportStatusChange.Items).toHaveLength(0);
  });
});

describe("saveMonitoringReports validation", () => {
  it("should throw an error if the report has already been submitted", async () => {
    const context = new TestContext();

    const report = context.testData.createMonitoringReportHeader(undefined, 1, { Acc_MonitoringReportStatus__c: "Awaiting IUK Approval" });

    const dto = await getDto(context, report);

    await expect(context.runCommand(new SaveMonitoringReport(dto, true))).rejects.toThrow(BadRequestError);
  });

  it("should return a validation error when trying to save responses without a periodId", async () => {
    const context = new TestContext();

    const report = context.testData.createMonitoringReportHeader();
    report.Acc_ProjectPeriodNumber__c = null as any;
    const dto = await getDto(context, report);

    const command = new SaveMonitoringReport(dto, false);

    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("should return a validation error if an invalid option is selected", async () => {
    const context = new TestContext();

    const question1Options = context.testData.createMonitoringReportQuestionSet(1, 3);
    const question2Options = context.testData.createMonitoringReportQuestionSet(2, 3);

    const report = context.testData.createMonitoringReportHeader();

    const dto = await getDto(context, report);

    // save 2nd question with option from first question
    dto.questions[0].optionId = question1Options[1].Id;
    dto.questions[0].comments = "Question 1 comments";
    dto.questions[1].optionId = question1Options[1].Id;
    dto.questions[1].comments = "Question 2 comments";

    await expect(context.runCommand(new SaveMonitoringReport(dto, false))).rejects.toThrow(ValidationError);

    // save 2nd question with option from second question
    dto.questions[1].optionId = question2Options[1].Id;

    await expect(context.runCommand(new SaveMonitoringReport(dto, false))).resolves.toBe(true);
  });

  it("should return a validation error if submitted and there are scores missing", async () => {
    const context = new TestContext();

    const question1Options = context.testData.createMonitoringReportQuestionSet(1, 3);
    const question2Options = context.testData.createMonitoringReportQuestionSet(2, 3);

    const report = context.testData.createMonitoringReportHeader();

    const dto = await getDto(context, report);

    dto.questions[0].optionId = question1Options[1].Id;
    dto.questions[0].comments = "Comment 1";

    // save draft
    await expect(context.runCommand(new SaveMonitoringReport(dto, false))).resolves.toBe(true);

    // save submitted expect fail
    await expect(context.runCommand(new SaveMonitoringReport(dto, true))).rejects.toThrow(ValidationError);

    dto.questions[1].optionId = question2Options[1].Id;
    dto.questions[1].comments = "Comment 2";

    // save submitted
    await expect(context.runCommand(new SaveMonitoringReport(dto, true))).resolves.toBe(true);
  });

  it("should return a validation error if submitted and with a comment without a score", async () => {
    const context = new TestContext();

    const question1Options = context.testData.createMonitoringReportQuestionSet(1, 3);
    const question2Options = context.testData.createMonitoringReportQuestionSet(2, 3);

    const report = context.testData.createMonitoringReportHeader();

    const dto = await getDto(context, report);

    dto.questions[0].comments = "Comment 1";
    dto.questions[1].optionId = question2Options[2].Id;
    dto.questions[1].comments = "Comment 2";

    // save draft
    await expect(context.runCommand(new SaveMonitoringReport(dto, true))).rejects.toThrow(ValidationError);

    dto.questions[0].optionId = question1Options[1].Id;

    // save draft
    await expect(context.runCommand(new SaveMonitoringReport(dto, true))).resolves.toBe(true);
  });

  it("should return a bad request if submitted with a different project id", async () => {
    const context = new TestContext();

    const project1 = context.testData.createProject(x => x.Acc_StartDate__c = "2012-01-01");
    const project2 = context.testData.createProject(x => x.Acc_StartDate__c = "2012-01-01");

    const report = context.testData.createMonitoringReportHeader(project1);

    const dto = await getDto(context, report);
    dto.projectId = project2.Id;

    await expect(context.runCommand(new SaveMonitoringReport(dto, false))).rejects.toThrow(BadRequestError);

    dto.projectId = project1.Id;

    await expect(context.runCommand(new SaveMonitoringReport(dto, false))).resolves.toBe(true);
  });
});

function getDto(context: TestContext, report: ISalesforceMonitoringReportHeader): Promise<MonitoringReportDto> {
  const project = context.testData.createProject((x) => {
    x.Id = "Project1";
  });
  const partner = context.testData.createPartner(project);
  context.testData.createProfileDetail(undefined, partner, 1);
  return context.runQuery(new GetMonitoringReportById(report.Acc_Project__c, report.Id));
}

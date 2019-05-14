// tslint:disable: no-duplicate-string no-big-function

import { TestContext } from "../../testContextProvider";
import { MonitoringReportStatus } from "../../../../src/types/constants/monitoringReportStatus";
import { GetMonitoringReportById } from "@server/features/monitoringReports/getMonitoringReport";

describe("GetMonitoringReport", () => {

  it("returns all questions when they have all been answered", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const question1Options = testData.createMonitoringReportQuestionSet(1);
    const question2Options = testData.createMonitoringReportQuestionSet(2);

    const report = testData.createMonitoringReportHeader();

    testData.createMonitoringReportResponse(report, question1Options[0]);
    testData.createMonitoringReportResponse(report, question2Options[0]);

    const query = new GetMonitoringReportById(report.Acc_Project__c, report.Id);

    const result = await context.runQuery(query);
    expect(result.questions).toHaveLength(2);
  });

  it("returns all questions even if they have not all been answered", async () => {
    const context = new TestContext();
    const testData = context.testData;

    testData.createMonitoringReportQuestionSet(1);
    testData.createMonitoringReportQuestionSet(2);

    const report = testData.createMonitoringReportHeader();

    const query = new GetMonitoringReportById(report.Acc_Project__c, report.Id);

    const result = await context.runQuery(query);
    expect(result.questions).toHaveLength(2);
  });

  it("question has the correct options", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const questionOptions = testData.createMonitoringReportQuestionSet(1, 3);

    const report = testData.createMonitoringReportHeader();

    const query = new GetMonitoringReportById(report.Acc_Project__c, report.Id);

    const result = await context.runQuery(query);

    expect(result.questions[0].options[0].id).toBe(questionOptions[2].Id);
    expect(result.questions[0].options[1].id).toBe(questionOptions[1].Id);
    expect(result.questions[0].options[2].id).toBe(questionOptions[0].Id);

    expect(result.questions[0].options[0].questionScore).toBe(questionOptions[2].Acc_QuestionScore__c);
    expect(result.questions[0].options[1].questionScore).toBe(questionOptions[1].Acc_QuestionScore__c);
    expect(result.questions[0].options[2].questionScore).toBe(questionOptions[0].Acc_QuestionScore__c);

    expect(result.questions[0].options[0].questionText).toBe(questionOptions[2].Acc_QuestionText__c);
    expect(result.questions[0].options[1].questionText).toBe(questionOptions[1].Acc_QuestionText__c);
    expect(result.questions[0].options[2].questionText).toBe(questionOptions[0].Acc_QuestionText__c);
  });

  it("the report has the right fields", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const expectedPeriodId = 2;
    const project = testData.createProject();

    const report = testData.createMonitoringReportHeader(project, expectedPeriodId, { Acc_MonitoringReportStatus__c: "Awaiting IUK Approval" });

    const query = new GetMonitoringReportById(report.Acc_Project__c, report.Id);

    const result = await context.runQuery(query);
    expect(result.periodId).toBe(expectedPeriodId);
    expect(result.projectId).toBe(project.Id);
    expect(result.headerId).toBe(report.Id);
    expect(result.status).toBe(MonitoringReportStatus.AwaitingApproval);
  });

  it("the answered questions have the response id and option id set", async () => {
    const context = new TestContext();
    const testData = context.testData;

    testData.createMonitoringReportQuestionSet(1, 3);

    testData.createMonitoringReportQuestionSet(1, 3);
    const question2Options = testData.createMonitoringReportQuestionSet(2, 3);

    const report = testData.createMonitoringReportHeader();

    const question2Answer = testData.createMonitoringReportResponse(report, question2Options[2]);

    const query = new GetMonitoringReportById(report.Acc_Project__c, report.Id);
    const result = await context.runQuery(query);

    expect(result.questions[0].responseId).toBeNull();
    expect(result.questions[0].optionId).toBeNull();
    expect(result.questions[0].comments).toBeNull();

    expect(result.questions[1].responseId).toBe(question2Answer.Id);
    expect(result.questions[1].optionId).toBe(question2Answer.Acc_Question__c);
    expect(result.questions[1].comments).toBe(question2Answer.Acc_QuestionComments__c);
  });

  it("returns an array with the display orders sorted in ascending order", async () => {
    const context = new TestContext();
    const testData = context.testData;

    testData.createMonitoringReportQuestionSet(86);
    testData.createMonitoringReportQuestionSet(3);
    testData.createMonitoringReportQuestionSet(152);
    testData.createMonitoringReportQuestionSet(22);
    testData.createMonitoringReportQuestionSet(94);

    const report = testData.createMonitoringReportHeader();

    const query = new GetMonitoringReportById(report.Acc_Project__c, report.Id);

    const result = await context.runQuery(query);
    expect(result.questions[0].displayOrder).toBe(3);
    expect(result.questions[1].displayOrder).toBe(22);
    expect(result.questions[2].displayOrder).toBe(86);
    expect(result.questions[3].displayOrder).toBe(94);
    expect(result.questions[4].displayOrder).toBe(152);
  });

  it("returns an array with the option scores sorted in descending order", async () => {
    const context = new TestContext();
    const testData = context.testData;

    testData.createMonitoringReportQuestionSet(1, 5);
    const report = testData.createMonitoringReportHeader();

    const query = new GetMonitoringReportById(report.Acc_Project__c, report.Id);

    const result = await context.runQuery(query);

    expect(result.questions[0].options.map(x => x.questionScore)).toEqual([5, 4, 3, 2, 1]);
  });

  it("returns only active questions when the report is in draft", async () => {
    const context = new TestContext();
    const testData = context.testData;

    // 3 questions - question 2 inactive
    const question1 = testData.createMonitoringReportQuestionSet(1, 3);
    testData.createMonitoringReportQuestionSet(2, 3, false);
    const question3 = testData.createMonitoringReportQuestionSet(3, 3);

    const report = testData.createMonitoringReportHeader(undefined, undefined, { Acc_MonitoringReportStatus__c: "Draft" });

    const query = new GetMonitoringReportById(report.Acc_Project__c, report.Id);

    const result = await context.runQuery(query);

    expect(result.questions).toHaveLength(2);
    expect(result.questions.map(x => x.title)).toEqual([question1[0].Acc_QuestionName__c, question3[0].Acc_QuestionName__c]);
  });

  it("returns only answered questions when the report is submitted", async () => {
    const context = new TestContext();
    const testData = context.testData;

    // 3 questions - question 2 inactive
    const question1 = testData.createMonitoringReportQuestionSet(1, 3);
    const question2 = testData.createMonitoringReportQuestionSet(2, 3, false);
    const question3 = testData.createMonitoringReportQuestionSet(3, 3);

    const report = testData.createMonitoringReportHeader(undefined, undefined, { Acc_MonitoringReportStatus__c: "Awaiting IUK Approval" });

    testData.createMonitoringReportResponse(report, question1[1]);
    testData.createMonitoringReportResponse(report, question2[2]);
    testData.createMonitoringReportResponse(report, question3[0]);

    const query = new GetMonitoringReportById(report.Acc_Project__c, report.Id);

    const result = await context.runQuery(query);
    expect(result.questions).toHaveLength(3);
    expect(result.questions.map(x => x.title)).toEqual([question1[0].Acc_QuestionName__c, question2[0].Acc_QuestionName__c, question3[2].Acc_QuestionName__c]);
    expect(result.questions.map(x => x.optionId)).toEqual([question1[1].Id, question2[2].Id, question3[0].Id]);
  });
});

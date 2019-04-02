// tslint:disable: no-duplicate-string no-big-function

import { TestContext } from "../../testContextProvider";
import { GetMonitoringReport } from "../../../../src/server/features/monitoringReports/getMonitoringReport";
import { MonitoringReportStatus } from "../../../../src/types/constants/monitoringReportStatus";

describe("GetMonitoringReport", () => {

  it("returns all questions when they have all been answered", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const question1 = testData.createQuestion(3, 1);
    const question2 = testData.createQuestion(3, 2);
    testData.createMonitoringReportResponse(question1[0]);
    testData.createMonitoringReportResponse(question2[0]);
    testData.createMonitoringReportHeader("a", "b", 1);

    const query = new GetMonitoringReport("b", 1);

    const result = await context.runQuery(query);
    expect(result.questions).toHaveLength(2);
  });

  it("returns all questions even if they have not all been answered", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const question1 = testData.createQuestion(3, 1);
    testData.createQuestion(3, 2);
    testData.createMonitoringReportResponse(question1[0]);
    testData.createMonitoringReportHeader("a", "b", 1);

    const query = new GetMonitoringReport("b", 1);

    const result = await context.runQuery(query);
    expect(result.questions).toHaveLength(2);
  });

  it("question has the correct options", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const question = testData.createQuestion(3, 1);
    testData.createMonitoringReportHeader("a", "b", 1);

    const query = new GetMonitoringReport("b", 1);

    const result = await context.runQuery(query);
    expect(result.questions[0].options[0].id).toBe(question[2].Id);
    expect(result.questions[0].options[1].id).toBe(question[1].Id);
    expect(result.questions[0].options[2].id).toBe(question[0].Id);

    expect(result.questions[0].options[0].questionScore).toBe(question[2].Acc_Score__c);
    expect(result.questions[0].options[1].questionScore).toBe(question[1].Acc_Score__c);
    expect(result.questions[0].options[2].questionScore).toBe(question[0].Acc_Score__c);

    expect(result.questions[0].options[0].questionText).toBe(question[2].Acc_QuestionText__c);
    expect(result.questions[0].options[1].questionText).toBe(question[1].Acc_QuestionText__c);
    expect(result.questions[0].options[2].questionText).toBe(question[0].Acc_QuestionText__c);
  });

  it("the report has the right fields", async () => {
    const context = new TestContext();
    const testData = context.testData;

    testData.createQuestion(3, 1);
    testData.createQuestion(3, 2);
    testData.createMonitoringReportHeader("a", "b", 1);

    const query = new GetMonitoringReport("b", 1);

    const result = await context.runQuery(query);
    expect(result.periodId).toBe(1);
    expect(result.projectId).toBe("b");
    expect(result.headerId).toBe("a");
    expect(result.status).toBe(MonitoringReportStatus.DRAFT);
    expect(result.startDate).toBeDefined();
    expect(result.endDate).toBeDefined();
  });

  it("the answered questions have the response id and option id set", async () => {
    const context = new TestContext();
    const testData = context.testData;

    testData.createQuestion(3, 1);
    const question2 = testData.createQuestion(3, 2);
    testData.createMonitoringReportHeader("a", "b", 1);
    const response = testData.createMonitoringReportResponse(question2[1]);

    const query = new GetMonitoringReport("b", 1);
    const result = await context.runQuery(query);

    expect(result.questions[0].responseId).toBeUndefined();
    expect(result.questions[0].optionId).toBeUndefined();
    expect(result.questions[0].comments).toBeUndefined();

    expect(result.questions[1].responseId).toBe(response.Id);
    expect(result.questions[1].optionId).toBe(response.Acc_Question__c);
    expect(result.questions[1].comments).toBe(response.Acc_QuestionComments__c);
  });

  it("returns an array with the display orders sorted in ascending order", async () => {
    const context = new TestContext();
    const testData = context.testData;

    testData.createQuestion(3, 86);
    testData.createQuestion(3, 3);
    testData.createQuestion(3, 152);
    testData.createQuestion(3, 22);
    testData.createQuestion(3, 94);

    testData.createMonitoringReportHeader("a", "b", 1);

    const query = new GetMonitoringReport("b", 1);

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

    testData.createQuestion(5, 1);
    testData.createMonitoringReportHeader("a", "b", 1);

    const query = new GetMonitoringReport("b", 1);

    const result = await context.runQuery(query);
    const options = result.questions[0].options;

    expect(options[0].questionScore).toBe(5);
    expect(options[1].questionScore).toBe(4);
    expect(options[2].questionScore).toBe(3);
    expect(options[3].questionScore).toBe(2);
    expect(options[4].questionScore).toBe(1);
  });

  it("returns only active questions when the report is in draft", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const question1 = testData.createQuestion(3, 1);
    const question2 = testData.createQuestion(3, 2);
    const question3 = testData.createQuestion(3, 3, false);

    testData.createMonitoringReportResponse(question1[0]);
    testData.createMonitoringReportResponse(question2[0]);
    testData.createMonitoringReportResponse(question3[0]);

    testData.createMonitoringReportHeader("a", "b", 1);

    const query = new GetMonitoringReport("b", 1);

    const result = await context.runQuery(query);
    expect(result.questions).toHaveLength(2);
    expect(result.questions[0].optionId).toBe("QuestionId: 1");
    expect(result.questions[1].optionId).toBe("QuestionId: 4");
  });

  it("returns only answered questions when the report is submitted", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const question1 = testData.createQuestion(3, 1);
    const question2 = testData.createQuestion(3, 2);
    const question3 = testData.createQuestion(3, 3, false);

    testData.createMonitoringReportResponse(question1[0]);
    testData.createMonitoringReportResponse(question2[0]);
    testData.createMonitoringReportResponse(question3[0]);

    testData.createMonitoringReportHeader("a", "b", 1, MonitoringReportStatus.SUBMITTED);

    const query = new GetMonitoringReport("b", 1);

    const result = await context.runQuery(query);
    expect(result.questions).toHaveLength(3);
    expect(result.questions[0].optionId).toBe("QuestionId: 1");
    expect(result.questions[1].optionId).toBe("QuestionId: 4");
    expect(result.questions[2].optionId).toBe("QuestionId: 7");
  });
});

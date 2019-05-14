// tslint:disable: no-duplicate-string no-big-function

import { TestContext } from "../../testContextProvider";
import { GetMonitoringReportAnsweredQuestions } from "@server/features/monitoringReports/getMonitoringReportAnsweredQuestions";

describe("GetMonitoringReportAnsweredQuestions", () => {
  it("returns the questions for the ids passed in", async () => {
    const context = new TestContext();
    const testData = context.testData;

    testData.createMonitoringReportQuestionSet(1, 2);
    testData.createMonitoringReportQuestionSet(2, 2, false);
    testData.createMonitoringReportQuestionSet(3, 2);

    const query = new GetMonitoringReportAnsweredQuestions(["QuestionId: 1", "QuestionId: 5"]);
    const result = await context.runQuery(query);
    expect(result).toHaveLength(2);
    expect(result[0].displayOrder).toBe(1);
    expect(result[1].displayOrder).toBe(3);
  });
});

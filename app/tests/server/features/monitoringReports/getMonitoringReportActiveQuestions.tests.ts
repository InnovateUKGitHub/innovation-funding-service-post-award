// tslint:disable: no-duplicate-string no-big-function

import { TestContext } from "../../testContextProvider";
import { GetMonitoringReportQuestions } from "../../../../src/server/features/monitoringReports/getMonitoringReportQuestions";

describe("GetMonitoringReportActiveQuestions", () => {

  it("returns all the active questions when no questio Ids are passed in", async () => {
    const context = new TestContext();
    const testData = context.testData;

    testData.createQuestion(3, 1);
    testData.createQuestion(3, 2, false);
    testData.createQuestion(3, 3);

    const query = new GetMonitoringReportQuestions();
    const result = await context.runQuery(query);
    expect(result).toHaveLength(2);
    expect(result[0].displayOrder).toBe(1);
    expect(result[1].displayOrder).toBe(3);
  });
});

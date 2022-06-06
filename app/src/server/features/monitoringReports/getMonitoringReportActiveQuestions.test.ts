import { GetMonitoringReportActiveQuestions } from "@server/features/monitoringReports/getMonitoringReportActiveQuestions";
import { TestContext } from "@tests/test-utils/testContextProvider";

describe("GetMonitoringReportActiveQuestions", () => {

  it("returns all the active questions when no questio Ids are passed in", async () => {
    const context = new TestContext();
    const testData = context.testData;

    testData.createMonitoringReportQuestionSet(1, 3);
    testData.createMonitoringReportQuestionSet(2, 3, false);
    testData.createMonitoringReportQuestionSet(3, 3);

    const query = new GetMonitoringReportActiveQuestions();
    const result = await context.runQuery(query);
    expect(result).toHaveLength(2);
    expect(result[0].displayOrder).toBe(1);
    expect(result[1].displayOrder).toBe(3);
  });
});

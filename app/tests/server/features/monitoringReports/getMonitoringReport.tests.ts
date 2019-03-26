import { TestContext } from "../../testContextProvider";
import { GetMonitoringReport} from "../../../../src/server/features/monitoringReports/getMonitoringReport";

describe("GetMonitoringReport", () => {
  it("does a thing", async () => {
    const context = new TestContext();
    const testData = context.testData;
    const questionCount = 3;

    console.log("test", testData.range(questionCount, _ => testData.createQuestion(3)));
    console.log("test", testData.createMonitoringReportHeader("a", "b", 1));
    console.log("test", testData.createMonitoringReportResponse(questionCount));

    const query = new GetMonitoringReport("a", "b", 1);

    const result = await context.runQuery(query);
    console.log("results", result);
  });

});

import { TestContext } from "../../testContextProvider";
import { GetMonitoringReport} from "../../../../src/server/features/monitoringReports/getMonitoringReport";
import * as Repositories from "../../../../src/server/repositories";

describe("GetMonitoringReport", () => {
  it("returns all questions", async () => {
    const context = new TestContext();
    const testData = context.testData;
    const questionCount = 3;

    const questions = testData.range(questionCount, _ => testData.createQuestion(3));
    questions.forEach((x, i) => testData.createMonitoringReportResponseFromQuestions(x, i));
    testData.createMonitoringReportHeader("a", "b", 1);

    const query = new GetMonitoringReport("a", "b", 1);

    const result = await context.runQuery(query);
    expect(result.questions).toHaveLength(questionCount);
  });

  it("returns an array with no empty values when the display order beings at non-1", async () => {
    const context = new TestContext();
    const testData = context.testData;
    const questionCount = 4;

    const questions = testData.range(questionCount, _ => testData.createQuestion(3, 5));
    questions.forEach((x, i) => testData.createMonitoringReportResponseFromQuestions(x, i));
    testData.createMonitoringReportHeader("a", "b", 1);

    const query = new GetMonitoringReport("a", "b", 1);

    const result = await context.runQuery(query);
    expect(result.questions).toHaveLength(questionCount);
  });

  it("returns an array with no empty values when the display order beings at non-1 and is non continuous", async () => {
    const context = new TestContext();
    const testData = context.testData;
    const questionCount = 3;
    const step = 2;
    const questionArray = [];

    let i;
    for (i = 0; i < questionCount*step; i = i + step) {
      const question = testData.createQuestion(3, 5 + i, true);
      questionArray.push(question);
    }
    questionArray.forEach((x, y) => testData.createMonitoringReportResponseFromQuestions(x, y));
    testData.createMonitoringReportHeader("a", "b", 1);

    const query = new GetMonitoringReport("a", "b", 1);

    const result = await context.runQuery(query);
    expect(result.questions).toHaveLength(questionCount);
  });

  it("returns an array with the display orders sorted in ascending order", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const questionArray: Repositories.ISalesforceQuestions[][] = [];
    const question1 = testData.createQuestion(3, 86, true);
    questionArray.push(question1);
    const question2 = testData.createQuestion(3, 3, true);
    questionArray.push(question2);
    const question3 = testData.createQuestion(3, 252, true);
    questionArray.push(question3);
    const question4 = testData.createQuestion(3, 22, true);
    questionArray.push(question4);
    const question5 = testData.createQuestion(3, 94, true);
    questionArray.push(question5);

    questionArray.forEach((x, i) => testData.createMonitoringReportResponseFromQuestions(x, i));
    testData.createMonitoringReportHeader("a", "b", 1);

    const query = new GetMonitoringReport("a", "b", 1);

    const result = await context.runQuery(query);
    console.log("result", result);

    const displayOrders = result.questions.map(x => x.displayOrder);
    const sortNumbers = (a: number, b: number) => a > b ? 1 : -1;
    const displayOrdersSorted = result.questions.map(x => x.displayOrder).sort(sortNumbers);

    expect(displayOrders).toEqual(displayOrdersSorted);
  });

  it("returns an array with the option scores sorted in descending order", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const question = testData.createQuestion(5);
    testData.createMonitoringReportResponseFromQuestions(question);
    testData.createMonitoringReportHeader("a", "b", 1);

    const query = new GetMonitoringReport("a", "b", 1);

    const result = await context.runQuery(query);

    const scores = result.questions[0].options.map(x => x.questionScore);
    const scoresSorted = result.questions[0].options.map(x => x.questionScore).sort().reverse();

    expect(scores).toEqual(scoresSorted);
  });

  it("returns an array with all questions, even if some haven't been answered", async () => {
    const context = new TestContext();
    const testData = context.testData;
    const questionCount = 4;

    const questions = testData.range(questionCount, _ => testData.createQuestion(3));
    questions.forEach((x, i) => testData.createMonitoringReportResponseFromQuestions(x, i));

    testData.createQuestion(3, 7, true);
    testData.createMonitoringReportHeader("a", "b", 1);

    const query = new GetMonitoringReport("a", "b", 1);

    const result = await context.runQuery(query);
    expect(result.questions).toHaveLength(questionCount + 1);
  });
});

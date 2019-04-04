// tslint:disable: no-duplicate-string no-big-function

import { TestContext } from "../../testContextProvider";
import { GetMonitoringReportsForProject } from "../../../../src/server/features/monitoringReports/getMonitoringReportsForProject";
import * as Repositories from "../../../../src/server/repositories";

describe("GetMonitoringReportsForProject", () => {

  it("returns an object of the right shape", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const project = testData.createProject();
    testData.createMonitoringReportHeader("testId", project.Id, 1);

    const query = new GetMonitoringReportsForProject(project.Id);
    const result = await context.runQuery(query);
    expect(result[0].headerId).toBe("testId");
    expect(result[0].status).toBe("Draft");
    expect(result[0].periodId).toBe(1);
    expect(result[0].startDate).toEqual(new Date("2018-02-04"));
    expect(result[0].endDate).toEqual(new Date("2018-03-04"));
  });

  it("returns the correct number of objects", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const project = testData.createProject();
    testData.createMonitoringReportHeader("testId_1", project.Id, 1);
    testData.createMonitoringReportHeader("testId_2", project.Id, 2);

    const query = new GetMonitoringReportsForProject(project.Id);
    const result = await context.runQuery(query);
    expect(result.length).toEqual(2);
  });

  it("should sort by period id", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const project = testData.createProject();
    testData.createMonitoringReportHeader("testId_1", project.Id, 1);
    testData.createMonitoringReportHeader("testId_2", project.Id, 2);
    testData.createMonitoringReportHeader("testId_2", project.Id, 3);

    const query = new GetMonitoringReportsForProject(project.Id);
    const result = await context.runQuery(query);
    expect(result[0].periodId).toEqual(3);
    expect(result[2].periodId).toEqual(1);
  });
});

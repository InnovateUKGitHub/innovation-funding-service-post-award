import { GetProjectChangeRequestStatusChanges } from "@server/features/pcrs/getProjectChangeRequestStatusChanges";
import { TestContext } from "../../testContextProvider";
import { DateTime } from "luxon";

describe("GetProjectChangeRequestStatusChanges", () => {
  it("returns an object of the correct shape", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const project = testData.createProject();
    const projectChangeRequest = testData.createPCR(project);
    const statusChange = testData.createProjectChangeRequestStatusChange(projectChangeRequest, false);

    const query = new GetProjectChangeRequestStatusChanges(project.Id, projectChangeRequest.id);
    const result = await context.runQuery(query);

    expect(result[0].id).toEqual(statusChange.id);
    expect(result[0].previousStatus).toEqual(statusChange.previousStatus);
    expect(result[0].newStatus).toBe(statusChange.newStatus);
    expect(result[0].projectChangeRequest).toBe(projectChangeRequest.id);
    expect(result[0].createdDate).toEqual(statusChange.createdDate);
    expect(result[0].comments).toEqual(null);
    expect(result[0].participantVisibility).toEqual(statusChange.participantVisibility);
  });

  it("returns the correct number of status changes", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const project = testData.createProject();
    const projectChangeRequest = testData.createPCR(project);
    testData.createProjectChangeRequestStatusChange(projectChangeRequest, true);
    testData.createProjectChangeRequestStatusChange(projectChangeRequest, true);

    const query = new GetProjectChangeRequestStatusChanges(project.Id, projectChangeRequest.id);
    const result = await context.runQuery(query);

    expect(result.length).toEqual(2);
  });

  it("returns the status changes sorted chronologically", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const project = testData.createProject();
    const projectChangeRequest = testData.createPCR(project);
    const statusChangeNew = testData.createProjectChangeRequestStatusChange(projectChangeRequest, true);
    const statusChangeOld = testData.createProjectChangeRequestStatusChange(projectChangeRequest, true);

    statusChangeOld.createdDate = DateTime.local().minus({ days: 100 }).toJSDate();

    const query = new GetProjectChangeRequestStatusChanges(project.Id, projectChangeRequest.id);
    const result = await context.runQuery(query);

    const resultIds = result.map(x => x.id);

    expect(resultIds).toEqual([statusChangeNew.id, statusChangeOld.id]);
  });
});

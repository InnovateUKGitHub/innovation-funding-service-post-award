import {TestContext} from "../../testContextProvider";
import { GetAllQuery } from "../../../../src/server/features/projects";

describe("ProjectsGetAllQuery", () => {
  it("when exists, returns three projects", async () => {
    const context = new TestContext();

    const expectedProjects = [
      { id: "Id1", name: "Name1" },
      { id: "Id2", name: "Name2" },
      { id: "Id3", name: "Name3" }
    ];

    expectedProjects.forEach((expectedProject) => {
      context.testData.createProject(x => {
        x.Id = expectedProject.id,
        x.Acc_ProjectTitle__c = expectedProject.name;
      });
    });

    const result = await context.runQuery(new GetAllQuery());

    expect(result.length).toBe(3);
  });

  it("when exists, returns project DTOs", async () => {
    const context = new TestContext();

    const expectedProjects = [
      { id: "Id1", name: "Name1" },
    ];

    expectedProjects.forEach((expectedProject) => {
      context.testData.createProject(x => {
        x.Id = expectedProject.id,
        x.Acc_ProjectTitle__c = expectedProject.name;
      });
    });

    const result = await context.runQuery(new GetAllQuery());

    result.forEach((project, idx) => {
      expect(project.id).toBe(expectedProjects[idx].id);
      expect(project.title).toBe(expectedProjects[idx].name);
    });
  });
});
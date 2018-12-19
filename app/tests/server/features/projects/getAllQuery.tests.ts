import {TestContext} from "../../testContextProvider";
import { GetAllQuery } from "../../../../src/server/features/projects";

describe("ProjectsGetAllQuery", () => {
  it("when valid returns all projects", async () => {
    const context = new TestContext();

    context.testData.range(3, () => context.testData.createProject());

    const result = await context.runQuery(new GetAllQuery());

    expect(result.length).toBe(3);
  });

  it("when valid returns project DTOs", async () => {
    const context = new TestContext();

    context.testData.createProject(x => {
      x.Id = "Expected Id";
      x.Acc_ProjectTitle__c = "Expected Name";
    });

    const result = (await context.runQuery(new GetAllQuery()))[0];

    expect(result.id).toBe("Expected Id");
    expect(result.title).toBe("Expected Name");
  });
});

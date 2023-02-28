import { GetAllQuery } from "@server/features/projects";
import { ProjectRole } from "@framework/types";
import { TestContext } from "@tests/test-utils/testContextProvider";

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
      x.Id = "Expected_Id" as ProjectId;
      x.Acc_ProjectTitle__c = "Expected Name";
    });

    const result = (await context.runQuery(new GetAllQuery()))[0];

    expect(result.id).toBe("Expected_Id");
    expect(result.title).toBe("Expected Name");
  });

  it("when logged in returns correct roles for each project", async () => {
    const context = new TestContext();

    const email = "test@test.com";
    context.user.set({ email });

    const projects = context.testData.range(5, () => context.testData.createProject());

    const expectedRoles = [
      ProjectRole.Unknown,
      ProjectRole.FinancialContact,
      ProjectRole.MonitoringOfficer,
      ProjectRole.ProjectManager,
      ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager,
    ];

    context.testData.createCurrentUserAsFinanceContact(projects[1]);

    context.testData.createCurrentUserAsMonitoringOfficer(projects[2]);

    context.testData.createCurrentUserAsProjectManager(projects[3]);

    context.testData.createCurrentUserAsFinanceContact(projects[4]);

    context.testData.createCurrentUserAsMonitoringOfficer(projects[4]);

    context.testData.createCurrentUserAsProjectManager(projects[4]);

    const projects2 = await context.runQuery(new GetAllQuery());
    expect(projects2.length).toBe(5);

    const results = (await context.runQuery(new GetAllQuery())).map(x => x.roles);

    expect(results).toEqual(expectedRoles);
  });
});

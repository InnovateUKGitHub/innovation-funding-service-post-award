// tslint:disable:no-bitwise
import { TestContext } from "../../testContextProvider";
import { GetAllQuery } from "../../../../src/server/features/projects";
import { ProjectRole } from "../../../../src/types";

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

  it("when logged in returns correct roles for each project", async () => {
    const context = new TestContext();

    const email = "test@test.com";
    context.user.set({ email });

    const projects = context.testData.range(5, x => context.testData.createProject());

    const expectedRoles = [
      ProjectRole.Unknown,
      ProjectRole.FinancialContact,
      ProjectRole.MonitoringOfficer,
      ProjectRole.ProjectManager,
      ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer | ProjectRole.ProjectManager,
    ];

    context.testData.createFinanceContact(projects[1], undefined, x => x.Acc_ContactId__r.Email = email);

    context.testData.createMonitoringOfficer(projects[2], x => x.Acc_ContactId__r.Email = email);

    context.testData.createProjectManager(projects[3], x => x.Acc_ContactId__r.Email = email);

    context.testData.createFinanceContact(projects[4], undefined, x => x.Acc_ContactId__r.Email = email);

    context.testData.createMonitoringOfficer(projects[4], x => x.Acc_ContactId__r.Email = email);

    context.testData.createProjectManager(projects[4], x => x.Acc_ContactId__r.Email = email);

    const projects2 = await context.runQuery(new GetAllQuery());
    expect(projects2.length).toBe(5);

    const results = (await context.runQuery(new GetAllQuery())).map(x => x.roles);

    expect(results).toEqual(expectedRoles);
  });
});

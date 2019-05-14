// tslint:disable:no-bitwise
import { TestContext } from "../../testContextProvider";
import { GetByIdQuery } from "@server/features/projects/getDetailsByIdQuery";
import { ProjectRole } from "@framework/types";

describe("ProjectsGetDetailsByIdQuery", () => {
    it("when exists expect item", async () => {
        const context = new TestContext();

        const expectedId = "Expected Id";
        const expectedName = "Expected Name";

        const project = context.testData.createProject(x => {
            x.Id = expectedId,
            x.Acc_ProjectTitle__c = expectedName;
        });

        const result = (await context.runQuery(new GetByIdQuery(project.Id)));

        expect(result.id).toBe(expectedId);
        expect(result.title).toBe(expectedName);
    });

    it("when mutiple returns expected item", async () => {
        const context = new TestContext();
        const project2 = context.testData.createProject();
        const result = (await context.runQuery(new GetByIdQuery(project2.Id)));

        expect(result.id).toBe(project2.Id);
        expect(result.title).toBe(project2.Acc_ProjectTitle__c);
    });

    it("when not exists expect exception", async () => {
        const context = new TestContext();

        // create a project to check we are filtering
        context.testData.createProject();

        await expect(context.runQuery(new GetByIdQuery("NOTFOUND"))).rejects.toThrow();
    });

    it("when user is finance contact expect role returns correctly", async () => {
        const context = new TestContext();
        const email = "fc@test.com";

        const project = context.testData.createProject();
        context.testData.createFinanceContact(project, undefined, x => x.Acc_ContactId__r.Email = email);

        // login as fc
        context.user.set({ email });

        const result = await context.runQuery(new GetByIdQuery(project.Id));
        expect(result.roles).toBe(ProjectRole.FinancialContact);
    });

    it("when user is monitoring officer expect role returns correctly", async () => {
        const context = new TestContext();
        const email = "mo@test.com";

        const project = context.testData.createProject();
        context.testData.createMonitoringOfficer(project, x => x.Acc_ContactId__r.Email = email);

        // login as fc
        context.user.set({ email });

        const result = await context.runQuery(new GetByIdQuery(project.Id));
        expect(result.roles).toBe(ProjectRole.MonitoringOfficer);
    });

    it("when user is project manager expect role returns correctly", async () => {
        const context = new TestContext();
        const email = "mo@test.com";

        context.user.set({ email });

        const project = context.testData.createProject();
        context.testData.createCurrentUserAsProjectManager(project);

        const result = await context.runQuery(new GetByIdQuery(project.Id));
        expect(result.roles).toBe(ProjectRole.ProjectManager);
    });

    it("when user is all roles expect role returns correctly", async () => {
        const context = new TestContext();
        const email = "all@test.com";

        context.user.set({ email });

        const project = context.testData.createProject();
        context.testData.createCurrentUserAsProjectManager(project);
        context.testData.createCurrentUserAsMonitoringOfficer(project);
        context.testData.createCurrentUserAsFinanceContact(project);

        const result = await context.runQuery(new GetByIdQuery(project.Id));
        expect(result.roles).toBe(ProjectRole.ProjectManager | ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer);
    });
});

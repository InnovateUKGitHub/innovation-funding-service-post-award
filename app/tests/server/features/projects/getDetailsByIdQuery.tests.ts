// tslint:disable:no-bitwise
import { TestContext } from "../../testContextProvider";
import { GetByIdQuery } from "../../../../src/server/features/projects/getDetailsByIdQuery";
import { ProjectRole } from "../../../../src/types";
import { SalesforceRole } from "../../../../src/server/repositories/projectContactsRepository";

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
        context.testData.createProjectContact(project, undefined, x => {
            x.Acc_ContactId__r.Email = email;
            x.Acc_Role__c = "Finance contact";
        });

        // login as fc
        context.user.set({ email });

        const result = await context.runQuery(new GetByIdQuery(project.Id));
        expect(result.roles).toBe(ProjectRole.FinancialContact);
    });

    it("when user is monitoring officer expect role returns correctly", async () => {
        const context = new TestContext();
        const email = "mo@test.com";

        const project = context.testData.createProject();
        context.testData.createProjectContact(project, undefined, x => {
            x.Acc_ContactId__r.Email = email;
            x.Acc_Role__c = "Monitoring officer";
        });

        // login as fc
        context.user.set({ email });

        const result = await context.runQuery(new GetByIdQuery(project.Id));
        expect(result.roles).toBe(ProjectRole.MonitoringOfficer);
    });

    it("when user is project manager expect role returns correctly", async () => {
        const context = new TestContext();
        const email = "mo@test.com";

        const project = context.testData.createProject();
        context.testData.createProjectContact(project, undefined, x => {
            x.Acc_ContactId__r.Email = email;
            x.Acc_Role__c = "Project Manager";
        });

        // login as fc
        context.user.set({ email });

        const result = await context.runQuery(new GetByIdQuery(project.Id));
        expect(result.roles).toBe(ProjectRole.ProjectManager);
    });

    it("when user is all roles expect role returns correctly", async () => {
        const context = new TestContext();
        const email = "all@test.com";

        const project = context.testData.createProject();
        const roles: SalesforceRole[] = ["Project Manager", "Monitoring officer", "Finance contact"];
        roles.forEach(role => {
            context.testData.createProjectContact(project, undefined, x => {
                x.Acc_ContactId__r.Email = email;
                x.Acc_Role__c = role;
            });
        });

        context.user.set({ email });

        const result = await context.runQuery(new GetByIdQuery(project.Id));
        expect(result.roles).toBe(ProjectRole.ProjectManager | ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer);
    });
});

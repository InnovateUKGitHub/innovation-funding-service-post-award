import {TestContext} from "../../testContextProvider";
import { GetByIdQuery } from "../../../../src/server/features/projects/getDetailsByIdQuery";

describe("ProjectsGetDetailsByIdQuery", () => {
    it("when exists expect item", async () => {
        const context = new TestContext();

        const expectedId = "Expected Id";
        const expectedName = "Expected Name";

        const project = context.testData.createProject(x => {
            x.Id = expectedId,
            x.Acc_ProjectTitle__c = expectedName;
        });

        const result = (await context.runQuery(new GetByIdQuery(project.Id)))!;

        expect(result.id).toBe(expectedId);
        expect(result.title).toBe(expectedName);
    });

    it("when mutiple returns expected item", async () => {
        const context = new TestContext();
        const project2 = context.testData.createProject();
        const result = (await context.runQuery(new GetByIdQuery(project2.Id)))!;

        expect(result.id).toBe(project2.Id);
        expect(result.title).toBe(project2.Acc_ProjectTitle__c);
    });

    it("when not exists expect exception", async () => {
        const context = new TestContext();

        // create a project to check we are filtering
        context.testData.createProject();

        await expect(context.runQuery(new GetByIdQuery("NOTFOUND"))).rejects.toThrow();
    });
});

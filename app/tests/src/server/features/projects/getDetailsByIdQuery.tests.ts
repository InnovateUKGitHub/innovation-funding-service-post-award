import {TestContext} from "../../testContextProvider";
import { GetByIdQuery } from "../../../../../src/server/features/projects/getDetailsByIdQuery";

describe("GetDetailsByIdQuery", () => {
    it("when exists expect item", async () => {
        let context = new TestContext();

        let expectedId = "Expected Id";
        let expectedName = "Expected Name";

        let project = context.testData.createProject(x => {
            x.Id = expectedId,
            x.Name = expectedName
        });

        let result = await context.runQuery(new GetByIdQuery(project.Id));

        expect(result.id).toBe(expectedId);
        expect(result.name).toBe(expectedName);
    });

    it("when mutiple returns expected item", async () => {
        let context = new TestContext();

        let project1 = context.testData.createProject();
        let project2 = context.testData.createProject();

        let result = await context.runQuery(new GetByIdQuery(project2.Id));

        expect(result.id).toBe(project2.Id);
        expect(result.name).toBe(project2.Name);
    });

    it("when not exists expect exception", async () => {
        let context = new TestContext();

        //create a project to check we are filtering
        context.testData.createProject();

        await expect(context.runQuery(new GetByIdQuery("NOTFOUND"))).rejects.toThrow();
    });
});

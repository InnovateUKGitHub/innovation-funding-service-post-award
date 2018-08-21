import { TestContext } from "../../testContextProvider";
import { MapToProjectDtoCommand } from "../../../../src/server/features/projects/mapToProjectDto";
import { ISalesforceProject } from "../../../../src/server/repositories/projectsRepository";
import { ProjectDto } from "../../../../src/models/projectDto";

describe("MapToProjectDtoCommand", () => {
    it("when valid expect mapping", async () => {
        let context = new TestContext();

        let expected: ProjectDto = {
            id: "Expected Id",
            competition: "Expected Competition",
            title: "Expected title",
            startDate: new Date("2008/12/12"),
            endDate: new Date("2010/12/12"),
            summary: "Expected summary"
        };

        let salesforce = context.testData.createProject(x => {
            x.Id = expected.id;
            x.Competetion__c = expected.competition;
            x.ProjectSummary__c = expected.summary;
            x.ProjectTitle__c = expected.title;
            x.StartDate__c = expected.startDate;
            x.EndDate__c = expected.endDate;
        });

        let result = await context.runCommand(new MapToProjectDtoCommand(salesforce));

        expect(result).toMatchObject(expected);
    });

});

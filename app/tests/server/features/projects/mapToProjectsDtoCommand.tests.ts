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
            x.Acc_CompetitionId__c = expected.competition;
            x.Acc_ProjectSummary__c = expected.summary;
            x.Acc_ProjectTitle__c = expected.title;
            x.Acc_StartDate__c = expected.startDate.toLocaleDateString();
            x.Acc_EndDate__c = expected.endDate.toLocaleDateString();
        });

        let result = await context.runCommand(new MapToProjectDtoCommand(salesforce));

        expect(result).toMatchObject(expected);
    });

});

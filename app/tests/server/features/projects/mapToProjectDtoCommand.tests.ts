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
            summary: "Expected summary",
            projectNumber: "Expected project number"
        };

        let salesforce = context.testData.createProject(x => {
            x.Id = expected.id;
            x.Acc_CompetitionId__c = expected.competition;
            x.Acc_ProjectSummary__c = expected.summary;
            x.Acc_ProjectTitle__c = expected.title;
            x.Acc_StartDate__c = expected.startDate.toLocaleDateString();
            x.Acc_EndDate__c = expected.endDate.toLocaleDateString();
            x.Acc_ProjectNumber__c = expected.projectNumber
        });

        let result = await context.runCommand(new MapToProjectDtoCommand(salesforce));

        expect(result).toMatchObject(expected);
    });

    it("when ifs application url configured expect full url", async () => {
        let context = new TestContext();
        context.config.ifsApplicationUrl = "https://ifs.application.url/application/competition/<<Acc_CompetitionId__c>>/project/<<Acc_IFSApplicationId__c>>";

        let salesforce = context.testData.createProject(x => {
            x.Acc_ProjectSource__c = "IFS";
            x.Acc_IFSApplicationId__c = 1;
            x.Acc_CompetitionId__c = "c1";
        });

        let result = await context.runCommand(new MapToProjectDtoCommand(salesforce));

        expect(result.applicationUrl).toBe("https://ifs.application.url/application/competition/c1/project/1")
    });

    it("when ifs grant letter url configured expect full url", async () => {
        let context = new TestContext();
        context.config.ifsGrantLetterUrl = "https://ifs.application.url/grantletter/competition/<<Acc_CompetitionId__c>>/project/<<Acc_IFSApplicationId__c>>";

        let salesforce = context.testData.createProject(x => {
            x.Acc_ProjectSource__c = "IFS";
            x.Acc_IFSApplicationId__c = 1;
            x.Acc_CompetitionId__c = "c1";
        });

        let result = await context.runCommand(new MapToProjectDtoCommand(salesforce));

        expect(result.grantOfferLetterUrl).toBe("https://ifs.application.url/grantletter/competition/c1/project/1")
    });
});

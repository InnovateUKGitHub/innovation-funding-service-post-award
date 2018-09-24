import "jest";
import { TestContext } from "../../testContextProvider";
import { MapToProjectDtoCommand } from "../../../../src/server/features/projects/mapToProjectDto";
import { ClaimFrequency, ProjectDto } from "../../../../src/ui/models";
import { DateTime } from "luxon";

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
            projectNumber: "Expected project number",
            claimFrequency: ClaimFrequency.Quarterly,
            period: 4          
        };

        let salesforce = context.testData.createProject(x => {
            x.Id = expected.id;
            x.Acc_CompetitionId__c = expected.competition;
            x.Acc_ProjectSummary__c = expected.summary;
            x.Acc_ProjectTitle__c = expected.title;
            x.Acc_StartDate__c = DateTime.fromJSDate(expected.startDate).toFormat("yyyy-MM-dd");
            x.Acc_EndDate__c = DateTime.fromJSDate(expected.endDate).toFormat("yyyy-MM-dd");
            x.Acc_ProjectNumber__c = expected.projectNumber;
            x.Acc_ClaimFrequency__c = "Quarterly";
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

    it("ClaimFrequency should map correct - Quarterly", async () => {
      const context    = new TestContext();
      const salesforce = context.testData.createProject(x => { x.Acc_ClaimFrequency__c = "Quarterly"; });
      const result     = await context.runCommand(new MapToProjectDtoCommand(salesforce));
      expect(result.claimFrequency).toBe(ClaimFrequency.Quarterly);
    });

    it("ClaimFrequency should map correct - Monthly", async () => {
      const context    = new TestContext();
      const salesforce = context.testData.createProject(x => { x.Acc_ClaimFrequency__c = "Monthly"; });
      const result     = await context.runCommand(new MapToProjectDtoCommand(salesforce));
      expect(result.claimFrequency).toBe(ClaimFrequency.Monthly);
    });

    it("ClaimFrequency should map correct - Unknown", async () => {
      const context    = new TestContext();
      const salesforce = context.testData.createProject(x => { x.Acc_ClaimFrequency__c = "asd"; });
      const result     = await context.runCommand(new MapToProjectDtoCommand(salesforce));
      expect(result.claimFrequency).toBe(ClaimFrequency.Unknown);
    });

    it("Period should calculate correct - Quarterly", async () => {
      const context    = new TestContext();
      const salesforce = context.testData.createProject(x => {
        x.Acc_ClaimFrequency__c = "Quarterly";
        x.Acc_StartDate__c = "2018-01-01";
      });

      for(let i=1; i<=12; i++) {
        const month = i < 10 ? `0${i}` : i;
        context.clock.setDate(`2018/${month}/01`);
        const result = await context.runCommand(new MapToProjectDtoCommand(salesforce));
        const expected = Math.ceil(i / 3);
        console.log("testing quertly", context.clock.today(), result.period, expected);
        expect(result.period).toBe(expected);
      }
    });

    it("Period should calculate correct - Monthly", async () => {
      const context    = new TestContext();
      const salesforce = context.testData.createProject(x => {
        x.Acc_ClaimFrequency__c = "Monthly";
        x.Acc_StartDate__c = "2018-01-01";
      });

      for(let i=1; i<=12; i++) {
        const month = i < 10 ? `0${i}` : i;
        context.clock.setDate(`2018/${month}/01`);
        const result = await context.runCommand(new MapToProjectDtoCommand(salesforce));
        const expected = Math.ceil(i);
        expect(result.period).toBe(expected);
      }
    });

    it("Period should default when Unknown", async () => {
      const context    = new TestContext();
      const salesforce = context.testData.createProject(x => {
        x.Acc_ClaimFrequency__c = "Monthly";
        x.Acc_StartDate__c = "2018-01-01";
      });

      for(let i=1; i<=12; i++) {
        const month = i < 10 ? `0${i}` : i;
        context.clock.setDate(`2018/${month}/01`);
        const result = await context.runCommand(new MapToProjectDtoCommand(salesforce));
        const expected = Math.ceil(i);
        expect(result.period).toBe(expected);
      }
    });
});

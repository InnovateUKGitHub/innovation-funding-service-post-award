// tslint:disable:no-identical-functions no-duplicate-string
import "jest";
import { DateTime } from "luxon";
import { TestContext } from "../../testContextProvider";
import { MapToProjectDtoCommand } from "../../../../src/server/features/projects/mapToProjectDto";
import { ClaimFrequency, ProjectDto, ProjectRole } from "../../../../src/types";

describe("MapToProjectDtoCommand", () => {
    it("when valid expect mapping", async () => {
        const context = new TestContext();

        context.clock.setDate("2008/12/31");

        const expected: ProjectDto = {
            id: "Expected Id",
            title: "Expected title",
            startDate: new Date("2008/01/01"),
            endDate: new Date("2010/12/31"),
            summary: "Expected summary",
            projectNumber: "Expected project number",
            claimFrequency: ClaimFrequency.Quarterly,
            claimFrequencyName: ClaimFrequency[ClaimFrequency.Quarterly],
            periodId: 4,
            totalPeriods: 12,
            grantOfferLetterCosts: 2000,
            costsClaimedToDate: 1000,
            claimedPercentage: 50,
            periodStartDate: new Date("2008/10/01"),
            periodEndDate: new Date("2008/12/31"),
            roles: ProjectRole.Unknown,
            roleTitles: []
          };

        const salesforce = context.testData.createProject(x => {
            x.Id = expected.id;
            x.Acc_ProjectSummary__c = expected.summary;
            x.Acc_ProjectTitle__c = expected.title;
            x.Acc_StartDate__c = DateTime.fromJSDate(expected.startDate).toFormat("yyyy-MM-dd");
            x.Acc_EndDate__c = DateTime.fromJSDate(expected.endDate).toFormat("yyyy-MM-dd");
            x.Acc_ProjectNumber__c = expected.projectNumber;
            x.Acc_ClaimFrequency__c = "Quarterly";
            x.Acc_GOLTotalCostAwarded__c = expected.grantOfferLetterCosts;
            x.Acc_TotalProjectCosts__c = expected.costsClaimedToDate;
          });

        const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));

        expect(result).toMatchObject(expected);
    });

    it("when ifs application url configured expect full url", async () => {
        const context = new TestContext();
        context.config.ifsApplicationUrl = "https://ifs.application.url/application/competition/<<Acc_ProjectNumber__c>>/project/<<Acc_IFSApplicationId__c>>";

        const salesforce = context.testData.createProject(x => {
            x.Acc_ProjectSource__c = "IFS";
            x.Acc_IFSApplicationId__c = 1;
            x.Acc_ProjectNumber__c = "30000";
        });

        const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));

        expect(result.applicationUrl).toBe("https://ifs.application.url/application/competition/30000/project/1");
    });

    it("when ifs grant letter url configured expect full url", async () => {
        const context = new TestContext();
        context.config.ifsGrantLetterUrl = "https://ifs.application.url/grantletter/competition/<<Acc_ProjectNumber__c>>/project/<<Acc_IFSApplicationId__c>>";

        const salesforce = context.testData.createProject(x => {
            x.Acc_ProjectSource__c = "IFS";
            x.Acc_IFSApplicationId__c = 1;
            x.Acc_ProjectNumber__c = "30000";
        });

        const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));

        expect(result.grantOfferLetterUrl).toBe("https://ifs.application.url/grantletter/competition/30000/project/1");
    });

    it("ClaimFrequency should map correct - Quarterly", async () => {
      const context    = new TestContext();
      const salesforce = context.testData.createProject(x => { x.Acc_ClaimFrequency__c = "Quarterly"; });
      const result     = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));
      expect(result.claimFrequency).toBe(ClaimFrequency.Quarterly);
    });

    it("ClaimFrequency should map correct - Monthly", async () => {
      const context    = new TestContext();
      const salesforce = context.testData.createProject(x => { x.Acc_ClaimFrequency__c = "Monthly"; });
      const result     = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));
      expect(result.claimFrequency).toBe(ClaimFrequency.Monthly);
    });

    it("ClaimFrequency should map correct - Unknown", async () => {
      const context    = new TestContext();
      const salesforce = context.testData.createProject(x => { x.Acc_ClaimFrequency__c = "asd"; });
      const result     = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));
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
        const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));
        const expected = Math.ceil(i / 3);
        expect(result.periodId).toBe(expected);
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
        const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));
        expect(result.periodId).toBe(i);
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
        const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));
        expect(result.periodId).toBe(i);
      }
    });

    it("Gol Costs should be returned", async () => {
    const context = new TestContext();

    const salesforce = context.testData.createProject(x => {
      x.Acc_GOLTotalCostAwarded__c = 100000;
    });

    const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));

    expect(result.grantOfferLetterCosts).toBe(100000);

  });

    it("Claimed Costs should be returned", async () => {
    const context = new TestContext();

    const salesforce = context.testData.createProject(x => {
      x.Acc_TotalProjectCosts__c = 500000;
    });

    const result = await context.runCommand(new MapToProjectDtoCommand(salesforce, ProjectRole.Unknown));

    expect(result.costsClaimedToDate).toBe(500000);

  });
});

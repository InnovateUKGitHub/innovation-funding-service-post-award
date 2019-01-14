// tslint:disable:no-identical-functions no-duplicate-string
import { TestContext } from "../../testContextProvider";
import { GetByIdQuery } from "../../../../src/server/features/partners/getByIdQuery";
import { PartnerDto, ProjectRole } from "../../../../src/types";

describe("getAllForProjectQuery", () => {
    it("when partner exists is mapped to DTO", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project, x => {
            x.Acc_AccountId__r.Name = "Expected name";
            x.Acc_TotalParticipantGrant__c = 125000;
            x.Acc_TotalParticipantCosts__c = 17474;
            x.Acc_Award_Rate__c = 50;
            x.Acc_Cap_Limit__c = 50;
            x.Acc_TotalFutureForecastsforParticipant__c = 1002;
        });

        const result = await context.runQuery(new GetByIdQuery(partner.Id));

        expect(result).not.toBe(null);

        const expected: PartnerDto = {
            id: "Partner1",
            name: "Expected name",
            accountId: "AccountId1",
            type: "Accedemic",
            isLead: true,
            projectId: "Project1",
            totalParticipantGrant: 125000,
            totalParticipantCostsClaimed: 17474,
            percentageParticipantCostsClaimed: 13.9792,
            awardRate: 50,
            capLimit: 50,
            totalFutureForecastsForParticipants: 1002,
            roles: ProjectRole.Unknown,
            forecastLastModifiedDate: null,
        };

        expect(result).toEqual(expected);
    });

    it("calculated cost claimed percentage", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project, x => {
            x.Acc_AccountId__r.Name = "Expected name";
            x.Acc_TotalParticipantGrant__c = 10000;
            x.Acc_TotalParticipantCosts__c = 1000;
            x.Acc_Award_Rate__c = 50;
            x.Acc_Cap_Limit__c = 50;
        });

        const result = (await context.runQuery(new GetByIdQuery(partner.Id)));

        expect(result.percentageParticipantCostsClaimed).toBe(10);
    });

    it("calculated cost claimed percentage is 0 when totalParticipantGrant is null", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project, x => {
            x.Acc_AccountId__r.Name = "Expected name";
            x.Acc_TotalParticipantGrant__c = null!;
            x.Acc_TotalParticipantCosts__c = 1000;
            x.Acc_Award_Rate__c = 50;
            x.Acc_Cap_Limit__c = 50;
        });

        const result = (await context.runQuery(new GetByIdQuery(partner.Id)));

        expect(result.percentageParticipantCostsClaimed).toBe(null);
    });

    it("calculated cost claimed percentage is 0 when totalParticipantGrant is null", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project, x => {
            x.Acc_AccountId__r.Name = "Expected name";
            x.Acc_TotalParticipantGrant__c = 10000;
            x.Acc_TotalParticipantCosts__c = null as any;
            x.Acc_Award_Rate__c = 50;
            x.Acc_Cap_Limit__c = 50;
        });

        const result = (await context.runQuery(new GetByIdQuery(partner.Id)));
        expect(result.percentageParticipantCostsClaimed).toBe(null);
    });

    it("when partner doesn't exist", async () => {
        const context = new TestContext();
        await expect(context.runQuery(new GetByIdQuery("fakePartnerId"))).rejects.toThrow();
    });

    it("when user is finance contact expect role set", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project);

        const projectContact1 = context.testData.createFinanceContact(project, partner, x => x.Acc_ContactId__r.Email = "financecontact@test.com");
        const projectContact2 = context.testData.createProjectManager(project, x => x.Acc_ContactId__r.Email = "projectManager@test.com");

        // now set user to the finance contact
        context.user.set({ email: projectContact1.Acc_ContactId__r.Email });

        const result1 = await context.runQuery(new GetByIdQuery(partner.Id));
        expect(result1.roles).toBe(ProjectRole.FinancialContact);

        // now set user to the project manager
        context.user.set({ email: projectContact2.Acc_ContactId__r.Email });

        const result2 = await context.runQuery(new GetByIdQuery(partner.Id));
        expect(result2.roles).toBe(ProjectRole.Unknown);
    });
});

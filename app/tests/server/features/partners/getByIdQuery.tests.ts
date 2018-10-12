import { TestContext } from "../../testContextProvider";
import { GetByIdQuery } from '../../../../src/server/features/partners/getByIdQuery';
import { range } from "../../../../src/shared/range";

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
        });

        const result = await context.runQuery(new GetByIdQuery(partner.Id));

        expect(result).not.toBe(null);

        expect(result).toEqual({
            id: 'Partner1',
            name: 'Expected name',
            accountId: 'AccountId1',
            type: 'Accedemic',
            isLead: true,
            projectId: 'Project1',
            totalParticipantGrant: 125000,
            totalParticipantCostsClaimed: 17474,
            totalParticipantCostsPaid: 50000,
            percentageParticipantCostsClaimed: 14,
            awardRate: 50,
            capLimit: 50
        });
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

        const result = await context.runQuery(new GetByIdQuery(partner.Id));

        expect(result.percentageParticipantCostsClaimed).toBe(10);
    });

    it("calculated cost claimed percentage is 0 when totalParticipantGrant is null", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project, x => {
            x.Acc_AccountId__r.Name = "Expected name";
            x.Acc_TotalParticipantGrant__c = null;
            x.Acc_TotalParticipantCosts__c = 1000;
            x.Acc_Award_Rate__c = 50;
            x.Acc_Cap_Limit__c = 50;
        });

        const result = await context.runQuery(new GetByIdQuery(partner.Id));

        expect(result.percentageParticipantCostsClaimed).toBe(null);
    });

    it("calculated cost claimed percentage is 0 when totalParticipantGrant is null", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project, x => {
            x.Acc_AccountId__r.Name = "Expected name";
            x.Acc_TotalParticipantGrant__c = 10000;
            x.Acc_TotalParticipantCosts__c = null;
            x.Acc_Award_Rate__c = 50;
            x.Acc_Cap_Limit__c = 50;
        });

        const result = await context.runQuery(new GetByIdQuery(partner.Id));
        expect(result.percentageParticipantCostsClaimed).toBe(null);
    });

    it("when partner doesn't exist", async () => {
        const context = new TestContext();
        await expect(context.runQuery(new GetByIdQuery("fakePartnerId"))).rejects.toThrow();
    });
});

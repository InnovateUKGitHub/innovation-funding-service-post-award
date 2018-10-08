import { TestContext } from "../../testContextProvider";
import { GetClaimDetailsSummaryForPartnerQuery } from "../../../../src/server/features/claims/claimDetails/getClaimDetailsSummaryForPartnerQuery";

describe("claimDetails/GetAllForPartnerQuery", () => {
    it("when valid then returns all cost categories", async () => {
        const context = new TestContext();

        const partner = context.testData.createPartner();
        context.testData.range(5, _ => context.testData.createCostCategory(x => x.Acc_OrganisationType__c = "Industrial"));

        const query = new GetClaimDetailsSummaryForPartnerQuery(partner.Id, 1);

        const result = await context.runQuery(query);

        expect(result.length).toBe(5);
    });

    it("should return correct remaining offer costs for a cost category", async () => {
        const context = new TestContext();

        const expectedCost = 25000;

        const costCategory = context.testData.createCostCategory(x => x.Acc_OrganisationType__c = "Industrial");
        const partner = context.testData.createPartner();
        const periodId = 1;

        context.testData.createClaimDetail(costCategory, partner, periodId, x => x.Acc_PeriodCostCategoryTotal__c = expectedCost);

        const query = new GetClaimDetailsSummaryForPartnerQuery(partner.Id, periodId);

        const result = await context.runQuery(query);

        expect(result.length).toBe(1);
        expect(result[0].costCategoryId).toBe(costCategory.Id);
        expect(result[0].costsClaimedThisPeriod).toBe(expectedCost);
    });

    it("should correctly filter cost categories", async () => {
        const context = new TestContext();

        const expectedCost1 = 25000;
        const expectedCost2 = 35000;

        const costCategory1 = context.testData.createCostCategory(x => x.Acc_OrganisationType__c = "Industrial");
        const costCategory2 = context.testData.createCostCategory(x => x.Acc_OrganisationType__c = "Industrial");

        const partner = context.testData.createPartner();
        const periodId = 1;

        context.testData.createClaimDetail(costCategory1, partner, periodId, x => x.Acc_PeriodCostCategoryTotal__c = expectedCost1);
        context.testData.createClaimDetail(costCategory2, partner, periodId, x => x.Acc_PeriodCostCategoryTotal__c = expectedCost2);

        const query = new GetClaimDetailsSummaryForPartnerQuery(partner.Id, periodId);

        const result = await context.runQuery(query);

        console.log("result", result);

        expect(result.length).toBe(2);

        expect(result[0].costCategoryId).toBe(costCategory1.Id);
        expect(result[0].costsClaimedThisPeriod).toBe(expectedCost1);

        expect(result[1].costCategoryId).toBe(costCategory2.Id);
        expect(result[1].costsClaimedThisPeriod).toBe(expectedCost2);
    });
});

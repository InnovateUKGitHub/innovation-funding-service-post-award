import "jest";
import { TestContext } from "../../testContextProvider";
import { GetAllLineItemsForClaimByCategoryQuery } from "../../../../src/server/features/claimLineItems";

describe("GetAllLineItemsForClaimByCategoryQuery", () => {
    it("returns objects of correct shape", async () => {
        const context = new TestContext();
        const partner = context.testData.createPartner();

        const testData = context.testData;
        const period = 1;
        const costCat = testData.createCostCategory();

        testData.createClaimLineItem({
            persist: true,
            costCategory: costCat,
            partner,
            periodId: period
        });

        testData.createClaim(partner, period);
        testData.createProfileTotalPeriod(partner, period);

        const query = new GetAllLineItemsForClaimByCategoryQuery(partner.Id, costCat.Id, period);
        const result = await context.runQuery(query);
        const item   = result[0];

        expect(result.length).toBe(1);
        expect(item.partnerId).toBe(partner.Id);
        expect(item.periodId).toBe(period);
    });

    it("returns an array of objects", async () => {
        const context = new TestContext();
        const partner = context.testData.createPartner();

        const testData = context.testData;
        const period = 1;
        const costCat = testData.createCostCategory();

        testData.createClaimLineItem({
            persist: true,
            costCategory: costCat,
            partner,
            periodId: period
        });

        testData.createClaimLineItem({
            persist: true,
            costCategory: costCat,
            partner,
            periodId: period
        });

        testData.createClaim(partner, period);
        testData.createProfileTotalPeriod(partner, period);

        const query = new GetAllLineItemsForClaimByCategoryQuery(partner.Id, costCat.Id, period);
        const result = await context.runQuery(query);

        expect(result.length).toBe(2);
        expect(result[0].costCategory).toEqual(result[1].costCategory);
        expect(result[0].period).toEqual(result[1].period);
    });

    it("returns empty array if none found", async () => {
        const context = new TestContext();
        const partner = context.testData.createPartner();

        const testData = context.testData;
        const period = 1;
        const costCat = testData.createCostCategory();

        const query = new GetAllLineItemsForClaimByCategoryQuery(partner.Id, costCat.Id, period);
        const result = await context.runQuery(query);

        expect(result).toEqual([]);
    });
});

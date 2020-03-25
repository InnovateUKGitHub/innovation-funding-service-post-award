import "jest";
import { TestContext } from "../../testContextProvider";
import { GetAllForPartnerQuery } from "../../../../src/server/features/claims";

describe("GetAllForPartnerQuery", () => {
    it("returns objects of correct shape", async () => {
        const context = new TestContext();
        const partner = context.testData.createPartner();

        const testData = context.testData;
        const period = 1;

        testData.createClaim(partner, period);
        testData.createProfileTotalPeriod(partner, period);

        const query = new GetAllForPartnerQuery(partner.id);
        const result = await context.runQuery(query);
        const item = result[0];

        expect(item.periodId).toBe(1);
    });

    it("returns array with 2 results", async () => {
        const context = new TestContext();
        const partner = context.testData.createPartner();

        const testData = context.testData;
        const period1 = 1;
        const period2 = 2;

        testData.createClaim(partner, period1);
        testData.createProfileTotalPeriod(partner, period1);

        testData.createClaim(partner, period2);
        testData.createProfileTotalPeriod(partner, period2);

        const query = new GetAllForPartnerQuery(partner.id);
        const result = await context.runQuery(query);

        expect(result.length).toBe(2);
    });
});

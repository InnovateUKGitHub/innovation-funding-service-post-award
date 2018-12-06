import "jest";
import { TestContext } from "../../testContextProvider";
import { GetClaim } from "../../../../src/server/features/claims";

describe("GetClaim", () => {
    it("returns objects of correct shape", async () => {
        const context = new TestContext();
        const partner = context.testData.createPartner();

        const testData = context.testData;
        const period1 = 1;
        const period2 = 2;

        testData.createClaim(partner, period1);
        testData.createClaim(partner, period2);

        testData.createProfileTotalPeriod(partner, period1);

        const query = new GetClaim(partner.Id, period1);
        const result = await context.runQuery(query);

        expect(result.periodId).toBe(1);
        expect(result.partnerId).toBe(partner.Id);
    });
});

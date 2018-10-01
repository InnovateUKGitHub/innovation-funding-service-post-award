import { TestContext } from "../../testContextProvider";
import { GetAllCostsForClaimQuery } from "../../../../src/server/features/claims";

describe('getAllCostsForClaim', () => {
    it('when valid then returns all costs', async () => {
        let context = new TestContext();
        let testData = context.testData;

        let claimId = "Claim1";

        testData.range(5, _ => testData.createClaimCosts(claimId))

        let query = new GetAllCostsForClaimQuery(claimId);

        let result = await context.runQuery(query);

        expect(result.length).toBe(5)
    })

});



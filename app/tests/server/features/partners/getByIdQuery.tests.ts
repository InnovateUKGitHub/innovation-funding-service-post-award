import { TestContext } from "../../testContextProvider";
import { GetByIdQuery } from '../../../../src/server/features/partners/getByIdQuery';
import { range } from "../../../../src/shared/range";

describe("getAllForProjectQuery", () => {
    it("when partner exists is mapped to DTO", async () => {
        const context = new TestContext();

        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project);

        const result = await context.runQuery(new GetByIdQuery(partner.Id));

        expect(result).not.toBe(null);

        expect(result).toEqual({
            id: 'Partner1',
            name: 'Participant Name 1',
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

    it("when partner doesn't exist", async () => {
        const context = new TestContext();
        await expect(context.runQuery(new GetByIdQuery("fakePartnerId"))).rejects.toThrow();
    });
});

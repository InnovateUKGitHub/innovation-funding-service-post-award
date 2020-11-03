
import { TestContext } from "../../testContextProvider";
import { GetFinancialVirementQuery } from "../../../../src/server/features/financialVirements/getFinancialVirementQuery";
import { UpdateFinancialVirementCommand } from "../../../../src/server/features/financialVirements/updateFinancialVirementCommand";
import { ValidationError } from "@server/features/common";
import { PartnerFinancialVirement } from "@framework/entities";

describe("UpdateFinancialVirementCommand", () => {
  it("calculates the partner newEligibleCosts and newRemainingGrant if they are undefined", async () => {
    const testContext = new TestContext();
    const { testData } = testContext;

    const pcrItem = testData.createPCRItem();
    const partner = testData.createPartner();
    const costCategory1 = testData.createCostCategory();
    const costCategory2 = testData.createCostCategory();

    const partnerVirement = testData.createFinancialVirement(pcrItem, partner, {
      newRemainingGrant: undefined,
      newEligibleCosts: undefined,
      newFundingLevel: 53,
      originalFundingLevel: 100,
    });

    partnerVirement.virements.push({
      id: "cat1",
      costCategoryId: costCategory1.id,
      newEligibleCosts: 50,
      originalCostsClaimedToDate: 51,
      originalEligibleCosts: 52,
      profileId: "profileId",
    });

    partnerVirement.virements.push({
      id: "cat2",
      costCategoryId: costCategory2.id,
      newEligibleCosts: 60,
      originalCostsClaimedToDate: 51,
      originalEligibleCosts: 52,
      profileId: "profileId",
    });

    const dto = await testContext.runQuery(new GetFinancialVirementQuery(partner.projectId, pcrItem.pcrId, pcrItem.id));

    expect(dto).not.toBeNull();
    expect(dto.partners.length).toBe(1);

    const newEligibleCosts = 50 + 60;
    const costsClaimedToDate = dto.partners[0].virements.reduce((total, item) => total + item.costsClaimedToDate, 0);
    const newRemainingCosts = newEligibleCosts - costsClaimedToDate;
    const newRemainingGrant = newRemainingCosts * dto.partners[0].newFundingLevel / 100;

    expect(dto.partners[0].newEligibleCosts).toBe(newEligibleCosts);
    expect(dto.partners[0].newRemainingGrant).toBe(newRemainingGrant);
  });

  it("returns the partner newEligibleCosts without calculating if it is not undefined", async () => {
    const testContext = new TestContext();
    const { testData } = testContext;

    const pcrItem = testData.createPCRItem();
    const partner = testData.createPartner();
    const costCategory1 = testData.createCostCategory();
    const costCategory2 = testData.createCostCategory();

    const partnerVirement = testData.createFinancialVirement(pcrItem, partner, {
      newRemainingGrant: 1,
      newEligibleCosts: 2,
      newFundingLevel: 53,
      originalFundingLevel: 100,
    });

    partnerVirement.virements.push({
      id: "cat1",
      costCategoryId: costCategory1.id,
      newEligibleCosts: 50,
      originalCostsClaimedToDate: 51,
      originalEligibleCosts: 52,
      profileId: "profileId",
    });

    partnerVirement.virements.push({
      id: "cat2",
      costCategoryId: costCategory2.id,
      newEligibleCosts: 60,
      originalCostsClaimedToDate: 51,
      originalEligibleCosts: 52,
      profileId: "profileId",
    });

    const dto = await testContext.runQuery(new GetFinancialVirementQuery(partner.projectId, pcrItem.pcrId, pcrItem.id));

    expect(dto).not.toBeNull();
    expect(dto.partners.length).toBe(1);
    expect(dto.partners[0].newEligibleCosts).toBe(2);
    expect(dto.partners[0].newRemainingGrant).toBe(1);
  });
});

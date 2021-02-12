import { TestContext } from "../../testContextProvider";
import { GetFinancialVirementQuery } from "@server/features/financialVirements/getFinancialVirementQuery";

describe("GetFinancialVirementQuery", () => {
  const setup = () => {
    const testContext = new TestContext();
    const { testData } = testContext;

    const pcrItem = testData.createPCRItem();
    const partner = testData.createPartner();

    return {
      pcrItem,
      partner,
      testContext,
      testData,
    };
  };

  it("calculates the partner newEligibleCosts and newRemainingGrant if they are undefined", async () => {
    const { testContext, testData, pcrItem, partner } = setup();

    const costCategory1 = testData.createCostCategory();
    const costCategory2 = testData.createCostCategory();

    const stubVirement1 = {
      id: "cat1",
      costCategoryId: costCategory1.id,
      newEligibleCosts: 50,
      originalCostsClaimedToDate: 51,
      originalEligibleCosts: 52,
      profileId: "profileId",
    };
    const stubVirement2 = {
      id: "cat2",
      costCategoryId: costCategory2.id,
      newEligibleCosts: 60,
      originalCostsClaimedToDate: 51,
      originalEligibleCosts: 52,
      profileId: "profileId",
    };

    const stubPayload = {
      newRemainingGrant: undefined,
      newEligibleCosts: undefined,
      newFundingLevel: 53,
      originalFundingLevel: 100,
      virements: [stubVirement1, stubVirement2],
    };

    testData.createFinancialVirement(pcrItem, partner, stubPayload);

    const dto = await testContext.runQuery(new GetFinancialVirementQuery(partner.projectId, pcrItem.pcrId, pcrItem.id));

    expect(dto).not.toBeNull();
    expect(dto.partners.length).toBe(1);

    const [dtoPartner] = dto.partners;

    const newEligibleCosts = 50 + 60;
    const costsClaimedToDate = dtoPartner.virements.reduce((total, item) => total + item.costsClaimedToDate, 0);
    const newRemainingCosts = newEligibleCosts - costsClaimedToDate;
    const newRemainingGrant = (newRemainingCosts * dtoPartner.newFundingLevel) / 100;

    expect(dtoPartner.newEligibleCosts).toBe(newEligibleCosts);
    expect(dtoPartner.newRemainingGrant).toBe(newRemainingGrant);
  });

  it("returns the partner newEligibleCosts without calculating if it is not undefined", async () => {
    const { testContext, testData, pcrItem, partner } = setup();

    const costCategory1 = testData.createCostCategory();
    const costCategory2 = testData.createCostCategory();

    const stubVirement1 = {
      id: "cat1",
      costCategoryId: costCategory1.id,
      newEligibleCosts: 50,
      originalCostsClaimedToDate: 51,
      originalEligibleCosts: 52,
      profileId: "profileId",
    };

    const stubVirement2 = {
      id: "cat2",
      costCategoryId: costCategory2.id,
      newEligibleCosts: 60,
      originalCostsClaimedToDate: 51,
      originalEligibleCosts: 52,
      profileId: "profileId",
    };

    const stubPayload = {
      newRemainingGrant: 1,
      newEligibleCosts: 2,
      newFundingLevel: 53,
      originalFundingLevel: 100,
      virements: [stubVirement1, stubVirement2],
    };

    testData.createFinancialVirement(pcrItem, partner, stubPayload);

    const dto = await testContext.runQuery(new GetFinancialVirementQuery(partner.projectId, pcrItem.pcrId, pcrItem.id));

    expect(dto).not.toBeNull();
    expect(dto.partners.length).toBe(1);

    const [dtoPartner] = dto.partners;

    expect(dtoPartner.newEligibleCosts).toBe(2);
    expect(dtoPartner.newRemainingGrant).toBe(1);
  });

  describe("returns edge cases", () => {
    it("returns a rounded currency value for originalRemainingGrant", async () => {
      const { testContext, testData, pcrItem, partner } = setup();
      const costCategory = testData.createCostCategory();

      // Note: This variables are specific as they cause multiple decimals in javascript
      const stubEligibleCostsValue = 167378;
      const stubOriginalCostsClaimedToDate = 0;
      const stubFundingLevel = 70;

      const stubVirement = {
        id: "cat1",
        costCategoryId: costCategory.id,
        newEligibleCosts: 50,
        originalCostsClaimedToDate: stubOriginalCostsClaimedToDate,
        originalEligibleCosts: stubEligibleCostsValue,
        profileId: "profileId",
      };

      const stubPayload = {
        originalFundingLevel: stubFundingLevel,
        virements: [stubVirement],
      };

      testData.createFinancialVirement(pcrItem, partner, stubPayload);

      const dto = await testContext.runQuery(
        new GetFinancialVirementQuery(partner.projectId, pcrItem.pcrId, pcrItem.id),
      );

      expect(dto).not.toBeNull();
      expect(dto.partners.length).toBe(1);

      const [dtoPartner] = dto.partners;

      expect(dtoPartner.originalRemainingGrant).toBe(117164.6);

      // Note: if this is returned then rounding has done been implemented properly
      expect(dtoPartner.originalRemainingGrant).not.toBe(117164.59999999999);
    });
  });
});

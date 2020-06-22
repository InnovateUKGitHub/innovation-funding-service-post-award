import "jest";
import { TestContext } from "../../testContextProvider";
import { GetFinancialVirementQuery } from "../../../../src/server/features/financialVirements/getFinancialVirementQuery";
import { UpdateFinancialVirementCommand } from "../../../../src/server/features/financialVirements/updateFinancialVirementCommand";
import { ValidationError } from "@server/features/common";

describe("UpdateFinancialVirementCommand", () => {
  it("handles no changes", async () => {
    const testContext = new TestContext();
    const { testData } = testContext;

    const pcrItem = testData.createPCRItem();
    const partner = testData.createPartner();

    testData.createFinancialVirement(pcrItem, partner);
    const dto = await testContext.runQuery(new GetFinancialVirementQuery(partner.projectId, pcrItem.pcrId, pcrItem.id));

    expect(dto).not.toBeNull();
    expect(dto.partners.length).toBe(1);

    const result = await testContext.runCommand(new UpdateFinancialVirementCommand(partner.projectId, pcrItem.pcrId, pcrItem.id, dto, true));

    expect(result).toBe(true);
  });

  it("updated a cost category newEligibleCosts value", async () => {
    const testContext = new TestContext();
    const { testData, repositories: { financialVirements} } = testContext;

    const pcrItem = testData.createPCRItem();
    const partner = testData.createPartner();

    const costCategory = testData.createCostCategory();

    const partner1 = testData.createFinancialVirement(pcrItem, partner);

    partner1.virements.push({
      id: "cc1",
      costCategoryId: costCategory.id,
      newEligibleCosts: 10,
      originalEligibleCosts: 10,
      originalCostsClaimedToDate: 0,
      profileId: "profileId"
    });

    const dto = await testContext.runQuery(new GetFinancialVirementQuery(partner.projectId, pcrItem.pcrId, pcrItem.id));

    dto.partners[0].virements[0].newEligibleCosts = 100;

    expect(dto).not.toBeNull();

    const result = await testContext.runCommand(new UpdateFinancialVirementCommand(partner.projectId, pcrItem.pcrId, pcrItem.id, dto, true));

    expect(result).toBe(true);

    expect(financialVirements.Items[0].virements[0].newEligibleCosts).toBe(100);
  });

  it("updated the partner newEligibleCosts and newRemainingGrant value", async () => {
    const testContext = new TestContext();
    const { testData, repositories: { financialVirements} } = testContext;

    const pcrItem = testData.createPCRItem();
    const partner = testData.createPartner();

    const costCategory1 = testData.createCostCategory();
    const costCategory2 = testData.createCostCategory();

    const partner1 = testData.createFinancialVirement(pcrItem, partner);

    partner1.virements.push({
      id: "cc1",
      costCategoryId: costCategory1.id,
      newEligibleCosts: 10,
      originalEligibleCosts: 10,
      originalCostsClaimedToDate: 0,
      profileId: "profileId"
    });

    partner1.virements.push({
      id: "cc2",
      costCategoryId: costCategory2.id,
      newEligibleCosts: 100,
      originalEligibleCosts: 120,
      originalCostsClaimedToDate: 0,
      profileId: "profileId"
    });

    const dto = await testContext.runQuery(new GetFinancialVirementQuery(partner.projectId, pcrItem.pcrId, pcrItem.id));

    dto.partners[0].virements.find(x => x.costCategoryId === costCategory1.id)!.newEligibleCosts = 160;

    const result = await testContext.runCommand(new UpdateFinancialVirementCommand(partner.projectId, pcrItem.pcrId, pcrItem.id, dto, true));

    expect(result).toBe(true);

    const newEligibleCosts = 160 + 100;
    const costsClaimedToDate = dto.partners[0].virements.reduce((total, item) => total + item.costsClaimedToDate, 0);
    const newRemainingCosts = newEligibleCosts - costsClaimedToDate;
    const newRemainingGrant = newRemainingCosts * dto.partners[0].newFundingLevel / 100;
    expect(financialVirements.Items[0].newEligibleCosts).toBe(newEligibleCosts);
    expect(financialVirements.Items[0].newRemainingGrant).toBe(newRemainingGrant);
  });

  it("updates the partner newRemainingGrant value when the funding level is changed", async () => {
    const testContext = new TestContext();
    const { testData, repositories: { financialVirements} } = testContext;

    const pcrItem = testData.createPCRItem();
    const partner = testData.createPartner();

    const costCategory1 = testData.createCostCategory();
    const costCategory2 = testData.createCostCategory();

    const partner1 = testData.createFinancialVirement(pcrItem, partner, {
      newFundingLevel: 50
    });

    partner1.virements.push({
      id: "cc1",
      costCategoryId: costCategory1.id,
      newEligibleCosts: 10,
      originalEligibleCosts: 10,
      originalCostsClaimedToDate: 0,
      profileId: "profileId"
    });

    partner1.virements.push({
      id: "cc2",
      costCategoryId: costCategory2.id,
      newEligibleCosts: 100,
      originalEligibleCosts: 120,
      originalCostsClaimedToDate: 0,
      profileId: "profileId"
    });

    const dto = await testContext.runQuery(new GetFinancialVirementQuery(partner.projectId, pcrItem.pcrId, pcrItem.id));

    dto.partners[0].virements.find(x => x.costCategoryId === costCategory1.id)!.newEligibleCosts = 160;
    dto.partners[0].newFundingLevel = 60;
    const result = await testContext.runCommand(new UpdateFinancialVirementCommand(partner.projectId, pcrItem.pcrId, pcrItem.id, dto, true));

    expect(result).toBe(true);

    const newEligibleCosts = 160 + 100;
    const costsClaimedToDate = dto.partners[0].virements.reduce((total, item) => total + item.costsClaimedToDate, 0);
    const newRemainingCosts = newEligibleCosts - costsClaimedToDate;
    const newRemainingGrant = newRemainingCosts * 60 / 100;
    expect(financialVirements.Items[0].newEligibleCosts).toBe(newEligibleCosts);
    expect(financialVirements.Items[0].newRemainingGrant).toBe(newRemainingGrant);
  });

  it("updated a cost category newEligibleCosts value cannot be less than costs claimed", async () => {
    const testContext = new TestContext();
    const { testData } = testContext;

    const pcrItem = testData.createPCRItem();
    const partner = testData.createPartner();

    const costCategory = testData.createCostCategory();

    const partner1 = testData.createFinancialVirement(pcrItem, partner);

    partner1.virements.push({
      id: "cc1",
      costCategoryId: costCategory.id,
      newEligibleCosts: 0,
      originalEligibleCosts: 10,
      originalCostsClaimedToDate: 10,
      profileId: "profileId"
    });

    const dto = await testContext.runQuery(new GetFinancialVirementQuery(partner.projectId, pcrItem.pcrId, pcrItem.id));

    dto.partners[0].virements[0].newEligibleCosts = 100;
    dto.partners[0].virements[0].costsClaimedToDate = 101;

    await expect(testContext.runCommand(new UpdateFinancialVirementCommand(partner.projectId, pcrItem.pcrId, pcrItem.id, dto, true))).rejects.toThrow(ValidationError);
  });

});

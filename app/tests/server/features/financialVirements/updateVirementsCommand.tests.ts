import "jest";
import { TestContext } from "../../testContextProvider";
import { GetFinancialVirementQuery } from "../../../../src/server/features/financialVirements/getFinancialVirementQuery";
import { UpdateFinancialVirementCommand } from "../../../../src/server/features/financialVirements/updateFinancialVirementCommand";
import { PartnerFinancialVirement } from "@framework/entities";
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

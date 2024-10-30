import { GetFinancialVirementQuery } from "@server/features/financialVirements/getFinancialVirementQuery";
import { UpdateFinancialVirementCommand } from "@server/features/financialVirements/updateFinancialVirementCommand";
import { InActiveProjectError, ValidationError } from "@shared/appError";
import { TestContext } from "@tests/test-utils/testContextProvider";

describe("UpdateFinancialVirementCommand", () => {
  it("throws an error when inactive project", async () => {
    const testContext = new TestContext();

    const project = testContext.testData.createProject(x => (x.Acc_ProjectStatus__c = "On Hold"));
    const partner = testContext.testData.createPartner(project);
    const pcrItem = testContext.testData.createPCRItem();

    const dto = await testContext.runQuery(new GetFinancialVirementQuery(partner.projectId, pcrItem.id));

    testContext.testData.createFinancialVirement(pcrItem, partner);
    const command = new UpdateFinancialVirementCommand(partner.projectId, pcrItem.pcrId, pcrItem.id, dto, true);

    await expect(testContext.runCommand(command)).rejects.toThrow(InActiveProjectError);
  });

  it("handles no changes", async () => {
    const testContext = new TestContext();
    const { testData } = testContext;

    const project = testData.createProject();
    const pcr = testData.createPCR(project);
    const pcrItem = testData.createPCRItem(pcr);
    const partner = testData.createPartner(project);

    testData.createFinancialVirement(pcrItem, partner);
    const dto = await testContext.runQuery(new GetFinancialVirementQuery(partner.projectId, pcrItem.id));

    expect(dto).not.toBeNull();
    expect(dto.partners.length).toBe(1);

    const result = await testContext.runCommand(
      new UpdateFinancialVirementCommand(partner.projectId, pcrItem.pcrId, pcrItem.id, dto, true),
    );

    expect(result).toBe(true);
  });

  it("updated a cost category newEligibleCosts value", async () => {
    const testContext = new TestContext();
    const {
      testData,
      repositories: { financialVirements },
    } = testContext;

    const project = testData.createProject();
    const pcr = testData.createPCR(project);
    const pcrItem = testData.createPCRItem(pcr);
    const partner = testData.createPartner(project);

    const costCategory = testData.createCostCategory();

    const partner1 = testData.createFinancialVirement(pcrItem, partner);

    partner1.virements.push({
      id: "cc1" as FinancialVirementForCostsId,
      costCategoryId: costCategory.id,
      newEligibleCosts: 10,
      originalEligibleCosts: 10,
      originalCostsClaimedToDate: 0,
      profileId: "profileId",
      parentId: "parentId" as FinancialVirementForParticipantId,
    });

    const dto = await testContext.runQuery(new GetFinancialVirementQuery(partner.projectId, pcrItem.id));

    dto.partners[0].virements[0].newEligibleCosts = 100;

    expect(dto).not.toBeNull();

    const result = await testContext.runCommand(
      new UpdateFinancialVirementCommand(partner.projectId, pcrItem.pcrId, pcrItem.id, dto, true),
    );

    expect(result).toBe(true);

    expect(financialVirements.Items[0].virements[0].newEligibleCosts).toBe(100);
  });

  it("updated the partner newEligibleCosts and newRemainingGrant value", async () => {
    const testContext = new TestContext();
    const {
      testData,
      repositories: { financialVirements },
    } = testContext;

    const project = testData.createProject();
    const pcr = testData.createPCR(project);
    const pcrItem = testData.createPCRItem(pcr);
    const partner = testData.createPartner(project);

    const costCategory1 = testData.createCostCategory();
    const costCategory2 = testData.createCostCategory();

    const partner1 = testData.createFinancialVirement(pcrItem, partner);

    partner1.virements.push({
      id: "cc1" as FinancialVirementForCostsId,
      costCategoryId: costCategory1.id,
      newEligibleCosts: 10,
      originalEligibleCosts: 10,
      originalCostsClaimedToDate: 0,
      profileId: "profileId",
      parentId: "parentId" as FinancialVirementForParticipantId,
    });

    partner1.virements.push({
      id: "cc2" as FinancialVirementForCostsId,
      costCategoryId: costCategory2.id,
      newEligibleCosts: 100,
      originalEligibleCosts: 120,
      originalCostsClaimedToDate: 0,
      profileId: "profileId",
      parentId: "parentId" as FinancialVirementForParticipantId,
    });

    const dto = await testContext.runQuery(new GetFinancialVirementQuery(partner.projectId, pcrItem.id));

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    dto.partners[0].virements.find(x => x.costCategoryId === costCategory1.id)!.newEligibleCosts = 160;

    const result = await testContext.runCommand(
      new UpdateFinancialVirementCommand(partner.projectId, pcrItem.pcrId, pcrItem.id, dto, true),
    );

    expect(result).toBe(true);

    const newEligibleCosts = 160 + 100;
    const costsClaimedToDate = dto.partners[0].virements.reduce((total, item) => total + item.costsClaimedToDate, 0);
    const newRemainingCosts = newEligibleCosts - costsClaimedToDate;
    const newRemainingGrant = (newRemainingCosts * dto.partners[0].newFundingLevel) / 100;
    expect(financialVirements.Items[0].newEligibleCosts).toBe(newEligibleCosts);
    expect(financialVirements.Items[0].newRemainingGrant).toBe(newRemainingGrant);
  });

  it("updates the partner newRemainingGrant value when the funding level is changed", async () => {
    const testContext = new TestContext();
    const {
      testData,
      repositories: { financialVirements },
    } = testContext;

    const project = testData.createProject();
    const pcr = testData.createPCR(project);
    const pcrItem = testData.createPCRItem(pcr);
    const partner = testData.createPartner(project);

    const costCategory1 = testData.createCostCategory();
    const costCategory2 = testData.createCostCategory();

    const partner1 = testData.createFinancialVirement(pcrItem, partner, {
      newFundingLevel: 50,
    });

    partner1.virements.push({
      id: "cc1" as FinancialVirementForCostsId,
      costCategoryId: costCategory1.id,
      newEligibleCosts: 10,
      originalEligibleCosts: 10,
      originalCostsClaimedToDate: 0,
      profileId: "profileId",
      parentId: "parentId" as FinancialVirementForParticipantId,
    });

    partner1.virements.push({
      id: "cc2" as FinancialVirementForCostsId,
      costCategoryId: costCategory2.id,
      newEligibleCosts: 100,
      originalEligibleCosts: 120,
      originalCostsClaimedToDate: 0,
      profileId: "profileId",
      parentId: "parentId" as FinancialVirementForParticipantId,
    });

    const dto = await testContext.runQuery(new GetFinancialVirementQuery(partner.projectId, pcrItem.id));

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    dto.partners[0].virements.find(x => x.costCategoryId === costCategory1.id)!.newEligibleCosts = 160;
    dto.partners[0].newFundingLevel = 60;
    const result = await testContext.runCommand(
      new UpdateFinancialVirementCommand(partner.projectId, pcrItem.pcrId, pcrItem.id, dto, true),
    );

    expect(result).toBe(true);

    const newEligibleCosts = 160 + 100;
    const costsClaimedToDate = dto.partners[0].virements.reduce((total, item) => total + item.costsClaimedToDate, 0);
    const newRemainingCosts = newEligibleCosts - costsClaimedToDate;
    const newRemainingGrant = (newRemainingCosts * 60) / 100;
    expect(financialVirements.Items[0].newEligibleCosts).toBe(newEligibleCosts);
    expect(financialVirements.Items[0].newRemainingGrant).toBe(newRemainingGrant);
  });

  it("updated a cost category newEligibleCosts value cannot be less than costs claimed", async () => {
    const testContext = new TestContext();
    const { testData } = testContext;

    const project = testData.createProject();
    const pcr = testData.createPCR(project);
    const pcrItem = testData.createPCRItem(pcr);
    const partner = testData.createPartner(project);

    const costCategory = testData.createCostCategory();

    const partner1 = testData.createFinancialVirement(pcrItem, partner);

    partner1.virements.push({
      id: "cc1" as FinancialVirementForCostsId,
      costCategoryId: costCategory.id,
      newEligibleCosts: 0,
      originalEligibleCosts: 10,
      originalCostsClaimedToDate: 10,
      profileId: "profileId",
      parentId: "parentId" as FinancialVirementForParticipantId,
    });

    const dto = await testContext.runQuery(new GetFinancialVirementQuery(partner.projectId, pcrItem.id));

    dto.partners[0].virements[0].newEligibleCosts = 100;
    dto.partners[0].virements[0].costsClaimedToDate = 101;

    await expect(
      testContext.runCommand(
        new UpdateFinancialVirementCommand(partner.projectId, pcrItem.pcrId, pcrItem.id, dto, true),
      ),
    ).rejects.toThrow(ValidationError);
  });
});

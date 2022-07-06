import { CostCategoryType, PCRItemStatus, PCRPartnerType, PCRProjectRole } from "@framework/constants";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import { PCRSpendProfileAcademicCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { UpdatePCRSpendProfileCommand } from "@server/features/pcrs/updatePcrSpendProfileCommand";
import { InActiveProjectError, ValidationError } from "@server/features/common";
import { setup as commonSetup } from "@tests/test-utils/pcr-spend-profile-helpers";

describe("UpdatePCRSpendProfileCommand", () => {
  const setup = async () => {
    const { context, projectChangeRequest, recordType, project } = commonSetup();
    const pcrItem = context.testData.createPCRItem(projectChangeRequest, recordType, {
      status: PCRItemStatus.Incomplete,
      projectRole: PCRProjectRole.Collaborator,
      isCommercialWork: true,
      partnerType: PCRPartnerType.Research,
    });
    const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(pcrItem.id));
    return { context, project, pcrItem, spendProfileDto };
  };

  test("should throw error when project is inactive", async () => {
    const { context, project } = commonSetup("On Hold");
    const pcrItem = context.testData.createPCRItem();
    await context.runQuery(new GetPcrSpendProfilesQuery(pcrItem.id));

    const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(pcrItem.id));
    const command = new UpdatePCRSpendProfileCommand(project.Id, pcrItem.id, spendProfileDto);

    await expect(context.runCommand(command)).rejects.toThrow(InActiveProjectError);
  });

  describe("Academic costs", () => {
    it("should save a academic cost", async () => {
      const { context, project, pcrItem, spendProfileDto } = await setup();
      const directlyIncurredCostCategory = context.testData.createCostCategory({
        name: "Directly incurred - staff",
        type: CostCategoryType.Academic,
      });
      const cost: PCRSpendProfileAcademicCostDto = {
        id: "",
        value: 100,
        costCategoryId: directlyIncurredCostCategory.id,
        costCategory: CostCategoryType.Academic,
        description: directlyIncurredCostCategory.description,
      };
      spendProfileDto.costs = [cost];

      const command = new UpdatePCRSpendProfileCommand(project.Id, pcrItem.id, spendProfileDto);
      await context.runCommand(command);

      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      expect(insertedSpendProfileCost).toBeDefined();
      expect(insertedSpendProfileCost.id).toBeTruthy();
      expect(insertedSpendProfileCost.value).toBe(cost.value);
      expect(insertedSpendProfileCost.costCategoryId).toBe(cost.costCategoryId);
      expect(insertedSpendProfileCost.description).toBe(cost.description);
    });
    it("should save multiple academic costs with different categories", async () => {
      const { context, project, pcrItem, spendProfileDto } = await setup();
      const directlyIncurredCostCategory = context.testData.createCostCategory({
        name: "Directly incurred - staff",
        type: CostCategoryType.Academic,
      });
      const exceptionsEquipmentCostCategory = context.testData.createCostCategory({
        name: "Exceptions - equipment",
        type: CostCategoryType.Academic,
      });
      const directlyIncurredCost: PCRSpendProfileAcademicCostDto = {
        id: "",
        value: 100,
        costCategoryId: directlyIncurredCostCategory.id,
        costCategory: CostCategoryType.Academic,
        description: directlyIncurredCostCategory.description,
      };
      const exceptionsEquipmentCost: PCRSpendProfileAcademicCostDto = {
        id: "",
        value: 200,
        costCategoryId: exceptionsEquipmentCostCategory.id,
        costCategory: CostCategoryType.Academic,
        description: exceptionsEquipmentCostCategory.description,
      };
      spendProfileDto.costs = [directlyIncurredCost, exceptionsEquipmentCost];

      const command = new UpdatePCRSpendProfileCommand(project.Id, pcrItem.id, spendProfileDto);
      await context.runCommand(command);

      const insertedItems = context.repositories.pcrSpendProfile.Items;
      expect(insertedItems).toHaveLength(2);

      const item1 = insertedItems.find(x => x.costCategoryId === directlyIncurredCostCategory.id);
      if(!item1) throw new Error("item1 not found");
      expect(item1.id).toBeTruthy();
      expect(item1.value).toBe(directlyIncurredCost.value);
      expect(item1.costCategoryId).toBe(directlyIncurredCostCategory.id);
      expect(item1.description).toBe(directlyIncurredCost.description);

      const item2 = insertedItems.find(x => x.costCategoryId === exceptionsEquipmentCostCategory.id);
      if(!item2) throw new Error("item2 not found");
      expect(item2.id).toBeTruthy();
      expect(item2.value).toBe(exceptionsEquipmentCost.value);
      expect(item2.costCategoryId).toBe(exceptionsEquipmentCost.costCategoryId);
      expect(item2.description).toBe(exceptionsEquipmentCost.description);
    });
    it("should return a validation error if there is more than one academic cost of a given category", async () => {
      const { context, project, pcrItem, spendProfileDto } = await setup();
      const someCostCategory = context.testData.createCostCategory({
        name: "Directly incurred - staff",
        type: CostCategoryType.Academic,
      });
      const costA: PCRSpendProfileAcademicCostDto = {
        id: "",
        value: 100,
        costCategoryId: someCostCategory.id,
        costCategory: CostCategoryType.Academic,
        description: someCostCategory.description,
      };
      const costB: PCRSpendProfileAcademicCostDto = {
        id: "",
        value: 200,
        costCategoryId: someCostCategory.id,
        costCategory: CostCategoryType.Academic,
        description: someCostCategory.description,
      };
      spendProfileDto.costs = [costA, costB];

      const command = new UpdatePCRSpendProfileCommand(project.Id, pcrItem.id, spendProfileDto);
      await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    });
    it("should return a validation error if a value is specified but is not a currency", async () => {
      const { context, project, pcrItem, spendProfileDto } = await setup();
      const someCostCategory = context.testData.createCostCategory({
        name: "Directly incurred - staff",
        type: CostCategoryType.Academic,
      });
      const cost: PCRSpendProfileAcademicCostDto = {
        id: "",
        value: "not a currency value" as any as number,
        costCategoryId: someCostCategory.id,
        costCategory: CostCategoryType.Academic,
        description: someCostCategory.description,
      };
      spendProfileDto.costs = [cost];

      const command = new UpdatePCRSpendProfileCommand(project.Id, pcrItem.id, spendProfileDto);
      await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    });
    it("should allow an academic cost with zero value", async () => {
      const { context, project, pcrItem, spendProfileDto } = await setup();
      const someCostCategory = context.testData.createCostCategory({
        name: "Directly incurred - staff",
        type: CostCategoryType.Academic,
      });
      const cost: PCRSpendProfileAcademicCostDto = {
        id: "",
        value: 0,
        costCategoryId: someCostCategory.id,
        costCategory: CostCategoryType.Academic,
        description: someCostCategory.description,
      };
      spendProfileDto.costs = [cost];

      const command = new UpdatePCRSpendProfileCommand(project.Id, pcrItem.id, spendProfileDto);
      await context.runCommand(command);
    });
    it("should allow an academic cost with null value", async () => {
      const { context, project, pcrItem, spendProfileDto } = await setup();
      const directlyIncurredCostCategory = context.testData.createCostCategory({
        name: "Directly incurred - staff",
        type: CostCategoryType.Academic,
      });
      spendProfileDto.costs = [
        {
          id: "",
          value: null,
          costCategoryId: directlyIncurredCostCategory.id,
          costCategory: CostCategoryType.Academic,
          description: directlyIncurredCostCategory.description,
        },
      ];

      const command = new UpdatePCRSpendProfileCommand(project.Id, pcrItem.id, spendProfileDto);
      await context.runCommand(command);

      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      expect(insertedSpendProfileCost).toBeDefined();
      expect(insertedSpendProfileCost.id).toBeTruthy();
      expect(insertedSpendProfileCost.value).toBe(0);
      expect(insertedSpendProfileCost.costCategoryId).toBe(directlyIncurredCostCategory.id);
      expect(insertedSpendProfileCost.description).toBe(directlyIncurredCostCategory.description);
    });
  });
});

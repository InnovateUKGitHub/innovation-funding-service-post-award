// tslint:disable:no-duplicate-string
import { ValidationError } from "@server/features/common";
import { PCRPartnerType, PCRProjectRole, } from "@framework/types";
import { PCRItemStatus } from "@framework/constants";
import { CostCategoryType } from "@framework/entities";
import { PCRSpendProfileMaterialsCostDto, } from "@framework/dtos/pcrSpendProfileDto";
import { UpdatePCRSpendProfileCommand } from "@server/features/pcrs/updatePcrSpendProfileCommand";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import { setup } from "./helpers";

describe("UpdatePCRSpendProfileCommand", () => {
  describe("Materials", () => {
    it("should validate new spend profile costs for materials", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategory = context.testData.createCostCategory({name: "Materials", type: CostCategoryType.Materials});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      const cost: PCRSpendProfileMaterialsCostDto = {
        id: "",
        value: 200,
        costCategoryId: costCategory.id,
        costCategory: CostCategoryType.Materials,
        quantity: 20,
        costPerItem: 10,
        description: "Spade",
      };
      spendProfileDto.costs = [cost];
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await expect(context.runCommand(command)).resolves.toBe(true);
      spendProfileDto.costs[0] = { ...cost, description: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
      spendProfileDto.costs[0] = { ...cost, costPerItem: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
      spendProfileDto.costs[0] = { ...cost, quantity: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
    });
    it("should save new spend profile costs for materials", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategory = context.testData.createCostCategory({name: "Materials", type: CostCategoryType.Materials});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      spendProfileDto.costs.push({
        id: "",
        value: 2000,
        costCategoryId: costCategory.id,
        costCategory: CostCategoryType.Materials,
        quantity: 200,
        costPerItem: 10,
        description: "Hammer",
      } as PCRSpendProfileMaterialsCostDto);
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await expect(await context.runCommand(command)).toBe(true);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      expect(insertedSpendProfileCost).toBeDefined();
      expect(insertedSpendProfileCost.id).toBeTruthy();
      expect(insertedSpendProfileCost.value).toBe(insertedSpendProfileCost.quantity! * insertedSpendProfileCost.costPerItem!);
      expect(insertedSpendProfileCost.quantity).toBe(200);
      expect(insertedSpendProfileCost.costPerItem).toBe(10);
      expect(insertedSpendProfileCost.description).toBe("Hammer");
    });
    it("should update spend profile costs for materials", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategory = context.testData.createCostCategory({name: "Materials", type: CostCategoryType.Materials});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      spendProfileDto.costs.push({
        id: "",
        value: 12,
        costCategoryId: costCategory.id,
        costCategory: CostCategoryType.Materials,
        quantity: 3,
        costPerItem: 4,
        description: "Wrench",
      } as PCRSpendProfileMaterialsCostDto);
      await expect(await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).toBe(true);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      const cost = spendProfileDto.costs[0] as PCRSpendProfileMaterialsCostDto;
      cost.id = insertedSpendProfileCost.id;
      cost.value = 30;
      cost.costPerItem = 5;
      cost.description = "Spanner";
      cost.quantity = 6;
      await expect(await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).toBe(true);
      expect(insertedSpendProfileCost.value).toBe(5*6);
      expect(insertedSpendProfileCost.description).toBe("Spanner");
      expect(insertedSpendProfileCost.costPerItem).toBe(5);
      expect(insertedSpendProfileCost.quantity).toBe(6);
    });
  });
});

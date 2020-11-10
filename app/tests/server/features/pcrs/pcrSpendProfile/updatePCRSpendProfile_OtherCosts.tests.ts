import { ValidationError } from "@server/features/common";
import { PCRPartnerType, PCRProjectRole, } from "@framework/types";
import { PCRItemStatus } from "@framework/constants";
import { CostCategoryType } from "@framework/entities";
import { PCRSpendProfileOtherCostsDto, } from "@framework/dtos/pcrSpendProfileDto";
import { UpdatePCRSpendProfileCommand } from "@server/features/pcrs/updatePcrSpendProfileCommand";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import { setup } from "./helpers";

describe("UpdatePCRSpendProfileCommand", () => {
  describe("Other Costs", () => {
    it("should validate new other spend profile costs", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategory = context.testData.createCostCategory({name: "Other costs", type: CostCategoryType.Other_Costs});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      const cost: PCRSpendProfileOtherCostsDto = {
        id: "",
        value: 450,
        costCategoryId: costCategory.id,
        costCategory: CostCategoryType.Other_Costs,
        description: "Laptop",
      };
      spendProfileDto.costs = [cost];
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await expect(context.runCommand(command)).resolves.toBe(true);
      spendProfileDto.costs[0] = { ...cost, description: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
      spendProfileDto.costs[0] = { ...cost, value: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
    });
    it("should save new other spend profile costs", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategory = context.testData.createCostCategory({name: "Other costs", type: CostCategoryType.Other_Costs});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      spendProfileDto.costs.push({
        id: "",
        value: 176.50,
        costCategoryId: costCategory.id,
        costCategory: CostCategoryType.Other_Costs,
        description: "Something unexpected",
      } as PCRSpendProfileOtherCostsDto);
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await context.runCommand(command);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      expect(insertedSpendProfileCost).toBeDefined();
      expect(insertedSpendProfileCost.id).toBeTruthy();
      expect(insertedSpendProfileCost.value).toBe(176.50);
      expect(insertedSpendProfileCost.description).toBe("Something unexpected");
    });
    it("should update other spend profile costs", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType,
        { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategory = context.testData.createCostCategory({name: "Materials", type: CostCategoryType.Other_Costs});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      spendProfileDto.costs.push({
        id: "",
        value: 1200,
        costCategoryId: costCategory.id,
        costCategory: CostCategoryType.Other_Costs,
        description: "Whale watching in Iceland",
      } as PCRSpendProfileOtherCostsDto);
      await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto));
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      const cost = spendProfileDto.costs[0] as PCRSpendProfileOtherCostsDto;
      cost.id = insertedSpendProfileCost.id;
      cost.value = 2500;
      cost.description = "Whale watching in Tadoussac";
      await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto));
      expect(insertedSpendProfileCost.value).toBe(2500);
      expect(insertedSpendProfileCost.description).toBe("Whale watching in Tadoussac");
    });
  });
});

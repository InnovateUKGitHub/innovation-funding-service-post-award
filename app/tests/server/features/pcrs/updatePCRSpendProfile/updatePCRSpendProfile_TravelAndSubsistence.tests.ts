// tslint:disable:no-duplicate-string
// tslint:disable:no-big-function
import { ValidationError } from "@server/features/common";
import { PCRPartnerType, PCRProjectRole, } from "@framework/types";
import { PCRItemStatus } from "@framework/constants";
import { CostCategoryType } from "@framework/entities";
import { PCRSpendProfileTravelAndSubsCostDto, } from "@framework/dtos/pcrSpendProfileDto";
import { UpdatePCRSpendProfileCommand } from "@server/features/pcrs/updatePcrSpendProfileCommand";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import { setup } from "./helpers";

describe("UpdatePCRSpendProfileCommand", () => {
  describe("Travel and Subsistence", () => {
    it("should validate new spend profile costs for travel and subsistence", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategory = context.testData.createCostCategory({name: "Travel and Subsistence", type: CostCategoryType.Travel_And_Subsistence});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      const cost: PCRSpendProfileTravelAndSubsCostDto = {
        id: "",
        value: 200,
        costCategoryId: costCategory.id,
        costCategory: CostCategoryType.Travel_And_Subsistence,
        numberOfTimes: 10,
        costOfEach: 20,
        description: "Train to Cardiff",
      };
      spendProfileDto.costs = [cost];
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await expect(context.runCommand(command)).resolves.toBe(true);
      spendProfileDto.costs[0] = { ...cost, description: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
      spendProfileDto.costs[0] = { ...cost, numberOfTimes: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
      spendProfileDto.costs[0] = { ...cost, costOfEach: 12.53467 };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
    });
    it("should save new spend profile costs for travel and subsitence", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategory = context.testData.createCostCategory({name: "Travel and Subsistence", type: CostCategoryType.Travel_And_Subsistence});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      spendProfileDto.costs.push({
        id: "",
        value: 2000,
        costCategoryId: costCategory.id,
        costCategory: CostCategoryType.Travel_And_Subsistence,
        numberOfTimes: 5,
        costOfEach: 3,
        description: "Boots Meal Deal",
      } as PCRSpendProfileTravelAndSubsCostDto);
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await expect(await context.runCommand(command)).toBe(true);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      expect(insertedSpendProfileCost).toBeDefined();
      expect(insertedSpendProfileCost.id).toBeTruthy();
      expect(insertedSpendProfileCost.value).toBe(insertedSpendProfileCost.numberOfTimes! * insertedSpendProfileCost.costOfEach!);
      expect(insertedSpendProfileCost.numberOfTimes).toBe(5);
      expect(insertedSpendProfileCost.costOfEach).toBe(3);
      expect(insertedSpendProfileCost.description).toBe("Boots Meal Deal");
    });
    it("should update spend profile costs for travel and subsistence", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType,
        { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategory = context.testData.createCostCategory({name: "Materials", type: CostCategoryType.Travel_And_Subsistence});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      spendProfileDto.costs.push({
        id: "",
        value: 12,
        costCategoryId: costCategory.id,
        costCategory: CostCategoryType.Travel_And_Subsistence,
        numberOfTimes: 33,
        costOfEach: 150,
        description: "Train to London",
      } as PCRSpendProfileTravelAndSubsCostDto);
      await expect(await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).toBe(true);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      const cost = spendProfileDto.costs[0] as PCRSpendProfileTravelAndSubsCostDto;
      cost.id = insertedSpendProfileCost.id;
      cost.value = 4950;
      cost.numberOfTimes = 33;
      cost.costOfEach = 150;
      cost.description = "Train to London";
      await expect(await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).toBe(true);
      expect(insertedSpendProfileCost.value).toBe(33*150);
      expect(insertedSpendProfileCost.description).toBe("Train to London");
      expect(insertedSpendProfileCost.numberOfTimes).toBe(33);
      expect(insertedSpendProfileCost.costOfEach).toBe(150);
    });
  });
});

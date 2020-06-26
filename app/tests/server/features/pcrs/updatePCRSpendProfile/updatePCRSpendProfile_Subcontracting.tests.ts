// tslint:disable:no-duplicate-string
// tslint:disable:no-big-function
import { ValidationError } from "@server/features/common";
import { PCRPartnerType, PCRProjectRole, } from "@framework/types";
import { PCRItemStatus } from "@framework/constants";
import { CostCategoryType } from "@framework/entities";
import { PCRSpendProfileSubcontractingCostDto, } from "@framework/dtos/pcrSpendProfileDto";
import { UpdatePCRSpendProfileCommand } from "@server/features/pcrs/updatePcrSpendProfileCommand";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import { setup } from "./helpers";

describe("UpdatePCRSpendProfileCommand", () => {
  describe("Subcontracting", () => {
    it("should validate new spend profile costs for subcontracting", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategory = context.testData.createCostCategory({name: "Subcontracting", type: CostCategoryType.Subcontracting});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      const cost: PCRSpendProfileSubcontractingCostDto = {
        id: "",
        value: 200,
        costCategory: CostCategoryType.Subcontracting,
        costCategoryId: costCategory.id,
        description: "Software Development",
        subcontractorCountry: "Spain",
        subcontractorRoleAndDescription: "Developer",
      };
      spendProfileDto.costs = [cost];
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await expect(context.runCommand(command)).resolves.toBe(true);
      spendProfileDto.costs[0] = { ...cost, description: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
      spendProfileDto.costs[0] = { ...cost, subcontractorRoleAndDescription: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
      spendProfileDto.costs[0] = { ...cost, subcontractorCountry: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
    });
    it("should save new spend profile costs for subcontracting", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategory = context.testData.createCostCategory({name: "Subcontracting", type: CostCategoryType.Subcontracting});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      spendProfileDto.costs.push({
        id: "",
        value: 2100,
        costCategory: CostCategoryType.Subcontracting,
        costCategoryId: costCategory.id,
        description: "Software Development",
        subcontractorCountry: "Spain",
        subcontractorRoleAndDescription: "Developer",
      } as PCRSpendProfileSubcontractingCostDto);
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await expect(await context.runCommand(command)).toBe(true);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      expect(insertedSpendProfileCost).toBeDefined();
      expect(insertedSpendProfileCost.id).toBeTruthy();
      expect(insertedSpendProfileCost.value).toBe(2100);
      expect(insertedSpendProfileCost.description).toBe("Software Development");
      expect(insertedSpendProfileCost.subcontractorCountry).toBe("Spain");
      expect(insertedSpendProfileCost.subcontractorRoleAndDescription).toBe("Developer");
    });
    it("should update spend profile costs for subcontracting", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategory = context.testData.createCostCategory({name: "Subcontracting", type: CostCategoryType.Subcontracting});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      spendProfileDto.costs.push({
        id: "",
        value: 2101,
        costCategoryId: costCategory.id,
        costCategory: CostCategoryType.Subcontracting,
        description: "Software Development",
        subcontractorRoleAndDescription: "Developer",
        subcontractorCountry: "Spain"
      } as PCRSpendProfileSubcontractingCostDto);
      await expect(await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).toBe(true);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      const cost = spendProfileDto.costs[0] as PCRSpendProfileSubcontractingCostDto;
      cost.id = insertedSpendProfileCost.id;
      cost.value = 2102;
      cost.description = "Website";
      cost.subcontractorRoleAndDescription = "Tester";
      cost.subcontractorCountry = "Spain";
      await expect(await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).toBe(true);
      expect(insertedSpendProfileCost.value).toBe(2102);
      expect(insertedSpendProfileCost.description).toBe("Website");
      expect(insertedSpendProfileCost.subcontractorRoleAndDescription).toBe("Tester");
      expect(insertedSpendProfileCost.subcontractorCountry).toBe("Spain");
    });
  });
});

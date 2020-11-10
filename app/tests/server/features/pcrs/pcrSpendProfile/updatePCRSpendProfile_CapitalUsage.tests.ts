// tslint:disable:no-duplicate-string
// tslint:disable:no-big-function
import { ValidationError } from "@server/features/common";
import { PCRPartnerType, PCRProjectRole, } from "@framework/types";
import { PCRItemStatus, PCRSpendProfileCapitalUsageType } from "@framework/constants";
import { CostCategoryType } from "@framework/entities";
import { PCRSpendProfileCapitalUsageCostDto, } from "@framework/dtos/pcrSpendProfileDto";
import { UpdatePCRSpendProfileCommand } from "@server/features/pcrs/updatePcrSpendProfileCommand";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import { setup } from "./helpers";

describe("UpdatePCRSpendProfileCommand", () => {
  describe("Capital Usage", () => {
    it("should validate new spend profile costs for capital usage", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategory = context.testData.createCostCategory({name: "Capital Usage", type: CostCategoryType.Capital_Usage});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      const cost: PCRSpendProfileCapitalUsageCostDto = {
        id: "",
        value: 1000,
        costCategoryId: costCategory.id,
        costCategory: CostCategoryType.Capital_Usage,
        description: "ABC",
        type: PCRSpendProfileCapitalUsageType.New,
        typeLabel: "New",
        depreciationPeriod: 8,
        netPresentValue: 200,
        residualValue: 100,
        utilisation: 10,
      };
      spendProfileDto.costs = [cost];
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await expect(context.runCommand(command)).resolves.toBe(true);
      spendProfileDto.costs[0] = { ...cost, description: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
      spendProfileDto.costs[0] = { ...cost, depreciationPeriod: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
      spendProfileDto.costs[0] = { ...cost, netPresentValue: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
      spendProfileDto.costs[0] = { ...cost, residualValue: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
      spendProfileDto.costs[0] = { ...cost, utilisation: 101 };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
      spendProfileDto.costs[0] = { ...cost, utilisation: 99.111 };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
    });
    it("should save new spend profile costs for capital usage", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategory = context.testData.createCostCategory({name: "Capital Usage", type: CostCategoryType.Capital_Usage});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      spendProfileDto.costs.push({
        id: "",
        value: 2000,
        costCategoryId: costCategory.id,
        costCategory: CostCategoryType.Capital_Usage,
        description: "ABC",
        type: PCRSpendProfileCapitalUsageType.New,
        depreciationPeriod: 8,
        netPresentValue: 300,
        residualValue: 100,
        utilisation: 10,
      } as PCRSpendProfileCapitalUsageCostDto);
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await context.runCommand(command);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      expect(insertedSpendProfileCost).toBeDefined();
      expect(insertedSpendProfileCost.id).toBeTruthy();
      expect(insertedSpendProfileCost.value).toBe((insertedSpendProfileCost.utilisation! / 100) * (insertedSpendProfileCost.netPresentValue! - insertedSpendProfileCost.residualValue!));
      expect(insertedSpendProfileCost.capitalUsageType).toBe(PCRSpendProfileCapitalUsageType.New);
      expect(insertedSpendProfileCost.depreciationPeriod).toBe(8);
      expect(insertedSpendProfileCost.netPresentValue).toBe(300);
      expect(insertedSpendProfileCost.residualValue).toBe(100);
      expect(insertedSpendProfileCost.utilisation).toBe(10);
      expect(insertedSpendProfileCost.description).toBe("ABC");
    });
    it("should update spend profile costs for capital usage", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategory = context.testData.createCostCategory({name: "Capital Usage", type: CostCategoryType.Capital_Usage});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      spendProfileDto.costs.push({
        id: "",
        value: 3500,
        costCategoryId: costCategory.id,
        costCategory: CostCategoryType.Capital_Usage,
        description: "ABC",
        type: PCRSpendProfileCapitalUsageType.New,
        depreciationPeriod: 10,
        netPresentValue: 550,
        residualValue: 200,
        utilisation: 10,
      } as PCRSpendProfileCapitalUsageCostDto);
      await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto));
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      const cost = spendProfileDto.costs[0] as PCRSpendProfileCapitalUsageCostDto;
      cost.id = insertedSpendProfileCost.id;
      cost.value = 1250;
      cost.description = "CBA";
      cost.type = PCRSpendProfileCapitalUsageType.Existing;
      cost.depreciationPeriod = 5;
      cost.netPresentValue = 350;
      cost.residualValue = 100;
      cost.utilisation = 5;
      await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto));
      expect(insertedSpendProfileCost.value).toBe((5/100)*(350-100));
      expect(insertedSpendProfileCost.capitalUsageType).toBe(PCRSpendProfileCapitalUsageType.Existing);
      expect(insertedSpendProfileCost.description).toBe("CBA");
      expect(insertedSpendProfileCost.depreciationPeriod).toBe(5);
      expect(insertedSpendProfileCost.netPresentValue).toBe(350);
      expect(insertedSpendProfileCost.residualValue).toBe(100);
      expect(insertedSpendProfileCost.utilisation).toBe(5);
    });
  });
});

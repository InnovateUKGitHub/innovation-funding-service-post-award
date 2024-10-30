import {
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileOtherCostsDto,
  PCRSpendProfileOverheadsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { UpdatePCRSpendProfileCommand } from "@server/features/pcrs/updatePcrSpendProfileCommand";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import { setup } from "@tests/test-utils/pcr-spend-profile-helpers";
import { pcrSpendProfileOverheadRatePicklist } from "./pcrSpendProfileOverheadsRateOptionsPicklist";
import { CostCategoryType } from "@framework/constants/enums";
import {
  PCRItemStatus,
  PCRProjectRole,
  PCRPartnerType,
  PCRSpendProfileOverheadRate,
} from "@framework/constants/pcrConstants";
import { roundCurrency } from "@framework/util/numberHelper";
import { ValidationError } from "@shared/appError";

describe("UpdatePCRSpendProfileCommand", () => {
  describe("Overheads", () => {
    it("should save new overheads spend profile costs when rate is 0", async () => {
      const { context, projectChangeRequest, recordType, project } = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, {
        status: PCRItemStatus.Incomplete,
        projectRole: PCRProjectRole.Collaborator,
        partnerType: PCRPartnerType.Business,
      });
      const costCategory = context.testData.createCostCategory({ name: "Overheads", type: CostCategoryType.Overheads });
      context.testData.createCostCategory({ name: "Labour", type: CostCategoryType.Labour });
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(project.Id, item.id));
      const cost: PCRSpendProfileOverheadsCostDto = {
        id: "" as CostId,
        value: null,
        costCategoryId: costCategory.id,
        costCategory: CostCategoryType.Overheads,
        description: pcrSpendProfileOverheadRatePicklist.get(PCRSpendProfileOverheadRate.Zero)?.label || null,
        overheadRate: PCRSpendProfileOverheadRate.Zero,
      };
      spendProfileDto.costs.push(cost);
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await context.runCommand(command);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      expect(insertedSpendProfileCost).toMatchObject({ ...cost, value: 0, id: insertedSpendProfileCost.id });
    });
    it("should save new overheads spend profile costs based on labour costs", async () => {
      const { context, projectChangeRequest, recordType, project } = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, {
        status: PCRItemStatus.Incomplete,
        projectRole: PCRProjectRole.Collaborator,
        partnerType: PCRPartnerType.Business,
      });
      const costCategoryOverheads = context.testData.createCostCategory({
        name: "Overheads",
        type: CostCategoryType.Overheads,
      });
      const costCategoryLabour = context.testData.createCostCategory({ name: "Labour", type: CostCategoryType.Labour });
      const costCategoryOther = context.testData.createCostCategory({
        name: "Other",
        type: CostCategoryType.Other_Costs,
      });
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(project.Id, item.id));
      const cost: PCRSpendProfileOverheadsCostDto = {
        id: "" as CostId,
        value: null,
        costCategoryId: costCategoryOverheads.id,
        costCategory: CostCategoryType.Overheads,
        description: pcrSpendProfileOverheadRatePicklist.get(PCRSpendProfileOverheadRate.Twenty)?.label || null,
        overheadRate: PCRSpendProfileOverheadRate.Twenty,
      };
      const labourCosts: PCRSpendProfileLabourCostDto[] = [
        {
          id: "" as CostId,
          value: null,
          costCategoryId: costCategoryLabour.id,
          costCategory: CostCategoryType.Labour,
          description: "Labour Overheads cost lots",
          ratePerDay: 20,
          daysSpentOnProject: 6,
          grossCostOfRole: 21,
        },
        {
          id: "" as CostId,
          value: null,
          costCategoryId: costCategoryLabour.id,
          costCategory: CostCategoryType.Labour,
          description: "Labour Overheads cost lots",
          ratePerDay: 21,
          daysSpentOnProject: 7,
          grossCostOfRole: 24,
        },
      ];

      const otherCost: PCRSpendProfileOtherCostsDto = {
        id: "" as CostId,
        value: 100022,
        costCategoryId: costCategoryOther.id,
        costCategory: CostCategoryType.Other_Costs,
        description: "Some other costs",
      };

      spendProfileDto.costs.push(cost);
      spendProfileDto.costs.push(otherCost);
      spendProfileDto.costs.push(...labourCosts);
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await context.runCommand(command);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items.find(
        x => x.costCategoryId === costCategoryOverheads.id,
      );
      expect(insertedSpendProfileCost).toMatchObject({
        ...cost,
        value: roundCurrency((20 / 100) * (20 * 6 + 21 * 7)),
        id: insertedSpendProfileCost?.id,
      });
    });
    it("should save new overheads spend profile costs with calculated value", async () => {
      const { context, projectChangeRequest, recordType, project } = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, {
        status: PCRItemStatus.Incomplete,
        projectRole: PCRProjectRole.Collaborator,
        partnerType: PCRPartnerType.Business,
      });
      const costCategoryOverheads = context.testData.createCostCategory({
        name: "Overheads",
        type: CostCategoryType.Overheads,
      });
      const costCategoryLabour = context.testData.createCostCategory({ name: "Labour", type: CostCategoryType.Labour });
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(project.Id, item.id));
      const cost: PCRSpendProfileOverheadsCostDto = {
        id: "" as CostId,
        value: 30,
        costCategoryId: costCategoryOverheads.id,
        costCategory: CostCategoryType.Overheads,
        description: pcrSpendProfileOverheadRatePicklist.get(PCRSpendProfileOverheadRate.Calculated)?.label || null,
        overheadRate: PCRSpendProfileOverheadRate.Calculated,
      };
      const labourCosts: PCRSpendProfileLabourCostDto[] = [
        {
          id: "" as CostId,
          value: null,
          costCategoryId: costCategoryLabour.id,
          costCategory: CostCategoryType.Labour,
          description: "Labour Overheads cost lots",
          ratePerDay: 20,
          daysSpentOnProject: 6,
          grossCostOfRole: 21,
        },
        {
          id: "" as CostId,
          value: null,
          costCategoryId: costCategoryLabour.id,
          costCategory: CostCategoryType.Labour,
          description: "Labour Overheads cost lots",
          ratePerDay: 21,
          daysSpentOnProject: 7,
          grossCostOfRole: 24,
        },
      ];
      spendProfileDto.costs.push(cost);
      spendProfileDto.costs.push(...labourCosts);
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await context.runCommand(command);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items.find(
        x => x.costCategoryId === costCategoryOverheads.id,
      );
      expect(insertedSpendProfileCost).toMatchObject({ ...cost, id: insertedSpendProfileCost?.id });
    });
    it("should return a validation error if there is more than one overheads cost", async () => {
      const { context, projectChangeRequest, recordType, project } = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, {
        status: PCRItemStatus.Incomplete,
        projectRole: PCRProjectRole.Collaborator,
        partnerType: PCRPartnerType.Business,
      });
      const costCategoryOverheads = context.testData.createCostCategory({
        name: "Overheads",
        type: CostCategoryType.Overheads,
      });
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(project.Id, item.id));
      spendProfileDto.costs = [
        {
          id: "" as CostId,
          value: 30,
          costCategoryId: costCategoryOverheads.id,
          costCategory: CostCategoryType.Overheads,
          description: pcrSpendProfileOverheadRatePicklist.get(PCRSpendProfileOverheadRate.Calculated)?.label || null,
          overheadRate: PCRSpendProfileOverheadRate.Calculated,
        },
        {
          id: "" as CostId,
          value: 40,
          costCategoryId: costCategoryOverheads.id,
          costCategory: CostCategoryType.Overheads,
          description: pcrSpendProfileOverheadRatePicklist.get(PCRSpendProfileOverheadRate.Calculated)?.label || null,
          overheadRate: PCRSpendProfileOverheadRate.Calculated,
        },
      ];
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    });
    it("should update overheads spend profile costs", async () => {
      const { context, projectChangeRequest, recordType, project } = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, {
        status: PCRItemStatus.Incomplete,
        projectRole: PCRProjectRole.Collaborator,
        isCommercialWork: true,
        partnerType: PCRPartnerType.Business,
      });
      const costCategoryLabour = context.testData.createCostCategory({ name: "Labour", type: CostCategoryType.Labour });
      const costCategory = context.testData.createCostCategory({ name: "Overheads", type: CostCategoryType.Overheads });
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(project.Id, item.id));
      const labourCosts: PCRSpendProfileLabourCostDto[] = [
        {
          id: "" as CostId,
          value: null,
          costCategoryId: costCategoryLabour.id,
          costCategory: CostCategoryType.Labour,
          description: "Labour Overheads cost lots",
          ratePerDay: 20,
          daysSpentOnProject: 6,
          grossCostOfRole: 21,
        },
        {
          id: "" as CostId,
          value: null,
          costCategoryId: costCategoryLabour.id,
          costCategory: CostCategoryType.Labour,
          description: "Labour Overheads cost lots",
          ratePerDay: 21,
          daysSpentOnProject: 7,
          grossCostOfRole: 24,
        },
      ];
      spendProfileDto.costs.push({
        id: "" as CostId,
        value: 50,
        costCategoryId: costCategory.id,
        costCategory: CostCategoryType.Overheads,
        description: pcrSpendProfileOverheadRatePicklist.get(PCRSpendProfileOverheadRate.Calculated)?.label || null,
        overheadRate: PCRSpendProfileOverheadRate.Calculated,
      } as PCRSpendProfileOverheadsCostDto);
      spendProfileDto.costs.push(...labourCosts);
      await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto));
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      const cost = spendProfileDto.costs[0] as PCRSpendProfileOverheadsCostDto;
      cost.id = insertedSpendProfileCost.id;
      cost.value = 60;
      await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto));
      expect(context.repositories.pcrSpendProfile.Items).toHaveLength(3);
      const updatedCost = context.repositories.pcrSpendProfile.Items[0];
      expect(updatedCost.value).toBe(60);
      expect(updatedCost.description).toBe(
        pcrSpendProfileOverheadRatePicklist.get(PCRSpendProfileOverheadRate.Calculated)?.label || null,
      );
    });
    it("should update overheads spend profile costs when a labour cost is added", async () => {
      const { context, projectChangeRequest, recordType, project } = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, {
        status: PCRItemStatus.Incomplete,
        projectRole: PCRProjectRole.Collaborator,
        partnerType: PCRPartnerType.Business,
      });
      const costCategoryOverheads = context.testData.createCostCategory({
        name: "Overheads",
        type: CostCategoryType.Overheads,
      });
      const costCategoryLabour = context.testData.createCostCategory({ name: "Labour", type: CostCategoryType.Labour });
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(project.Id, item.id));
      const cost: PCRSpendProfileOverheadsCostDto = {
        id: "" as CostId,
        value: null,
        costCategoryId: costCategoryOverheads.id,
        costCategory: CostCategoryType.Overheads,
        description: pcrSpendProfileOverheadRatePicklist.get(PCRSpendProfileOverheadRate.Twenty)?.label || null,
        overheadRate: PCRSpendProfileOverheadRate.Twenty,
      };
      const labourCosts: PCRSpendProfileLabourCostDto[] = [
        {
          id: "" as CostId,
          value: null,
          costCategoryId: costCategoryLabour.id,
          costCategory: CostCategoryType.Labour,
          description: "Labour Overheads cost lots",
          ratePerDay: 20,
          daysSpentOnProject: 6,
          grossCostOfRole: 21,
        },
        {
          id: "" as CostId,
          value: null,
          costCategoryId: costCategoryLabour.id,
          costCategory: CostCategoryType.Labour,
          description: "Labour Overheads cost lots",
          ratePerDay: 21,
          daysSpentOnProject: 7,
          grossCostOfRole: 24,
        },
      ];
      spendProfileDto.costs.push(cost);
      spendProfileDto.costs.push(...labourCosts);
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await context.runCommand(command);

      const inserted = await context.runQuery(new GetPcrSpendProfilesQuery(project.Id, item.id));
      inserted.costs.push({
        id: "" as CostId,
        value: null,
        costCategoryId: costCategoryLabour.id,
        costCategory: CostCategoryType.Labour,
        description: "Labour Overheads cost lots",
        ratePerDay: 25,
        daysSpentOnProject: 10,
        grossCostOfRole: 24,
      });
      await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, inserted));
      const updatedSpendProfileCosts = context.repositories.pcrSpendProfile.Items.filter(
        x => x.costCategoryId === costCategoryOverheads.id,
      );
      expect(updatedSpendProfileCosts).toHaveLength(1);
      expect(updatedSpendProfileCosts[0]).toMatchObject({
        ...cost,
        value: roundCurrency((20 / 100) * (20 * 6 + 21 * 7 + 25 * 10)),
        id: updatedSpendProfileCosts[0].id,
      });
    });
  });
});

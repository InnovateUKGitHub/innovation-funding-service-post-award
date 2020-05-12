// tslint:disable:no-duplicate-string
import { TestContext } from "../../testContextProvider";
import { ValidationError } from "@server/features/common";
import {
  PCRItemType,
  PCRPartnerType,
  PCRProjectRole,
} from "@framework/types";
import { PCRRecordTypeMetaValues } from "@server/features/pcrs/getItemTypesQuery";
import { PCRItemStatus, PCRSpendProfileCapitalUsageType, PCRStatus } from "@framework/constants";
import { CostCategoryType } from "@framework/entities";
import { PCRSpendProfileCapitalUsageCostDto, PCRSpendProfileLabourCostDto, PCRSpendProfileMaterialsCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { UpdatePCRSpendProfileCommand } from "@server/features/pcrs/updatePcrSpendProfileCommand";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";

// tslint:disable-next-line:no-big-function
describe("UpdatePCRSpendProfileCommand", () => {
  const setup = () => {
    const context = new TestContext();
    const project = context.testData.createProject();
    context.testData.createCurrentUserAsProjectManager(project);
    const projectChangeRequest = context.testData.createPCR(project, { status: PCRStatus.Draft });
    const recordTypes = context.testData.createPCRRecordTypes();
    const projectSuspensionType = PCRRecordTypeMetaValues.find(x => x.type === PCRItemType.PartnerAddition)!;
    const recordType = recordTypes.find(x => x.type === projectSuspensionType.typeName);
    return {context, recordType, projectChangeRequest, project};
  };

  describe("Labour", () => {
    it("should validate new spend profile costs for labour", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategoryLabour = context.testData.createCostCategory({name: "Labour", type: CostCategoryType.Labour});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      const cost: PCRSpendProfileLabourCostDto = {
        id: "",
        value: 60,
        costCategoryId: costCategoryLabour.id,
        costCategory: CostCategoryType.Labour,
        ratePerDay: 20,
        daysSpentOnProject: 10,
        description: "Queen",
        grossCostOfRole: 200
      };
      spendProfileDto.costs = [cost];
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await expect(context.runCommand(command)).resolves.toBe(true);
      spendProfileDto.costs[0] = { ...cost, ratePerDay: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
      spendProfileDto.costs[0] = { ...cost, daysSpentOnProject: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
      spendProfileDto.costs[0] = { ...cost, grossCostOfRole: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
      spendProfileDto.costs[0] = { ...cost, value: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
      spendProfileDto.costs[0] = { ...cost, description: null };
      await expect(context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).rejects.toThrow(ValidationError);
    });
    it("should save new spend profile costs for labour", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategoryLabour = context.testData.createCostCategory({name: "Labour", type: CostCategoryType.Labour});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      spendProfileDto.costs.push({
        id: "",
        value: 60,
        costCategoryId: costCategoryLabour.id,
        costCategory: CostCategoryType.Labour,
        ratePerDay: 20,
        daysSpentOnProject: 10,
        description: "Queen",
        grossCostOfRole: 200
      } as PCRSpendProfileLabourCostDto);
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await expect(await context.runCommand(command)).toBe(true);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      expect(insertedSpendProfileCost).toBeDefined();
      expect(insertedSpendProfileCost.id).toBeTruthy();
      expect(insertedSpendProfileCost.value).toBe(insertedSpendProfileCost.daysSpentOnProject! * insertedSpendProfileCost.ratePerDay!);
      expect(insertedSpendProfileCost.costCategoryId).toBe(costCategoryLabour.id);
      expect(insertedSpendProfileCost.pcrItemId).toBe(item.id);
      expect(insertedSpendProfileCost.grossCostOfRole).toBe(200);
      expect(insertedSpendProfileCost.daysSpentOnProject).toBe(10);
      expect(insertedSpendProfileCost.ratePerDay).toBe(20);
      expect(insertedSpendProfileCost.description).toBe("Queen");
    });
    it("should update spend profile costs for labour", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategoryLabour = context.testData.createCostCategory({name: "Labour", type: CostCategoryType.Labour});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      spendProfileDto.costs.push({
        id: "",
        value: 60,
        costCategoryId: costCategoryLabour.id,
        costCategory: CostCategoryType.Labour,
        ratePerDay: 10,
        daysSpentOnProject: 10,
        description: "Queen",
        grossCostOfRole: 100
      } as PCRSpendProfileLabourCostDto);
      await expect(await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).toBe(true);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      const cost = spendProfileDto.costs[0] as PCRSpendProfileLabourCostDto;
      cost.id = insertedSpendProfileCost.id;
      cost.value = 30;
      cost.grossCostOfRole = 35;
      cost.description = "Queenie";
      cost.daysSpentOnProject = 5;
      cost.ratePerDay = 6;
      await expect(await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).toBe(true);
      expect(insertedSpendProfileCost.value).toBe(30);
      expect(insertedSpendProfileCost.ratePerDay).toBe(6);
      expect(insertedSpendProfileCost.daysSpentOnProject).toBe(5);
      expect(insertedSpendProfileCost.description).toBe("Queenie");
      expect(insertedSpendProfileCost.grossCostOfRole).toBe(35);
    });
  });
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
      spendProfileDto.costs[0] = { ...cost, value: null };
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
      spendProfileDto.costs[0] = { ...cost, value: null };
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
      await expect(await context.runCommand(command)).toBe(true);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      expect(insertedSpendProfileCost).toBeDefined();
      expect(insertedSpendProfileCost.id).toBeTruthy();
      expect(insertedSpendProfileCost.value).toBe(insertedSpendProfileCost.utilisation! * (insertedSpendProfileCost.netPresentValue! - insertedSpendProfileCost.residualValue!));
      expect(insertedSpendProfileCost.type).toBe(PCRSpendProfileCapitalUsageType.New);
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
      await expect(await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).toBe(true);
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
      await expect(await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).toBe(true);
      expect(insertedSpendProfileCost.value).toBe(5*(350-100));
      expect(insertedSpendProfileCost.type).toBe(PCRSpendProfileCapitalUsageType.Existing);
      expect(insertedSpendProfileCost.description).toBe("CBA");
      expect(insertedSpendProfileCost.depreciationPeriod).toBe(5);
      expect(insertedSpendProfileCost.netPresentValue).toBe(350);
      expect(insertedSpendProfileCost.residualValue).toBe(100);
      expect(insertedSpendProfileCost.utilisation).toBe(5);
    });
  });
  it("should delete spend profile costs", async () => {
    const {context, projectChangeRequest, recordType, project} = setup();
    const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
    const costCategoryLabour = context.testData.createCostCategory({name: "Labour", type: CostCategoryType.Labour});
    const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
    spendProfileDto.costs.push({
      id: "",
      value: 60,
      costCategoryId: costCategoryLabour.id,
      costCategory: CostCategoryType.Labour,
      ratePerDay: 10,
      daysSpentOnProject: 10,
      description: "Queen",
      grossCostOfRole: 100
    });
    const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
    await expect(await context.runCommand(command)).toBe(true);
    expect(context.repositories.pcrSpendProfile.Items).toHaveLength(1);
    spendProfileDto.costs = [];
    await expect(await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).toBe(true);
    expect(context.repositories.pcrSpendProfile.Items).toHaveLength(0);
  });
});

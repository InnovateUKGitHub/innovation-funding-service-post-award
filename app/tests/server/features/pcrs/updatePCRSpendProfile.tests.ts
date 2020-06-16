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
import {
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto,
  PCRSpendProfileOtherCostsDto, PCRSpendProfileOverheadsCostDto,
  PCRSpendProfileSubcontractingCostDto,
  PCRSpendProfileTravelAndSubsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { UpdatePCRSpendProfileCommand } from "@server/features/pcrs/updatePcrSpendProfileCommand";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import { roundCurrency } from "@framework/util";

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
      await expect(await context.runCommand(command)).toBe(true);
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
      expect(insertedSpendProfileCost.value).toBe((5/100)*(350-100));
      expect(insertedSpendProfileCost.capitalUsageType).toBe(PCRSpendProfileCapitalUsageType.Existing);
      expect(insertedSpendProfileCost.description).toBe("CBA");
      expect(insertedSpendProfileCost.depreciationPeriod).toBe(5);
      expect(insertedSpendProfileCost.netPresentValue).toBe(350);
      expect(insertedSpendProfileCost.residualValue).toBe(100);
      expect(insertedSpendProfileCost.utilisation).toBe(5);
    });
  });
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
      await expect(await context.runCommand(command)).toBe(true);
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
      await expect(await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).toBe(true);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      const cost = spendProfileDto.costs[0] as PCRSpendProfileOtherCostsDto;
      cost.id = insertedSpendProfileCost.id;
      cost.value = 2500;
      cost.description = "Whale watching in Tadoussac";
      await expect(await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).toBe(true);
      expect(insertedSpendProfileCost.value).toBe(2500);
      expect(insertedSpendProfileCost.description).toBe("Whale watching in Tadoussac");
    });
  });
  // tslint:disable-next-line:no-big-function
  describe("Overheads", () => {
    it("should save new overheads spend profile costs when rate is 0", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategory = context.testData.createCostCategory({name: "Overheads", type: CostCategoryType.Overheads});
      context.testData.createCostCategory({name: "Labour", type: CostCategoryType.Labour});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      const cost: PCRSpendProfileOverheadsCostDto = {
        id: "",
        value: null,
        costCategoryId: costCategory.id,
        costCategory: CostCategoryType.Overheads,
        description: "Labour Overheads cost lots",
        overheadRate: 0,
      };
      spendProfileDto.costs.push(cost);
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await expect(await context.runCommand(command)).toBe(true);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      expect(insertedSpendProfileCost).toMatchObject({ ...cost, value: 0, id: insertedSpendProfileCost.id });
    });
    it("should save new overheads spend profile costs based on labour costs", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategoryOverheads = context.testData.createCostCategory({name: "Overheads", type: CostCategoryType.Overheads});
      const costCategoryLabour = context.testData.createCostCategory({name: "Labour", type: CostCategoryType.Labour});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      const cost: PCRSpendProfileOverheadsCostDto = {
        id: "",
        value: null,
        costCategoryId: costCategoryOverheads.id,
        costCategory: CostCategoryType.Overheads,
        description: "Labour Overheads cost lots",
        overheadRate: 20,
      };
      const labourCosts: PCRSpendProfileLabourCostDto[] = [{
        id: "",
        value: null,
        costCategoryId: costCategoryLabour.id,
        costCategory: CostCategoryType.Labour,
        description: "Labour Overheads cost lots",
        ratePerDay: 20,
        daysSpentOnProject: 6,
        grossCostOfRole: 21,
      }, {
        id: "",
        value: null,
        costCategoryId: costCategoryLabour.id,
        costCategory: CostCategoryType.Labour,
        description: "Labour Overheads cost lots",
        ratePerDay: 21,
        daysSpentOnProject: 7,
        grossCostOfRole: 24,
      }];
      spendProfileDto.costs.push(cost);
      spendProfileDto.costs.push(...labourCosts);
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await expect(await context.runCommand(command)).toBe(true);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items.find(x => x.costCategoryId === costCategoryOverheads.id)!;
      expect(insertedSpendProfileCost).toMatchObject({ ...cost, value: roundCurrency((20/100)*(20*6 + 21*7)), id: insertedSpendProfileCost.id });
    });
    it("should save new overheads spend profile costs with calculated value", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategoryOverheads = context.testData.createCostCategory({name: "Overheads", type: CostCategoryType.Overheads});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      const cost: PCRSpendProfileOverheadsCostDto = {
        id: "",
        value: 30,
        costCategoryId: costCategoryOverheads.id,
        costCategory: CostCategoryType.Overheads,
        description: "Labour Overheads cost lots",
        overheadRate: "calculated",
      };
      spendProfileDto.costs.push(cost);
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await expect(await context.runCommand(command)).toBe(true);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items.find(x => x.costCategoryId === costCategoryOverheads.id)!;
      expect(insertedSpendProfileCost).toMatchObject({ ...cost, id: insertedSpendProfileCost.id });
    });
    it("should return a validation error if there is more than one overheads cost", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategoryOverheads = context.testData.createCostCategory({name: "Overheads", type: CostCategoryType.Overheads});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      const costs: PCRSpendProfileOverheadsCostDto[] = [{
        id: "",
        value: 30,
        costCategoryId: costCategoryOverheads.id,
        costCategory: CostCategoryType.Overheads,
        description: "Labour Overheads cost lots",
        overheadRate: "calculated",
      }, {
        id: "",
        value: 40,
        costCategoryId: costCategoryOverheads.id,
        costCategory: CostCategoryType.Overheads,
        description: "Labour Overheads cost lots and lots",
        overheadRate: "calculated",
      }];
      spendProfileDto.costs = costs;
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    });
    it("should update overheads spend profile costs", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, {
        status: PCRItemStatus.Incomplete,
        projectRole: PCRProjectRole.Collaborator,
        partnerType: PCRPartnerType.Business
      });
      const costCategory = context.testData.createCostCategory({name: "Overheads", type: CostCategoryType.Overheads});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      spendProfileDto.costs.push({
        id: "",
        value: 50,
        costCategoryId: costCategory.id,
        costCategory: CostCategoryType.Overheads,
        description: "Labour Overheads cost lots",
        overheadRate: "calculated",
      } as PCRSpendProfileOverheadsCostDto);
      await expect(await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).toBe(true);
      const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
      const cost = spendProfileDto.costs[0] as PCRSpendProfileOtherCostsDto;
      cost.id = insertedSpendProfileCost.id;
      cost.value = 60;
      cost.description = "Labour Overheads cost little";
      await expect(await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto))).toBe(true);
      expect(context.repositories.pcrSpendProfile.Items).toHaveLength(1);
      const updatedCost = context.repositories.pcrSpendProfile.Items[0];
      expect(updatedCost.value).toBe(60);
      expect(updatedCost.description).toBe("Labour Overheads cost little");
    });
    it("should update overheads spend profile costs when a labour cost is added", async () => {
      const {context, projectChangeRequest, recordType, project} = setup();
      const item = context.testData.createPCRItem(projectChangeRequest, recordType, { status: PCRItemStatus.Incomplete, projectRole: PCRProjectRole.Collaborator, partnerType: PCRPartnerType.Business });
      const costCategoryOverheads = context.testData.createCostCategory({name: "Overheads", type: CostCategoryType.Overheads});
      const costCategoryLabour = context.testData.createCostCategory({name: "Labour", type: CostCategoryType.Labour});
      const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      const cost: PCRSpendProfileOverheadsCostDto = {
        id: "",
        value: null,
        costCategoryId: costCategoryOverheads.id,
        costCategory: CostCategoryType.Overheads,
        description: "Labour Overheads cost lots",
        overheadRate: 20,
      };
      const labourCosts: PCRSpendProfileLabourCostDto[] = [{
        id: "",
        value: null,
        costCategoryId: costCategoryLabour.id,
        costCategory: CostCategoryType.Labour,
        description: "Labour Overheads cost lots",
        ratePerDay: 20,
        daysSpentOnProject: 6,
        grossCostOfRole: 21,
      }, {
        id: "",
        value: null,
        costCategoryId: costCategoryLabour.id,
        costCategory: CostCategoryType.Labour,
        description: "Labour Overheads cost lots",
        ratePerDay: 21,
        daysSpentOnProject: 7,
        grossCostOfRole: 24,
      }];
      spendProfileDto.costs.push(cost);
      spendProfileDto.costs.push(...labourCosts);
      const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
      await expect(await context.runCommand(command)).toBe(true);

      const inserted = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
      inserted.costs.push({
        id: "",
        value: null,
        costCategoryId: costCategoryLabour.id,
        costCategory: CostCategoryType.Labour,
        description: "Labour Overheads cost lots",
        ratePerDay: 25,
        daysSpentOnProject: 10,
        grossCostOfRole: 24,
      });
      await expect(await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, inserted))).toBe(true);
      const updatedSpendProfileCosts = context.repositories.pcrSpendProfile.Items.filter(x => x.costCategoryId === costCategoryOverheads.id);
      expect(updatedSpendProfileCosts).toHaveLength(1);
      expect(updatedSpendProfileCosts[0]).toMatchObject({ ...cost, value: roundCurrency((20/100)*(20*6 + 21*7 + 25*10)), id: updatedSpendProfileCosts[0].id });
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

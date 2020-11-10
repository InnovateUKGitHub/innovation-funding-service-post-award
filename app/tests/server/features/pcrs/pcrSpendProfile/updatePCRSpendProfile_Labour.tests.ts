import { setup } from "./helpers";
import { PCRItemStatus, PCRPartnerType, PCRProjectRole } from "@framework/constants";
import { CostCategoryType } from "@framework/entities";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import { PCRSpendProfileLabourCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { UpdatePCRSpendProfileCommand } from "@server/features/pcrs/updatePcrSpendProfileCommand";
import { ValidationError } from "@server/features/common";

describe("UpdatePCRSpendProfileCommand", () => {
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
            await context.runCommand(command);
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
            await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto));
            const insertedSpendProfileCost = context.repositories.pcrSpendProfile.Items[0];
            const cost = spendProfileDto.costs[0] as PCRSpendProfileLabourCostDto;
            cost.id = insertedSpendProfileCost.id;
            cost.value = 30;
            cost.grossCostOfRole = 35;
            cost.description = "Queenie";
            cost.daysSpentOnProject = 5;
            cost.ratePerDay = 6;
            await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto));
            expect(insertedSpendProfileCost.value).toBe(30);
            expect(insertedSpendProfileCost.ratePerDay).toBe(6);
            expect(insertedSpendProfileCost.daysSpentOnProject).toBe(5);
            expect(insertedSpendProfileCost.description).toBe("Queenie");
            expect(insertedSpendProfileCost.grossCostOfRole).toBe(35);
        });
    });
});

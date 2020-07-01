import { PCRPartnerType, PCRProjectRole, } from "@framework/types";
import { PCRItemStatus } from "@framework/constants";
import { CostCategoryType } from "@framework/entities";
import { UpdatePCRSpendProfileCommand } from "@server/features/pcrs/updatePcrSpendProfileCommand";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import { setup } from "./helpers";

describe("UpdatePCRSpendProfileCommand", () => {
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

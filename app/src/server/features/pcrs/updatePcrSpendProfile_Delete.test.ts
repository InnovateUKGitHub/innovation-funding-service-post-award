import { UpdatePCRSpendProfileCommand } from "@server/features/pcrs/updatePcrSpendProfileCommand";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import { setup } from "@tests/test-utils/pcr-spend-profile-helpers";
import { CostCategoryType } from "@framework/constants/enums";
import { PCRItemStatus, PCRProjectRole, PCRPartnerType } from "@framework/constants/pcrConstants";

describe("UpdatePCRSpendProfileCommand", () => {
  it("should delete spend profile costs", async () => {
    const { context, projectChangeRequest, recordType, project } = setup();
    const item = context.testData.createPCRItem(projectChangeRequest, recordType, {
      status: PCRItemStatus.Incomplete,
      projectRole: PCRProjectRole.Collaborator,
      partnerType: PCRPartnerType.Business,
    });
    const costCategoryLabour = context.testData.createCostCategory({ name: "Labour", type: CostCategoryType.Labour });
    const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(item.id));
    spendProfileDto.costs.push({
      id: "" as CostId,
      value: 60,
      costCategoryId: costCategoryLabour.id,
      costCategory: CostCategoryType.Labour,
      ratePerDay: 10,
      daysSpentOnProject: 10,
      description: "Queen",
      grossCostOfRole: 100,
    });
    const command = new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto);
    await context.runCommand(command);
    expect(context.repositories.pcrSpendProfile.Items).toHaveLength(1);
    spendProfileDto.costs = [];
    await context.runCommand(new UpdatePCRSpendProfileCommand(project.Id, item.id, spendProfileDto));
    expect(context.repositories.pcrSpendProfile.Items).toHaveLength(0);
  });
});

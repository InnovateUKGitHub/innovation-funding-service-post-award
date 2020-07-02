import { setup as commonSetup } from "./helpers";
import { PCRItemStatus, PCRPartnerType, PCRProjectRole } from "@framework/constants";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import { CostCategoryType } from "@framework/entities";
import { DateTime } from "luxon";

const setup = async () => {
  const { context, projectChangeRequest, recordType, project } = commonSetup();
  const pcrItem = context.testData.createPCRItem(
    projectChangeRequest,
    recordType,
    {
      status: PCRItemStatus.Incomplete,
      projectRole: PCRProjectRole.Collaborator,
      partnerType: PCRPartnerType.Research
    });
  return { context, project, pcrItem };
};

describe("getPcrSpendProfile", () => {
  it("should return costs", async () => {
    const { context, pcrItem } = await setup();
    const costCategory = context.testData.createCostCategory({name: "Labour", type: CostCategoryType.Labour});
    await context.testData.createPcrSpendProfile({
      pcrItem, costCategory, update: {
        value: 60,
        description: "First labour cost",
      }
    });
    const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(pcrItem.id));
    expect(spendProfileDto.funds).toHaveLength(0);
    expect(spendProfileDto.costs).toHaveLength(1);
    const cost = spendProfileDto.costs[0];
    expect(cost.costCategory).toEqual(CostCategoryType.Labour);
    expect(cost.costCategoryId).toEqual(costCategory.id);
    expect(cost.value).toEqual(60);
    expect(cost.description).toEqual("First labour cost");
  });
  it("should return funds", async () => {
    const { context, pcrItem } = await setup();
    const costCategory = context.testData.createCostCategory({name: "Other Funding", type: CostCategoryType.Other_Funding});
    await context.testData.createPcrSpendProfile({
      pcrItem, costCategory, update: {
        value: 50,
        description: "Some other funding",
        dateOtherFundingSecured: DateTime.local(2020, 2, 1).toISODate()
      }
    });
    const spendProfileDto = await context.runQuery(new GetPcrSpendProfilesQuery(pcrItem.id));
    expect(spendProfileDto.costs).toHaveLength(0);
    expect(spendProfileDto.funds).toHaveLength(1);
    const otherFunding = spendProfileDto.funds[0];
    expect(otherFunding.costCategory).toEqual(CostCategoryType.Other_Funding);
    expect(otherFunding.costCategoryId).toEqual(costCategory.id);
    expect(otherFunding.value).toEqual(50);
    expect(otherFunding.description).toEqual("Some other funding");
  });
});

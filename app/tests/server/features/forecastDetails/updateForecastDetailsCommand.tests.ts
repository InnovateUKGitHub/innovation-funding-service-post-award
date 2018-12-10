import { TestContext } from "../../testContextProvider";
import { UpdateForecastDetailsCommand } from "../../../../src/server/features/forecastDetails";
import { ValidationError } from "../../../../src/shared/validation";
import { ClaimFrequency } from "../../../../src/types";
import { DateTime } from "luxon";

describe("UpdateForecastDetailsCommand", () => {
  it("when id not set expect validation exception", async () => {
    const context = new TestContext();

    const profileDetail = context.testData.createProfileDetail();
    const partnerId     = profileDetail.Acc_ProjectParticipant__c;
    const periodId      = profileDetail.Acc_ProjectPeriodNumber__c;
    const dto: ForecastDetailsDTO[] = [{
      id: null,
      costCategoryId: profileDetail.Acc_CostCategory__c,
      periodId: parseInt(profileDetail.Acc_CostCategory__c, 10),
      periodStart: new Date(profileDetail.Acc_ProjectPeriodStartDate__c),
      periodEnd: new Date(profileDetail.Acc_ProjectPeriodEndDate__c),
      value: 123
    }];

    const command = new UpdateForecastDetailsCommand(partnerId, periodId, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("total costs exceed gol costs", async () => {
    const context       = new TestContext();
    const testData      = context.testData;
    const partner       = testData.createPartner();
    const costCat       = testData.createCostCategory();
    const periodId      = 2;
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => x.Acc_LatestForecastCost__c = 123);
    testData.createClaimDetail(costCat, partner, periodId - 1, x => x.Acc_PeriodCostCategoryTotal__c = 1000);
    testData.createProfileTotalCostCategory(costCat, partner, 1500);

    const dto: ForecastDetailsDTO[] = [{
      periodId,
      id: profileDetail.Acc_CostCategory__c,
      costCategoryId: costCat.Id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 501
    }];

    const command = new UpdateForecastDetailsCommand(partner.Id, periodId, dto);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("total costs equal gol costs should update forecasts", async () => {
    const context       = new TestContext();
    const testData      = context.testData;
    const partner       = testData.createPartner();
    const costCat       = testData.createCostCategory();
    const periodId      = 1;
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => x.Acc_LatestForecastCost__c = 123);
    testData.createClaimDetail(costCat, partner, periodId - 1, x => x.Acc_PeriodCostCategoryTotal__c = 1000);
    testData.createProfileTotalCostCategory(costCat, partner, 1500);

    const dto: ForecastDetailsDTO[] = [{
      periodId,
      id: profileDetail.Id,
      costCategoryId: costCat.Id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 500
    }];

    const command = new UpdateForecastDetailsCommand(partner.Id, periodId, dto);
    await context.runCommand(command);

    expect(context.repositories.profileDetails.Items.find(x => x.Id === profileDetail.Id).Acc_LatestForecastCost__c).toBe(500);
  });

  it("total costs less than gol costs should update forecasts", async () => {
    const context        = new TestContext();
    const testData       = context.testData;
    const partner        = testData.createPartner();
    const costCat        = testData.createCostCategory();
    const periodId       = 1;
    const profileDetail  = testData.createProfileDetail(costCat, partner, periodId, x => x.Acc_LatestForecastCost__c = 123);
    const profileDetail2 = testData.createProfileDetail(costCat, partner, periodId + 1, x => x.Acc_LatestForecastCost__c = 123);
    testData.createClaimDetail(costCat, partner, periodId - 1, x => x.Acc_PeriodCostCategoryTotal__c = 1000);
    testData.createProfileTotalCostCategory(costCat, partner, 1500);

    const dto: ForecastDetailsDTO[] = [{
      periodId,
      id: profileDetail.Id,
      costCategoryId: costCat.Id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 250
    },
    {
      periodId: periodId + 1,
      id: profileDetail2.Id,
      costCategoryId: costCat.Id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 100
    }];

    const command = new UpdateForecastDetailsCommand(partner.Id, periodId, dto);
    await context.runCommand(command);

    expect(context.repositories.profileDetails.Items.find(x => x.Id === profileDetail.Id).Acc_LatestForecastCost__c).toBe(250);
    expect(context.repositories.profileDetails.Items.find(x => x.Id === profileDetail2.Id).Acc_LatestForecastCost__c).toBe(100);
  });

  it("when updating forecast for period < project period id, expect exception", async () => {
    const context  = new TestContext();
    const testData = context.testData;

    const periodId  = 1;
    const startDate = DateTime.local().minus({ months: 6 });
    const endDate   = DateTime.local().plus({ months: 6 });

    const project   = testData.createProject(x => {
      x.Acc_ClaimFrequency__c = "Monthly";
      x.Acc_StartDate__c      = startDate.toFormat("yyyy-MM-dd");
      x.Acc_EndDate__c        = endDate.toFormat("yyyy-MM-dd");
    });
    const partner       = testData.createPartner(project);
    const costCat       = testData.createCostCategory();
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => x.Acc_LatestForecastCost__c = 123);
    const partnerId     = profileDetail.Acc_ProjectParticipant__c;
    const dto: ForecastDetailsDTO[] = [{
      periodId,
      id: profileDetail.Id,
      costCategoryId: costCat.Id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 500
    }];
    testData.createClaimDetail(costCat, partner, periodId - 1, x => x.Acc_PeriodCostCategoryTotal__c = 1000);
    testData.createProfileTotalCostCategory(costCat, partner, 1500);

    const command = new UpdateForecastDetailsCommand(partnerId, periodId, dto, false);
    await expect(context.runCommand(command)).rejects.toThrow(Error);
  });
});

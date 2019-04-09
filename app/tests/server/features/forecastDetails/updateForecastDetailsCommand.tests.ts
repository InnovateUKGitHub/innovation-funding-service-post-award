// tslint:disable: no-duplicate-string no-big-function no-identical-functions
import { TestContext } from "../../testContextProvider";
import { UpdateForecastDetailsCommand } from "../../../../src/server/features/forecastDetails";
import { DateTime } from "luxon";
import { ClaimFrequency, ClaimStatus } from "../../../../src/types";
import { BadRequestError, ValidationError } from "../../../../src/server/features/common/appError";

describe("UpdateForecastDetailsCommand", () => {
  it("when id not set expect validation exception", async () => {
    const context = new TestContext();

    const profileDetail = context.testData.createProfileDetail();
    const project = context.testData.createProject();
    const partnerId = profileDetail.Acc_ProjectParticipant__c;
    const dto: ForecastDetailsDTO[] = [{
      id: null,
      costCategoryId: profileDetail.Acc_CostCategory__c,
      periodId: parseInt(profileDetail.Acc_CostCategory__c, 10),
      periodStart: new Date(profileDetail.Acc_ProjectPeriodStartDate__c),
      periodEnd: new Date(profileDetail.Acc_ProjectPeriodEndDate__c),
      value: 123
    } as any];

    const command = new UpdateForecastDetailsCommand(project.Id, partnerId, dto, false);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("total costs exceed gol costs", async () => {
    const context = new TestContext();
    const testData = context.testData;
    const partner = testData.createPartner();
    const costCat = testData.createCostCategory();
    const periodId = 2;
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => x.Acc_LatestForecastCost__c = 123);
    testData.createClaim(partner, periodId - 1, x => x.Acc_TotalCostsSubmitted__c = 1000);
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

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__c, partner.Id, dto, false);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("should throw Bad Request Error if current claim does not exist", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const periodId = 1;

    const project = testData.createProject();
    const partner = testData.createPartner(project);
    const costCat = testData.createCostCategory();
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => x.Acc_LatestForecastCost__c = 123);

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

    const command = new UpdateForecastDetailsCommand(project.Id, partner.Id, dto, true);

    await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
  });

  it("total costs equal gol costs should update forecasts", async () => {
    const context = new TestContext();
    const testData = context.testData;
    const partner = testData.createPartner();
    const costCat = testData.createCostCategory();
    const periodId = 1;
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

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__c, partner.Id, dto, false);
    await context.runCommand(command);

    expect(context.repositories.profileDetails.Items.find(x => x.Id === profileDetail.Id)!.Acc_LatestForecastCost__c).toBe(500);
  });

  it("total costs less than gol costs should update forecasts", async () => {
    const context = new TestContext();
    const testData = context.testData;
    const partner = testData.createPartner();
    const costCat = testData.createCostCategory();
    const periodId = 1;
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => x.Acc_LatestForecastCost__c = 123);
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

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__c, partner.Id, dto, false);
    await context.runCommand(command);

    expect(context.repositories.profileDetails.Items.find(x => x.Id === profileDetail.Id)!.Acc_LatestForecastCost__c).toBe(250);
    expect(context.repositories.profileDetails.Items.find(x => x.Id === profileDetail2.Id)!.Acc_LatestForecastCost__c).toBe(100);
  });

  it("should update claim status from DRAFT to SUBMITTED", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const periodId = 1;

    const project = testData.createProject();
    const partner = testData.createPartner(project);
    const costCat = testData.createCostCategory();
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => x.Acc_LatestForecastCost__c = 123);
    const claim = testData.createClaim(partner, periodId);

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

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__c, partner.Id, dto, true);
    await context.runCommand(command);
    expect(context.repositories.claims.Items.find(x => x.Id === claim.Id)!.Acc_ClaimStatus__c).toBe(ClaimStatus.SUBMITTED);
  });

  it("should update claim status from MO_QUERIED to SUBMITTED", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const periodId = 1;

    const project = testData.createProject();
    const partner = testData.createPartner(project);
    const costCat = testData.createCostCategory();
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => x.Acc_LatestForecastCost__c = 123);
    const claim = testData.createClaim(partner, periodId, (item) => {
      item.Acc_ClaimStatus__c = ClaimStatus.MO_QUERIED;
    });

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

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__c, partner.Id, dto, true);
    await context.runCommand(command);
    expect(context.repositories.claims.Items.find(x => x.Id === claim.Id)!.Acc_ClaimStatus__c).toBe(ClaimStatus.SUBMITTED);
  });

  it("should update claim status from INNOVATE_QUERIED to AWAITING_IUK_APPROVAL", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const periodId = 1;

    const project = testData.createProject();
    const partner = testData.createPartner(project);
    const costCat = testData.createCostCategory();
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => x.Acc_LatestForecastCost__c = 123);
    const claim = testData.createClaim(partner, periodId, (item) => {
      item.Acc_ClaimStatus__c = ClaimStatus.INNOVATE_QUERIED;
    });

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

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__c, partner.Id, dto, true);
    await context.runCommand(command);
    expect(context.repositories.claims.Items.find(x => x.Id === claim.Id)!.Acc_ClaimStatus__c).toBe(ClaimStatus.AWAITING_IUK_APPROVAL);
  });

  it("should throw an error if invalid claim status when updating forecast", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const periodId = 1;

    const project = testData.createProject();
    const partner = testData.createPartner(project);
    const costCat = testData.createCostCategory();
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => x.Acc_LatestForecastCost__c = 123);
    testData.createClaim(partner, periodId);

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

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__c, partner.Id, dto, true);
    await context.runCommand(command);
    await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
  });

  it("when updating forecast for period < project period id, expect exception", async () => {
    const context = new TestContext();
    const testData = context.testData;

    const periodId = 1;
    const startDate = DateTime.local().minus({ months: 6 });
    const endDate = DateTime.local().plus({ months: 6 });

    const project = testData.createProject(x => {
      x.Acc_ClaimFrequency__c = "Monthly";
      x.Acc_StartDate__c = startDate.toFormat("yyyy-MM-dd");
      x.Acc_EndDate__c = endDate.toFormat("yyyy-MM-dd");
    });
    const partner = testData.createPartner(project);
    const costCat = testData.createCostCategory();
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => x.Acc_LatestForecastCost__c = 123);
    const partnerId = profileDetail.Acc_ProjectParticipant__c;
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

    const command = new UpdateForecastDetailsCommand(project.Id, partnerId, dto, false);
    await expect(context.runCommand(command)).rejects.toMatchObject(new BadRequestError("You can't update the forecast of approved periods."));
  });

  it("when project in period 2 and period 1 updated expect exception", async () => {

    const context = new TestContext();

    const projectStart = DateTime.local().set({ day: 1 }).minus({ months: 2 });
    const projectEnd = projectStart.plus({ months: 1, days: -1 });

    const project = context.testData.createProject(x => {
      x.Acc_StartDate__c = projectStart.toFormat("yyyy-MM-dd");
      x.Acc_EndDate__c = projectEnd.toFormat("yyyy-MM-dd");
    });

    const partner = context.testData.createPartner(project);
    const costCat = context.testData.createCostCategory();

    context.testData.createProfileTotalCostCategory(costCat, partner, 1000000);

    const profileDetail = context.testData.createProfileDetail(costCat, partner, 1, x => x.Acc_LatestForecastCost__c = 1);

    const update = [{
      id: profileDetail.Id,
      costCategoryId: profileDetail.Acc_CostCategory__c,
      periodId: profileDetail.Acc_ProjectPeriodNumber__c,
      periodStart: projectStart.toJSDate(),
      periodEnd: projectStart.plus({ months: 1, days: -1 }).toJSDate(),
      value: profileDetail.Acc_LatestForecastCost__c + 1
    }];

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__c, partner.Id, update, false);
    await expect(context.runCommand(command)).rejects.toMatchObject(new BadRequestError("You can't update the forecast of approved periods."));

  });

  it("when project in period 2 and period 1 updated expect exception", async () => {

    const context = new TestContext();

    const projectStart = DateTime.local().minus({ months: 1 }).set({ day: 1 });
    const projectEnd = projectStart.plus({ months: 2 }).minus({ days: 1 });

    const project = context.testData.createProject(x => {
      x.Acc_StartDate__c = projectStart.toFormat("yyyy-MM-dd");
      x.Acc_EndDate__c = projectEnd.toFormat("yyyy-MM-dd");
    });

    const partner = context.testData.createPartner(project);
    const costCat = context.testData.createCostCategory();

    context.testData.createProfileTotalCostCategory(costCat, partner, 1000000);

    const profileDetail1 = context.testData.createProfileDetail(costCat, partner, 1, x => x.Acc_LatestForecastCost__c = 10);
    const profileDetail2 = context.testData.createProfileDetail(costCat, partner, 2, x => x.Acc_LatestForecastCost__c = 20);

    const dtos = [profileDetail1, profileDetail2].map((profileDetail, i) => ({
      id: profileDetail.Id,
      costCategoryId: profileDetail.Acc_CostCategory__c,
      periodId: profileDetail.Acc_ProjectPeriodNumber__c,
      periodStart: projectStart.plus({ months: i }).toJSDate(),
      periodEnd: projectStart.plus({ months: i + 1, days: -1 }).toJSDate(),
      value: profileDetail.Acc_LatestForecastCost__c
    }));

    dtos[0].value++;

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__c, partner.Id, dtos, false);
    await expect(context.runCommand(command)).rejects.toMatchObject(new BadRequestError("You can't update the forecast of approved periods."));

  });

  it("when project in period 1 and period 2 updated expect no exception", async () => {

    const context = new TestContext();

    const projectStart = DateTime.local().set({ day: 1 });
    const projectEnd = projectStart.plus({ months: 2 }).minus({ days: 1 });

    const project = context.testData.createProject(x => {
      x.Acc_StartDate__c = projectStart.toFormat("yyyy-MM-dd");
      x.Acc_EndDate__c = projectEnd.toFormat("yyyy-MM-dd");
      x.Acc_ClaimFrequency__c = ClaimFrequency[ClaimFrequency.Monthly];
    });

    const partner = context.testData.createPartner(project);
    const costCat = context.testData.createCostCategory();

    context.testData.createProfileTotalCostCategory(costCat, partner, 1000000);

    const profileDetail1 = context.testData.createProfileDetail(costCat, partner, 1, x => x.Acc_LatestForecastCost__c = 10);
    const profileDetail2 = context.testData.createProfileDetail(costCat, partner, 2, x => x.Acc_LatestForecastCost__c = 20);

    const dtos: ForecastDetailsDTO[] = [profileDetail1, profileDetail2].map((profileDetail, i) => ({
      id: profileDetail.Id,
      costCategoryId: profileDetail.Acc_CostCategory__c,
      periodId: profileDetail.Acc_ProjectPeriodNumber__c,
      periodStart: projectStart.plus({ months: i }).toJSDate(),
      periodEnd: projectStart.plus({ months: i + 1, days: -1 }).toJSDate(),
      value: profileDetail.Acc_LatestForecastCost__c
    }));

    dtos[1].value++;

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__c, partner.Id, dtos, false);
    await expect(context.runCommand(command)).resolves.toBe(true);

  });

  it("when total forcast exceeds goal costs expect exception", async () => {

    const context = new TestContext();

    const projectStart = DateTime.local().set({ day: 1 });
    const projectEnd = projectStart.plus({ months: 2 }).minus({ days: 1 });

    const project = context.testData.createProject(x => {
      x.Acc_StartDate__c = projectStart.toFormat("yyyy-MM-dd");
      x.Acc_EndDate__c = projectEnd.toFormat("yyyy-MM-dd");
      x.Acc_ClaimFrequency__c = ClaimFrequency[ClaimFrequency.Monthly];
    });

    const partner = context.testData.createPartner(project);
    const costCat = context.testData.createCostCategory();

    context.testData.createProfileTotalCostCategory(costCat, partner, 100);

    const profileDetail1 = context.testData.createProfileDetail(costCat, partner, 1, x => x.Acc_LatestForecastCost__c = 100);
    const profileDetail2 = context.testData.createProfileDetail(costCat, partner, 2, x => x.Acc_LatestForecastCost__c = 0);

    const dtos: ForecastDetailsDTO[] = [profileDetail1, profileDetail2].map((profileDetail, i) => ({
      id: profileDetail.Id,
      costCategoryId: profileDetail.Acc_CostCategory__c,
      periodId: profileDetail.Acc_ProjectPeriodNumber__c,
      periodStart: projectStart.plus({ months: i }).toJSDate(),
      periodEnd: projectStart.plus({ months: i + 1, days: -1 }).toJSDate(),
      value: profileDetail.Acc_LatestForecastCost__c
    }));

    dtos[1].value++;

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__c, partner.Id, dtos, false);
    let error!: ValidationError;

    await context.runCommand(command).catch(e => error = e);

    expect(error).not.toBeNull();
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.results!.isValid).toBe(false);
    expect(error.results!.errors.map(x => x.errorMessage)).toEqual(["Your overall total cannot be higher than your total eligible costs."]);
  });

  it("will ignore calculated cost categories", async () => {
    const context = new TestContext();

    const updateableCostCateogry = context.testData.createCostCategory();
    const calculatedCostCateogry = context.testData.createCostCategory(x => x.Acc_CostCategoryName__c = "Overheads");

    const projectStart = DateTime.local().set({ day: 1 });
    const projectEnd = projectStart.plus({ months: 2 }).minus({ days: 1 });

    const project = context.testData.createProject(x => {
      x.Acc_StartDate__c = projectStart.toFormat("yyyy-MM-dd");
      x.Acc_EndDate__c = projectEnd.toFormat("yyyy-MM-dd");
      x.Acc_ClaimFrequency__c = ClaimFrequency[ClaimFrequency.Monthly];
    });

    const partner = context.testData.createPartner(project);

    context.testData.createProfileTotalCostCategory(updateableCostCateogry, partner, 1500);
    context.testData.createProfileTotalCostCategory(calculatedCostCateogry, partner, 1500);

    const profileDetail1 = context.testData.createProfileDetail(updateableCostCateogry, partner, 2, x => x.Acc_LatestForecastCost__c = 1000);
    const profileDetail2 = context.testData.createProfileDetail(calculatedCostCateogry, partner, 2, x => x.Acc_LatestForecastCost__c = 100);

    const dtos = [profileDetail1, profileDetail2].map((profileDetail, i) => ({
      id: profileDetail.Id,
      costCategoryId: profileDetail.Acc_CostCategory__c,
      periodId: profileDetail.Acc_ProjectPeriodNumber__c,
      periodStart: projectStart.plus({ months: i }).toJSDate(),
      periodEnd: projectStart.plus({ months: i + 1, days: -1 }).toJSDate(),
      value: 500
    }));

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__c, partner.Id, dtos, false);

    await context.runCommand(command);

    expect(profileDetail1.Acc_LatestForecastCost__c).toBe(500);
    expect(profileDetail2.Acc_LatestForecastCost__c).toBe(100);

  });
});

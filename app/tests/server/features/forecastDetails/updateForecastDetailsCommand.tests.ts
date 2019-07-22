// tslint:disable: no-duplicate-string no-big-function no-identical-functions
import { DateTime } from "luxon";
import { TestContext } from "../../testContextProvider";
import { UpdateForecastDetailsCommand } from "@server/features/forecastDetails";
import { BadRequestError, ValidationError } from "@server/features/common/appError";
import { ClaimFrequency, ClaimStatus } from "@framework/types";
import { ISalesforceProfileDetails } from "@server/repositories";

const mapProfileValue = (item: ISalesforceProfileDetails, value?: number): ForecastDetailsDTO => {
  return {
    costCategoryId: item.Acc_CostCategory__c,
    id: item.Id,
    periodEnd: new Date(),
    periodStart: new Date(),
    periodId: item.Acc_ProjectPeriodNumber__c,
    value: value === undefined ? item.Acc_LatestForecastCost__c : value,
  };
};

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
    const project = testData.createProject();
    const partner = testData.createPartner();
    const costCat = testData.createCostCategory();
    const periodId = 2;
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => x.Acc_LatestForecastCost__c = 123);
    testData.createClaim(partner, periodId - 1, x => x.Acc_TotalCostsSubmitted__c = 1000);
    testData.createClaimDetail(project, costCat, partner, periodId - 1, x => x.Acc_PeriodCostCategoryTotal__c = 1000);
    testData.createProfileTotalCostCategory(costCat, partner, 1500);

    const dto: ForecastDetailsDTO[] = [{
      periodId,
      id: profileDetail.Acc_CostCategory__c,
      costCategoryId: costCat.id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 501
    }];

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__r.Id, partner.Id, dto, false);
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
      costCategoryId: costCat.id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 500
    }];
    testData.createClaimDetail(project, costCat, partner, periodId - 1, x => x.Acc_PeriodCostCategoryTotal__c = 1000);
    testData.createProfileTotalCostCategory(costCat, partner, 1500);

    const command = new UpdateForecastDetailsCommand(project.Id, partner.Id, dto, true);

    await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
  });

  it("total costs equal gol costs should update forecasts", async () => {
    const context = new TestContext();
    const testData = context.testData;
    const project = testData.createProject();
    const partner = testData.createPartner();
    const costCat = testData.createCostCategory();
    const periodId = 1;
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => x.Acc_LatestForecastCost__c = 123);
    testData.createClaimDetail(project, costCat, partner, periodId - 1, x => x.Acc_PeriodCostCategoryTotal__c = 1000);
    testData.createProfileTotalCostCategory(costCat, partner, 1500);

    const dto: ForecastDetailsDTO[] = [{
      periodId,
      id: profileDetail.Id,
      costCategoryId: costCat.id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 500
    }];

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__r.Id, partner.Id, dto, false);
    await context.runCommand(command);

    expect(context.repositories.profileDetails.Items.find(x => x.Id === profileDetail.Id)!.Acc_LatestForecastCost__c).toBe(500);
  });

  it("total costs less than gol costs should update forecasts", async () => {
    const context = new TestContext();
    const testData = context.testData;
    const project = testData.createProject();
    const partner = testData.createPartner();
    const costCat = testData.createCostCategory();
    const periodId = 1;
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => x.Acc_LatestForecastCost__c = 123);
    const profileDetail2 = testData.createProfileDetail(costCat, partner, periodId + 1, x => x.Acc_LatestForecastCost__c = 123);
    testData.createClaimDetail(project, costCat, partner, periodId - 1, x => x.Acc_PeriodCostCategoryTotal__c = 1000);
    testData.createProfileTotalCostCategory(costCat, partner, 1500);

    const dto: ForecastDetailsDTO[] = [{
      periodId,
      id: profileDetail.Id,
      costCategoryId: costCat.id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 250
    },
    {
      periodId: periodId + 1,
      id: profileDetail2.Id,
      costCategoryId: costCat.id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 100
    }];

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__r.Id, partner.Id, dto, false);
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
      costCategoryId: costCat.id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 500
    }];
    testData.createClaimDetail(project, costCat, partner, periodId - 1, x => x.Acc_PeriodCostCategoryTotal__c = 1000);
    testData.createProfileTotalCostCategory(costCat, partner, 1500);

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__r.Id, partner.Id, dto, true);
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
      costCategoryId: costCat.id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 500
    }];
    testData.createClaimDetail(project, costCat, partner, periodId - 1, x => x.Acc_PeriodCostCategoryTotal__c = 1000);
    testData.createProfileTotalCostCategory(costCat, partner, 1500);

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__r.Id, partner.Id, dto, true);
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
      costCategoryId: costCat.id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 500
    }];
    testData.createClaimDetail(project, costCat, partner, periodId - 1, x => x.Acc_PeriodCostCategoryTotal__c = 1000);
    testData.createProfileTotalCostCategory(costCat, partner, 1500);

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__r.Id, partner.Id, dto, true);
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
      costCategoryId: costCat.id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 500
    }];
    testData.createClaimDetail(project, costCat, partner, periodId - 1, x => x.Acc_PeriodCostCategoryTotal__c = 1000);
    testData.createProfileTotalCostCategory(costCat, partner, 1500);

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__r.Id, partner.Id, dto, true);
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
      costCategoryId: costCat.id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 500
    }];
    testData.createClaimDetail(project, costCat, partner, periodId - 1, x => x.Acc_PeriodCostCategoryTotal__c = 1000);
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

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__r.Id, partner.Id, update, false);
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

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__r.Id, partner.Id, dtos, false);
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

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__r.Id, partner.Id, dtos, false);
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

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__r.Id, partner.Id, dtos, false);
    let error!: ValidationError;

    await context.runCommand(command).catch(e => error = e);

    expect(error).not.toBeNull();
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.results!.isValid).toBe(false);
    expect(error.results!.errors.map(x => x.errorMessage)).toEqual(["Your overall total cannot be higher than your total eligible costs."]);
  });

  it("when submitted creates status change record", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);

    const claim = context.testData.createClaim(partner, 1);
    claim.Acc_ClaimStatus__c = ClaimStatus.DRAFT;
    claim.Acc_ReasonForDifference__c = "Original Comments";

    const dto: ForecastDetailsDTO[] = [

    ];

    const command = new UpdateForecastDetailsCommand(partner.Acc_ProjectId__r.Id, partner.Id, dto, true);

    await context.runCommand(command);

    expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.SUBMITTED);
    expect(claim.Acc_ReasonForDifference__c).toBe("");

    expect(context.repositories.claimStatusChanges.Items.length).toBe(1);
    expect(context.repositories.claimStatusChanges.Items[0].Acc_ExternalComment__c).toBe("Original Comments");

  });

  it("when labour updated overheads should be updated to value calulated from labour value", async () => {
    const context = new TestContext();

    const labour = context.testData.createCostCategory({ hasRelated: true });
    const overheads = context.testData.createCostCategory({ isCalculated: true });

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    partner.Acc_OverheadRate__c = 10;

    context.testData.createProfileTotalCostCategory(labour, partner, 1000);
    context.testData.createProfileTotalCostCategory(overheads, partner, 100);

    const labourProfile = context.testData.createProfileDetail(labour, partner, 1, x => x.Acc_LatestForecastCost__c = 100);
    const overheadProfile = context.testData.createProfileDetail(overheads, partner, 1, x => x.Acc_LatestForecastCost__c = 10);

    const dto: ForecastDetailsDTO[] = [
      mapProfileValue(labourProfile, 1000),
      mapProfileValue(overheadProfile, 10)
    ];

    const command = new UpdateForecastDetailsCommand(project.Id, partner.Id, dto, false);

    await context.runCommand(command);

    expect(labourProfile.Acc_LatestForecastCost__c).toBe(1000);
    expect(overheadProfile.Acc_LatestForecastCost__c).toBe(100);
  });

  it("when multiple labour updated overheads should be updated to calulated value for correct period", async () => {
    const context = new TestContext();

    const labour = context.testData.createCostCategory({ hasRelated: true });
    const overheads = context.testData.createCostCategory({ isCalculated: true });

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    partner.Acc_OverheadRate__c = 10;

    context.testData.createProfileTotalCostCategory(labour, partner, 3000);
    context.testData.createProfileTotalCostCategory(overheads, partner, 300);

    const labourProfile1 = context.testData.createProfileDetail(labour, partner, 1, x => x.Acc_LatestForecastCost__c = 100);
    const overheadProfile1 = context.testData.createProfileDetail(overheads, partner, 1, x => x.Acc_LatestForecastCost__c = 10);
    const labourProfile2 = context.testData.createProfileDetail(labour, partner, 2, x => x.Acc_LatestForecastCost__c = 100);
    const overheadProfile2 = context.testData.createProfileDetail(overheads, partner, 2, x => x.Acc_LatestForecastCost__c = 10);

    const dto: ForecastDetailsDTO[] = [
      mapProfileValue(labourProfile1, 1000),
      mapProfileValue(overheadProfile1),
      mapProfileValue(labourProfile2, 2000),
      mapProfileValue(overheadProfile2),
    ];

    const command = new UpdateForecastDetailsCommand(project.Id, partner.Id, dto, false);

    await context.runCommand(command);

    expect(labourProfile1.Acc_LatestForecastCost__c).toBe(1000);
    expect(overheadProfile1.Acc_LatestForecastCost__c).toBe(100);
    expect(labourProfile2.Acc_LatestForecastCost__c).toBe(2000);
    expect(overheadProfile2.Acc_LatestForecastCost__c).toBe(200);
  });

  it("when labour not supplied overheads should be updated to calculation from exising labour value", async () => {
    const context = new TestContext();

    const labour = context.testData.createCostCategory({ hasRelated: true });
    const overheads = context.testData.createCostCategory({ isCalculated: true });

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    partner.Acc_OverheadRate__c = 10;

    context.testData.createProfileTotalCostCategory(labour, partner, 1000);
    context.testData.createProfileTotalCostCategory(overheads, partner, 100);

    const labourProfile1 = context.testData.createProfileDetail(labour, partner, 1, x => x.Acc_LatestForecastCost__c = 100);
    const overheadProfile1 = context.testData.createProfileDetail(overheads, partner, 1, x => x.Acc_LatestForecastCost__c = 1);
    const labourProfile2 = context.testData.createProfileDetail(labour, partner, 2, x => x.Acc_LatestForecastCost__c = 200);
    const overheadProfile2 = context.testData.createProfileDetail(overheads, partner, 2, x => x.Acc_LatestForecastCost__c = 1);

    const dto: ForecastDetailsDTO[] = [
      mapProfileValue(overheadProfile1, 1),
      mapProfileValue(overheadProfile2, 1),
    ];

    const command = new UpdateForecastDetailsCommand(project.Id, partner.Id, dto, false);

    await context.runCommand(command);

    expect(labourProfile1.Acc_LatestForecastCost__c).toBe(100);
    expect(overheadProfile1.Acc_LatestForecastCost__c).toBe(10);
    expect(labourProfile2.Acc_LatestForecastCost__c).toBe(200);
    expect(overheadProfile2.Acc_LatestForecastCost__c).toBe(20);
  });

  it("when overheads calculated in salesforece should not calculate overheads", async () => {
    const context = new TestContext();
    context.config.features.calculateOverheads = false;

    const labour = context.testData.createCostCategory({ hasRelated: true });
    const overheads = context.testData.createCostCategory({ isCalculated: true });

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project);
    partner.Acc_OverheadRate__c = 10;

    context.testData.createProfileTotalCostCategory(labour, partner, 1000);
    context.testData.createProfileTotalCostCategory(overheads, partner, 100);

    const labourProfile = context.testData.createProfileDetail(labour, partner, 1, x => x.Acc_LatestForecastCost__c = 100);
    const overheadProfile = context.testData.createProfileDetail(overheads, partner, 1, x => x.Acc_LatestForecastCost__c = 10);

    const dto: ForecastDetailsDTO[] = [
      mapProfileValue(labourProfile, 1000),
      mapProfileValue(overheadProfile, 10)
    ];

    const command = new UpdateForecastDetailsCommand(project.Id, partner.Id, dto, false);

    await context.runCommand(command);

    expect(labourProfile.Acc_LatestForecastCost__c).toBe(1000);
    expect(overheadProfile.Acc_LatestForecastCost__c).toBe(10);
  });

});

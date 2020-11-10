import { TestContext } from "../../testContextProvider";
import { UpdateInitialForecastDetailsCommand } from "@server/features/forecastDetails";
import { BadRequestError, ValidationError } from "@server/features/common/appError";
import { ISalesforceProfileDetails } from "@server/repositories";
import { GetByIdQuery } from "@server/features/partners";
import { ForecastDetailsDTO, ProjectRole, SpendProfileStatus } from "@framework/dtos";
import { Authorisation } from "@framework/types";

const mapProfileValue = (item: ISalesforceProfileDetails, value?: number): ForecastDetailsDTO => {
  return {
    costCategoryId: item.Acc_CostCategory__c,
    id: item.Id,
    periodEnd: new Date(),
    periodStart: new Date(),
    periodId: item.Acc_ProjectPeriodNumber__c,
    value: value === undefined ? item.Acc_InitialForecastCost__c : value,
  };
};

// tslint:disable-next-line:no-big-function
describe("UpdateInitialForecastDetailsCommand", () => {
  it("when id not set expect validation exception", async () => {
    const context = new TestContext();

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project, x => x.participantStatus = "Pending");
    const profileDetail = context.testData.createProfileDetail(undefined, partner);
    const dto: ForecastDetailsDTO[] = [{
      id: null,
      costCategoryId: profileDetail.Acc_CostCategory__c,
      periodId: parseInt(profileDetail.Acc_CostCategory__c, 10),
      periodStart: new Date(profileDetail.Acc_ProjectPeriodStartDate__c),
      periodEnd: new Date(profileDetail.Acc_ProjectPeriodEndDate__c),
      value: 123
    } as any];

    const command = new UpdateInitialForecastDetailsCommand(project.Id, partner.id, dto, false);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("throws a validation error if total costs exceed gol costs when submitting", async () => {
    const context = new TestContext();
    const testData = context.testData;
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project, x => x.participantStatus = "Pending");
    const costCat = testData.createCostCategory();
    const periodId = 2;
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => x.Acc_InitialForecastCost__c = 123);
    testData.createProfileTotalCostCategory(costCat, partner, 1500);

    const dto: ForecastDetailsDTO[] = [{
      periodId,
      id: profileDetail.Acc_CostCategory__c,
      costCategoryId: costCat.id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 501
    }];

    const command = new UpdateInitialForecastDetailsCommand(partner.projectId, partner.id, dto, true);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("throws a bad request error if the partner status is not pending", async () => {
    const context = new TestContext();
    const testData = context.testData;
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project, x => x.participantStatus = "Active");
    const costCat = testData.createCostCategory();
    const periodId = 2;
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId);
    testData.createProfileTotalCostCategory(costCat, partner, 150);

    const dto: ForecastDetailsDTO[] = [{
      periodId,
      id: profileDetail.Acc_CostCategory__c,
      costCategoryId: costCat.id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 150
    }];

    const command = new UpdateInitialForecastDetailsCommand(partner.projectId, partner.id, dto, true);
    await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
  });

  // tslint:disable-next-line:no-identical-functions
  it("throws a validation error if total costs are less than gol costs when submitting", async () => {
    const context = new TestContext();
    const testData = context.testData;
    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project, x => x.participantStatus = "Pending");
    const costCat = testData.createCostCategory();
    const periodId = 2;
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => x.Acc_InitialForecastCost__c = 1400);
    testData.createProfileTotalCostCategory(costCat, partner, 1500);

    const dto: ForecastDetailsDTO[] = [{
      periodId,
      id: profileDetail.Acc_CostCategory__c,
      costCategoryId: costCat.id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 3000
    }];

    const command = new UpdateInitialForecastDetailsCommand(partner.projectId, partner.id, dto, true);
    await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
  });

  it("should update forecasts and initial when forecast is valid and submit === true", async () => {
    const context = new TestContext();
    const testData = context.testData;
    const project = testData.createProject();
    const partner = context.testData.createPartner(project, x => {
      x.participantStatus = "Pending";
      x.spendProfileStatus = "To Do";
    });
    const costCat = testData.createCostCategory();
    const periodId = 1;
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => {
      x.Acc_InitialForecastCost__c = 1400;
      x.Acc_LatestForecastCost__c = 0;
    });
    testData.createProfileTotalCostCategory(costCat, partner, 1500);

    const dto: ForecastDetailsDTO[] = [{
      periodId,
      id: profileDetail.Id,
      costCategoryId: costCat.id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 1500
    }];

    const command = new UpdateInitialForecastDetailsCommand(partner.projectId, partner.id, dto, true);
    await context.runCommand(command);

    const item = context.repositories.profileDetails.Items.find(x => x.Id === profileDetail.Id)!;
    expect(item.Acc_InitialForecastCost__c).toBe(1500);
    expect(item.Acc_LatestForecastCost__c).toBe(1500);
    const partnerDto = await context.runQuery(new GetByIdQuery(partner.id));
    expect(partnerDto.spendProfileStatus).toEqual(SpendProfileStatus.Complete);
  });

  it("should update initial forecasts when forecast is invalid and submit === false", async () => {
    const context = new TestContext();
    const testData = context.testData;
    const project = testData.createProject();
    const partner = context.testData.createPartner(project, x => {
      x.participantStatus = "Pending";
      x.spendProfileStatus = "To Do";
    });
    const costCat = testData.createCostCategory();
    const periodId = 1;
    const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => {
      x.Acc_InitialForecastCost__c = 1400;
      x.Acc_LatestForecastCost__c = 0;
    });
    testData.createProfileTotalCostCategory(costCat, partner, 1500);

    const dto: ForecastDetailsDTO[] = [{
      periodId,
      id: profileDetail.Id,
      costCategoryId: costCat.id,
      periodStart: new Date(),
      periodEnd: new Date(),
      value: 100
    }];

    const command = new UpdateInitialForecastDetailsCommand(partner.projectId, partner.id, dto, false);
    await context.runCommand(command);

    const item = context.repositories.profileDetails.Items.find(x => x.Id === profileDetail.Id)!;
    expect(item.Acc_InitialForecastCost__c).toBe(100);
    expect(item.Acc_LatestForecastCost__c).toBe(0);
    const partnerDto = await context.runQuery(new GetByIdQuery(partner.id));
    expect(partnerDto.spendProfileStatus).toEqual(SpendProfileStatus.Incomplete);
  });

  it("overheads should be ignored", async () => {
    const context = new TestContext();

    const overheads = context.testData.createCostCategory({ isCalculated: true });

    const originalAmount = 1000;

    const project = context.testData.createProject();
    const partner = context.testData.createPartner(project, x => x.participantStatus = "Pending");
    partner.overheadRate = 10;

    context.testData.createProfileTotalCostCategory(overheads, partner, 100);

    const overheadProfile = context.testData.createProfileDetail(overheads, partner, 1, x => x.Acc_InitialForecastCost__c = originalAmount);

    const dto: ForecastDetailsDTO[] = [
      mapProfileValue(overheadProfile, originalAmount / 10)
    ];

    const command = new UpdateInitialForecastDetailsCommand(project.Id, partner.id, dto, false);

    await context.runCommand(command);

    expect(overheadProfile.Acc_InitialForecastCost__c).toBe(originalAmount);
  });
  describe("accessControl", () => {
    const getCommand = () => {
      const context = new TestContext();
      const testData = context.testData;
      const project = testData.createProject();
      const partner = context.testData.createPartner(project, x => {
        x.participantStatus = "Pending";
        x.spendProfileStatus = "To Do";
      });
      const costCat = testData.createCostCategory();
      const periodId = 1;
      const profileDetail = testData.createProfileDetail(costCat, partner, periodId, x => {
        x.Acc_InitialForecastCost__c = 1400;
        x.Acc_LatestForecastCost__c = 0;
      });
      testData.createProfileTotalCostCategory(costCat, partner, 1500);

      const dto: ForecastDetailsDTO[] = [{
        periodId,
        id: profileDetail.Id,
        costCategoryId: costCat.id,
        periodStart: new Date(),
        periodEnd: new Date(),
        value: 100
      }];

      const command = new UpdateInitialForecastDetailsCommand(partner.projectId, partner.id, dto, false);
      return {project, partner, command, context};
    };
    test("accessControl - Finance Contact passes", async () => {
      const {project, partner, command, context} = getCommand();
      const auth    = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.Unknown,
          partnerRoles: { [partner.id]: ProjectRole.FinancialContact }
        }
      });
      expect(await context.runAccessControl(auth, command)).toBe(true);
    });
    test("accessControl - Everyone else fails", async () => {
      const {project, partner, command, context} = getCommand();
      const auth    = new Authorisation({
        [project.Id]: {
          projectRoles: ProjectRole.FinancialContact | ProjectRole.MonitoringOfficer  | ProjectRole.ProjectManager | ProjectRole.Unknown,
          partnerRoles: {
            [partner.id]: ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer | ProjectRole.Unknown,
            ["other partner"]: ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer | ProjectRole.FinancialContact | ProjectRole.Unknown,
          }
        }
      });
      expect(await context.runAccessControl(auth, command)).toBe(false);
    });
  });
});

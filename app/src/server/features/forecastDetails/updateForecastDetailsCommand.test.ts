import { DateTime } from "luxon";
import { BadRequestError, InActiveProjectError, ValidationError } from "@server/features/common/appError";
import { TestContext } from "@tests/test-utils/testContextProvider";
import { initFullTestIntl, initStubTestIntl } from "@shared/initStubTestIntl";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { ClaimFrequency } from "@framework/constants/enums";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { ISalesforceProfileDetails } from "@server/repositories/profileDetailsRepository";
import { UpdateForecastDetailsCommand } from "./updateForecastDetailsCommand";

const mapProfileValue = (item: ISalesforceProfileDetails, value?: number): ForecastDetailsDTO => {
  return {
    costCategoryId: item.Acc_CostCategory__c as CostCategoryId,
    id: item.Id,
    periodEnd: new Date(),
    periodStart: new Date(),
    periodId: item.Acc_ProjectPeriodNumber__c as PeriodId,
    value: value === undefined ? item.Acc_LatestForecastCost__c : value,
  };
};

describe("UpdateForecastDetailsCommand", () => {
  describe.each(["en-GB", "no"])("With %s i18n", language => {
    beforeAll(async () => {
      if (language === "en-GB") {
        await initFullTestIntl();
      } else {
        await initStubTestIntl();
      }
    });

    it("throws an error when a project is inactive", async () => {
      const context = new TestContext();

      const profileDetail = context.testData.createProfileDetail();
      const project = context.testData.createProject(x => (x.Acc_ProjectStatus__c = "On Hold"));
      const partnerId = profileDetail.Acc_ProjectParticipant__c as PartnerId;
      const dto: ForecastDetailsDTO[] = [
        {
          id: "123",
          costCategoryId: profileDetail.Acc_CostCategory__c as CostCategoryId,
          periodId: parseInt(profileDetail.Acc_CostCategory__c, 10) as PeriodId,
          periodStart: new Date(profileDetail.Acc_ProjectPeriodStartDate__c),
          periodEnd: new Date(profileDetail.Acc_ProjectPeriodEndDate__c),
          value: 123,
        },
      ];

      const command = new UpdateForecastDetailsCommand(project.Id, partnerId, dto, false);
      await expect(context.runCommand(command)).rejects.toThrow(InActiveProjectError);
    });

    it("when id not set expect validation exception", async () => {
      const context = new TestContext();

      const profileDetail = context.testData.createProfileDetail();
      const project = context.testData.createProject();
      const partnerId = profileDetail.Acc_ProjectParticipant__c as PartnerId;
      const dto: ForecastDetailsDTO[] = [
        {
          // @ts-expect-error invalid id scenario
          id: null,
          costCategoryId: profileDetail.Acc_CostCategory__c as CostCategoryId,
          periodId: parseInt(profileDetail.Acc_CostCategory__c, 10) as PeriodId,
          periodStart: new Date(profileDetail.Acc_ProjectPeriodStartDate__c),
          periodEnd: new Date(profileDetail.Acc_ProjectPeriodEndDate__c),
          value: 123,
        },
      ];

      const command = new UpdateForecastDetailsCommand(project.Id, partnerId, dto, false);
      await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    });

    it("total costs exceed gol costs", async () => {
      const context = new TestContext();
      const testData = context.testData;
      const project = testData.createProject();
      const partner = testData.createPartner();
      const costCat = testData.createCostCategory();
      const periodId = 2 as PeriodId;
      const profileDetail = testData.createProfileDetail(
        costCat,
        partner,
        periodId,
        x => (x.Acc_LatestForecastCost__c = 123),
      );
      testData.createClaim(partner, periodId - 1, x => (x.Acc_TotalCostsSubmitted__c = 1000));
      testData.createClaimDetail(
        project,
        costCat,
        partner,
        (periodId - 1) as PeriodId,
        x => (x.Acc_PeriodCostCategoryTotal__c = 1000),
      );
      testData.createProfileTotalCostCategory(costCat, partner, 1500);

      const dto: ForecastDetailsDTO[] = [
        {
          periodId,
          id: profileDetail.Acc_CostCategory__c,
          costCategoryId: costCat.id,
          periodStart: new Date(),
          periodEnd: new Date(),
          value: 501,
        },
      ];

      const command = new UpdateForecastDetailsCommand(partner.projectId, partner.id, dto, false);
      await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    });

    it("should throw Bad Request Error if current claim does not exist", async () => {
      const context = new TestContext();
      const testData = context.testData;

      const periodId = 1 as PeriodId;

      const project = testData.createProject();
      const partner = testData.createPartner(project);
      const costCat = testData.createCostCategory();
      const profileDetail = testData.createProfileDetail(
        costCat,
        partner,
        periodId,
        x => (x.Acc_LatestForecastCost__c = 123),
      );

      const dto: ForecastDetailsDTO[] = [
        {
          periodId,
          id: profileDetail.Id,
          costCategoryId: costCat.id,
          periodStart: new Date(),
          periodEnd: new Date(),
          value: 500,
        },
      ];
      testData.createClaimDetail(
        project,
        costCat,
        partner,
        (periodId - 1) as PeriodId,
        x => (x.Acc_PeriodCostCategoryTotal__c = 1000),
      );
      testData.createProfileTotalCostCategory(costCat, partner, 1500);

      const command = new UpdateForecastDetailsCommand(project.Id, partner.id, dto, true);

      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });

    it("total costs equal gol costs should update forecasts", async () => {
      const context = new TestContext();
      const testData = context.testData;
      const project = testData.createProject();
      const partner = testData.createPartner();
      const costCat = testData.createCostCategory();
      const periodId = 1 as PeriodId;
      const profileDetail = testData.createProfileDetail(
        costCat,
        partner,
        periodId,
        x => (x.Acc_LatestForecastCost__c = 123),
      );
      testData.createClaimDetail(
        project,
        costCat,
        partner,
        (periodId - 1) as PeriodId,
        x => (x.Acc_PeriodCostCategoryTotal__c = 1000),
      );
      testData.createProfileTotalCostCategory(costCat, partner, 1500);

      const dto: ForecastDetailsDTO[] = [
        {
          periodId,
          id: profileDetail.Id,
          costCategoryId: costCat.id,
          periodStart: new Date(),
          periodEnd: new Date(),
          value: 500,
        },
      ];

      const command = new UpdateForecastDetailsCommand(partner.projectId, partner.id, dto, false);
      await context.runCommand(command);

      expect(
        context.repositories.profileDetails.Items.find(x => x.Id === profileDetail.Id)?.Acc_LatestForecastCost__c,
      ).toBe(500);
    });

    it("total costs less than gol costs should update forecasts", async () => {
      const context = new TestContext();
      const testData = context.testData;
      const project = testData.createProject();
      const partner = testData.createPartner();
      const costCat = testData.createCostCategory();
      const periodId = 1 as PeriodId;
      const profileDetail = testData.createProfileDetail(
        costCat,
        partner,
        periodId,
        x => (x.Acc_LatestForecastCost__c = 123),
      );
      const profileDetail2 = testData.createProfileDetail(
        costCat,
        partner,
        periodId + 1,
        x => (x.Acc_LatestForecastCost__c = 123),
      );
      testData.createClaimDetail(
        project,
        costCat,
        partner,
        (periodId - 1) as PeriodId,
        x => (x.Acc_PeriodCostCategoryTotal__c = 1000),
      );
      testData.createProfileTotalCostCategory(costCat, partner, 1500);

      const dto: ForecastDetailsDTO[] = [
        {
          periodId,
          id: profileDetail.Id,
          costCategoryId: costCat.id,
          periodStart: new Date(),
          periodEnd: new Date(),
          value: 250,
        },
        {
          periodId: (periodId + 1) as PeriodId,
          id: profileDetail2.Id,
          costCategoryId: costCat.id,
          periodStart: new Date(),
          periodEnd: new Date(),
          value: 100,
        },
      ];

      const command = new UpdateForecastDetailsCommand(partner.projectId, partner.id, dto, false);
      await context.runCommand(command);

      expect(
        context.repositories.profileDetails.Items.find(x => x.Id === profileDetail.Id)?.Acc_LatestForecastCost__c,
      ).toBe(250);
      expect(
        context.repositories.profileDetails.Items.find(x => x.Id === profileDetail2.Id)?.Acc_LatestForecastCost__c,
      ).toBe(100);
    });

    it("should update claim status from DRAFT to SUBMITTED", async () => {
      const context = new TestContext();
      const testData = context.testData;

      const periodId = 1 as PeriodId;

      const project = testData.createProject();
      const partner = testData.createPartner(project);
      const costCat = testData.createCostCategory();
      const profileDetail = testData.createProfileDetail(
        costCat,
        partner,
        periodId,
        x => (x.Acc_LatestForecastCost__c = 123),
      );
      const claim = testData.createClaim(partner, periodId);

      const dto: ForecastDetailsDTO[] = [
        {
          periodId,
          id: profileDetail.Id,
          costCategoryId: costCat.id,
          periodStart: new Date(),
          periodEnd: new Date(),
          value: 500,
        },
      ];
      testData.createClaimDetail(
        project,
        costCat,
        partner,
        (periodId - 1) as PeriodId,
        x => (x.Acc_PeriodCostCategoryTotal__c = 1000),
      );
      testData.createProfileTotalCostCategory(costCat, partner, 1500);

      const command = new UpdateForecastDetailsCommand(partner.projectId, partner.id, dto, true);
      await context.runCommand(command);
      expect(context.repositories.claims.Items.find(x => x.Id === claim.Id)?.Acc_ClaimStatus__c).toBe(
        ClaimStatus.SUBMITTED,
      );
    });

    it("should update claim status from MO_QUERIED to SUBMITTED", async () => {
      const context = new TestContext();
      const testData = context.testData;

      const periodId = 1 as PeriodId;

      const project = testData.createProject();
      const partner = testData.createPartner(project);
      const costCat = testData.createCostCategory();
      const profileDetail = testData.createProfileDetail(
        costCat,
        partner,
        periodId,
        x => (x.Acc_LatestForecastCost__c = 123),
      );
      const claim = testData.createClaim(partner, periodId, item => {
        item.Acc_ClaimStatus__c = ClaimStatus.MO_QUERIED;
      });

      const dto: ForecastDetailsDTO[] = [
        {
          periodId,
          id: profileDetail.Id,
          costCategoryId: costCat.id,
          periodStart: new Date(),
          periodEnd: new Date(),
          value: 500,
        },
      ];
      testData.createClaimDetail(
        project,
        costCat,
        partner,
        (periodId - 1) as PeriodId,
        x => (x.Acc_PeriodCostCategoryTotal__c = 1000),
      );
      testData.createProfileTotalCostCategory(costCat, partner, 1500);

      const command = new UpdateForecastDetailsCommand(partner.projectId, partner.id, dto, true);
      await context.runCommand(command);
      expect(context.repositories.claims.Items.find(x => x.Id === claim.Id)?.Acc_ClaimStatus__c).toBe(
        ClaimStatus.SUBMITTED,
      );
    });

    it("should update claim status from INNOVATE_QUERIED to AWAITING_IUK_APPROVAL", async () => {
      const context = new TestContext();
      const testData = context.testData;

      const periodId = 1 as PeriodId;

      const project = testData.createProject();
      const partner = testData.createPartner(project);
      const costCat = testData.createCostCategory();
      const profileDetail = testData.createProfileDetail(
        costCat,
        partner,
        periodId,
        x => (x.Acc_LatestForecastCost__c = 123),
      );
      const claim = testData.createClaim(partner, periodId, item => {
        item.Acc_ClaimStatus__c = ClaimStatus.INNOVATE_QUERIED;
      });

      const dto: ForecastDetailsDTO[] = [
        {
          periodId,
          id: profileDetail.Id,
          costCategoryId: costCat.id,
          periodStart: new Date(),
          periodEnd: new Date(),
          value: 500,
        },
      ];
      testData.createClaimDetail(
        project,
        costCat,
        partner,
        (periodId - 1) as PeriodId,
        x => (x.Acc_PeriodCostCategoryTotal__c = 1000),
      );
      testData.createProfileTotalCostCategory(costCat, partner, 1500);

      const command = new UpdateForecastDetailsCommand(partner.projectId, partner.id, dto, true);
      await context.runCommand(command);
      expect(context.repositories.claims.Items.find(x => x.Id === claim.Id)?.Acc_ClaimStatus__c).toBe(
        ClaimStatus.AWAITING_IUK_APPROVAL,
      );
    });

    it("should throw an error if invalid claim status when updating forecast", async () => {
      const context = new TestContext();
      const testData = context.testData;

      const periodId = 1 as PeriodId;

      const project = testData.createProject();
      const partner = testData.createPartner(project);
      const costCat = testData.createCostCategory();
      const profileDetail = testData.createProfileDetail(
        costCat,
        partner,
        periodId,
        x => (x.Acc_LatestForecastCost__c = 123),
      );
      testData.createClaim(partner, periodId);

      const dto: ForecastDetailsDTO[] = [
        {
          periodId,
          id: profileDetail.Id,
          costCategoryId: costCat.id,
          periodStart: new Date(),
          periodEnd: new Date(),
          value: 500,
        },
      ];
      testData.createClaimDetail(
        project,
        costCat,
        partner,
        (periodId - 1) as PeriodId,
        x => (x.Acc_PeriodCostCategoryTotal__c = 1000),
      );
      testData.createProfileTotalCostCategory(costCat, partner, 1500);

      const command = new UpdateForecastDetailsCommand(partner.projectId, partner.id, dto, true);
      await context.runCommand(command);
      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });

    it("when updating forecast amd submitting for period equal to project period id, expect detail to be updated", async () => {
      const context = new TestContext();
      const testData = context.testData;

      const projectPeriodId = 2;
      const claimPeriodId = 1 as PeriodId;
      const startDate = DateTime.local().minus({ months: 1 }).set({ day: 1 });
      const endDate = startDate.plus({ months: 6 });

      const project = testData.createProject(x => {
        x.Acc_ClaimFrequency__c = "Monthly";
        x.Acc_StartDate__c = startDate.toFormat("yyyy-MM-dd");
        x.Acc_EndDate__c = endDate.toFormat("yyyy-MM-dd");
      });
      const partner = testData.createPartner(project);
      const costCat = testData.createCostCategory();
      const previousProfileDetail = testData.createProfileDetail(
        costCat,
        partner,
        claimPeriodId,
        x => (x.Acc_LatestForecastCost__c = 123),
      );
      const currentProfileDetail = testData.createProfileDetail(
        costCat,
        partner,
        projectPeriodId,
        x => (x.Acc_LatestForecastCost__c = 123),
      );

      const dto: ForecastDetailsDTO[] = [
        mapProfileValue(previousProfileDetail),
        mapProfileValue(currentProfileDetail, 246),
      ];

      testData.createClaimDetail(
        project,
        costCat,
        partner,
        claimPeriodId,
        x => (x.Acc_PeriodCostCategoryTotal__c = 123),
      );
      testData.createClaim(partner, claimPeriodId, x => (x.Acc_ClaimStatus__c = ClaimStatus.DRAFT));
      testData.createProfileTotalCostCategory(costCat, partner, 1500);

      const command = new UpdateForecastDetailsCommand(project.Id, partner.id, dto, true);
      await context.runCommand(command);

      expect(currentProfileDetail.Acc_LatestForecastCost__c).toEqual(246);
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

      const profileDetail1 = context.testData.createProfileDetail(
        costCat,
        partner,
        1 as PeriodId,
        x => (x.Acc_LatestForecastCost__c = 10),
      );
      const profileDetail2 = context.testData.createProfileDetail(
        costCat,
        partner,
        2 as PeriodId,
        x => (x.Acc_LatestForecastCost__c = 20),
      );

      const dtos: ForecastDetailsDTO[] = [profileDetail1, profileDetail2].map((profileDetail, i) => ({
        id: profileDetail.Id,
        costCategoryId: profileDetail.Acc_CostCategory__c as CostCategoryId,
        periodId: profileDetail.Acc_ProjectPeriodNumber__c as PeriodId,
        periodStart: projectStart.plus({ months: i }).toJSDate(),
        periodEnd: projectStart.plus({ months: i + 1, days: -1 }).toJSDate(),
        value: profileDetail.Acc_LatestForecastCost__c,
      }));

      dtos[1].value++;

      const command = new UpdateForecastDetailsCommand(partner.projectId, partner.id, dtos, false);
      await expect(context.runCommand(command)).resolves.toBe(true);
    });

    it("when total forecast exceeds goal costs expect exception", async () => {
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

      const profileDetail1 = context.testData.createProfileDetail(
        costCat,
        partner,
        1,
        x => (x.Acc_LatestForecastCost__c = 100),
      );
      const profileDetail2 = context.testData.createProfileDetail(
        costCat,
        partner,
        2,
        x => (x.Acc_LatestForecastCost__c = 0),
      );

      const dtos: ForecastDetailsDTO[] = [profileDetail1, profileDetail2].map((profileDetail, i) => ({
        id: profileDetail.Id,
        costCategoryId: profileDetail.Acc_CostCategory__c as CostCategoryId,
        periodId: profileDetail.Acc_ProjectPeriodNumber__c as PeriodId,
        periodStart: projectStart.plus({ months: i }).toJSDate(),
        periodEnd: projectStart.plus({ months: i + 1, days: -1 }).toJSDate(),
        value: profileDetail.Acc_LatestForecastCost__c,
      }));

      dtos[1].value++;

      const command = new UpdateForecastDetailsCommand(partner.projectId, partner.id, dtos, false);
      let error!: ValidationError;

      await context.runCommand(command).catch(e => (error = e));

      expect(error).not.toBeNull();
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.results?.isValid).toBe(false);
      expect(error.results?.errors.map(x => x.errorMessage)).toMatchSnapshot();
    });

    it("when submitted creates status change record", async () => {
      const context = new TestContext();

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);

      const claim = context.testData.createClaim(partner, 1);
      claim.Acc_ClaimStatus__c = ClaimStatus.DRAFT;
      claim.Acc_ReasonForDifference__c = "Original Comments";

      const dto: ForecastDetailsDTO[] = [];

      const command = new UpdateForecastDetailsCommand(partner.projectId, partner.id, dto, true);

      await context.runCommand(command);

      expect(claim.Acc_ClaimStatus__c).toBe(ClaimStatus.SUBMITTED);
      expect(claim.Acc_ReasonForDifference__c).toBe("");

      expect(context.repositories.claimStatusChanges.Items.length).toBe(1);
      expect(context.repositories.claimStatusChanges.Items[0].Acc_ExternalComment__c).toBe("Original Comments");
    });

    it("overheads should be ignored", async () => {
      const context = new TestContext();

      const overheads = context.testData.createCostCategory({ isCalculated: true });

      const originalAmount = 1000;

      const project = context.testData.createProject();
      const partner = context.testData.createPartner(project);
      partner.overheadRate = 10;

      context.testData.createProfileTotalCostCategory(overheads, partner, 100);

      const overheadProfile = context.testData.createProfileDetail(
        overheads,
        partner,
        1,
        x => (x.Acc_LatestForecastCost__c = originalAmount),
      );

      const dto: ForecastDetailsDTO[] = [mapProfileValue(overheadProfile, originalAmount / 10)];

      const command = new UpdateForecastDetailsCommand(project.Id, partner.id, dto, false);

      await context.runCommand(command);

      expect(overheadProfile.Acc_LatestForecastCost__c).toBe(originalAmount);
    });
  });
});

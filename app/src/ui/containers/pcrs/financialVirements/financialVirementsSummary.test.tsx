import { Pending } from "@shared/pending";
import { TestBed, TestBedStore } from "@shared/TestBed";
import { render } from "@testing-library/react";

import { PcrSummaryProvider, PcrSummaryProviderProps } from "@ui/containers/pcrs/components/PcrSummary/PcrSummary";

import {
  FinancialVirementSummary,
  FinancialVirementSummaryContainerProps,
} from "@ui/containers/pcrs/financialVirements/financialVirementsSummary";
import { ProjectParticipantProvider } from "@ui/features/project-participants";
import { TestContext } from "@tests/test-utils/testContextProvider";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { PCRItemType } from "@framework/constants/pcrConstants";

describe("<FinancialVirementSummary />", () => {
  const context = new TestContext();

  const stubProject = context.testData.createProject();
  const stubPartner = context.testData.createPartner(stubProject);
  const stubPcr = context.testData.createPCR();
  const stubPcrItem = context.testData.createPCRItem();

  const stubValidVirement = {
    pcrItemId: "a0G0C000005M8yTUAS" as PcrItemId,
    costsClaimedToDate: 74000,
    originalEligibleCosts: 496000,
    originalRemainingCosts: 422000,
    originalRemainingGrant: 211000,
    originalFundingLevel: 50,
    newEligibleCosts: 496000,
    newRemainingCosts: 422000,
    newRemainingGrant: 211000,
    newFundingLevel: 50,
    currentPartnerId: "undefined",
    partners: [stubPartner, stubPartner],
  };

  const stubValidPcr = { ...stubPcr, items: [stubPcrItem] };

  const stubValidProject = {
    id: "a0E0C000002CfsoUAC",
    title: "Test project 1",
    summary: "An example project for local testing",
    description: "An example project for local testing",
    projectNumber: "300101",
    applicationUrl:
      "https://application-for-innovation-funding.service.gov.uk/management/competition/<<Acc_CompetitionId__c>>/application/300101",
    grantOfferLetterUrl:
      "https://application-for-innovation-funding.service.gov.uk/management/competition/<<Acc_CompetitionId__c>>/project/300101",
    leadPartnerName: "Test account 1",
    isPastEndDate: false,
    claimFrequency: 1,
    claimFrequencyName: "Monthly",
    grantOfferLetterCosts: 496000,
    costsClaimedToDate: 74000,
    competitionType: "CR&D",
    claimedPercentage: 14.919354838709678,
    startDate: new Date(),
    endDate: new Date(),
    periodId: 3,
    periodStartDate: new Date(),
    periodEndDate: new Date(),
    pcrsToReview: 0,
    pcrsQueried: 0,
    roles: 7,
    roleTitles: ["Monitoring Officer", "Project Manager", "Finance Contact"],
    status: 2,
    statusName: "Live",
    claimsOverdue: 2,
    claimsToReview: 1,
    claimsWithParticipant: 1,
    numberOfOpenClaims: 2,
    durationInMonths: 4,
    numberOfPeriods: 4,
  };

  const stubValidValidator = {
    model: {
      id: "a0G0C000005M8yTUAS",
      guidance:
        "You need to submit a reallocate project costs spreadsheet. In the yellow boxes enter the names of all partner organisations, their current costs and the costs you are proposing. Enter all partners’ details. There are separate tables for businesses and academic organisations.\n\nYou must not:\n\n* increase the combined grant funding within the collaboration\n* exceed any individual partner’s award rate limit\n\nYou should not increase the overhead percentage rate.\n",
      typeName: "Reallocate project costs",
      status: 1,
      statusName: "To Do",
      shortName: "Move partners’ costs",
      type: 60,
      grantMovingOverFinancialYear: null,
    },
    showValidationErrors: false,
    errors: [],
    isValid: true,
    isRequired: false,
    canEdit: true,
    role: 7,
    pcrStatus: 1,
    recordTypes: [
      {
        type: 70,
        displayName: "Reallocate project costs",
        enabled: false,
        disabled: false,
        recordTypeId: "0124I000000FZOEQA4",
        files: [
          {
            name: "reallocate-project-costs.xlsx",
            relativeUrl: "/ifspa-assets/pcr_templates/reallocate-project-costs.xlsx",
          },
        ],
      },
      {
        type: 60,
        displayName: "Reallocate project costs",
        enabled: true,
        disabled: false,
        recordTypeId: "0124I000000FZOFQA4",
        files: [
          {
            name: "reallocate-project-costs.xlsx",
            relativeUrl: "/ifspa-assets/pcr_templates/reallocate-project-costs.xlsx",
          },
        ],
      },
      {
        type: 30,
        displayName: "Remove a partner",
        enabled: true,
        disabled: false,
        recordTypeId: "0124I000000FZOGQA4",
        files: [],
      },
      {
        type: 20,
        displayName: "Add a partner",
        enabled: true,
        disabled: false,
        recordTypeId: "0124I000000FZO6QAO",
        files: [
          { name: "de-minimis-declaration.odt", relativeUrl: "/ifspa-assets/pcr_templates/de-minimis-declaration.odt" },
        ],
      },
      {
        type: 80,
        displayName: "Change project scope",
        enabled: true,
        disabled: false,
        recordTypeId: "0124I000000FZOAQA4",
        files: [],
      },
      {
        type: 90,
        displayName: "Change project duration",
        enabled: true,
        disabled: false,
        recordTypeId: "0124I000000FZO9QAO",
        files: [],
      },
      {
        type: 100,
        displayName: "Change period length",
        enabled: false,
        disabled: false,
        recordTypeId: "0120C0000002m1FQAQ",
        files: [],
      },
      {
        type: 10,
        displayName: "Change a partner's name",
        enabled: true,
        disabled: false,
        recordTypeId: "0124I000000FZO8QAO",
        files: [],
      },
      {
        type: 40,
        displayName: "Put project on hold",
        enabled: true,
        disabled: false,
        recordTypeId: "0124I000000FZODQA4",
        files: [],
      },
      {
        type: 50,
        displayName: "End the project early",
        enabled: true,
        disabled: false,
        recordTypeId: "0124I000000FZOBQA4",
        files: [],
      },
    ],
    original: {
      id: "a0G0C000005M8yTUAS",
      guidance:
        "You need to submit a reallocate project costs spreadsheet. In the yellow boxes enter the names of all partner organisations, their current costs and the costs you are proposing. Enter all partners’ details. There are separate tables for businesses and academic organisations.\n\nYou must not:\n\n* increase the combined grant funding within the collaboration\n* exceed any individual partner’s award rate limit\n\nYou should not increase the overhead percentage rate.\n",
      typeName: "Reallocate project costs",
      status: 1,
      statusName: "To Do",
      shortName: "Move partners’ costs",
      type: 60,
      grantMovingOverFinancialYear: null,
    },
    status: {
      showValidationErrors: false,
      isValid: true,
      errorMessage: null,
      isRequired: false,
      key: "Val578",
    },
    type: {
      showValidationErrors: false,
      isValid: true,
      errorMessage: null,
      isRequired: false,
      key: "Val582",
    },
    grantMovingOverFinancialYear: {
      showValidationErrors: false,
      isValid: true,
      errorMessage: null,
      isRequired: false,
      key: "Val586",
    },
  };

  const stubPropDrilledProps = {
    routes: {
      pcrFinancialVirementEditCostCategoryLevel: {
        getLink: jest.fn().mockReturnValue({
          routeName: "stub-pcrFinancialVirementEditCostCategoryLevel-routeName",
          path: "stub-pcrFinancialVirementEditCostCategoryLevel-path",
          routeParams: {},
          accessControl: true,
        }),
      },
      pcrFinancialVirementDetails: {
        getLink: jest.fn().mockReturnValue({
          routeName: "stub-pcrFinancialVirementDetails-routeName",
          path: "stub-pcrFinancialVirementDetails-path",
          routeParams: {},
          accessControl: true,
        }),
      },
      pcrFinancialVirementEditPartnerLevel: {
        getLink: jest.fn().mockReturnValue({
          routeName: "stub-pcrFinancialVirementEditPartnerLevel-routeName",
          path: "stub-pcrFinancialVirementEditPartnerLevel-path",
          routeParams: {},
          accessControl: true,
        }),
      },
    },
  };

  const requiredProps = {
    ...stubPropDrilledProps,
    projectId: stubValidProject.id,
    pcr: stubValidPcr,
    pcrItem: stubPcrItem,
    project: stubValidProject,
    validator: stubValidValidator,
    onSave: jest.fn(),
    getStepLink: jest.fn(),
    getEditLink: jest.fn(),
    getViewLink: jest.fn(),
  } as unknown as FinancialVirementSummaryContainerProps; // Note: Validation is very hard to stub cast as any to workaround :(

  const stubContent = {
    financialVirementDetails: {
      labels: {
        projectTotals: "stub-projectTotals",
      },
    },
    pages: {
      financialVirementSummary: {
        availableGrantMessage: "stub-availableGrantMessage",
        unavailableGrantMessage: "stub-unavailableGrantMessage",
        changeGrantLink: "stub-changeGrantLink",
        grantAdvice: "stub-grantAdvice",
        grantValueMovingOverHeading: "stub-grantValueMovingOverHeading",
        labels: {
          partnerName: "stub-partnerName",
          partnerOriginalEligibleCosts: "stub-partnerOriginalEligibleCosts",
          partnerOriginalRemainingCosts: "stub-partnerOriginalRemainingCosts",
          partnerOriginalRemainingGrant: "stub-partnerOriginalRemainingGrant",
          partnerNewEligibleCosts: "stub-partnerNewEligibleCosts",
          partnerNewRemainingCosts: "stub-partnerNewRemainingCosts",
          partnerNewRemainingGrant: "stub-partnerNewRemainingGrant",
        },
      },
    },
  };

  const stubStore = {
    partners: {
      getPartnersForProject: jest.fn().mockReturnValue(Pending.done([{}, {}])),
    },
    financialVirements: {
      get: jest.fn().mockReturnValue(Pending.done(stubValidVirement)),
    },
  } as unknown as TestBedStore;

  // Note: We omit "children" as this is context provider. "virement" is omitted as we add this in each test case below, see setup()
  const stubPcrSummaryProviderProps: Omit<PcrSummaryProviderProps, "children" | "virement"> = {
    type: PCRItemType.MultiplePartnerFinancialVirement,
    partners: [
      {
        id: "a0D0C000001JvgGUAS" as PartnerId,
        name: "Test account 1",
        accountId: "0010C00000AtnO8QAJ",
        type: "Business",
        postcode: "BS1 2AG",
        postcodeStatus: 30,
        postcodeStatusLabel: "BS1 2AG",
        organisationType: "Industrial",
        competitionType: "CR&D",
        competitionName: "Competition 1",
        isLead: true,
        projectRoleName: "Project Lead",
        projectId: "a0E0C000002CfsoUAC" as ProjectId,
        totalParticipantGrant: 248000,
        totalParticipantCostsClaimed: 37000,
        percentageParticipantCostsClaimed: 14.919354838709678,
        awardRate: 50,
        capLimit: 50,
        capLimitDeferredAmount: 180_000,
        totalPaidCosts: null,
        totalFutureForecastsForParticipants: 92923.78,
        totalCostsSubmitted: 37000,
        roles: 7,
        forecastLastModifiedDate: new Date(),
        overdueProject: false,
        claimsOverdue: 1,
        claimsWithParticipant: 1,
        claimStatus: 3,
        statusName: "Claims Overdue",
        overheadRate: 20,
        partnerStatus: 1,
        partnerStatusLabel: "Active",
        isWithdrawn: false,
        totalCostsAwarded: 15,
        auditReportFrequencyName: "With all claims",
        totalPrepayment: null,
        percentageParticipantCostsSubmitted: 14.919354838709678,
        totalFundingDueToReceive: 124000,
        newForecastNeeded: false,
        spendProfileStatus: 30,
        bankCheckStatus: 40,
        bankDetailsTaskStatus: 30,
        spendProfileStatusLabel: "To do",
        totalGrantApproved: 0,
        remainingParticipantGrant: 124000,
        bankDetailsTaskStatusLabel: "Complete",
        bankDetails: {
          companyNumber: null,
          accountNumber: null,
          sortCode: null,
          firstName: null,
          lastName: null,
          address: {
            accountPostcode: null,
            accountStreet: null,
            accountBuilding: null,
            accountLocality: null,
            accountTownOrCity: null,
          },
        },
        bankCheckRetryAttempts: 0,
        validationResponse: {
          validationCheckPassed: false,
          iban: null,
          validationConditionsSeverity: null,
          validationConditionsCode: null,
          validationConditionsDesc: null,
        },
        verificationResponse: {
          personalDetailsScore: null,
          companyNameScore: null,
          addressScore: null,
          regNumberScore: null,
          verificationConditionsSeverity: null,
          verificationConditionsCode: null,
          verificationConditionsDesc: null,
        },
        isNonFunded: false,
      },
      {
        id: "a0D0C000001JvgHUAS" as PartnerId,
        name: "Test account 1b",
        accountId: "0010C00000AtnO9QAJ",
        type: "Business",
        postcode: "BS1 6AB",
        postcodeStatus: 30,
        postcodeStatusLabel: "BS1 6AB",
        organisationType: "Industrial",
        competitionType: "CR&D",
        competitionName: "Competition 1",
        isLead: false,
        projectRoleName: "Collaborator",
        projectId: "a0E0C000002CfsoUAC" as ProjectId,
        totalParticipantGrant: 248000,
        totalParticipantCostsClaimed: 37000,
        percentageParticipantCostsClaimed: 14.919354838709678,
        awardRate: 50,
        capLimit: 50,
        capLimitDeferredAmount: 180_000,
        totalPaidCosts: null,
        totalFutureForecastsForParticipants: null,
        totalCostsSubmitted: 74600,
        roles: 7,
        forecastLastModifiedDate: null,
        overdueProject: false,
        claimsOverdue: 1,
        claimsWithParticipant: 0,
        claimStatus: 5,
        statusName: "Claim Submitted",
        overheadRate: 20,
        partnerStatus: 1,
        partnerStatusLabel: "Active",
        isWithdrawn: false,
        totalCostsAwarded: 15,
        auditReportFrequencyName: "With the first and last claim only",
        totalPrepayment: null,
        percentageParticipantCostsSubmitted: 30.080645161290324,
        totalFundingDueToReceive: 124000,
        newForecastNeeded: false,
        spendProfileStatus: 30,
        bankCheckStatus: 40,
        bankDetailsTaskStatus: 30,
        spendProfileStatusLabel: "To do",
        totalGrantApproved: 0,
        remainingParticipantGrant: 124000,
        bankDetailsTaskStatusLabel: "To do",
        bankDetails: {
          companyNumber: null,
          accountNumber: null,
          sortCode: null,
          firstName: null,
          lastName: null,
          address: {
            accountPostcode: null,
            accountStreet: null,
            accountBuilding: null,
            accountLocality: null,
            accountTownOrCity: null,
          },
        },
        bankCheckRetryAttempts: 0,
        validationResponse: {
          validationCheckPassed: false,
          iban: null,
          validationConditionsSeverity: null,
          validationConditionsCode: null,
          validationConditionsDesc: null,
        },
        verificationResponse: {
          personalDetailsScore: null,
          companyNameScore: null,
          addressScore: null,
          regNumberScore: null,
          verificationConditionsSeverity: null,
          verificationConditionsCode: null,
          verificationConditionsDesc: null,
        },
        isNonFunded: false,
      },
    ],
  };

  const setup = (
    mode: FinancialVirementSummaryContainerProps["mode"],
    grantVirement: PcrSummaryProviderProps["virement"],
  ) => {
    const summaryProviderProps: Omit<PcrSummaryProviderProps, "children"> = {
      ...stubPcrSummaryProviderProps,
      virement: grantVirement,
    };
    const projectId = "stub-id" as ProjectId;
    return render(
      <TestBed stores={stubStore}>
        <ProjectParticipantProvider projectId={projectId}>
          <PcrSummaryProvider {...summaryProviderProps}>
            <FinancialVirementSummary {...requiredProps} mode={mode} />
          </PcrSummaryProvider>
        </ProjectParticipantProvider>
      </TestBed>,
    );
  };

  beforeAll(async () => {
    await initStubTestIntl(stubContent);
  });

  describe("@returns", () => {
    describe("when mode is prepare", () => {
      const grantAdviceContent = stubContent.pages.financialVirementSummary.grantAdvice;
      const availableGrantContent = stubContent.pages.financialVirementSummary.availableGrantMessage;
      const unavailableGrantContent = stubContent.pages.financialVirementSummary.unavailableGrantMessage;

      test("with valid grant content", () => {
        const validGrantVirement = {
          pcrItemId: "a0G0C000005M8yTUAS" as PcrItemId,
          costsClaimedToDate: 74000,
          originalEligibleCosts: 496000,
          originalRemainingCosts: 422000,
          originalRemainingGrant: 211000,
          originalFundingLevel: 50,
          newEligibleCosts: 496000,
          newRemainingCosts: 422000,
          newRemainingGrant: 211000,
          newFundingLevel: 50,
          currentPartnerId: "undefined" as PartnerId,
          partners: [
            {
              partnerId: "a0D0C000001JvgGUAS" as PartnerId,
              costsClaimedToDate: 37000,
              originalEligibleCosts: 248000,
              originalRemainingCosts: 211000,
              originalFundingLevel: 50,
              newEligibleCosts: 248000,
              newRemainingCosts: 211000,
              newFundingLevel: 50,
              originalRemainingGrant: 105500,
              newRemainingGrant: 105500,
              virements: [
                {
                  costCategoryName: "Labour",
                  originalRemainingCosts: 35000,
                  newRemainingCosts: 35000,
                  costCategoryId: "a060C000000fKORQA2",
                  costsClaimedToDate: 5000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 35000 / 2,
                  newRemainingGrant: 35000 / 2,
                },
                {
                  costCategoryName: "Overheads",
                  originalRemainingCosts: 7000,
                  newRemainingCosts: 7000,
                  costCategoryId: "a060C000000fKOSQA2",
                  costsClaimedToDate: 1000,
                  originalEligibleCosts: 8000,
                  newEligibleCosts: 8000,
                  originalRemainingGrant: 7000 / 2,
                  newRemainingGrant: 7000 / 2,
                },
                {
                  costCategoryName: "Materials",
                  originalRemainingCosts: 33000,
                  newRemainingCosts: 33000,
                  costCategoryId: "a060C000000fKOTQA2",
                  costsClaimedToDate: 7000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 33000 / 2,
                  newRemainingGrant: 33000 / 2,
                },
                {
                  costCategoryName: "Capital usage",
                  originalRemainingCosts: 32000,
                  newRemainingCosts: 32000,
                  costCategoryId: "a060C000000fKOUQA2",
                  costsClaimedToDate: 8000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 32000 / 2,
                  newRemainingGrant: 32000 / 2,
                },
                {
                  costCategoryName: "Subcontracting",
                  originalRemainingCosts: 31000,
                  newRemainingCosts: 31000,
                  costCategoryId: "a060C000000fKOVQA2",
                  costsClaimedToDate: 9000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 31000 / 2,
                  newRemainingGrant: 31000 / 2,
                },
                {
                  costCategoryName: "Travel and subsistence",
                  originalRemainingCosts: 36000,
                  newRemainingCosts: 36000,
                  costCategoryId: "a060C000000fKOWQA2",
                  costsClaimedToDate: 4000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 36000 / 2,
                  newRemainingGrant: 36000 / 2,
                },
                {
                  costCategoryName: "Other costs",
                  originalRemainingCosts: 37000,
                  newRemainingCosts: 37000,
                  costCategoryId: "a060C000000fKOXQA2",
                  costsClaimedToDate: 3000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 37000 / 2,
                  newRemainingGrant: 37000 / 2,
                },
              ],
            },
            {
              partnerId: "a0D0C000001JvgHUAS" as PartnerId,
              costsClaimedToDate: 37000,
              originalEligibleCosts: 248000,
              originalRemainingCosts: 211000,
              originalFundingLevel: 50,
              newEligibleCosts: 248000,
              newRemainingCosts: 211000,
              newFundingLevel: 50,
              originalRemainingGrant: 105500,
              newRemainingGrant: 105500,
              virements: [
                {
                  costCategoryName: "Labour",
                  originalRemainingCosts: 35000,
                  newRemainingCosts: 35000,
                  costCategoryId: "a060C000000fKORQA2",
                  costsClaimedToDate: 5000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 35000 / 2,
                  newRemainingGrant: 35000 / 2,
                },
                {
                  costCategoryName: "Overheads",
                  originalRemainingCosts: 7000,
                  newRemainingCosts: 7000,
                  costCategoryId: "a060C000000fKOSQA2",
                  costsClaimedToDate: 1000,
                  originalEligibleCosts: 8000,
                  newEligibleCosts: 8000,
                  originalRemainingGrant: 7000 / 2,
                  newRemainingGrant: 7000 / 2,
                },
                {
                  costCategoryName: "Materials",
                  originalRemainingCosts: 33000,
                  newRemainingCosts: 33000,
                  costCategoryId: "a060C000000fKOTQA2",
                  costsClaimedToDate: 7000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 33000 / 2,
                  newRemainingGrant: 33000 / 2,
                },
                {
                  costCategoryName: "Capital usage",
                  originalRemainingCosts: 32000,
                  newRemainingCosts: 32000,
                  costCategoryId: "a060C000000fKOUQA2",
                  costsClaimedToDate: 8000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 32000 / 2,
                  newRemainingGrant: 32000 / 2,
                },
                {
                  costCategoryName: "Subcontracting",
                  originalRemainingCosts: 31000,
                  newRemainingCosts: 31000,
                  costCategoryId: "a060C000000fKOVQA2",
                  costsClaimedToDate: 9000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 31000 / 2,
                  newRemainingGrant: 31000 / 2,
                },
                {
                  costCategoryName: "Travel and subsistence",
                  originalRemainingCosts: 36000,
                  newRemainingCosts: 36000,
                  costCategoryId: "a060C000000fKOWQA2",
                  costsClaimedToDate: 4000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 36000 / 2,
                  newRemainingGrant: 36000 / 2,
                },
                {
                  costCategoryName: "Other costs",
                  originalRemainingCosts: 37000,
                  newRemainingCosts: 37000,
                  costCategoryId: "a060C000000fKOXQA2",
                  costsClaimedToDate: 3000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 37000 / 2,
                  newRemainingGrant: 37000 / 2,
                },
              ],
            },
          ],
        };

        const { queryByText } = setup("prepare", validGrantVirement);

        const grantAdvice = queryByText(grantAdviceContent);
        const availableGrantAdvice = queryByText(availableGrantContent);
        const unavailableGrantAdvice = queryByText(unavailableGrantContent);

        expect(grantAdvice).toBeInTheDocument();

        expect(unavailableGrantAdvice).not.toBeInTheDocument();
        expect(availableGrantAdvice).not.toBeInTheDocument();
      });

      test("with unavailable grant content", () => {
        const unavailableGrantVirement = {
          pcrItemId: "a0G0C000005M8yTUAS" as PcrItemId,
          costsClaimedToDate: 74000,
          originalEligibleCosts: 496000,
          originalRemainingCosts: 422000,
          originalRemainingGrant: 211000,
          originalFundingLevel: 50,
          newEligibleCosts: 506000,
          newRemainingCosts: 432000,
          newRemainingGrant: 216000,
          newFundingLevel: 50,
          partners: [
            {
              partnerId: "a0D0C000001JvgGUAS" as PartnerId,
              costsClaimedToDate: 37000,
              originalEligibleCosts: 248000,
              originalRemainingCosts: 211000,
              originalFundingLevel: 50,
              newEligibleCosts: 258000,
              newRemainingCosts: 221000,
              newFundingLevel: 50,
              originalRemainingGrant: 105500,
              newRemainingGrant: 110500,
              virements: [
                {
                  costCategoryName: "Labour",
                  originalRemainingCosts: 35000,
                  newRemainingCosts: 35000,
                  costCategoryId: "a060C000000fKORQA2",
                  costsClaimedToDate: 5000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 35000 / 2,
                  newRemainingGrant: 35000 / 2,
                },
                {
                  costCategoryName: "Overheads",
                  originalRemainingCosts: 7000,
                  newRemainingCosts: 7000,
                  costCategoryId: "a060C000000fKOSQA2",
                  costsClaimedToDate: 1000,
                  originalEligibleCosts: 8000,
                  newEligibleCosts: 8000,
                  originalRemainingGrant: 7000 / 2,
                  newRemainingGrant: 7000 / 2,
                },
                {
                  costCategoryName: "Materials",
                  originalRemainingCosts: 33000,
                  newRemainingCosts: 33000,
                  costCategoryId: "a060C000000fKOTQA2",
                  costsClaimedToDate: 7000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 33000 / 2,
                  newRemainingGrant: 33000 / 2,
                },
                {
                  costCategoryName: "Capital usage",
                  originalRemainingCosts: 32000,
                  newRemainingCosts: 32000,
                  costCategoryId: "a060C000000fKOUQA2",
                  costsClaimedToDate: 8000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 32000 / 2,
                  newRemainingGrant: 32000 / 2,
                },
                {
                  costCategoryName: "Subcontracting",
                  originalRemainingCosts: 31000,
                  newRemainingCosts: 31000,
                  costCategoryId: "a060C000000fKOVQA2",
                  costsClaimedToDate: 9000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 31000 / 2,
                  newRemainingGrant: 31000 / 2,
                },
                {
                  costCategoryName: "Travel and subsistence",
                  originalRemainingCosts: 36000,
                  newRemainingCosts: 36000,
                  costCategoryId: "a060C000000fKOWQA2",
                  costsClaimedToDate: 4000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 36000 / 2,
                  newRemainingGrant: 36000 / 2,
                },
                {
                  costCategoryName: "Other costs",
                  originalRemainingCosts: 37000,
                  newRemainingCosts: 47000,
                  costCategoryId: "a060C000000fKOXQA2",
                  costsClaimedToDate: 3000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 50000,
                  originalRemainingGrant: 37000 / 2,
                  newRemainingGrant: 47000 / 2,
                },
              ],
            },
            {
              partnerId: "a0D0C000001JvgHUAS" as PartnerId,
              costsClaimedToDate: 37000,
              originalEligibleCosts: 248000,
              originalRemainingCosts: 211000,
              originalFundingLevel: 50,
              newEligibleCosts: 248000,
              newRemainingCosts: 211000,
              newFundingLevel: 50,
              originalRemainingGrant: 105500,
              newRemainingGrant: 105500,
              virements: [
                {
                  costCategoryName: "Labour",
                  originalRemainingCosts: 35000,
                  newRemainingCosts: 35000,
                  costCategoryId: "a060C000000fKORQA2",
                  costsClaimedToDate: 5000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 35000 / 2,
                  newRemainingGrant: 35000 / 2,
                },
                {
                  costCategoryName: "Overheads",
                  originalRemainingCosts: 7000,
                  newRemainingCosts: 7000,
                  costCategoryId: "a060C000000fKOSQA2",
                  costsClaimedToDate: 1000,
                  originalEligibleCosts: 8000,
                  newEligibleCosts: 8000,
                  originalRemainingGrant: 7000 / 2,
                  newRemainingGrant: 7000 / 2,
                },
                {
                  costCategoryName: "Materials",
                  originalRemainingCosts: 33000,
                  newRemainingCosts: 33000,
                  costCategoryId: "a060C000000fKOTQA2",
                  costsClaimedToDate: 7000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 33000 / 2,
                  newRemainingGrant: 33000 / 2,
                },
                {
                  costCategoryName: "Capital usage",
                  originalRemainingCosts: 32000,
                  newRemainingCosts: 32000,
                  costCategoryId: "a060C000000fKOUQA2",
                  costsClaimedToDate: 8000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 32000 / 2,
                  newRemainingGrant: 32000 / 2,
                },
                {
                  costCategoryName: "Subcontracting",
                  originalRemainingCosts: 31000,
                  newRemainingCosts: 31000,
                  costCategoryId: "a060C000000fKOVQA2",
                  costsClaimedToDate: 9000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 31000 / 2,
                  newRemainingGrant: 31000 / 2,
                },
                {
                  costCategoryName: "Travel and subsistence",
                  originalRemainingCosts: 36000,
                  newRemainingCosts: 36000,
                  costCategoryId: "a060C000000fKOWQA2",
                  costsClaimedToDate: 4000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 36000 / 2,
                  newRemainingGrant: 36000 / 2,
                },
                {
                  costCategoryName: "Other costs",
                  originalRemainingCosts: 37000,
                  newRemainingCosts: 37000,
                  costCategoryId: "a060C000000fKOXQA2",
                  costsClaimedToDate: 3000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 37000 / 2,
                  newRemainingGrant: 37000 / 2,
                },
              ],
            },
          ],
        };

        const { queryByText } = setup("prepare", unavailableGrantVirement);

        const grantAdvice = queryByText(grantAdviceContent);
        const availableGrantAdvice = queryByText(availableGrantContent);
        const unavailableGrantAdvice = queryByText(unavailableGrantContent);

        expect(unavailableGrantAdvice).toBeInTheDocument();
        expect(availableGrantAdvice).not.toBeInTheDocument();
        expect(grantAdvice).toBeInTheDocument();
      });

      test("with available grant content", () => {
        const availableGrantVirement = {
          pcrItemId: "a0G0C000005M8yTUAS" as PcrItemId,
          costsClaimedToDate: 74000,
          originalEligibleCosts: 496000,
          originalRemainingCosts: 422000,
          originalRemainingGrant: 211000,
          originalFundingLevel: 50,
          newEligibleCosts: 486000,
          newRemainingCosts: 412000,
          newRemainingGrant: 206000,
          newFundingLevel: 50,
          partners: [
            {
              partnerId: "a0D0C000001JvgGUAS" as PartnerId,
              costsClaimedToDate: 37000,
              originalEligibleCosts: 248000,
              originalRemainingCosts: 211000,
              originalFundingLevel: 50,
              newEligibleCosts: 238000,
              newRemainingCosts: 201000,
              newFundingLevel: 50,
              originalRemainingGrant: 105500,
              newRemainingGrant: 100500,
              virements: [
                {
                  costCategoryName: "Labour",
                  originalRemainingCosts: 35000,
                  newRemainingCosts: 35000,
                  costCategoryId: "a060C000000fKORQA2",
                  costsClaimedToDate: 5000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 35000 / 2,
                  newRemainingGrant: 35000 / 2,
                },
                {
                  costCategoryName: "Overheads",
                  originalRemainingCosts: 7000,
                  newRemainingCosts: 7000,
                  costCategoryId: "a060C000000fKOSQA2",
                  costsClaimedToDate: 1000,
                  originalEligibleCosts: 8000,
                  newEligibleCosts: 8000,
                  originalRemainingGrant: 7000 / 2,
                  newRemainingGrant: 7000 / 2,
                },
                {
                  costCategoryName: "Materials",
                  originalRemainingCosts: 33000,
                  newRemainingCosts: 33000,
                  costCategoryId: "a060C000000fKOTQA2",
                  costsClaimedToDate: 7000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 33000 / 2,
                  newRemainingGrant: 33000 / 2,
                },
                {
                  costCategoryName: "Capital usage",
                  originalRemainingCosts: 32000,
                  newRemainingCosts: 32000,
                  costCategoryId: "a060C000000fKOUQA2",
                  costsClaimedToDate: 8000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 32000 / 2,
                  newRemainingGrant: 32000 / 2,
                },
                {
                  costCategoryName: "Subcontracting",
                  originalRemainingCosts: 31000,
                  newRemainingCosts: 31000,
                  costCategoryId: "a060C000000fKOVQA2",
                  costsClaimedToDate: 9000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 31000 / 2,
                  newRemainingGrant: 31000 / 2,
                },
                {
                  costCategoryName: "Travel and subsistence",
                  originalRemainingCosts: 36000,
                  newRemainingCosts: 36000,
                  costCategoryId: "a060C000000fKOWQA2",
                  costsClaimedToDate: 4000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 36000 / 2,
                  newRemainingGrant: 36000 / 2,
                },
                {
                  costCategoryName: "Other costs",
                  originalRemainingCosts: 37000,
                  newRemainingCosts: 27000,
                  costCategoryId: "a060C000000fKOXQA2",
                  costsClaimedToDate: 3000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 30000,
                  originalRemainingGrant: 37000 / 2,
                  newRemainingGrant: 27000 / 2,
                },
              ],
            },
            {
              partnerId: "a0D0C000001JvgHUAS" as PartnerId,
              costsClaimedToDate: 37000,
              originalEligibleCosts: 248000,
              originalRemainingCosts: 211000,
              originalFundingLevel: 50,
              newEligibleCosts: 248000,
              newRemainingCosts: 211000,
              newFundingLevel: 50,
              originalRemainingGrant: 105500,
              newRemainingGrant: 105500,
              virements: [
                {
                  costCategoryName: "Labour",
                  originalRemainingCosts: 35000,
                  newRemainingCosts: 35000,
                  costCategoryId: "a060C000000fKORQA2",
                  costsClaimedToDate: 5000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 35000 / 2,
                  newRemainingGrant: 35000 / 2,
                },
                {
                  costCategoryName: "Overheads",
                  originalRemainingCosts: 7000,
                  newRemainingCosts: 7000,
                  costCategoryId: "a060C000000fKOSQA2",
                  costsClaimedToDate: 1000,
                  originalEligibleCosts: 8000,
                  newEligibleCosts: 8000,
                  originalRemainingGrant: 7000 / 2,
                  newRemainingGrant: 7000 / 2,
                },
                {
                  costCategoryName: "Materials",
                  originalRemainingCosts: 33000,
                  newRemainingCosts: 33000,
                  costCategoryId: "a060C000000fKOTQA2",
                  costsClaimedToDate: 7000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 33000 / 2,
                  newRemainingGrant: 33000 / 2,
                },
                {
                  costCategoryName: "Capital usage",
                  originalRemainingCosts: 32000,
                  newRemainingCosts: 32000,
                  costCategoryId: "a060C000000fKOUQA2",
                  costsClaimedToDate: 8000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 32000 / 2,
                  newRemainingGrant: 32000 / 2,
                },
                {
                  costCategoryName: "Subcontracting",
                  originalRemainingCosts: 31000,
                  newRemainingCosts: 31000,
                  costCategoryId: "a060C000000fKOVQA2",
                  costsClaimedToDate: 9000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 31000 / 2,
                  newRemainingGrant: 31000 / 2,
                },
                {
                  costCategoryName: "Travel and subsistence",
                  originalRemainingCosts: 36000,
                  newRemainingCosts: 36000,
                  costCategoryId: "a060C000000fKOWQA2",
                  costsClaimedToDate: 4000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 36000 / 2,
                  newRemainingGrant: 36000 / 2,
                },
                {
                  costCategoryName: "Other costs",
                  originalRemainingCosts: 37000,
                  newRemainingCosts: 37000,
                  costCategoryId: "a060C000000fKOXQA2",
                  costsClaimedToDate: 3000,
                  originalEligibleCosts: 40000,
                  newEligibleCosts: 40000,
                  originalRemainingGrant: 37000 / 2,
                  newRemainingGrant: 37000 / 2,
                },
              ],
            },
          ],
        };

        const { queryByText } = setup("prepare", availableGrantVirement);

        const grantAdvice = queryByText(grantAdviceContent);
        const availableGrantAdvice = queryByText(availableGrantContent);
        const unavailableGrantAdvice = queryByText(unavailableGrantContent);

        expect(availableGrantAdvice).toBeInTheDocument();
        expect(unavailableGrantAdvice).not.toBeInTheDocument();
        expect(grantAdvice).toBeInTheDocument();
      });
    });
  });
});

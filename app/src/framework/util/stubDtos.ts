import _merge from "lodash.merge";

import { ClaimDto, CostsSummaryForPeriodDto, PartnerDto, PCRSummaryDto, ProjectDto } from "@framework/dtos";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { ILinkInfo } from "@framework/types";

type CreateDTO<DTO> = (objectToMerge?: Partial<DTO>) => DTO;

export const createProjectDto: CreateDTO<ProjectDto> = (objectToMerge?) => {
  const stubProject: ProjectDto = {
    id: "stub-id",
    title: "stub-title",
    summary: "stub-summary",
    description: "stub-description",
    projectNumber: "stub-projectNumber",
    applicationUrl: "stub-applicationUrl",
    grantOfferLetterUrl: "stub-grantOfferLetterUrl",
    leadPartnerName: "stub-leadPartnerName",
    isPastEndDate: false,
    claimFrequency: 3,
    claimFrequencyName: "Quarterly",
    grantOfferLetterCosts: 372000,
    costsClaimedToDate: 124000,
    competitionType: "CR&D",
    claimedPercentage: 33.333333333333336,
    startDate: new Date(),
    endDate: new Date(),
    periodId: 2,
    periodStartDate: new Date(),
    periodEndDate: new Date(),
    pcrsToReview: 0,
    pcrsQueried: 0,
    roles: 7,
    roleTitles: ["Monitoring Officer", "Project Manager", "Finance Contact"],
    status: 2,
    statusName: "Live",
    claimsOverdue: 1,
    claimsToReview: 1,
    claimsWithParticipant: 1,
    numberOfOpenClaims: 2,
    durationInMonths: 9,
    numberOfPeriods: 3,
  };

  return _merge(stubProject, objectToMerge || {});
};

export const createPartnerDto: CreateDTO<PartnerDto> = (objectToMerge?) => {
  const stubPartner: PartnerDto = {
    id: "a0D0C000001AEZzUAO",
    name: "Test account 2A",
    accountId: "0010C00000AtnOAQAZ",
    type: "Business",
    postcode: "BS1 6AC",
    postcodeStatusLabel: "To do",
    postcodeStatus: 10,
    organisationType: "Industrial",
    competitionType: "CR&D",
    isLead: true,
    projectRoleName: "Project Lead",
    projectId: "a0E0C000001zU2sUAE",
    totalParticipantGrant: 186000,
    totalParticipantCostsClaimed: 37000,
    percentageParticipantCostsClaimed: 19.892473118279568,
    awardRate: 50,
    capLimit: 50,
    totalPaidCosts: null,
    totalFutureForecastsForParticipants: 48820.8,
    totalCostsSubmitted: 37000,
    roles: 7,
    forecastLastModifiedDate: new Date(),
    claimsOverdue: 0,
    claimsWithParticipant: 1,
    claimStatus: 3,
    statusName: "Claims Overdue",
    overheadRate: 20,
    partnerStatus: 1,
    partnerStatusLabel: "Active",
    isWithdrawn: false,
    totalCostsAwarded: 20,
    auditReportFrequencyName: "With all claims",
    totalPrepayment: null,
    percentageParticipantCostsSubmitted: 19.892473118279568,
    totalFundingDueToReceive: 93000,
    newForecastNeeded: false,
    spendProfileStatus: 30,
    bankCheckStatus: 40,
    bankDetailsTaskStatus: 30,
    spendProfileStatusLabel: "To do",
    totalGrantApproved: 0,
    remainingParticipantGrant: 74500,
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
  };

  return _merge(stubPartner, objectToMerge || {});
};

export const createCostCategories = (): CostCategoryDto[] => {
  return [
    {
      id: "a060C000000dxWtQAI",
      name: "Labour",
      type: 10,
      competitionType: "CR&D",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Labour costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxWuQAI",
      name: "Overheads",
      type: 20,
      competitionType: "CR&D",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Overhead costs - a % of Labour costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxWvQAI",
      name: "Materials",
      type: 30,
      competitionType: "CR&D",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Materials costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxWwQAI",
      name: "Capital usage",
      type: 40,
      competitionType: "CR&D",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Capital usage costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxWxQAI",
      name: "Subcontracting",
      type: 50,
      competitionType: "CR&D",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Subcontracting costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxWyQAI",
      name: "Travel and subsistence",
      type: 60,
      competitionType: "CR&D",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Travel and subsistence costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxWzQAI",
      name: "Other costs",
      type: 70,
      competitionType: "CR&D",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Other costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxX0QAI",
      name: "Directly incurred - Staff",
      type: 5,
      competitionType: "CR&D",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred staff costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxX1QAI",
      name: "Directly incurred - Travel and subsistence",
      type: 5,
      competitionType: "CR&D",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred travel and subsistence costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxX2QAI",
      name: "Directly incurred - Equipment",
      type: 5,
      competitionType: "CR&D",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred equipment costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxX3QAI",
      name: "Directly incurred - Other costs",
      type: 5,
      competitionType: "CR&D",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred other costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxX4QAI",
      name: "Directly allocated - Investigations",
      type: 5,
      competitionType: "CR&D",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly allocated investigators costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxX5QAI",
      name: "Directly allocated - Estates costs",
      type: 5,
      competitionType: "CR&D",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly allocated estates costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxX6QAI",
      name: "Directly allocated - Other costs",
      type: 5,
      competitionType: "CR&D",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly allocated other DA costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxX7QAI",
      name: "Indirect costs - Investigations",
      type: 5,
      competitionType: "CR&D",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Indirect costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxX8QAI",
      name: "Exceptions - Staff",
      type: 5,
      competitionType: "CR&D",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Exceptions staff costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxX9QAI",
      name: "Exceptions - Travel and subsistence",
      type: 5,
      competitionType: "CR&D",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Exceptions travel and subsistence costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXAQAY",
      name: "Exceptions - Equipment",
      type: 5,
      competitionType: "CR&D",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Exceptions equipment costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXBQAY",
      name: "Exceptions - Other costs",
      type: 5,
      competitionType: "CR&D",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Exceptions other costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXCQAY",
      name: "Labour",
      type: 10,
      competitionType: "CONTRACTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Labour costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXDQAY",
      name: "Overheads",
      type: 20,
      competitionType: "CONTRACTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Overhead costs - a % of Labour costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXEQAY",
      name: "Materials",
      type: 30,
      competitionType: "CONTRACTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Materials costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXFQAY",
      name: "Capital usage",
      type: 40,
      competitionType: "CONTRACTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Capital usage costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXGQAY",
      name: "Subcontracting",
      type: 50,
      competitionType: "CONTRACTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Subcontracting costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXHQAY",
      name: "Travel and subsistence",
      type: 60,
      competitionType: "CONTRACTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Travel and subsistence costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXIQAY",
      name: "Other costs",
      type: 70,
      competitionType: "CONTRACTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Other costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXJQAY",
      name: "VAT",
      type: 0,
      competitionType: "CONTRACTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "VAT for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXKQAY",
      name: "Directly incurred - Staff",
      type: 5,
      competitionType: "CONTRACTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred staff costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXLQAY",
      name: "Directly incurred - Travel and subsistence",
      type: 5,
      competitionType: "CONTRACTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred travel and subsistence costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXMQAY",
      name: "Directly incurred - Equipment",
      type: 5,
      competitionType: "CONTRACTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred equipment costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXNQAY",
      name: "Directly incurred - Other costs",
      type: 5,
      competitionType: "CONTRACTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred other costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXOQAY",
      name: "Directly allocated - Investigations",
      type: 5,
      competitionType: "CONTRACTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly allocated investigators costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXPQAY",
      name: "Directly allocated - Estates costs",
      type: 5,
      competitionType: "CONTRACTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly allocated estates costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXQQAY",
      name: "Directly allocated - Other costs",
      type: 5,
      competitionType: "CONTRACTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly allocated other DA costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXRQAY",
      name: "Indirect costs - Investigations",
      type: 5,
      competitionType: "CONTRACTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Indirect costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXSQAY",
      name: "Exceptions - Staff",
      type: 5,
      competitionType: "CONTRACTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Exceptions staff costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXTQAY",
      name: "Exceptions - Travel and subsistence",
      type: 5,
      competitionType: "CONTRACTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Exceptions travel and subsistence costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXUQAY",
      name: "Exceptions - Equipment",
      type: 5,
      competitionType: "CONTRACTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Exceptions equipment costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXVQAY",
      name: "Exceptions - Other costs",
      type: 5,
      competitionType: "CONTRACTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Exceptions other costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXWQAY",
      name: "VAT",
      type: 5,
      competitionType: "CONTRACTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "VAT for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXXQAY",
      name: "Labour",
      type: 10,
      competitionType: "SBRI",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Labour costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXYQAY",
      name: "Overheads",
      type: 20,
      competitionType: "SBRI",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Overhead costs - a % of Labour costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXZQAY",
      name: "Materials",
      type: 30,
      competitionType: "SBRI",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Materials costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXaQAI",
      name: "Capital usage",
      type: 40,
      competitionType: "SBRI",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Capital usage costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXbQAI",
      name: "Subcontracting",
      type: 50,
      competitionType: "SBRI",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Subcontracting costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXcQAI",
      name: "Travel and subsistence",
      type: 60,
      competitionType: "SBRI",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Travel and subsistence costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXdQAI",
      name: "Other costs",
      type: 70,
      competitionType: "SBRI",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Other costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXeQAI",
      name: "VAT",
      type: 0,
      competitionType: "SBRI",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "VAT for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXfQAI",
      name: "Directly incurred - Staff",
      type: 5,
      competitionType: "SBRI",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred staff costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXgQAI",
      name: "Directly incurred - Travel and subsistence",
      type: 5,
      competitionType: "SBRI",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred travel and subsistence costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXhQAI",
      name: "Directly incurred - Staff",
      type: 5,
      competitionType: "SBRI",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred staff costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXiQAI",
      name: "Directly incurred - Travel and subsistence",
      type: 5,
      competitionType: "SBRI",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred travel and subsistence costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXjQAI",
      name: "Directly incurred - Equipment",
      type: 5,
      competitionType: "SBRI",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred equipment costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXkQAI",
      name: "Directly incurred - Other costs",
      type: 5,
      competitionType: "SBRI",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred other costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXlQAI",
      name: "Directly allocated - Investigations",
      type: 5,
      competitionType: "SBRI",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly allocated investigators costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXmQAI",
      name: "Directly allocated - Estates costs",
      type: 5,
      competitionType: "SBRI",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly allocated estates costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXnQAI",
      name: "Directly allocated - Other costs",
      type: 5,
      competitionType: "SBRI",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly allocated other DA costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXoQAI",
      name: "Indirect costs - Investigations",
      type: 5,
      competitionType: "SBRI",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Indirect costs for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXpQAI",
      name: "Associate employment",
      type: 5,
      competitionType: "KTP",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred associate employment costs",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXqQAI",
      name: "Travel and subsistence",
      type: 5,
      competitionType: "KTP",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred travel and subsistence costs",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXrQAI",
      name: "Consumables",
      type: 5,
      competitionType: "KTP",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred consumables costs",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXsQAI",
      name: "Associate development",
      type: 5,
      competitionType: "KTP",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred associate development costs",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXtQAI",
      name: "Knowledge base supervisor",
      type: 5,
      competitionType: "KTP",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred knowledge base supervisor costs",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXuQAI",
      name: "Associate estate costs",
      type: 5,
      competitionType: "KTP",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred associate estate costs",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXvQAI",
      name: "Additional associate support",
      type: 5,
      competitionType: "KTP",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred additional associate support costs",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXwQAI",
      name: "Other costs",
      type: 5,
      competitionType: "KTP",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Directly incurred other costs",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXxQAI",
      name: "Labour",
      type: 10,
      competitionType: "CATAPULTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Labour costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXyQAI",
      name: "Overheads",
      type: 20,
      competitionType: "CATAPULTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Overhead costs - a % of Labour costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxXzQAI",
      name: "Materials",
      type: 30,
      competitionType: "CATAPULTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Materials costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxY0QAI",
      name: "Subcontracting",
      type: 50,
      competitionType: "CATAPULTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Subcontracting costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxY1QAI",
      name: "Travel and subsistence",
      type: 60,
      competitionType: "CATAPULTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Travel and subsistence costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxY2QAI",
      name: "Property Revenue",
      type: 0,
      competitionType: "CATAPULTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Property Revenue for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxY3QAI",
      name: "Other Costs - Resource",
      type: 0,
      competitionType: "CATAPULTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Other Costs- Resource for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxY4QAI",
      name: "Capital Equipment",
      type: 0,
      competitionType: "CATAPULTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Capital Equipment for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxY5QAI",
      name: "Property Capital",
      type: 0,
      competitionType: "CATAPULTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Property Capital for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxY6QAI",
      name: "Capitalised Labour",
      type: 0,
      competitionType: "CATAPULTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Capitalised Labour for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxY7QAI",
      name: "Other costs- Capital",
      type: 0,
      competitionType: "CATAPULTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Other costs- Capital for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxY8QAI",
      name: "Advance on Grant",
      type: 0,
      competitionType: "CATAPULTS",
      organisationType: "Industrial",
      isCalculated: false,
      hasRelated: false,
      description: "Advance on Grant for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxY9QAI",
      name: "Labour",
      type: 5,
      competitionType: "CATAPULTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Labour costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxYAQAY",
      name: "Overheads",
      type: 5,
      competitionType: "CATAPULTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Overhead costs - a % of Labour costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxYBQAY",
      name: "Materials",
      type: 5,
      competitionType: "CATAPULTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Materials costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxYCQAY",
      name: "Subcontracting",
      type: 5,
      competitionType: "CATAPULTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Subcontracting costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxYDQAY",
      name: "Travel and subsistence",
      type: 5,
      competitionType: "CATAPULTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Travel and subsistence costs for industrial organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxYEQAY",
      name: "Property Revenue",
      type: 5,
      competitionType: "CATAPULTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Property Revenue for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxYFQAY",
      name: "Other Costs - Resource",
      type: 5,
      competitionType: "CATAPULTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Other Costs- Resource for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxYGQAY",
      name: "Capital Equipment",
      type: 5,
      competitionType: "CATAPULTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Capital Equipment for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxYHQAY",
      name: "Property Capital",
      type: 5,
      competitionType: "CATAPULTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Property Capital for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxYIQAY",
      name: "Capitalised Labour",
      type: 5,
      competitionType: "CATAPULTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Capitalised Labour for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxYJQAY",
      name: "Other costs - Capital",
      type: 5,
      competitionType: "CATAPULTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Other costs- Capital for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000dxYKQAY",
      name: "Advance on Grant",
      type: 5,
      competitionType: "CATAPULTS",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Advance on Grant for academic organisations",
      hintText: "stub-hintText",
    },
    {
      id: "a060C000000eT2cQAE",
      name: "Indirect costs",
      type: 5,
      competitionType: "KTP",
      organisationType: "Academic",
      isCalculated: false,
      hasRelated: false,
      description: "Indirectly incurred costs",
      hintText: "stub-hintText",
    },
  ];
};

export const createClaimDetails = (): CostsSummaryForPeriodDto[] => {
  return [
    {
      costCategoryId: "a060C000000dxWtQAI",
      offerTotal: 30000,
      forecastThisPeriod: 10000,
      costsClaimedToDate: 5000,
      costsClaimedThisPeriod: 3500,
      remainingOfferCosts: 21500,
    },
    {
      costCategoryId: "a060C000000dxWuQAI",
      offerTotal: 6000,
      forecastThisPeriod: 2000,
      costsClaimedToDate: 1000,
      costsClaimedThisPeriod: 700,
      remainingOfferCosts: 4300,
    },
    {
      costCategoryId: "a060C000000dxWvQAI",
      offerTotal: 30000,
      forecastThisPeriod: 10000,
      costsClaimedToDate: 7000,
      costsClaimedThisPeriod: 23001,
      remainingOfferCosts: -1,
    },
    {
      costCategoryId: "a060C000000dxWwQAI",
      offerTotal: 30000,
      forecastThisPeriod: 10000,
      costsClaimedToDate: 8000,
      costsClaimedThisPeriod: 8000,
      remainingOfferCosts: 14000,
    },
    {
      costCategoryId: "a060C000000dxWxQAI",
      offerTotal: 30000,
      forecastThisPeriod: 10000,
      costsClaimedToDate: 9000,
      costsClaimedThisPeriod: 9000,
      remainingOfferCosts: 12000,
    },
    {
      costCategoryId: "a060C000000dxWyQAI",
      offerTotal: 30000,
      forecastThisPeriod: 10000,
      costsClaimedToDate: 4000,
      costsClaimedThisPeriod: 4000,
      remainingOfferCosts: 22000,
    },
    {
      costCategoryId: "a060C000000dxWzQAI",
      offerTotal: 30000,
      forecastThisPeriod: 10000,
      costsClaimedToDate: 3000,
      costsClaimedThisPeriod: 3000,
      remainingOfferCosts: 24000,
    },
  ];
};

export const createClaim: CreateDTO<ClaimDto> = (objectToMerge?) => {
  const stubClaim = {
    id: "a050C000000lBgDQAU",
    partnerId: "a0D0C000001AEZzUAO",
    lastModifiedDate: "2020-12-11T16:35:55.000Z",
    status: "Draft",
    statusLabel: "Draft",
    periodStartDate: "2020-08-31T23:00:00.000Z",
    periodEndDate: "2020-11-30T00:00:00.000Z",
    periodId: 2,
    totalCost: 51201,
    forecastCost: 62000,
    approvedDate: null,
    paidDate: null,
    comments: null,
    isIarRequired: true,
    isApproved: false,
    allowIarEdit: true,
    overheadRate: 20,
    isFinalClaim: false,
    totalCostsSubmitted: null,
    totalCostsApproved: null,
    totalDeferredAmount: 0,
    periodCostsToBePaid: 0,
  };

  return _merge(stubClaim, objectToMerge);
};

export const createPCRSummaryDto: CreateDTO<PCRSummaryDto> = (objectToMerge?) => {
  const stubPCRSummaryDto = {
    id: "a0G0C000004OH0sUAG",
    requestNumber: 12,
    started: new Date(),
    lastUpdated: new Date(),
    status: 1,
    statusName: "Draft",
    projectId: "a0E0C000001zU2tUAE",
    items: [
      { type: 60, typeName: "Reallocate project costs", shortName: "Move partners’ costs" },
      { type: 30, typeName: "Remove a partner", shortName: "Remove partner" },
    ],
  };

  // Note: Don't worry about deep merge, we want to override `items` if needed 👍🏻
  return { ...stubPCRSummaryDto, ...objectToMerge };
};

export const createClaimLink = () => (): ILinkInfo => ({
  routeName: "stub-routeName",
  routeParams: {},
  accessControl: () => false,
});

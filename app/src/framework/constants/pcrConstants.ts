import { PCRDto, PCRSummaryDto } from "@framework/dtos/pcrDtos";

export enum PCRStatus {
  Unknown = 0,
  Draft = 1,
  SubmittedToMonitoringOfficer = 2,
  QueriedByMonitoringOfficer = 3,
  SubmittedToInnovationLead = 4,
  QueriedByInnovateUK = 5,
  InExternalReview = 6,
  InReviewWithInnovateUK = 7,
  Rejected = 8,
  Withdrawn = 9,
  Approved = 10,
  Actioned = 11,
  SubmittedToInnovateUK = 12,
  QueriedByInnovationLead = 13,
  InReviewWithProjectFinance = 14,
}

export enum PCRProjectRole {
  Unknown = 0,
  ProjectLead = 10,
  Collaborator = 20,
}

export enum PCRContactRole {
  Unknown = 0,
  ProjectManager = 10,
  FinanceContact = 20,
}

export enum PCRPartnerType {
  Unknown = 0,
  Business = 10,
  Research = 20,
  ResearchAndTechnology = 30,
  Other = 40,
}

export enum PCRItemStatus {
  Unknown = 0,
  ToDo = 1,
  Incomplete = 2,
  Complete = 3,
}

export enum PCRItemDisabledReason {
  None = 0,
  AnotherPcrAlreadyHasThisType = 1,
  ThisPcrAlreadyHasThisType = 2,
  NotEnoughPartnersToActionThisType = 3,
}

export const enum PCRItemType {
  Unknown = 0,
  AccountNameChange = 10,
  PartnerAddition = 20,
  PartnerWithdrawal = 30,
  ProjectSuspension = 40,
  ProjectTermination = 50,
  MultiplePartnerFinancialVirement = 60,
  ScopeChange = 80,
  TimeExtension = 90,
  PeriodLengthChange = 100,
  LoanDrawdownChange = 110,
  LoanDrawdownExtension = 120,
}

export const enum PCRItemTypeName {
  Unknown = "Unknown",
  AccountNameChange = "AccountNameChange",
  PartnerAddition = "PartnerAddition",
  PartnerWithdrawal = "PartnerWithdrawal",
  ProjectSuspension = "ProjectSuspension",
  ProjectTermination = "ProjectTermination",
  MultiplePartnerFinancialVirement = "MultiplePartnerFinancialVirement",
  ScopeChange = "ScopeChange",
  TimeExtension = "TimeExtension",
  PeriodLengthChange = "PeriodLengthChange",
  LoanDrawdownChange = "LoanDrawdownChange",
  LoanDrawdownExtension = "LoanDrawdownExtension",
}

export const enum PCRStepId {
  // Base PCR Steps
  none = "",
  reasoningStep = "reasoningStep",
  filesStep = "filesStep",

  // Partner Addition Workflow IDs
  projectLocationStep = "projectLocationStep",
  financeContactStep = "financeContactStep",
  otherFundingStep = "otherFundingStep",
  awardRateStep = "awardRateStep",
  agreementToPcrStep = "agreementToPcrStep",
  roleAndOrganisationStep = "roleAndOrganisationStep",
  aidEligibilityStep = "aidEligibilityStep",
  academicOrganisationStep = "academicOrganisationStep",
  jeSStep = "jeSStep",
  academicCostsStep = "academicCostsStep",
  companiesHouseStep = "companiesHouseStep",
  organisationDetailsStep = "organisationDetailsStep",
  financeDetailsStep = "financeDetailsStep",
  spendProfileStep = "spendProfileStep",
  projectManagerDetailsStep = "projectManagerDetailsStep",
  otherFundingSourcesStep = "otherFundingSourcesStep",

  // Loan Drawdown Change IDs
  loanDrawdownChange = "loanDrawdownChange",

  // Loan Extension IDs
  loanExtension = "loanExtension",

  // Partner Withdrawal Workflow IDs
  removalPeriodStep = "removalPeriodStep",

  // Scope Change Workflow IDs
  publicDescriptionStep = "publicDescriptionStep",
  projectSummaryStep = "projectSummaryStep",

  // Suspend Project Workflow IDs
  details = "details",

  // Time extension workflow IDs
  timeExtension = "timeExtension",

  // Account Name Change IDs
  partnerNameStep = "partnerNameStep",
}

export enum PCRParticipantSize {
  Unknown = 0,
  Academic = 10,
  Small = 20,
  Medium = 30,
  Large = 40,
}

export enum PCRProjectLocation {
  Unknown = 0,
  InsideTheUnitedKingdom = 10,
  OutsideTheUnitedKingdom = 20,
}

export enum PCRSpendProfileOverheadRate {
  Unknown = 0,
  Calculated = 10,
  Zero = 20,
  Twenty = 30,
}

export enum PCRSpendProfileCapitalUsageType {
  Unknown = 0,
  New = 10,
  Existing = 20,
}

export enum PCROrganisationType {
  Unknown = "",
  Academic = "Academic",
  Industrial = "Industrial",
}

export const getPCROrganisationType = (partnerType: PCRPartnerType): PCROrganisationType => {
  if (partnerType === PCRPartnerType.Research) {
    return PCROrganisationType.Academic;
  } else if (
    partnerType === PCRPartnerType.Business ||
    partnerType === PCRPartnerType.Other ||
    partnerType === PCRPartnerType.ResearchAndTechnology
  ) {
    return PCROrganisationType.Industrial;
  }
  return PCROrganisationType.Unknown;
};

/**
 * A matrix of PCR types that CANNOT have more than one instance of itself in ANY PCR.
 *
 * Note: Matches business logic to prevent unneeded reconciliation with duplicate pcrs
 */
const pcrDisabledMatrix = {
  [PCRItemType.Unknown]: [],
  [PCRItemType.AccountNameChange]: [],
  [PCRItemType.PartnerAddition]: [],
  [PCRItemType.PartnerWithdrawal]: [],
  [PCRItemType.ProjectSuspension]: [],
  [PCRItemType.ProjectTermination]: [],
  [PCRItemType.MultiplePartnerFinancialVirement]: [PCRItemType.MultiplePartnerFinancialVirement],
  [PCRItemType.ScopeChange]: [PCRItemType.ScopeChange],
  [PCRItemType.TimeExtension]: [PCRItemType.TimeExtension],
  [PCRItemType.PeriodLengthChange]: [],
  [PCRItemType.LoanDrawdownChange]: [PCRItemType.LoanDrawdownChange],
  [PCRItemType.LoanDrawdownExtension]: [PCRItemType.LoanDrawdownExtension],
} as const;

/**
 * A map of PCR types that CANNOT have more than one instance of itself in a single PCR.
 * Used to allow duplicate Partner Addition/Removal/Rename in a single PCR.
 */
export const pcrUnduplicatableMatrix = {
  [PCRItemType.Unknown]: true,
  [PCRItemType.AccountNameChange]: false,
  [PCRItemType.PartnerAddition]: false,
  [PCRItemType.PartnerWithdrawal]: false,
  [PCRItemType.ProjectSuspension]: true,
  [PCRItemType.ProjectTermination]: true,
  [PCRItemType.MultiplePartnerFinancialVirement]: true,
  [PCRItemType.ScopeChange]: true,
  [PCRItemType.TimeExtension]: true,
  [PCRItemType.PeriodLengthChange]: true,
  [PCRItemType.LoanDrawdownChange]: true,
  [PCRItemType.LoanDrawdownExtension]: true,
} as const;

/**
 * Gets a list of PCR items that are not available
 */
export const getUnavailablePcrItemsMatrix = (pcrs: PCRSummaryDto[]): PCRItemType[] => {
  // Note: Avoid wasting time upfront
  if (!pcrs.length) return [];

  const statusesToIgnore: PCRStatus[] = [
    PCRStatus.Rejected,
    PCRStatus.Withdrawn,
    PCRStatus.Approved,
    PCRStatus.Actioned,
  ];

  // Get a list of all our in progress PCRs.
  const inProgressPCRs: PCRSummaryDto[] = pcrs.filter(x => !statusesToIgnore.includes(x.status));

  // Create a set of all disallowed PCRs.
  const disallowedPCRs: Set<PCRItemType> = new Set();

  // For each in-progress PCR...
  for (const inProgressPcr of inProgressPCRs) {
    // Get the types of PCR within the PCR
    const inProgressTypes = inProgressPcr.items.map(x => x.type);

    // For each PCR type within the PCR...
    for (const type of inProgressTypes) {
      // Iterate over the list of disallowed duplicate PCRs.
      for (const disallowedType of pcrDisabledMatrix[type]) {
        // Then add that disallow list to the list of disallowed duplicate PCRs.
        disallowedPCRs.add(disallowedType);
      }
    }
  }

  return [...disallowedPCRs];
};

export const getUnduplicatablePcrItemsMatrix = (pcr?: PCRDto): PCRItemType[] =>
  pcr?.items.map(x => x.type).filter(x => pcrUnduplicatableMatrix[x]) ?? [];

import { ContentSelector } from "@copy/type";
import { PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { SalesforceCompetitionTypes } from "./competitionTypes";

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
 * Gets a list of PCR items that are not available
 */
export const getPcrItemsSingleInstanceInAnyPcrViolations = (
  pcrs: Pick<PCRSummaryDto, "status" | "items">[],
): PCRItemType[] => {
  // Note: Avoid wasting time upfront
  if (!pcrs.length) return [];

  const statusesToIgnore: PCRStatus[] = [
    PCRStatus.Rejected,
    PCRStatus.Withdrawn,
    PCRStatus.Approved,
    PCRStatus.Actioned,
  ];

  // Get a list of all our in progress PCRs.
  const inProgressPCRs = pcrs.filter(x => !statusesToIgnore.includes(x.status));

  // Create a set of all disallowed PCRs.
  const disallowedPCRs: Set<PCRItemType> = new Set();

  // For each in-progress PCR...
  for (const inProgressPcr of inProgressPCRs) {
    // Get the types of PCR within the PCR
    const inProgressTypes = inProgressPcr.items.map(x => x.type);

    // For each PCR type within the PCR...
    for (const type of inProgressTypes) {
      if (recordTypeMetaValues.find(x => x.type === type)?.singleInstanceInAnyPcr) {
        disallowedPCRs.add(type);
      }
    }
  }

  return [...disallowedPCRs];
};

/**
 * Return a list of all invalid PCR types because a type can only exist once in the current PCR
 *
 * @param pcr The current PCR. If none available, will return no invalid types.
 * @returns List of PCRs that cannot be added.
 */
export const getPcrItemsSingleInstanceInThisPcrViolations = (pcr?: {
  items: { type: PCRItemType }[];
}): PCRItemType[] => {
  if (!pcr?.items) return [];
  const pcrItemType: PCRItemType[] = [];

  // Get a list of all PCR types where only a single instance is allowed
  const unduplicatablePcrItems = recordTypeMetaValues.filter(x => x.singleInstanceInThisPcr);

  // For each PCR item in our list of items...
  for (const pcrItem of pcr.items) {
    if (unduplicatablePcrItems.some(x => x.type === pcrItem.type)) {
      pcrItemType.push(pcrItem.type);
    }
  }

  return pcrItemType;
};

/**
 * Get a list of PCR items that should be disabled, to prevent too many items that action on
 * partners.
 *
 * @param numberOfPartners The number of partners in the project.
 * @param currentPcr The current PCR
 * @returns A list of PCR item types that should no longer have any more of the specified type.
 */
export const getPcrItemsTooManyViolations = (
  numberOfPartners: number,
  currentPcr?: Pick<PCRSummaryDto, "items">,
): PCRItemType[] => {
  if (!currentPcr) return [];

  const { items } = currentPcr;
  const bannedTypes: PCRItemType[] = [];

  // If we already have `n` renames, disallow adding an `n+1`th rename.
  if (items.filter(x => x.type === PCRItemType.AccountNameChange).length >= numberOfPartners)
    bannedTypes.push(PCRItemType.AccountNameChange);

  const hasAnyAdditions = items.some(x => x.type === PCRItemType.PartnerAddition);

  // Maximum number of deletes allowed.
  // `n`   You can delete all partners if we have any additions
  // `n-1` You cannot delete all partners if there are no additions
  const maxDeletes = hasAnyAdditions ? numberOfPartners : numberOfPartners - 1;

  if (items.filter(x => x.type === PCRItemType.PartnerWithdrawal).length > maxDeletes)
    bannedTypes.push(PCRItemType.PartnerWithdrawal);

  return bannedTypes;
};

const scopeChangeGuidance = `Your public description is published in line with government practice on openness and transparency of public-funded activities. It should describe your project in a way that will be easy for a non-specialist to understand. Do not include any information that is confidential, for example, intellectual property or patent details.

Your project summary should provide a clear overview of the whole project, including:

* your vision for the project
* key objectives
* main areas of focus
* details of how it is innovative
`;

const nameChangeGuidance = `This will change the partner's name in all projects they are claiming funding for. You must upload a change of name certificate from Companies House as evidence of the change.
`;

const partnerAdditionGuidance = undefined;

const multiplePartnerFinancialVirementGuidance = `You need to submit a reallocate project costs spreadsheet. In the yellow boxes enter the names of all partner organisations, their current costs and the costs you are proposing. Enter all partners’ details. There are separate tables for businesses and academic organisations.

You must not:

* increase the combined grant funding within the collaboration
* exceed any individual partner’s award rate limit

You should not increase the overhead percentage rate.
`;

export interface IMetaValue {
  ignoredCompetitions: string[];
  type: PCRItemType;
  typeName: string;
  displayName?: string;
  i18nName?: ContentSelector;
  i18nDescription?: ContentSelector;
  files?: string[];
  guidance?: string;
  deprecated?: boolean;
  singleInstanceInAnyPcr?: boolean;
  singleInstanceInThisPcr?: boolean;
}

/**
 * @description There is no mechanism to support filtering, hence this manual list. The order dictates the UI order what will be presented.
 *
 * If the db has an entry but it is not defined here then it will not be available through the api.
 */
export const recordTypeMetaValues: IMetaValue[] = [
  {
    type: PCRItemType.MultiplePartnerFinancialVirement,
    typeName: "Reallocate several partners' project cost",
    files: ["reallocate-project-costs.xlsx"],
    displayName: "Reallocate project costs",
    i18nName: x => x.pcrTypes.multiplePartnerFinancialVirement,
    i18nDescription: x => x.pages.pcrModifyOptions.reallocateCostsMessage,
    guidance: multiplePartnerFinancialVirementGuidance,
    ignoredCompetitions: [],
    singleInstanceInAnyPcr: true,
    singleInstanceInThisPcr: true,
  },
  {
    type: PCRItemType.PartnerWithdrawal,
    typeName: "Remove a partner",
    ignoredCompetitions: [SalesforceCompetitionTypes.loans],
    i18nName: x => x.pcrTypes.partnerWithdrawal,
    i18nDescription: x => x.pages.pcrModifyOptions.removePartnerMessage,
    singleInstanceInAnyPcr: false,
    singleInstanceInThisPcr: false,
  },
  {
    type: PCRItemType.PartnerAddition,
    typeName: "Add a partner",
    files: ["de-minimis-declaration.odt"],
    guidance: partnerAdditionGuidance,
    ignoredCompetitions: [SalesforceCompetitionTypes.loans],
    i18nName: x => x.pcrTypes.partnerAddition,
    i18nDescription: x => x.pages.pcrModifyOptions.addPartnerMessage,
    singleInstanceInAnyPcr: false,
    singleInstanceInThisPcr: false,
  },
  {
    type: PCRItemType.ScopeChange,
    typeName: "Change project scope",
    guidance: scopeChangeGuidance,
    ignoredCompetitions: [],
    i18nName: x => x.pcrTypes.scopeChange,
    i18nDescription: x => x.pages.pcrModifyOptions.changeScopeMessage,
    singleInstanceInAnyPcr: true,
    singleInstanceInThisPcr: true,
  },
  {
    type: PCRItemType.TimeExtension,
    typeName: "Change project duration",
    ignoredCompetitions: [SalesforceCompetitionTypes.loans],
    i18nName: x => x.pcrTypes.timeExtension,
    i18nDescription: x => x.pages.pcrModifyOptions.changeDurationMessage,
    singleInstanceInAnyPcr: true,
    singleInstanceInThisPcr: true,
  },
  {
    type: PCRItemType.PeriodLengthChange,
    typeName: "Change period length",
    ignoredCompetitions: [
      SalesforceCompetitionTypes.crnd,
      SalesforceCompetitionTypes.contracts,
      SalesforceCompetitionTypes.ktp,
      SalesforceCompetitionTypes.catapults,
      SalesforceCompetitionTypes.loans,
      SalesforceCompetitionTypes.edge,
      SalesforceCompetitionTypes.sbri,
      SalesforceCompetitionTypes.sbriIfs,
      SalesforceCompetitionTypes.horizonEurope,
    ],
    singleInstanceInAnyPcr: false,
    singleInstanceInThisPcr: true,
  },
  {
    type: PCRItemType.AccountNameChange,
    typeName: "Change a partner's name",
    guidance: nameChangeGuidance,
    ignoredCompetitions: [SalesforceCompetitionTypes.loans],
    i18nName: x => x.pcrTypes.accountNameChange,
    i18nDescription: x => x.pages.pcrModifyOptions.changePartnersNameMessage,
    singleInstanceInAnyPcr: false,
    singleInstanceInThisPcr: false,
  },
  {
    type: PCRItemType.ProjectSuspension,
    typeName: "Put project on hold",
    ignoredCompetitions: [],
    i18nName: x => x.pcrTypes.projectSuspension,
    i18nDescription: x => x.pages.pcrModifyOptions.putProjectOnHoldMessage,
    singleInstanceInAnyPcr: false,
    singleInstanceInThisPcr: true,
  },
  {
    type: PCRItemType.ProjectTermination,
    typeName: "End the project early",
    ignoredCompetitions: [SalesforceCompetitionTypes.loans],
    i18nName: x => x.pcrTypes.projectTermination,
    i18nDescription: x => x.pages.pcrModifyOptions.endProjectEarlyMessage,
    deprecated: true,
    singleInstanceInAnyPcr: false,
    singleInstanceInThisPcr: true,
  },
  {
    type: PCRItemType.LoanDrawdownChange,
    typeName: "Loan Drawdown Change",
    ignoredCompetitions: [
      SalesforceCompetitionTypes.crnd,
      SalesforceCompetitionTypes.contracts,
      SalesforceCompetitionTypes.ktp,
      SalesforceCompetitionTypes.catapults,
      SalesforceCompetitionTypes.edge,
      SalesforceCompetitionTypes.sbri,
      SalesforceCompetitionTypes.sbriIfs,
      SalesforceCompetitionTypes.horizonEurope,
    ],
    i18nName: x => x.pcrTypes.loanDrawdownChange,
    i18nDescription: x => x.pages.pcrModifyOptions.loanDrawdownChangeMessage,
    singleInstanceInAnyPcr: true,
    singleInstanceInThisPcr: true,
  },
  {
    type: PCRItemType.LoanDrawdownExtension,
    typeName: "Change Loans Duration",
    ignoredCompetitions: [
      SalesforceCompetitionTypes.crnd,
      SalesforceCompetitionTypes.contracts,
      SalesforceCompetitionTypes.ktp,
      SalesforceCompetitionTypes.catapults,
      SalesforceCompetitionTypes.edge,
      SalesforceCompetitionTypes.sbri,
      SalesforceCompetitionTypes.sbriIfs,
      SalesforceCompetitionTypes.horizonEurope,
    ],
    i18nName: x => x.pcrTypes.loanDrawdownExtension,
    i18nDescription: x => x.pages.pcrModifyOptions.loanDrawdownExtensionMessage,
    singleInstanceInAnyPcr: true,
    singleInstanceInThisPcr: true,
  },
];

export const pcrItems = [
  PCRItemType.AccountNameChange,
  PCRItemType.PartnerAddition,
  PCRItemType.PartnerWithdrawal,
  PCRItemType.ProjectSuspension,
  PCRItemType.ProjectTermination,
  PCRItemType.MultiplePartnerFinancialVirement,
  PCRItemType.ScopeChange,
  PCRItemType.TimeExtension,
  PCRItemType.PeriodLengthChange,
  PCRItemType.LoanDrawdownChange,
  PCRItemType.LoanDrawdownExtension,
] as const;

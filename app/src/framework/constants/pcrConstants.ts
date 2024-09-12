import { ContentSelector } from "@copy/type";
import { PCRItemSummaryDto, PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { SalesforceCompetitionTypes } from "./competitionTypes";
import { FormTypes } from "@ui/zod/FormTypes";
import { ProjectChangeRequest } from "./recordTypes";

export enum PCRStatus {
  Unknown = 0,

  // Current Values
  DraftWithProjectManager = 1,
  SubmittedToMonitoringOfficer = 2,
  QueriedByMonitoringOfficer = 3,
  SubmittedToInnovateUK = 12,
  QueriedToProjectManager = 13,
  Withdrawn = 9,
  Rejected = 8,
  AwaitingAmendmentLetter = 16,
  Approved = 10,

  // Salesforce "Inactive Values"
  DeprecatedSubmittedToInnovationLead = 4,
  DeprecatedQueriedByInnovateUK = 5,
  DeprecatedInExternalReview = 6,
  DeprecatedInReviewWithInnovateUK = 7,
  DeprecatedInReviewWithProjectFinance = 14,
  DeprecatedActioned = 11,
  DeprecatedReadyForApproval = 15,
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

export enum PCRItemHiddenReason {
  None = 0,
  AnotherPcrAlreadyHasThisType = 1,
  ThisPcrAlreadyHasThisType = 2,
  NotEnoughPartnersToActionThisType = 3,
  Exclusive = 4,
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
  ApproveNewSubcontractor = 130,
  Uplift = 140,
  ManageTeamMembers = 150,
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

export const enum PCRStepType {
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

  // Approve a new subcontractor workflow ID
  approveNewContractorNameStep = "approveNewContractorNameStep",
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

/**
 * You know, CRUD...
 */
export enum ManageTeamMemberMethod {
  CREATE = FormTypes.ProjectManageTeamMembersCreate,
  REPLACE = FormTypes.ProjectManageTeamMembersReplace,
  UPDATE = FormTypes.ProjectManageTeamMembersUpdate,
  DELETE = FormTypes.ProjectManageTeamMembersDelete,
  UNKNOWN = "unknownManageTeamMemberMethod",
}

export const ManageTeamMemberMethods = [
  ManageTeamMemberMethod.CREATE,
  ManageTeamMemberMethod.REPLACE,
  ManageTeamMemberMethod.UPDATE,
  ManageTeamMemberMethod.DELETE,
];

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
  pcrs: (Pick<PCRSummaryDto, "status" | "id"> & { items: Pick<PCRItemSummaryDto, "type">[] })[],
): PCRItemType[] => {
  // Note: Avoid wasting time upfront
  if (!pcrs.length) return [];

  const statusesToIgnore: PCRStatus[] = [
    PCRStatus.Rejected,
    PCRStatus.Withdrawn,
    PCRStatus.Approved,
    PCRStatus.DeprecatedActioned,
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
      if (pcrItemTypes.find(x => x.type === type)?.singleInstanceInAnyPcr) {
        disallowedPCRs.add(type);
      }
    }
  }

  return [...disallowedPCRs];
};

/**
 * Return a list of all invalid PCR types because a type can only exist once in the current PCR
 *
 * @param pcr The current PCR.
 * @param pcr.items The current PCR items. If none available, will return no invalid types.
 * @returns List of PCRs that cannot be added.
 */
export const getPcrItemsSingleInstanceInThisPcrViolations = (pcr?: {
  items: { type: PCRItemType }[];
}): PCRItemType[] => {
  if (!pcr?.items) return [];
  const pcrItemType: PCRItemType[] = [];

  // For each PCR item in our list of items...
  for (const pcrItem of pcr.items) {
    if (unduplicatablePcrItems.includes(pcrItem.type)) {
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
  currentPcr?: Pick<PCRSummaryDto, "status" | "id"> & { items: Pick<PCRItemSummaryDto, "type">[] },
): PCRItemType[] => {
  if (!currentPcr) return [];

  const bannedTypes = new Set<PCRItemType>();

  let numberOfAdditions = 0;
  let numberOfRenames = 0;
  let numberOfRemoves = 0;

  for (const item of currentPcr.items ?? []) {
    if (item.type === PCRItemType.PartnerAddition) numberOfAdditions += 1;
    if (item.type === PCRItemType.PartnerWithdrawal) numberOfRemoves += 1;
    if (item.type === PCRItemType.AccountNameChange) numberOfRenames += 1;
  }

  const maxNumberOfRemoves = numberOfAdditions === 0 ? numberOfPartners : numberOfPartners + 1;
  const maxNumberOfRenames = numberOfPartners;
  const maxNumberOfBoth = numberOfPartners;

  if (numberOfRenames >= maxNumberOfRenames) {
    bannedTypes.add(PCRItemType.AccountNameChange);
  }
  if (numberOfRemoves >= maxNumberOfRemoves) {
    bannedTypes.add(PCRItemType.PartnerWithdrawal);
  }
  if (numberOfRenames + numberOfRemoves >= maxNumberOfBoth) {
    bannedTypes.add(PCRItemType.AccountNameChange);
    bannedTypes.add(PCRItemType.PartnerWithdrawal);
  }

  return [...bannedTypes.values()];
};

export const getPcrItemsExclusivityViolations = (currentPcr?: { items: unknown[] }): PCRItemType[] => {
  if (!currentPcr?.items) return [];

  // Theoretically a header record can't be created with no items
  // However, someone internally is bound to break the system
  if (currentPcr.items.length === 0) return [];

  // If there are any PCR items, we disallow adding any more exclusive shiny pokemon
  return exclusiveItems;
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

export interface IPcrStatusMetaValue {
  status: PCRStatus;
  i18nName: ContentSelector;
  editableByPm: boolean;
  deletableByPm: boolean;
  reviewableByMo: boolean;
  archived: boolean;

  // For internal PCRs (aka Uplift)
  // Replaces the External facing status with a new Internal status
  i18nInternalName?: ContentSelector;
}

export const pcrStatusMetaValues: ReadonlyArray<IPcrStatusMetaValue> = [
  // Current Values
  {
    status: PCRStatus.Unknown,
    i18nName: x => x.pcrStatus.Unknown,
    i18nInternalName: x => x.pcrStatus.InternalInProgress,
    editableByPm: false,
    deletableByPm: false,
    reviewableByMo: false,
    archived: false,
  },
  {
    status: PCRStatus.DraftWithProjectManager,
    i18nName: x => x.pcrStatus.DraftWithProjectManager,
    i18nInternalName: x => x.pcrStatus.InternalInProgress,
    editableByPm: true,
    deletableByPm: true,
    reviewableByMo: false,
    archived: false,
  },
  {
    status: PCRStatus.SubmittedToMonitoringOfficer,
    i18nName: x => x.pcrStatus.SubmittedToMonitoringOfficer,
    i18nInternalName: x => x.pcrStatus.InternalInProgress,
    editableByPm: false,
    deletableByPm: false,
    reviewableByMo: true,
    archived: false,
  },
  {
    status: PCRStatus.QueriedByMonitoringOfficer,
    i18nName: x => x.pcrStatus.Queried,
    i18nInternalName: x => x.pcrStatus.InternalInProgress,
    editableByPm: true,
    deletableByPm: false,
    reviewableByMo: false,
    archived: false,
  },
  {
    status: PCRStatus.SubmittedToInnovateUK,
    i18nName: x => x.pcrStatus.SubmittedToInnovateUK,
    i18nInternalName: x => x.pcrStatus.InternalInProgress,
    editableByPm: false,
    deletableByPm: false,
    reviewableByMo: false,
    archived: false,
  },
  {
    status: PCRStatus.QueriedToProjectManager,
    i18nName: x => x.pcrStatus.Queried,
    i18nInternalName: x => x.pcrStatus.InternalInProgress,
    editableByPm: true,
    deletableByPm: false,
    reviewableByMo: false,
    archived: false,
  },
  {
    status: PCRStatus.Withdrawn,
    i18nName: x => x.pcrStatus.Withdrawn,
    editableByPm: false,
    deletableByPm: false,
    reviewableByMo: false,
    archived: true,
  },
  {
    status: PCRStatus.Rejected,
    i18nName: x => x.pcrStatus.Rejected,
    editableByPm: false,
    deletableByPm: false,
    reviewableByMo: false,
    archived: true,
  },
  {
    status: PCRStatus.AwaitingAmendmentLetter,
    i18nName: x => x.pcrStatus.AwaitingAmendmentLetter,
    i18nInternalName: x => x.pcrStatus.InternalInProgress,
    editableByPm: false,
    deletableByPm: false,
    reviewableByMo: false,
    archived: false,
  },
  {
    status: PCRStatus.Approved,
    i18nName: x => x.pcrStatus.Approved,
    editableByPm: false,
    deletableByPm: false,
    reviewableByMo: false,
    archived: true,
  },

  // Salesforce "Inactive Values"
  {
    status: PCRStatus.DeprecatedSubmittedToInnovationLead,
    i18nName: x => x.pcrStatus.SubmittedToInnovateUK,
    i18nInternalName: x => x.pcrStatus.InternalInProgress,
    editableByPm: false,
    deletableByPm: false,
    reviewableByMo: false,
    archived: false,
  },
  {
    status: PCRStatus.DeprecatedQueriedByInnovateUK,
    i18nName: x => x.pcrStatus.Queried,
    editableByPm: true,
    deletableByPm: false,
    reviewableByMo: false,
    archived: false,
  },
  {
    status: PCRStatus.DeprecatedInExternalReview,
    i18nName: x => x.pcrStatus.SubmittedToInnovateUK,
    i18nInternalName: x => x.pcrStatus.InternalInProgress,
    editableByPm: false,
    deletableByPm: false,
    reviewableByMo: false,
    archived: false,
  },
  {
    status: PCRStatus.DeprecatedInReviewWithInnovateUK,
    i18nName: x => x.pcrStatus.SubmittedToInnovateUK,
    i18nInternalName: x => x.pcrStatus.InternalInProgress,
    editableByPm: false,
    deletableByPm: false,
    reviewableByMo: false,
    archived: false,
  },
  {
    status: PCRStatus.DeprecatedActioned,
    i18nName: x => x.pcrStatus.Approved,
    editableByPm: false,
    deletableByPm: false,
    reviewableByMo: false,
    archived: true,
  },
  {
    status: PCRStatus.DeprecatedInReviewWithProjectFinance,
    i18nName: x => x.pcrStatus.SubmittedToInnovateUK,
    i18nInternalName: x => x.pcrStatus.InternalInProgress,
    editableByPm: false,
    deletableByPm: false,
    reviewableByMo: false,
    archived: false,
  },
  {
    status: PCRStatus.DeprecatedReadyForApproval,
    i18nName: x => x.pcrStatus.SubmittedToInnovateUK,
    i18nInternalName: x => x.pcrStatus.InternalInProgress,
    editableByPm: false,
    deletableByPm: false,
    reviewableByMo: false,
    archived: false,
  },
] as const;

export interface IMetaValue {
  ignoredCompetitions: SalesforceCompetitionTypes[];
  type: PCRItemType;
  typeName: string;
  developerRecordTypeName: ProjectChangeRequest;
  displayName?: string;
  i18nName?: ContentSelector;
  i18nDescription?: ContentSelector;
  files?: string[];
  guidance?: string;
  deprecated?: boolean;
  singleInstanceInAnyPcr?: boolean;
  singleInstanceInThisPcr?: boolean;

  /**
   * If this PCR Item exists, hide the Summary step in the entire PCR
   */
  disableSummary?: boolean;

  /**
   * Hide the "To do"/"Incomplete"/"Complete" status associated with a PCR Item
   */
  disableStatus?: boolean;

  /**
   * Whether to use internal statuses (map status to "In progress"/"Done")
   */
  enableInternalStatuses?: boolean;

  /**
   * Check if PCR Type successfully validates against Financial Virement DTO Validator
   */
  enableFinancialVirement?: boolean;

  /**
   * Exclusivity
   */
  exclusive?: boolean;
}

/**
 * @description There is no mechanism to support filtering, hence this manual list. The order dictates the UI order what will be presented.
 *
 * If the db has an entry but it is not defined here then it will not be available through the api.
 */
export const pcrItemTypes: IMetaValue[] = [
  {
    type: PCRItemType.MultiplePartnerFinancialVirement,
    typeName: "Reallocate several partners' project cost",
    developerRecordTypeName: ProjectChangeRequest.reallocateSeveralPartnersProjectCost,
    files: ["reallocate-project-costs.xlsx"],
    displayName: "Reallocate project costs",
    i18nName: x => x.pcrTypes.multiplePartnerFinancialVirement,
    i18nDescription: x => x.pages.pcrModifyOptions.reallocateCostsMessage,
    guidance: multiplePartnerFinancialVirementGuidance,
    ignoredCompetitions: [],
    singleInstanceInAnyPcr: true,
    singleInstanceInThisPcr: true,
    enableFinancialVirement: true,
  },
  {
    type: PCRItemType.PartnerWithdrawal,
    typeName: "Remove a partner",
    developerRecordTypeName: ProjectChangeRequest.partnerWithdrawal,
    ignoredCompetitions: [SalesforceCompetitionTypes.loans],
    i18nName: x => x.pcrTypes.partnerWithdrawal,
    i18nDescription: x => x.pages.pcrModifyOptions.removePartnerMessage,
    singleInstanceInAnyPcr: false,
    singleInstanceInThisPcr: false,
  },
  {
    type: PCRItemType.PartnerAddition,
    typeName: "Add a partner",
    developerRecordTypeName: ProjectChangeRequest.addAPartner,
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
    developerRecordTypeName: ProjectChangeRequest.changeProjectScope,
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
    developerRecordTypeName: ProjectChangeRequest.changeProjectDuration,
    ignoredCompetitions: [SalesforceCompetitionTypes.loans],
    i18nName: x => x.pcrTypes.timeExtension,
    i18nDescription: x => x.pages.pcrModifyOptions.changeDurationMessage,
    singleInstanceInAnyPcr: true,
    singleInstanceInThisPcr: true,
  },
  {
    type: PCRItemType.PeriodLengthChange,
    typeName: "Change period length",
    developerRecordTypeName: ProjectChangeRequest.changePeriodLength,
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
      SalesforceCompetitionTypes.combinedCapital,
    ],
    singleInstanceInAnyPcr: false,
    singleInstanceInThisPcr: true,
  },
  {
    type: PCRItemType.AccountNameChange,
    typeName: "Change a partner's name",
    developerRecordTypeName: ProjectChangeRequest.changeAPartnersName,
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
    developerRecordTypeName: ProjectChangeRequest.putProjectOnHold,
    ignoredCompetitions: [],
    i18nName: x => x.pcrTypes.projectSuspension,
    i18nDescription: x => x.pages.pcrModifyOptions.putProjectOnHoldMessage,
    singleInstanceInAnyPcr: true,
    singleInstanceInThisPcr: true,
  },
  {
    type: PCRItemType.ProjectTermination,
    typeName: "End the project early",
    developerRecordTypeName: ProjectChangeRequest.endProjectEarly,
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
    developerRecordTypeName: ProjectChangeRequest.loanDrawdownChange,
    ignoredCompetitions: [
      SalesforceCompetitionTypes.crnd,
      SalesforceCompetitionTypes.contracts,
      SalesforceCompetitionTypes.ktp,
      SalesforceCompetitionTypes.catapults,
      SalesforceCompetitionTypes.edge,
      SalesforceCompetitionTypes.sbri,
      SalesforceCompetitionTypes.sbriIfs,
      SalesforceCompetitionTypes.horizonEurope,
      SalesforceCompetitionTypes.combinedCapital,
    ],
    i18nName: x => x.pcrTypes.loanDrawdownChange,
    i18nDescription: x => x.pages.pcrModifyOptions.loanDrawdownChangeMessage,
    singleInstanceInAnyPcr: true,
    singleInstanceInThisPcr: true,
  },
  {
    type: PCRItemType.LoanDrawdownExtension,
    typeName: "Change Loans Duration",
    developerRecordTypeName: ProjectChangeRequest.changeLoansDuration,
    ignoredCompetitions: [
      SalesforceCompetitionTypes.crnd,
      SalesforceCompetitionTypes.contracts,
      SalesforceCompetitionTypes.ktp,
      SalesforceCompetitionTypes.catapults,
      SalesforceCompetitionTypes.edge,
      SalesforceCompetitionTypes.sbri,
      SalesforceCompetitionTypes.sbriIfs,
      SalesforceCompetitionTypes.horizonEurope,
      SalesforceCompetitionTypes.combinedCapital,
    ],
    i18nName: x => x.pcrTypes.loanDrawdownExtension,
    i18nDescription: x => x.pages.pcrModifyOptions.loanDrawdownExtensionMessage,
    singleInstanceInAnyPcr: true,
    singleInstanceInThisPcr: true,
  },
  {
    type: PCRItemType.ApproveNewSubcontractor,
    typeName: "Approve a new subcontractor",
    developerRecordTypeName: ProjectChangeRequest.approveNewSubcontractor,
    ignoredCompetitions: [SalesforceCompetitionTypes.ktp, SalesforceCompetitionTypes.loans],
    i18nName: x => x.pcrTypes.approveNewSubcontractor,
    i18nDescription: x => x.pages.pcrModifyOptions.approveNewSubcontractorMessage,
    singleInstanceInAnyPcr: false,
    singleInstanceInThisPcr: false,
  },
  {
    type: PCRItemType.Uplift,
    typeName: "Uplift",
    developerRecordTypeName: ProjectChangeRequest.uplift,
    i18nName: x => x.pcrTypes.uplift,
    ignoredCompetitions: [
      SalesforceCompetitionTypes.crnd,
      SalesforceCompetitionTypes.contracts,
      SalesforceCompetitionTypes.ktp,
      SalesforceCompetitionTypes.catapults,
      SalesforceCompetitionTypes.edge,
      SalesforceCompetitionTypes.sbri,
      SalesforceCompetitionTypes.sbriIfs,
      SalesforceCompetitionTypes.horizonEurope,
      SalesforceCompetitionTypes.combinedCapital,
      SalesforceCompetitionTypes.loans,
    ],
    disableSummary: true,
    disableStatus: true,
    enableInternalStatuses: true,
  },
  {
    type: PCRItemType.ManageTeamMembers,
    typeName: "Manage team members",
    developerRecordTypeName: ProjectChangeRequest.manageTeamMembers,
    i18nName: x => x.pcrTypes.manageTeamMembers,
    i18nDescription: x => x.pages.pcrModifyOptions.manageTeamMembersMessage,
    ignoredCompetitions: [],
    disableSummary: true,
    exclusive: true,
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
  PCRItemType.ApproveNewSubcontractor,
  PCRItemType.ManageTeamMembers,
] as const;

export const disableSummaryItems = pcrItemTypes.filter(x => x.disableSummary).map(x => x.type);
export const enableFinancialVirementItems = pcrItemTypes.filter(x => x.enableFinancialVirement).map(x => x.type);
export const unduplicatablePcrItems = pcrItemTypes.filter(x => x.singleInstanceInThisPcr).map(x => x.type);
export const exclusiveItems = pcrItemTypes.filter(x => x.exclusive).map(x => x.type);

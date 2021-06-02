import { PCRSummaryDto } from "@framework/dtos/pcrDtos";

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
  Complete = 3
}

export enum PCRItemType {
  Unknown = 0,
  AccountNameChange = 10,
  PartnerAddition = 20,
  PartnerWithdrawal = 30,
  ProjectSuspension = 40,
  ProjectTermination = 50,
  MultiplePartnerFinancialVirement = 60,
  SinglePartnerFinancialVirement = 70,
  ScopeChange = 80,
  TimeExtension = 90,
  PeriodLengthChange = 100,
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
  } else if (partnerType === PCRPartnerType.Business || partnerType === PCRPartnerType.Other || partnerType === PCRPartnerType.ResearchAndTechnology) {
    return PCROrganisationType.Industrial;
  }
  return PCROrganisationType.Unknown;
};

export function getUnavailablePcrItemsMatrix(pcrs: PCRSummaryDto[]): PCRItemType[] {
  // Note: Avoid wasting time upfront
  if (!pcrs.length) return [];

  const statusesToIgnore: PCRStatus[] = [
    PCRStatus.Rejected,
    PCRStatus.Withdrawn,
    PCRStatus.Approved,
    PCRStatus.Actioned,
  ];

  const filteredPcrs: PCRSummaryDto[] = pcrs.filter(x => !statusesToIgnore.includes(x.status));

  // Note: escape hatch if no available statuses found
  if (!filteredPcrs.length) return [];

  // Note: Matches business logic to prevent unneeded reconciliation with duplicate pcrs
  const pcrDisabledMatrix: Record<PCRItemType, PCRItemType[]> = {
    [PCRItemType.Unknown]: [],
    [PCRItemType.AccountNameChange]: [],
    [PCRItemType.PartnerAddition]: [],
    [PCRItemType.PartnerWithdrawal]: [],
    [PCRItemType.ProjectSuspension]: [],
    [PCRItemType.ProjectTermination]: [],
    [PCRItemType.MultiplePartnerFinancialVirement]: [PCRItemType.MultiplePartnerFinancialVirement],
    [PCRItemType.SinglePartnerFinancialVirement]: [],
    [PCRItemType.ScopeChange]: [PCRItemType.ScopeChange],
    [PCRItemType.TimeExtension]: [PCRItemType.TimeExtension],
    [PCRItemType.PeriodLengthChange]: [],
  };

  let matrixItems: PCRItemType[] = [];

  for (const filteredPcr of filteredPcrs) {
    const itemKeys = filteredPcr.items.map(x => x.type);

    for (const key of itemKeys) {
      matrixItems = [...matrixItems, ...pcrDisabledMatrix[key]];
    }
  }

  // Note: Remove duplicates on final parse
  return [...new Set([...matrixItems])];
}

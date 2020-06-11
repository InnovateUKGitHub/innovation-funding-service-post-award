export enum PCRStatus {
  Unknown = 0,
  Draft = 1,
  SubmittedToMonitoringOfficer = 2,
  QueriedByMonitoringOfficer = 3,
  SubmittedToInnovateUK = 12,
  QueriedByInnovateUK = 5,

  SubmittedToInnovationLead = 4,
  InExternalReview = 6,
  InReviewWithInnovateUK = 7,
  Rejected = 8,
  Withdrawn = 9,
  Approved = 10,
  Actioned = 11,
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

export type PCRSpendProfileOverheadRate = number | "calculated" | "unknown";

export enum PCRSpendProfileCapitalUsageType {
  Unknown = 0,
  New = 10,
  Existing = 20,
}

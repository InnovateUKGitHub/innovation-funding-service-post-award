export enum PCRStatus {
  Unknown = 0,
  Draft= 1,
  SubmittedToMonitoringOfficer= 2,
  QueriedByMonitoringOfficer= 3,
  SubmittedToInnovationLead= 4,
  QueriedByInnovateUK= 5,
  InExternalReview= 6,
  InReviewWithInnovateUK= 7,
  Rejected= 8,
  Withdrawn= 9,
  Approved= 10,
  Actioned= 11,
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
}

export interface PCR {
  id: string;
  projectId: string;
  number: number;
  started: Date;
  updated: Date;
  status: PCRStatus;
  statusName: string;
  reasoningStatus: PCRItemStatus;
  reasoningStatusName: string;
  reasoning: string;
  comments: string;
  items: PCRItem[];
}

export interface PCRItem {
  id: string;
  recordTypeId: string;
  pcrId: string;
  status: PCRItemStatus;
  statusName: string;
}

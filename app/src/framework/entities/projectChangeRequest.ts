export enum ProjectChangeRequestStatus {
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

export enum ProjectChangeRequestItemStatus {
  Unknown = 0,
  ToDo = 1,
  Incomplete = 2,
  Complete = 3
}

export enum ProjectChangeRequestItemTypeEntity {
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

export interface ProjectChangeRequestForCreateEntity {
  projectId: string;
  partnerId: string;
  status: ProjectChangeRequestStatus;
  reasoningStatus: ProjectChangeRequestItemStatus;
  items: ProjectChangeRequestItemForCreateEntity[];
}

export interface ProjectChangeRequestEntity extends ProjectChangeRequestForCreateEntity {
  id: string;
  number: number;
  started: Date;
  updated: Date;
  statusName: string;
  reasoningStatusName: string;
  reasoning: string;
  guidance: string;
  comments: string;
  items: ProjectChangeRequestItemEntity[];
}

export interface ProjectChangeRequestItemForCreateEntity {
  recordTypeId: string;
  status: ProjectChangeRequestItemStatus;
  partnerId: string;
  projectId: string;
}

export interface ProjectChangeRequestItemEntity extends ProjectChangeRequestItemForCreateEntity {
  id: string;
  statusName: string;
  guidance: string;
  pcrId: string;
}

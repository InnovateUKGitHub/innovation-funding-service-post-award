export enum PCRStatus {
  Unknown = 0,
}

export enum PCRItemStatus {
  Unknown = 0,
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
  items: {
    itemType: PCRItemType;
    itemTypeName: string;
  }[];
}

export interface PCRItem {
  id: string;
  pcrId: string;
  itemType: PCRItemType;
  itemTypeName: string;
  status: PCRItemStatus;
  statusName: string;
}

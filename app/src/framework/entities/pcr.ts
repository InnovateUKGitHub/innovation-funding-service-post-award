export enum PCRStatus {
  Unknown = 0,
}

export enum PCRItemStatus {
  Unknown = 0,
}

export enum PCRItemType {
  Unknown = 0,
  FinancialVirement = 1,
  PartnerAddition = 2,
  PartnerWithdrawal = 3,
  TimeExtension = 4,
  ProjectSuspension = 5,
  ScopeChange = 6,
  ProjectTermination  = 7,
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

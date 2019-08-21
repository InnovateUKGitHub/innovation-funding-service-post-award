export enum PCRStatus {
  Unknown = 0,
}

export enum PCRItemStatus {
  Unknown = 0,
}

export enum PCRItemType {
  Unknown = 0,
}

export interface PCR {
  id: string;
  projectId: string;
  number: number;
  started: Date;
  updated: Date;
  status: PCRStatus;
  reasoningStatus: PCRItemStatus;
  comments: string;
}

export interface PCRItem {
  id: string;
  pcrId: string;
  itemType: PCRItemType;
  status: PCRItemStatus;
}

import { PCRItemStatus, PCRItemType, PCRStatus, } from "@framework/entities";

export interface PCRBaseDto {
  id: string;
  requestNumber: number;
  started: Date;
  lastUpdated: Date;
  status: PCRStatus;
  statusName: string;
  projectId: string;
}

export interface PCRSummaryDto extends PCRBaseDto {
  items: {
    type: PCRItemType;
    typeName: string;
  }[];
}

export interface PCRDto extends PCRBaseDto {
  items: PCRItemDto[];
  comments: string;
  reasoningStatus: PCRItemStatus;
  reasoningStatusName: string;
  reasoningComments: string;
}

export interface PCRItemDto {
  id: string;
  type: PCRItemType;
  typeName: string;
  status: PCRItemStatus;
  statusName: string;
}

export interface PCRItemTypeDto {
  type: PCRItemType;
  displayName: string;
  recordTypeId: string;
  enabled: boolean;
}

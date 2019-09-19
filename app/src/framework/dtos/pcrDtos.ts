import { ProjectChangeRequestItemStatus, ProjectChangeRequestItemTypeEntity, ProjectChangeRequestStatus, } from "@framework/entities";

export interface PCRBaseDto {
  id: string;
  requestNumber: number;
  started: Date;
  lastUpdated: Date;
  status: ProjectChangeRequestStatus;
  statusName: string;
  projectId: string;
}

export interface PCRItemSummaryDto {
  type: ProjectChangeRequestItemTypeEntity;
  typeName: string;
}

export interface PCRSummaryDto extends PCRBaseDto {
  items: PCRItemSummaryDto[];
}

export interface PCRDto extends PCRBaseDto {
  items: PCRItemDto[];
  comments: string;
  guidance: string;
  reasoningStatus: ProjectChangeRequestItemStatus;
  reasoningStatusName: string;
  reasoningComments: string;
}

export interface PCRItemDto extends PCRItemSummaryDto {
  id: string;
  guidance: string;
  status: ProjectChangeRequestItemStatus;
  statusName: string;
}

export interface PCRItemTypeDto {
  type: ProjectChangeRequestItemTypeEntity;
  displayName: string;
  recordTypeId: string;
  enabled: boolean;
}

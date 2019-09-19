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

export interface PCRSummaryDto extends PCRBaseDto {
  items: {
    type: ProjectChangeRequestItemTypeEntity;
    typeName: string;
  }[];
}

export interface PCRDto extends PCRBaseDto {
  items: PCRItemDto[];
  comments: string;
  reasoningStatus: ProjectChangeRequestItemStatus;
  reasoningStatusName: string;
  reasoningComments: string;
}

export interface PCRItemDto {
  id: string;
  type: ProjectChangeRequestItemTypeEntity;
  typeName: string;
  status: ProjectChangeRequestItemStatus;
  statusName: string;
}

export interface PCRItemTypeDto {
  type: ProjectChangeRequestItemTypeEntity;
  displayName: string;
  recordTypeId: string;
  enabled: boolean;
}

export interface ProjectChangeRequestStatusChangeDto {
  id: string;
  projectChangeRequest: string;
  name: string;
  previousStatus: string;
  newStatus: string;
  createdDate: Date;
}

import { ProjectChangeRequestItemStatus, ProjectChangeRequestItemTypeEntity, ProjectChangeRequestStandardItemTypes, ProjectChangeRequestStatus, } from "@framework/entities";

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
  items: (TypedPcrItemDto)[];
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

export type TypedPcrItemDto = PCRStandardItemDto | PCRItemForTimeExtensionDto | PCRItemForScopeChangeDto;

export interface PCRStandardItemDto extends PCRItemDto {
  type: ProjectChangeRequestStandardItemTypes;
}

export interface PCRItemForTimeExtensionDto extends PCRItemDto {
  type: ProjectChangeRequestItemTypeEntity.TimeExtension;
  projectEndDate: Date | null;
}

export interface PCRItemForScopeChangeDto extends PCRItemDto {
  type: ProjectChangeRequestItemTypeEntity.ScopeChange;
  publicDescription: string | null;
  projectSummary: string | null;
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
  previousStatus: string;
  newStatus: string;
  createdDate: Date;
  participantVisibility: boolean;
  comments: string | null;
}

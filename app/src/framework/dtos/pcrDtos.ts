import { ProjectChangeRequestItemStatus, ProjectChangeRequestItemTypeEntity, ProjectChangeRequestStandardItemTypes, ProjectChangeRequestStatus, } from "@framework/entities";

interface PCRBaseDto {
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
  items: (PCRItemDto)[];
  comments: string;
  guidance: string;
  reasoningStatus: ProjectChangeRequestItemStatus;
  reasoningStatusName: string;
  reasoningComments: string;
}

interface PCRItemBaseDto extends PCRItemSummaryDto {
  id: string;
  guidance: string;
  status: ProjectChangeRequestItemStatus;
  statusName: string;
}

export type PCRItemDto =
  PCRStandardItemDto |
  PCRItemForTimeExtensionDto |
  PCRItemForScopeChangeDto |
  PCRItemForProjectSuspensionDto |
  PCRItemForAccountNameChangeDto |
  PCRItemForProjectTerminationDto;

export interface PCRStandardItemDto extends PCRItemBaseDto {
  type: ProjectChangeRequestStandardItemTypes;
}

export interface PCRItemForTimeExtensionDto extends PCRItemBaseDto {
  type: ProjectChangeRequestItemTypeEntity.TimeExtension;
  projectEndDate: Date | null;
}

export interface PCRItemForScopeChangeDto extends PCRItemBaseDto {
  type: ProjectChangeRequestItemTypeEntity.ScopeChange;
  publicDescription: string | null;
  projectSummary: string | null;
}

export interface PCRItemForProjectSuspensionDto extends PCRItemBaseDto {
  type: ProjectChangeRequestItemTypeEntity.ProjectSuspension;
  suspensionStartDate: Date | null;
  suspensionEndDate: Date | null;
}

export interface PCRItemForAccountNameChangeDto extends PCRItemBaseDto {
  type: ProjectChangeRequestItemTypeEntity.AccountNameChange;
  accountName: string | null;
  partnerId: string | null;
}

export interface PCRItemForProjectTerminationDto extends PCRItemBaseDto {
  type: ProjectChangeRequestItemTypeEntity.ProjectTermination;
}

export interface PCRItemTypeDto {
  type: ProjectChangeRequestItemTypeEntity;
  displayName: string;
  recordTypeId: string;
  enabled: boolean;
  files: { name: string, relativeUrl: string}[];
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

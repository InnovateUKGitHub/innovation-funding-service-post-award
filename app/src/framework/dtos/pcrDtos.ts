import {
  PCRItemStatus,
  PCRItemType,
  PCRProjectRole,
  PCRStatus
} from "@framework/constants";

interface PCRBaseDto {
  id: string;
  requestNumber: number;
  started: Date;
  lastUpdated: Date;
  status: PCRStatus;
  statusName: string;
  projectId: string;
}

export interface PCRItemSummaryDto {
  type: PCRItemType;
  typeName: string;
  shortName: string;
}

export interface PCRSummaryDto extends PCRBaseDto {
  items: PCRItemSummaryDto[];
}

export interface PCRDto extends PCRBaseDto {
  items: (PCRItemDto)[];
  comments: string;
  reasoningStatus: PCRItemStatus;
  reasoningStatusName: string;
  reasoningComments: string;
}

interface PCRItemBaseDto extends PCRItemSummaryDto {
  id: string;
  guidance?: string;
  status: PCRItemStatus;
  statusName: string;
}

export type PCRItemDto =
  PCRStandardItemDto |
  PCRItemForTimeExtensionDto |
  PCRItemForScopeChangeDto |
  PCRItemForProjectSuspensionDto |
  PCRItemForAccountNameChangeDto |
  PCRItemForProjectTerminationDto |
  PCRItemForPartnerAdditionDto |
  PCRItemForPartnerWithdrawalDto;

export type ProjectChangeRequestStandardItemTypes = (
  PCRItemType.MultiplePartnerFinancialVirement|
  PCRItemType.SinglePartnerFinancialVirement
  );

export interface PCRStandardItemDto extends PCRItemBaseDto {
  type: ProjectChangeRequestStandardItemTypes;
}

export interface PCRItemForTimeExtensionDto extends PCRItemBaseDto {
  type: PCRItemType.TimeExtension;
  additionalMonths: number | null;
  projectDurationSnapshot: number;
}

export interface PCRItemForScopeChangeDto extends PCRItemBaseDto {
  type: PCRItemType.ScopeChange;
  publicDescription: string | null;
  projectSummary: string | null;
  publicDescriptionSnapshot: string | null;
  projectSummarySnapshot: string | null;
}

export interface PCRItemForProjectSuspensionDto extends PCRItemBaseDto {
  type: PCRItemType.ProjectSuspension;
  suspensionStartDate: Date | null;
  suspensionEndDate: Date | null;
}

export interface PCRItemForAccountNameChangeDto extends PCRItemBaseDto {
  type: PCRItemType.AccountNameChange;
  accountName: string | null;
  partnerId: string | null;
  partnerNameSnapshot: string | null;
}

export interface PCRItemForPartnerWithdrawalDto extends PCRItemBaseDto {
  type: PCRItemType.PartnerWithdrawal;
  partnerNameSnapshot: string | null;
  withdrawalDate: Date | null;
  partnerId: string | null;
}

export interface PCRItemForProjectTerminationDto extends PCRItemBaseDto {
  type: PCRItemType.ProjectTermination;
}

export interface PCRItemForPartnerAdditionDto extends PCRItemBaseDto {
  type: PCRItemType.PartnerAddition;
  projectRole: PCRProjectRole;
  partnerType: string | null; // TODO check this
}

export interface PCRItemTypeDto {
  type: PCRItemType;
  displayName: string;
  recordTypeId: string;
  enabled: boolean;
  files: { name: string, relativeUrl: string}[];
}

export interface ProjectChangeRequestStatusChangeDto {
  id: string;
  projectChangeRequest: string;
  newStatus: PCRStatus;
  newStatusLabel: string;
  previousStatus: PCRStatus;
  previousStatusLabel: string;
  createdDate: Date;
  participantVisibility: boolean;
  createdBy: string;
  comments: string | null;
}

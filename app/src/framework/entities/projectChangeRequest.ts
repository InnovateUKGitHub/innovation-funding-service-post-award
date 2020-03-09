import {
  PCRItemStatus,
  PCRStatus
} from "@framework/constants";

export interface ProjectChangeRequestForCreateEntity {
  projectId: string;
  status: PCRStatus;
  reasoningStatus: PCRItemStatus;
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
  comments: string;
  items: ProjectChangeRequestItemEntity[];
}

export interface ProjectChangeRequestItemForCreateEntity {
  recordTypeId: string;
  status: PCRItemStatus;
  projectId: string;
  projectDuration?: number | null;
  additionalMonths?: number | null;
  publicDescription?: string | null;
  accountName?: string | null;
  projectSummary?: string | null;
  suspensionStartDate?: Date | null;
  suspensionEndDate?: Date | null;
  partnerId?: string | null;
  withdrawalDate?: Date | null;
  removalPeriod?: number | null;
  projectRole?: string | null;
  partnerType?: string | null;
}

export interface ProjectChangeRequestItemEntity extends ProjectChangeRequestItemForCreateEntity {
  id: string;
  statusName: string;
  pcrId: string;
  shortName: string;
  publicDescriptionSnapshot?: string | null;
  projectSummarySnapshot?: string | null;
  partnerNameSnapshot?: string | null;
  projectDurationSnapshot?: number | null;
}

export interface ProjectChangeRequestStatusChangeEntity {
  id: string;
  pcrId: string;
  createdBy: string;
  createdDate: Date;
  previousStatus: PCRStatus;
  newStatus: PCRStatus;
  externalComments: string;
  participantVisibility: boolean;
}

import {
  PCRContactRole,
  PCRItemStatus,
  PCROrganisationType,
  PCRParticipantSize,
  PCRPartnerType,
  PCRProjectLocation,
  PCRProjectRole,
  PCRStatus,
  TypeOfAid,
} from "@framework/constants";

export interface ProjectChangeRequestForCreateEntity {
  items: ProjectChangeRequestItemForCreateEntity[];
  projectId: ProjectId;
  reasoningStatus: PCRItemStatus;
  status: PCRStatus;
}

export interface ProjectChangeRequestEntity extends ProjectChangeRequestForCreateEntity {
  comments: string;
  id: string;
  items: ProjectChangeRequestItemEntity[];
  number: number;
  reasoning: string;
  reasoningStatusName: string;
  started: Date;
  statusName: string;
  updated: Date;
}

export interface ProjectChangeRequestItemForCreateEntity {
  accountName?: string | null;
  availabilityPeriod?: number | null;
  availabilityPeriodChange?: number | null;
  awardRate?: number | null;
  contact1Email?: string | null;
  contact1Forename?: string | null;
  contact1Phone?: string | null;
  contact1ProjectRole?: PCRContactRole;
  contact1Surname?: string | null;
  contact2Email?: string | null;
  contact2Forename?: string | null;
  contact2Phone?: string | null;
  contact2ProjectRole?: PCRContactRole;
  contact2Surname?: string | null;
  extensionPeriod?: number | null;
  extensionPeriodChange?: number | null;
  financialYearEndDate?: Date | null;
  financialYearEndTurnover?: number | null;
  grantMovingOverFinancialYear?: number | null;
  hasOtherFunding?: boolean | null;
  isCommercialWork?: boolean | null;
  numberOfEmployees?: number | null;
  offsetMonths?: number;
  organisationName?: string | null;
  organisationType?: PCROrganisationType;
  participantSize?: PCRParticipantSize;
  participantSizeLabel?: string | null;
  partnerId?: PartnerId | null;
  partnerType?: PCRPartnerType;
  partnerTypeLabel?: string | null;
  projectCity?: string | null;
  projectDuration?: number | null;
  projectId: ProjectId;
  projectLocation?: PCRProjectLocation;
  projectLocationLabel?: string | null;
  projectPostcode?: string | null;
  projectRole?: PCRProjectRole;
  projectRoleLabel?: string | null;
  projectStartDate?: Date | null;
  projectSummary?: string | null;
  publicDescription?: string | null;
  recordTypeId: string;
  registeredAddress?: string | null;
  registrationNumber?: string | null;
  removalPeriod?: number | null;
  repaymentPeriod?: number | null;
  repaymentPeriodChange?: number | null;
  status: PCRItemStatus;
  suspensionEndDate?: Date | null;
  suspensionStartDate?: Date | null;
  tsbReference?: string | null;
}

export interface ProjectChangeRequestItemEntity extends ProjectChangeRequestItemForCreateEntity {
  id: string;
  partnerNameSnapshot?: string | null;
  pcrId: string;
  projectDurationSnapshot?: number | null;
  projectSummarySnapshot?: string | null;
  publicDescriptionSnapshot?: string | null;
  shortName: string;
  statusName: string;
  totalOtherFunding?: number | null;
  typeOfAid: TypeOfAid;
}

export interface ProjectChangeRequestStatusChangeEntity {
  createdBy: string;
  createdDate: Date;
  externalComments: string;
  id: string;
  newStatus: PCRStatus;
  participantVisibility: boolean;
  pcrId: string;
  previousStatus: PCRStatus;
}

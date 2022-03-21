import {
  PCRContactRole,
  PCRItemStatus,
  PCROrganisationType,
  PCRParticipantSize,
  PCRPartnerType,
  PCRProjectLocation,
  PCRProjectRole,
  PCRStatus,
  TypeOfAid
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
  offsetMonths?: number;
  publicDescription?: string | null;
  accountName?: string | null;
  projectSummary?: string | null;
  suspensionStartDate?: Date | null;
  suspensionEndDate?: Date | null;
  partnerId?: string | null;
  removalPeriod?: number | null;

  // add partner
  projectRole?: PCRProjectRole;
  projectRoleLabel?: string | null;
  partnerType?: PCRPartnerType;
  organisationType?: PCROrganisationType;
  partnerTypeLabel?: string | null;
  isCommercialWork?: boolean | null;
  organisationName?: string | null;
  registeredAddress?: string | null;
  registrationNumber?: string | null;
  participantSize?: PCRParticipantSize;
  participantSizeLabel?: string | null;
  numberOfEmployees?: number | null;
  financialYearEndDate?: Date | null;
  financialYearEndTurnover?: number | null;
  projectLocation?: PCRProjectLocation;
  projectLocationLabel?: string | null;
  projectCity?: string | null;
  projectPostcode?: string | null;
  contact1ProjectRole?: PCRContactRole;
  contact1Forename?: string | null;
  contact1Surname?: string | null;
  contact1Phone?: string | null;
  contact1Email?: string | null;
  contact2ProjectRole?: PCRContactRole;
  contact2Forename?: string | null;
  contact2Surname?: string | null;
  contact2Phone?: string | null;
  contact2Email?: string | null;
  awardRate?: number | null;
  hasOtherFunding?: boolean | null;
  tsbReference?: string | null;

  // Partner Virements
  grantMovingOverFinancialYear?: number | null;
}

export interface ProjectChangeRequestItemEntity extends ProjectChangeRequestItemForCreateEntity {
  id: string;
  typeOfAid: TypeOfAid;
  statusName: string;
  pcrId: string;
  shortName: string;
  publicDescriptionSnapshot?: string | null;
  projectSummarySnapshot?: string | null;
  partnerNameSnapshot?: string | null;
  projectDurationSnapshot?: number | null;
  totalOtherFunding?: number | null;
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

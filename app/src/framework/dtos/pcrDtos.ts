import {
  PCRStatus,
  PCRItemType,
  PCRItemStatus,
  PCRContactRole,
  PCROrganisationType,
  PCRParticipantSize,
  PCRPartnerType,
  PCRProjectLocation,
  PCRProjectRole,
  PCRItemHiddenReason,
} from "@framework/constants/pcrConstants";
import { TypeOfAid } from "@framework/constants/project";
import { PcrSpendProfileDto } from "@framework/dtos/pcrSpendProfileDto";

interface PCRBaseDto {
  id: PcrId;
  lastUpdated: Date;
  projectId: ProjectId;
  requestNumber: number;
  started: Date;
  status: PCRStatus;
  statusName: string;
}

export interface PCRItemSummaryDto {
  shortName: string;
  type: PCRItemType;
  typeName: string;
}

export interface PCRSummaryDto extends PCRBaseDto {
  items: PCRItemSummaryDto[];
}

export interface PCRDto extends PCRBaseDto {
  comments: string;
  items: PCRItemDto[];
  reasoningComments: string;
  reasoningStatus: PCRItemStatus;
  reasoningStatusName: string;
}

export interface StandalonePcrDto extends PCRBaseDto {
  type: PCRItemType;
}

export interface PCRItemBaseDto extends PCRItemSummaryDto {
  guidance?: string;
  id: PcrItemId;
  status: PCRItemStatus;
  statusName: string;
}

export type CreatePcrItemDto = Pick<PCRItemDto, "type" | "status">;
export type CreatePcrDto = Pick<PCRDto, "projectId" | "reasoningStatus" | "status"> & {
  items: CreatePcrItemDto[];
};

export type PCRItemDto =
  | PCRItemForAccountNameChangeDto
  | PCRItemForLoanDrawdownChangeDto
  | PCRItemForLoanDrawdownExtensionDto
  | PCRItemForMultiplePartnerFinancialVirementDto
  | PCRItemForPartnerAdditionDto
  | PCRItemForPartnerWithdrawalDto
  | PCRItemForPeriodLengthChangeDto
  | PCRItemForProjectSuspensionDto
  | PCRItemForProjectTerminationDto
  | PCRItemForScopeChangeDto
  | PCRItemForTimeExtensionDto
  | PCRItemForApproveNewSubcontractorDto
  | PCRItemForUpliftDto
  | PCRItemForManageTeamMembersDto;

export interface PCRItemForMultiplePartnerFinancialVirementDto extends PCRItemBaseDto {
  grantMovingOverFinancialYear: number | null;
  type: PCRItemType.MultiplePartnerFinancialVirement;
}

export interface PCRItemForTimeExtensionDto extends PCRItemBaseDto {
  offsetMonths: number;
  projectDurationSnapshot: number;
  type: PCRItemType.TimeExtension;
}

export interface PCRItemForScopeChangeDto extends PCRItemBaseDto {
  projectSummary: string | null;
  projectSummarySnapshot: string | null;
  publicDescription: string | null;
  publicDescriptionSnapshot: string | null;
  type: PCRItemType.ScopeChange;
}

export interface PCRItemForProjectSuspensionDto extends PCRItemBaseDto {
  suspensionEndDate: Date | null;
  suspensionStartDate: Date | null;
  type: PCRItemType.ProjectSuspension;
}

export interface PCRItemForAccountNameChangeDto extends PCRItemBaseDto {
  accountName: string | null;
  partnerId: PartnerId | null;
  partnerNameSnapshot: string | null;
  type: PCRItemType.AccountNameChange;
}

export interface PCRItemForPartnerWithdrawalDto extends PCRItemBaseDto {
  partnerId: PartnerId | null;
  partnerNameSnapshot: string | null;
  removalPeriod: number | null;
  type: PCRItemType.PartnerWithdrawal;
}

export interface PCRItemForProjectTerminationDto extends PCRItemBaseDto {
  type: PCRItemType.ProjectTermination;
}

export interface PCRItemForPeriodLengthChangeDto extends PCRItemBaseDto {
  type: PCRItemType.PeriodLengthChange;
}

export interface PCRItemForLoanDrawdownChangeDto extends PCRItemBaseDto {
  type: PCRItemType.LoanDrawdownChange;
}

export interface PCRItemForUpliftDto extends PCRItemBaseDto {
  type: PCRItemType.Uplift;
}

export interface PCRItemForLoanDrawdownExtensionDto extends PCRItemBaseDto {
  availabilityPeriod: number | null;
  availabilityPeriodChange: number | null;
  extensionPeriod: number | null;
  extensionPeriodChange: number | null;
  projectStartDate: Date | null;
  repaymentPeriod: number | null;
  repaymentPeriodChange: number | null;
  type: PCRItemType.LoanDrawdownExtension;
}

export interface PCRItemForPartnerAdditionDto extends PCRItemBaseDto {
  awardRate: number | null;
  contact1Email: string | null;
  contact1Forename: string | null;
  contact1Phone: string | null;
  contact1ProjectRole: PCRContactRole;
  contact1Surname: string | null;
  contact2Email: string | null;
  contact2Forename: string | null;
  contact2Phone: string | null;
  contact2ProjectRole: PCRContactRole;
  contact2Surname: string | null;
  financialYearEndDate: Date | null;
  financialYearEndTurnover: number | null;
  hasOtherFunding: boolean | null;
  isCommercialWork: boolean | null;
  // isProjectRoleAndPartnerTypeRequired is used to determine validation only. It is set by the client and not retrieved or saved to salesforce.
  isProjectRoleAndPartnerTypeRequired?: boolean;
  numberOfEmployees: number | null;
  organisationName: string | null;
  organisationType: PCROrganisationType;
  participantSize: PCRParticipantSize;
  participantSizeLabel: string | null;
  partnerType: PCRPartnerType;
  partnerTypeLabel: string | null;
  projectCity: string | null;
  projectLocation: PCRProjectLocation;
  projectLocationLabel: string | null;
  projectPostcode: string | null;
  projectRole: PCRProjectRole;
  projectRoleLabel: string | null;
  registeredAddress: string | null;
  registrationNumber: string | null;
  spendProfile: PcrSpendProfileDto;
  totalOtherFunding: number | null;
  tsbReference: string | null;
  type: PCRItemType.PartnerAddition;
  typeOfAid: TypeOfAid;
}

export interface PCRItemForApproveNewSubcontractorDto extends PCRItemBaseDto {
  type: PCRItemType.ApproveNewSubcontractor;
  subcontractorName: string | null;
  subcontractorRegistrationNumber: string | null;
  subcontractorRelationship: boolean | null;
  subcontractorRelationshipJustification: string | null;
  subcontractorLocation: string | null;
  subcontractorDescription: string | null;
  subcontractorJustification: string | null;
  subcontractorCost: number | null;
}

export interface PCRItemForManageTeamMembersDto extends PCRItemBaseDto {
  type: PCRItemType.ManageTeamMembers;
  // TODO: FPD-1090
}

export interface PCRItemTypeDto {
  type: PCRItemType;
  displayName: string;
  recordTypeId: string;
  /**
   * @todo Refactor this to reduce confusion around the inverse of "disabled"
   * @description This refers to whether it should be available to the end user (visually available), consider renaming to isAvailable.
   */
  enabled: boolean;
  hidden: boolean;
  hiddenReason: PCRItemHiddenReason;
  files: { name: string; relativeUrl: string }[];
  standalone: boolean;
}

export interface ProjectChangeRequestStatusChangeDto {
  comments: string | null;
  createdBy: string;
  createdDate: Date;
  id: string;
  newStatus: PCRStatus;
  newStatusLabel: string;
  participantVisibility: boolean;
  previousStatus: PCRStatus;
  previousStatusLabel: string;
  projectChangeRequest: string;
}

export interface PCRTimeExtensionOption {
  label: string;
  offset: number;
}

export type ManageTeamMemberPcrDto = PCRBaseDto & {
  firstName?: string;
  lastName?: string;
  // previousFirstName?: string;
  // previousLastName?: string;
  email?: string;
  organisation?: string;
  role: string;
};

export type FullPCRItemDto = {
  accountName: string | null;
  availabilityPeriod: number | null;
  availabilityPeriodChange: number | null;
  awardRate: number | null;
  contact1Email: string | null;
  contact1Forename: string | null;
  contact1Phone: string | null;
  contact1ProjectRole: PCRContactRole;
  contact1Surname: string | null;
  contact2Email: string | null;
  contact2Forename: string | null;
  contact2Phone: string | null;
  contact2ProjectRole: PCRContactRole;
  contact2Surname: string | null;
  extensionPeriod: number | null;
  extensionPeriodChange: number | null;
  financialYearEndDate: Date | null;
  financialYearEndTurnover: number | null;
  grantMovingOverFinancialYear: number | null;
  guidance: string | undefined;
  hasOtherFunding: boolean | null;
  id: PcrItemId;
  isCommercialWork: boolean | null;
  isProjectRoleAndPartnerTypeRequired?: boolean;
  lastUpdated: Date;
  numberOfEmployees: number | null;
  offsetMonths: number;
  organisationName: string | null;
  organisationType: PCROrganisationType;
  participantSize: PCRParticipantSize;
  participantSizeLabel: string | null;
  partnerId: PartnerId | null;
  partnerNameSnapshot: string | null;
  partnerType: PCRPartnerType;
  partnerTypeLabel: string | null;
  projectCity: string | null;
  projectDurationSnapshot: number;
  projectId: ProjectId;
  projectLocation: PCRProjectLocation;
  projectLocationLabel: string | null;
  projectPostcode: string | null;
  projectRole: PCRProjectRole;
  projectRoleLabel: string | null;
  projectStartDate: Date | null;
  projectSummary: string | null;
  projectSummarySnapshot: string | null;
  publicDescription: string | null;
  publicDescriptionSnapshot: string | null;
  reasoningComments: string | null;
  registeredAddress: string | null;
  registrationNumber: string | null;
  removalPeriod: number | null;
  repaymentPeriod: number | null;
  repaymentPeriodChange: number | null;
  requestNumber: number;
  shortName: string;
  spendProfile: PcrSpendProfileDto;
  started: Date;
  status: PCRItemStatus;
  statusName: string;
  suspensionEndDate: Date | null;
  suspensionStartDate: Date | null;
  totalOtherFunding: number | null;
  tsbReference: string | null;
  type: PCRItemType;
  typeName: string;
  typeOfAid: TypeOfAid;
  subcontractorName: string | null;
  subcontractorRegistrationNumber: string | null;
  subcontractorRelationship: boolean | null;
  subcontractorRelationshipJustification: string | null;
  subcontractorLocation: string | null;
  subcontractorDescription: string | null;
  subcontractorJustification: string | null;
  subcontractorCost: number | null;
};

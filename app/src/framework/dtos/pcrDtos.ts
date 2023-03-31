import {
  PCRContactRole,
  PCRItemStatus,
  PCRItemType,
  PCROrganisationType,
  PCRParticipantSize,
  PCRPartnerType,
  PCRProjectLocation,
  PCRProjectRole,
  PCRStatus,
  TypeOfAid,
} from "@framework/constants";
import { PcrSpendProfileDto } from "@framework/dtos/pcrSpendProfileDto";

interface PCRBaseDto {
  id: string;
  requestNumber: number;
  started: Date;
  lastUpdated: Date;
  status: PCRStatus;
  statusName: string;
  projectId: ProjectId;
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
  items: PCRItemDto[];
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
  | PCRStandardItemDto
  | PCRItemForTimeExtensionDto
  | PCRItemForScopeChangeDto
  | PCRItemForProjectSuspensionDto
  | PCRItemForAccountNameChangeDto
  | PCRItemForProjectTerminationDto
  | PCRItemForPartnerAdditionDto
  | PCRItemForPartnerWithdrawalDto
  | PCRItemForMultiplePartnerFinancialVirementDto
  | PCRItemForPeriodLengthChangeDto
  | PCRItemForLoanDrawdownChangeDto
  | PCRItemForLoanDrawdownExtensionDto;

export type ProjectChangeRequestStandardItemTypes = PCRItemType.SinglePartnerFinancialVirement;

export interface PCRStandardItemDto extends PCRItemBaseDto {
  type: ProjectChangeRequestStandardItemTypes;
}

export interface PCRItemForMultiplePartnerFinancialVirementDto extends PCRItemBaseDto {
  type: PCRItemType.MultiplePartnerFinancialVirement;
  grantMovingOverFinancialYear: number | null;
}

export interface PCRItemForTimeExtensionDto extends PCRItemBaseDto {
  type: PCRItemType.TimeExtension;
  offsetMonths: number;
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
  partnerId: PartnerId | null;
  partnerNameSnapshot: string | null;
}

export interface PCRItemForPartnerWithdrawalDto extends PCRItemBaseDto {
  type: PCRItemType.PartnerWithdrawal;
  partnerNameSnapshot: string | null;
  partnerId: PartnerId | null;
  removalPeriod: number | null;
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
export interface PCRItemForLoanDrawdownExtensionDto extends PCRItemBaseDto {
  type: PCRItemType.LoanDrawdownExtension;
  projectStartDate: Date | null;
  availabilityPeriod: number | null;
  availabilityPeriodChange: number | null;
  extensionPeriod: number | null;
  extensionPeriodChange: number | null;
  repaymentPeriod: number | null;
  repaymentPeriodChange: number | null;
}

export interface PCRItemForPartnerAdditionDto extends PCRItemBaseDto {
  type: PCRItemType.PartnerAddition;
  // isProjectRoleAndPartnerTypeRequired is used to determine validation only. It is set by the client and not retrieved or saved to salesforce.
  isProjectRoleAndPartnerTypeRequired?: boolean;
  projectRole: PCRProjectRole;
  partnerType: PCRPartnerType;
  isCommercialWork: boolean | null;
  typeOfAid: TypeOfAid;
  organisationType: PCROrganisationType;
  spendProfile: PcrSpendProfileDto;
  projectRoleLabel: string | null;
  partnerTypeLabel: string | null;
  organisationName: string | null;
  registeredAddress: string | null;
  registrationNumber: string | null;
  participantSize: PCRParticipantSize;
  participantSizeLabel: string | null;
  numberOfEmployees: number | null;
  financialYearEndDate: Date | null;
  financialYearEndTurnover: number | null;
  projectLocation: PCRProjectLocation;
  projectLocationLabel: string | null;
  projectCity: string | null;
  projectPostcode: string | null;
  contact1ProjectRole: PCRContactRole;
  contact1Forename: string | null;
  contact1Surname: string | null;
  contact1Phone: string | null;
  contact1Email: string | null;
  contact2ProjectRole: PCRContactRole;
  contact2Forename: string | null;
  contact2Surname: string | null;
  contact2Phone: string | null;
  contact2Email: string | null;
  awardRate: number | null;
  hasOtherFunding: boolean | null;
  totalOtherFunding: number | null;
  tsbReference: string | null;
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
  disabled: boolean;
  files: { name: string; relativeUrl: string }[];
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

export interface PCRTimeExtensionOption {
  label: string;
  offset: number;
}

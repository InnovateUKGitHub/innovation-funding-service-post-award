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
  PCRItemDisabledReason,
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

interface PCRItemBaseDto extends PCRItemSummaryDto {
  guidance?: string;
  id: PcrItemId;
  status: PCRItemStatus;
  statusName: string;
}

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
  | PCRItemForTimeExtensionDto;

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
  disabledReason: PCRItemDisabledReason;
  files: { name: string; relativeUrl: string }[];
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
  guidance?: string;
  hasOtherFunding: boolean | null;
  id: PcrItemId;
  isCommercialWork: boolean | null;
  isProjectRoleAndPartnerTypeRequired?: boolean;
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
  registeredAddress: string | null;
  registrationNumber: string | null;
  removalPeriod: number | null;
  repaymentPeriod: number | null;
  repaymentPeriodChange: number | null;
  shortName: string;
  spendProfile: PcrSpendProfileDto;
  status: PCRItemStatus;
  statusName: string;
  suspensionEndDate: Date | null;
  suspensionStartDate: Date | null;
  totalOtherFunding: number | null;
  tsbReference: string | null;
  type: PCRItemType;
  typeName: string;
  typeOfAid: TypeOfAid;
};

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
  ManageTeamMemberMethod,
} from "@framework/constants/pcrConstants";
import { TypeOfAid } from "@framework/constants/project";
import { PcrSpendProfileDto } from "@framework/dtos/pcrSpendProfileDto";
import { ProjectRole } from "./projectContactDto";
import { FormTypes } from "@ui/zod/FormTypes";
import { CostCategoryType } from "@framework/constants/enums";

interface PCRBaseDto {
  id: PcrId;
  lastUpdated: Date;
  projectId: ProjectId;
  requestNumber: number;
  started: Date;
  status: PCRStatus;
  manageTeamMemberStatus: PCRStatus;
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

export type CreatePcrItemDto = PickRequiredFromPartial<PCRItemDto, "type" | "status">;
export type CreatePcrDto = Omit<
  Pick<PCRDto, "projectId" | "reasoningStatus" | "status" | "manageTeamMemberStatus">,
  "items"
> & {
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
  pclId: ProjectContactLinkId | null;
  partnerId: PartnerId | null; // Project Participant ID
  manageTeamMemberType: ManageTeamMemberMethod | null;
  manageTeamMemberFirstName: string | null;
  manageTeamMemberLastName: string | null;
  manageTeamMemberEmail: string | null;
  manageTeamMemberRole: ProjectRole | null;
  manageTeamMemberAssociateStartDate: Date | null;
}

export interface PCRItemTypeDto {
  type: PCRItemType;
  displayName: string;
  developerRecordTypeName: string;
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
  manageTeamMemberType: ManageTeamMemberMethod | null;
  manageTeamMemberFirstName: string | null;
  manageTeamMemberLastName: string | null;
  manageTeamMemberEmail: string | null;
  manageTeamMemberRole: ProjectRole | null;
  manageTeamMemberAssociateStartDate: Date | null;
  form?: FormTypes;
};

export type PCRTypeWithoutBase<T> = Omit<T, Exclude<keyof PCRItemBaseDto, "type">>;

interface PcrDtoCommon {
  status?: PCRItemStatus;
  markedAsComplete?: boolean;
}

export type ScopeChangeFormType =
  | FormTypes.PcrChangeProjectScopeProposedPublicDescriptionStepSaveAndContinue
  | FormTypes.PcrChangeProjectScopeProposedProjectSummaryStepSaveAndContinue
  | FormTypes.PcrChangeProjectScopeSummary;

export interface PcrScopeChangeDto extends PcrDtoCommon {
  publicDescription?: string;
  projectSummary?: string;
  form: ScopeChangeFormType;
}

export type RenamePartnerFormType =
  | FormTypes.PcrRenamePartnerStep
  | FormTypes.PcrRenamePartnerSummary
  | FormTypes.PcrRenamePartnerFilesStep;

export interface PcrRenamePartnerDto extends PcrDtoCommon {
  accountName: string | null;
  existingAccountName: string | null;
  partnerId: PartnerId | null;
  form: RenamePartnerFormType;
}

export type RemovePartnerFormType =
  | FormTypes.PcrRemovePartnerStep
  | FormTypes.PcrRemovePartnerSummary
  | FormTypes.PcrRemovePartnerFilesStep;

export interface PcrRemovePartnerDto extends PcrDtoCommon {
  numberOfPeriods: number | null;
  removalPeriod: number | null;
  partnerId: PartnerId | null;
  form: RemovePartnerFormType;
}

export type ChangeDurationFormType = FormTypes.PcrChangeDurationStep | FormTypes.PcrChangeDurationSummary;

export interface PcrChangeDurationDto extends PcrDtoCommon {
  timeExtension: string;
  form: ChangeDurationFormType;
}

export interface LoanDrawdownExtensionDto extends PcrDtoCommon {
  availabilityPeriodChange: string | number;
  extensionPeriodChange: string | number;
  repaymentPeriodChange: string | number;
  availabilityPeriod: number | null;
  extensionPeriod: number | null;
  repaymentPeriod: number | null;
  form: FormTypes.PcrLoanDurationChange | FormTypes.PcrLoanDurationChangeSummary;
}

export type SuspendProjectFormType = FormTypes.PcrProjectSuspensionStep | FormTypes.PcrProjectSuspensionSummary;

export interface PcrSuspendProjectDto extends PcrDtoCommon {
  suspensionStartDate: Date | null;
  suspensionEndDate: Date | null;
  suspensionStartDate_month: string;
  suspensionStartDate_year: string;
  suspensionEndDate_month: string;
  suspensionEndDate_year: string;
  projectStartDate: Date | null;
  projectEndDate: Date | null;
  form: SuspendProjectFormType;
}

export interface PcrAddPartnerRoleAndOrganisationDto extends PcrDtoCommon {
  form: FormTypes.PcrAddPartnerRoleAndOrganisationStep;
  button_submit: string;
  projectRole: number;
  isCommercialWork: string;
  partnerType: PCRPartnerType;
}

export interface PcrAddPartnerAcademicCostsDto extends PcrDtoCommon {
  form: FormTypes.PcrAddPartnerAcademicCostsStep;
  button_submit: string;
  tsbReference?: string;
  costs: Array<{
    costCategory: CostCategoryType;
    costCategoryId: CostCategoryId;
    description: string;
    id: CostId;
    value: string | null;
  }>;
}

export interface PcrAddPartnerAgreementToPcrDto extends PcrDtoCommon {
  form: FormTypes.PcrAddPartnerAgreementFilesStep;
  button_submit?: string;
}

export interface PcrAddPartnerAcademicOrganisationDto extends PcrDtoCommon {
  form: FormTypes.PcrAddPartnerAcademicOrganisationStep;
  button_submit: string;
  organisationName: string;
}

export interface PcrAddPartnerJesStepDto extends PcrDtoCommon {
  form: FormTypes.PcrAddPartnerJesFormStep;
  button_submit?: string;
}

export interface PcrAddPartnerOtherFundingDto extends PcrDtoCommon {
  form: FormTypes.PcrAddPartnerOtherFundingStep;
  button_submit: string;
  hasOtherFunding?: string;
}

export interface PcrAddPartnerOtherSourcesOfFundingDto extends PcrDtoCommon {
  form: FormTypes.PcrAddPartnerOtherSourcesOfFundingStep;
  button_submit: string;
  funds: Array<{
    dateSecured_month: string;
    dateSecured_year: string;
    dateSecured: Date | null;
    value: string | null;
    description: string;
    costCategory: CostCategoryType;
    costCategoryId: CostCategoryId;
    costId: CostId;
  }>;
  deletedCostsOrFunds: CostId[];
}

export interface PcrAddPartnerCompanyDetailsDto extends PcrDtoCommon {
  form: FormTypes.PcrAddPartnerCompaniesHouseStepSaveAndContinue | FormTypes.PcrAddPartnerCompaniesHouseStepSaveAndQuit;
  organisationName?: string;
  registrationNumber?: string;
  registeredAddress?: string;
}

export interface PcrAddPartnerOrganisationDetailsDto extends PcrDtoCommon {
  form: FormTypes.PcrAddPartnerOrganisationDetailsStep;
  button_submit: string;
  participantSize: number;
  numberOfEmployees: number | null;
}

export interface PcrAddPartnerProjectLocationDto extends PcrDtoCommon {
  form: FormTypes.PcrAddPartnerProjectLocationStep;
  button_submit: string;
  projectCity?: string;
  projectLocation?: number;
  projectPostcode?: string;
}

export interface PcrAddPartnerFinanceContactDto extends PcrDtoCommon {
  form: FormTypes.PcrAddPartnerFinanceContactStep;
  button_submit: string;
  contact1Email?: string;
  contact1Forename?: string;
  contact1Surname?: string;
  contact1Phone?: string;
}

export interface PcrAddPartnerFinancialDetailsDto extends PcrDtoCommon {
  form: FormTypes.PcrAddPartnerFinancialDetailsStep;
  financialYearEndTurnover: string | null;
  financialYearEndDate_month?: string;
  financialYearEndDate_year?: string;
  button_submit: string;
}

export interface PcrAddPartnerFundingLevelDto extends PcrDtoCommon {
  form: FormTypes.PcrAddPartnerAwardRateStep;
  button_submit: string;
  awardRate?: number | null;
}

export interface PcrAddPartnerProjectManagerDto extends PcrDtoCommon {
  form: FormTypes.PcrAddPartnerProjectManagerStep;
  button_submit: string;
  contact2Email?: string;
  contact2Forename?: string;
  contact2Surname?: string;
  contact2Phone?: string;
}

export interface PcrReplaceTeamMemberDto {
  form: FormTypes.ProjectManageTeamMembersReplace;
  pclId: ProjectContactLinkId;
  firstName: string;
  lastName: string;
  email: string;
  role: ProjectRole;
  partnerId: PartnerId;
}

export interface PcrInviteTeamMemberDto {
  form: FormTypes.ProjectManageTeamMembersCreate;
  firstName: string;
  lastName: string;
  email: string;
  role: ProjectRole.KNOWLEDGE_BASE_ADMINISTRATOR | ProjectRole.MAIN_COMPANY_CONTACT | ProjectRole.ASSOCIATE;
  startDate?: Date;
  partnerId: PartnerId;
}

export interface PcrUpdateTeamMemberDto {
  form: FormTypes.ProjectManageTeamMembersUpdate;
  pclId: ProjectContactLinkId;
  firstName: string;
  lastName: string;
  role: ProjectRole;
  partnerId: PartnerId;
  contactId: ContactId;
}

export interface PcrDeleteTeamMemberDto {
  form: FormTypes.ProjectManageTeamMembersDelete;
  pclId: ProjectContactLinkId;
  role: ProjectRole;
}

export interface PcrAddPartnerProjectCost {
  costCategoryType: CostCategoryType;
  id: CostId | null;
  costCategoryId: CostCategoryId;
}

export interface PcrAddPartnerProjectCostOtherCostDto extends PcrAddPartnerProjectCost {
  description: string | null;
  value: string | null;
  form: FormTypes.PcrAddPartnerSpendProfileOtherCost;
}

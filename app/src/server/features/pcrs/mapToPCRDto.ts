import {
  PCRItemType,
  PCRContactRole,
  PCRProjectRole,
  PCRPartnerType,
  PCROrganisationType,
  PCRProjectLocation,
  PCRParticipantSize,
  pcrItemTypes,
} from "@framework/constants/pcrConstants";
import { TypeOfAid } from "@framework/constants/project";
import {
  PCRItemTypeDto,
  PCRDto,
  PCRItemForProjectTerminationDto,
  PCRItemForPeriodLengthChangeDto,
  PCRItemForTimeExtensionDto,
  PCRItemForScopeChangeDto,
  PCRItemForProjectSuspensionDto,
  PCRItemForAccountNameChangeDto,
  PCRItemForPartnerWithdrawalDto,
  PCRItemForPartnerAdditionDto,
  PCRItemForMultiplePartnerFinancialVirementDto,
  PCRItemForLoanDrawdownChangeDto,
  PCRItemForLoanDrawdownExtensionDto,
  PCRItemForApproveNewSubcontractorDto,
  PCRItemForUpliftDto,
  PCRItemForManageTeamMembersDto,
  PCRTypeWithoutBase,
} from "@framework/dtos/pcrDtos";
import { ProjectChangeRequestEntity, ProjectChangeRequestItemEntity } from "@framework/entities/projectChangeRequest";
import { isBoolean } from "@framework/util/booleanHelper";
import { isNumber } from "@framework/util/numberHelper";

export const mapToPcrDto = (pcr: ProjectChangeRequestEntity, itemTypes: PCRItemTypeDto[]): PCRDto => ({
  id: pcr.id as PcrId,
  requestNumber: pcr.number,
  started: pcr.started,
  lastUpdated: pcr.updated,
  status: pcr.status,
  manageTeamMemberStatus: pcr.manageTeamMemberStatus,
  statusName: pcr.statusName,
  comments: pcr.comments,
  reasoningStatus: pcr.reasoningStatus,
  reasoningStatusName: pcr.reasoningStatusName,
  reasoningComments: pcr.reasoning,
  projectId: pcr.projectId,
  items: mapItems(pcr.items, itemTypes),
});

/**
 * Map a Salesforce PCR item within a PCR header to it's correct frontend PCR item DTO.
 *
 * @param pcrs The PCRs associated with the PCR header
 * @param itemTypes The valid PCR types associated with this competition type
 * @returns A list of PCR items
 */
const mapItems = (pcrs: ProjectChangeRequestItemEntity[], itemTypes: PCRItemTypeDto[]) => {
  return pcrs
    .map(x => ({
      pcr: x,
      itemType: itemTypes.find(itemType => x.recordTypeId === itemType.recordTypeId),
    }))
    .filter(({ itemType }) => itemType)
    .map(({ pcr, itemType }) => mapItem(pcr, itemType));
};

const mapItem = (pcr: ProjectChangeRequestItemEntity | undefined, itemType: PCRItemTypeDto | undefined) => {
  if (!pcr) throw new Error("Cannot map undefined pcr");
  const hasMapper = dtoHasMapper(itemType);
  const mapper = getMapper(itemType?.type);
  if (hasMapper && mapper) {
    return {
      ...mapBaseItem(pcr, itemType?.displayName, itemType?.type),
      ...mapper(pcr),
    };
  } else {
    throw new Error("No PCR mapper handler found");
  }
};

const dtoHasMapper = (itemDto: PCRItemTypeDto | undefined): itemDto is PCRItemTypeDto => !!getMapper(itemDto?.type);

export const getMapper = (type: PCRItemType | undefined) => {
  switch (type) {
    case PCRItemType.TimeExtension:
      return mapItemForTimeExtension;
    case PCRItemType.ScopeChange:
      return mapItemForScopeChange;
    case PCRItemType.ProjectSuspension:
      return mapItemForProjectSuspension;
    case PCRItemType.ProjectTermination:
      return mapItemForTermination;
    case PCRItemType.AccountNameChange:
      return mapItemForAccountNameChange;
    case PCRItemType.PartnerWithdrawal:
      return mapItemForPartnerWithdrawal;
    case PCRItemType.PartnerAddition:
      return mapItemForPartnerAddition;
    case PCRItemType.MultiplePartnerFinancialVirement:
      return mapItemForMultiplePartnerVirements;
    case PCRItemType.PeriodLengthChange:
      return mapItemForPeriodLengthChange;
    case PCRItemType.LoanDrawdownChange:
      return mapItemForLoansChangeDrawdown;
    case PCRItemType.LoanDrawdownExtension:
      return mapItemForChangeLoansDuration;
    case PCRItemType.ApproveNewSubcontractor:
      return mapItemForApproveNewSubcontractor;
    case PCRItemType.Uplift:
      return mapItemForUplift;
    case PCRItemType.ManageTeamMembers:
      return mapItemForManageTeamMembers;
    default:
      return null;
  }
};

const mapBaseItem = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: PCRItemType) => ({
  id: pcr.id as PcrItemId,
  guidance: pcrItemTypes.find(x => x.type === type)?.guidance,
  typeName,
  status: pcr.status,
  statusName: pcr.statusName,
  shortName: pcr.shortName || typeName,
});

const mapItemForTermination = (): PCRTypeWithoutBase<PCRItemForProjectTerminationDto> => ({
  type: PCRItemType.ProjectTermination,
});

const mapItemForPeriodLengthChange = (): PCRTypeWithoutBase<PCRItemForPeriodLengthChangeDto> => ({
  type: PCRItemType.PeriodLengthChange,
});

const mapItemForApproveNewSubcontractor = (
  pcr: Pick<
    ProjectChangeRequestItemEntity,
    | "subcontractorName"
    | "subcontractorRegistrationNumber"
    | "subcontractorRelationship"
    | "subcontractorRelationshipJustification"
    | "subcontractorLocation"
    | "subcontractorDescription"
    | "subcontractorJustification"
    | "subcontractorCost"
  >,
): PCRTypeWithoutBase<PCRItemForApproveNewSubcontractorDto> => ({
  subcontractorName: pcr.subcontractorName ?? null,
  subcontractorRegistrationNumber: pcr.subcontractorRegistrationNumber ?? null,
  subcontractorRelationship: pcr.subcontractorRelationship ?? null,
  subcontractorRelationshipJustification: pcr.subcontractorRelationshipJustification ?? null,
  subcontractorLocation: pcr.subcontractorLocation ?? null,
  subcontractorDescription: pcr.subcontractorDescription ?? null,
  subcontractorJustification: pcr.subcontractorJustification ?? null,
  subcontractorCost: pcr.subcontractorCost ?? null,
  type: PCRItemType.ApproveNewSubcontractor,
});

const mapItemForTimeExtension = (
  pcr: Pick<ProjectChangeRequestItemEntity, "offsetMonths" | "projectDurationSnapshot">,
): PCRTypeWithoutBase<PCRItemForTimeExtensionDto> => ({
  offsetMonths: pcr.offsetMonths ?? 0,
  projectDurationSnapshot: pcr.projectDurationSnapshot || 0,
  type: PCRItemType.TimeExtension,
});

const mapItemForScopeChange = (
  pcr: Pick<
    ProjectChangeRequestItemEntity,
    "projectSummary" | "publicDescription" | "projectSummarySnapshot" | "publicDescriptionSnapshot"
  >,
): PCRTypeWithoutBase<PCRItemForScopeChangeDto> => ({
  projectSummary: pcr.projectSummary || null,
  publicDescription: pcr.publicDescription || null,
  projectSummarySnapshot: pcr.projectSummarySnapshot || null,
  publicDescriptionSnapshot: pcr.publicDescriptionSnapshot || null,
  type: PCRItemType.ScopeChange,
});

const mapItemForProjectSuspension = (
  pcr: Pick<ProjectChangeRequestItemEntity, "suspensionStartDate" | "suspensionEndDate">,
): PCRTypeWithoutBase<PCRItemForProjectSuspensionDto> => ({
  suspensionStartDate: pcr.suspensionStartDate || null,
  suspensionEndDate: pcr.suspensionEndDate || null,
  type: PCRItemType.ProjectSuspension,
});

const mapItemForAccountNameChange = (
  pcr: Pick<ProjectChangeRequestItemEntity, "accountName" | "partnerId" | "partnerNameSnapshot">,
): PCRTypeWithoutBase<PCRItemForAccountNameChangeDto> => ({
  accountName: pcr.accountName || null,
  partnerId: pcr.partnerId || null,
  partnerNameSnapshot: pcr.partnerNameSnapshot || null,
  type: PCRItemType.AccountNameChange,
});

const mapItemForPartnerWithdrawal = (
  pcr: Pick<ProjectChangeRequestItemEntity, "partnerId" | "partnerNameSnapshot" | "removalPeriod">,
): PCRTypeWithoutBase<PCRItemForPartnerWithdrawalDto> => ({
  partnerId: pcr.partnerId || null,
  partnerNameSnapshot: pcr.partnerNameSnapshot || null,
  removalPeriod: pcr.removalPeriod || null,
  type: PCRItemType.PartnerWithdrawal,
});

const mapItemForPartnerAddition = (
  pcr: Pick<
    ProjectChangeRequestItemEntity,
    | "contact1ProjectRole"
    | "contact1Forename"
    | "contact1Surname"
    | "contact1Phone"
    | "contact1Email"
    | "financialYearEndDate"
    | "financialYearEndTurnover"
    | "organisationName"
    | "registeredAddress"
    | "registrationNumber"
    | "projectRole"
    | "partnerType"
    | "organisationType"
    | "projectRoleLabel"
    | "partnerTypeLabel"
    | "isCommercialWork"
    | "typeOfAid"
    | "projectLocation"
    | "projectLocationLabel"
    | "projectCity"
    | "projectPostcode"
    | "participantSize"
    | "participantSizeLabel"
    | "numberOfEmployees"
    | "contact2ProjectRole"
    | "contact2Forename"
    | "contact2Surname"
    | "contact2Phone"
    | "contact2Email"
    | "awardRate"
    | "hasOtherFunding"
    | "totalOtherFunding"
    | "tsbReference"
  > &
    Partial<Pick<ProjectChangeRequestItemEntity, "id">>,
): PCRTypeWithoutBase<PCRItemForPartnerAdditionDto> => {
  if (!pcr.id) throw new Error("ID must be specified");

  return {
    contact1ProjectRole: pcr.contact1ProjectRole || PCRContactRole.Unknown,
    contact1Forename: pcr.contact1Forename || null,
    contact1Surname: pcr.contact1Surname || null,
    contact1Phone: pcr.contact1Phone || null,
    contact1Email: pcr.contact1Email || null,
    financialYearEndDate: pcr.financialYearEndDate || null,
    financialYearEndTurnover: isNumber(pcr.financialYearEndTurnover) ? pcr.financialYearEndTurnover : null,
    organisationName: pcr.organisationName || null,
    registeredAddress: pcr.registeredAddress || null,
    registrationNumber: pcr.registrationNumber || null,
    projectRole: pcr.projectRole || PCRProjectRole.Unknown,
    partnerType: pcr.partnerType || PCRPartnerType.Unknown,
    organisationType: pcr.organisationType || PCROrganisationType.Unknown,
    projectRoleLabel: pcr.projectRoleLabel || null,
    partnerTypeLabel: pcr.partnerTypeLabel || null,
    isCommercialWork: isBoolean(pcr.isCommercialWork) ? pcr.isCommercialWork : null,
    typeOfAid: pcr.typeOfAid || TypeOfAid.Unknown,
    spendProfile: { costs: [], funds: [], pcrItemId: pcr.id },
    projectLocation: pcr.projectLocation || PCRProjectLocation.Unknown,
    projectLocationLabel: pcr.projectLocationLabel || null,
    projectCity: pcr.projectCity || null,
    projectPostcode: pcr.projectPostcode || null,
    participantSize: pcr.participantSize || PCRParticipantSize.Unknown,
    participantSizeLabel: pcr.participantSizeLabel || null,
    numberOfEmployees: isNumber(pcr.numberOfEmployees) ? pcr.numberOfEmployees : null,
    contact2ProjectRole: pcr.contact2ProjectRole || PCRContactRole.Unknown,
    contact2Forename: pcr.contact2Forename || null,
    contact2Surname: pcr.contact2Surname || null,
    contact2Phone: pcr.contact2Phone || null,
    contact2Email: pcr.contact2Email || null,
    awardRate: isNumber(pcr.awardRate) ? pcr.awardRate : null,
    hasOtherFunding: isBoolean(pcr.hasOtherFunding) ? pcr.hasOtherFunding : null,
    totalOtherFunding: isNumber(pcr.totalOtherFunding) ? pcr.totalOtherFunding : null,
    tsbReference: pcr.tsbReference || null,
    type: PCRItemType.PartnerAddition,
  };
};

const mapItemForMultiplePartnerVirements = (
  pcr: Pick<ProjectChangeRequestItemEntity, "grantMovingOverFinancialYear">,
): PCRTypeWithoutBase<PCRItemForMultiplePartnerFinancialVirementDto> => ({
  type: PCRItemType.MultiplePartnerFinancialVirement,
  grantMovingOverFinancialYear:
    !!pcr.grantMovingOverFinancialYear || pcr.grantMovingOverFinancialYear === 0
      ? pcr.grantMovingOverFinancialYear
      : null,
});

const mapItemForUplift = (): PCRTypeWithoutBase<PCRItemForUpliftDto> => ({
  type: PCRItemType.Uplift,
});

const mapItemForManageTeamMembers = (
  pcr: Pick<
    ProjectChangeRequestItemEntity,
    | "pclId"
    | "manageTeamMemberType"
    | "manageTeamMemberFirstName"
    | "manageTeamMemberLastName"
    | "manageTeamMemberEmail"
    | "manageTeamMemberRole"
    | "manageTeamMemberAssociateStartDate"
    | "partnerId"
  >,
): PCRTypeWithoutBase<PCRItemForManageTeamMembersDto> => ({
  type: PCRItemType.ManageTeamMembers,
  pclId: pcr.pclId ?? null,
  partnerId: pcr.partnerId ?? null,
  manageTeamMemberType: pcr.manageTeamMemberType ?? null,
  manageTeamMemberFirstName: pcr.manageTeamMemberFirstName ?? null,
  manageTeamMemberLastName: pcr.manageTeamMemberLastName ?? null,
  manageTeamMemberAssociateStartDate: pcr.manageTeamMemberAssociateStartDate ?? null,
  manageTeamMemberEmail: pcr.manageTeamMemberEmail ?? null,
  manageTeamMemberRole: pcr.manageTeamMemberRole ?? null,
});

const mapItemForLoansChangeDrawdown = (): PCRTypeWithoutBase<PCRItemForLoanDrawdownChangeDto> => ({
  type: PCRItemType.LoanDrawdownChange,
});

const mapItemForChangeLoansDuration = (
  pcr: Pick<
    ProjectChangeRequestItemEntity,
    | "projectStartDate"
    | "availabilityPeriod"
    | "availabilityPeriodChange"
    | "extensionPeriod"
    | "extensionPeriodChange"
    | "repaymentPeriod"
    | "repaymentPeriodChange"
  >,
): PCRTypeWithoutBase<PCRItemForLoanDrawdownExtensionDto> => ({
  type: PCRItemType.LoanDrawdownExtension,
  projectStartDate: pcr.projectStartDate ?? null,
  availabilityPeriod: pcr.availabilityPeriod ?? null,
  availabilityPeriodChange: pcr.availabilityPeriodChange ?? null,
  extensionPeriod: pcr.extensionPeriod ?? null,
  extensionPeriodChange: pcr.extensionPeriodChange ?? null,
  repaymentPeriod: pcr.repaymentPeriod ?? null,
  repaymentPeriodChange: pcr.repaymentPeriodChange ?? null,
});

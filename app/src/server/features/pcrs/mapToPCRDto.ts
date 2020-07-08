import { ProjectChangeRequestEntity, ProjectChangeRequestItemEntity } from "@framework/entities";
import {
  PCRDto,
  PCRItemForAccountNameChangeDto,
  PCRItemForMultiplePartnerFinancialVirementDto,
  PCRItemForPartnerAdditionDto,
  PCRItemForPartnerWithdrawalDto,
  PCRItemForPeriodLengthChangeDto,
  PCRItemForProjectSuspensionDto,
  PCRItemForProjectTerminationDto,
  PCRItemForScopeChangeDto,
  PCRItemForTimeExtensionDto,
  PCRItemTypeDto,
  PCRStandardItemDto,
  ProjectChangeRequestStandardItemTypes
} from "@framework/dtos";
import {
  PCRContactRole,
  PCRItemType,
  PCROrganisationType,
  PCRParticipantSize,
  PCRPartnerType,
  PCRProjectLocation,
  PCRProjectRole
} from "@framework/constants";
import { PCRRecordTypeMetaValues } from "@server/features/pcrs/getItemTypesQuery";
import { isBoolean, isNumber } from "@framework/util";

export const mapToPcrDto = (pcr: ProjectChangeRequestEntity, itemTypes: PCRItemTypeDto[]): PCRDto => ({
  id: pcr.id,
  requestNumber: pcr.number,
  started: pcr.started,
  lastUpdated: pcr.updated,
  status: pcr.status,
  statusName: pcr.statusName,
  comments: pcr.comments,
  reasoningStatus: pcr.reasoningStatus,
  reasoningStatusName: pcr.reasoningStatusName,
  reasoningComments: pcr.reasoning,
  projectId: pcr.projectId,
  items: mapItems(pcr.items, itemTypes)
});

const mapItems = (pcrs: ProjectChangeRequestItemEntity[], itemTypes: PCRItemTypeDto[]) => {
  const filtered = itemTypes.filter(itemType => pcrs.some(x => x.recordTypeId === itemType.recordTypeId));
  return filtered.map(itemType => mapItem(pcrs.find(x => x.recordTypeId === itemType.recordTypeId)!, itemType));
};

const mapItem = (pcr: ProjectChangeRequestItemEntity, itemType: PCRItemTypeDto) => {
  switch (itemType.type) {
    case PCRItemType.TimeExtension:
      return mapItemForTimeExtension(pcr, itemType.displayName, itemType.type);
    case PCRItemType.ScopeChange:
      return mapItemForScopeChange(pcr, itemType.displayName, itemType.type);
    case PCRItemType.ProjectSuspension:
      return mapItemForProjectSuspension(pcr, itemType.displayName, itemType.type);
    case PCRItemType.ProjectTermination:
      return mapItemForTermination(pcr, itemType.displayName, itemType.type);
    case PCRItemType.AccountNameChange:
      return mapItemForAccountNameChange(pcr, itemType.displayName, itemType.type);
    case PCRItemType.PartnerWithdrawal:
      return mapItemForPartnerWithdrawal(pcr, itemType.displayName, itemType.type);
    case PCRItemType.PartnerAddition:
      return mapItemForPartnerAddition(pcr, itemType.displayName, itemType.type);
    case PCRItemType.MultiplePartnerFinancialVirement:
      return mapItemForMultiplePartnerVirements(pcr, itemType.displayName, itemType.type);
    case PCRItemType.PeriodLengthChange:
      return mapItemForPeriodLengthChange(pcr, itemType.displayName, itemType.type);
    case PCRItemType.SinglePartnerFinancialVirement:
      return mapStandardItem(pcr, itemType.displayName, itemType.type);
    default:
      throw new Error("Type not handled");
  }
};

const mapBaseItem = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: PCRItemType) => ({
  id: pcr.id,
  guidance: PCRRecordTypeMetaValues.find(x => x.type === type)!.guidance,
  typeName,
  status: pcr.status,
  statusName: pcr.statusName,
  shortName: pcr.shortName || typeName,
});

const mapStandardItem = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: ProjectChangeRequestStandardItemTypes): PCRStandardItemDto => ({
  ...mapBaseItem(pcr, typeName, type),
  type
});

const mapItemForTermination = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: PCRItemType.ProjectTermination): PCRItemForProjectTerminationDto => ({
  ...mapBaseItem(pcr, typeName, type),
  type
});

const mapItemForPeriodLengthChange = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: PCRItemType.PeriodLengthChange): PCRItemForPeriodLengthChangeDto => ({
  ...mapBaseItem(pcr, typeName, type),
  type
});

const mapItemForTimeExtension = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: PCRItemType.TimeExtension): PCRItemForTimeExtensionDto => ({
  ...mapBaseItem(pcr, typeName, type),
  additionalMonths: pcr.additionalMonths || null,
  projectDurationSnapshot: pcr.projectDurationSnapshot || 0,
  type
});

const mapItemForScopeChange = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: PCRItemType.ScopeChange): PCRItemForScopeChangeDto => ({
  ...mapBaseItem(pcr, typeName, type),
  projectSummary: pcr.projectSummary || null,
  publicDescription: pcr.publicDescription || null,
  projectSummarySnapshot: pcr.projectSummarySnapshot || null,
  publicDescriptionSnapshot: pcr.publicDescriptionSnapshot || null,
  type
});

const mapItemForProjectSuspension = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: PCRItemType.ProjectSuspension): PCRItemForProjectSuspensionDto => ({
  ...mapBaseItem(pcr, typeName, type),
  suspensionStartDate: pcr.suspensionStartDate || null,
  suspensionEndDate: pcr.suspensionEndDate || null,
  type
});

const mapItemForAccountNameChange = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: PCRItemType.AccountNameChange): PCRItemForAccountNameChangeDto => ({
  ...mapBaseItem(pcr, typeName, type),
  accountName: pcr.accountName || null,
  partnerId: pcr.partnerId || null,
  partnerNameSnapshot: pcr.partnerNameSnapshot || null,
  type
});

const mapItemForPartnerWithdrawal = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: PCRItemType.PartnerWithdrawal): PCRItemForPartnerWithdrawalDto => ({
  ...mapBaseItem(pcr, typeName, type),
  partnerId: pcr.partnerId || null,
  partnerNameSnapshot: pcr.partnerNameSnapshot || null,
  removalPeriod: pcr.removalPeriod || null,
  type
});

const mapItemForPartnerAddition = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: PCRItemType.PartnerAddition): PCRItemForPartnerAdditionDto => ({
  ...mapBaseItem(pcr, typeName, type),
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
  typeOfAid: pcr.typeOfAid,
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
  type
});

const mapItemForMultiplePartnerVirements = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: PCRItemType.MultiplePartnerFinancialVirement): PCRItemForMultiplePartnerFinancialVirementDto => ({
  ...mapBaseItem(pcr, typeName, type),
  type,
  grantMovingOverFinancialYear: (!!pcr.grantMovingOverFinancialYear || pcr.grantMovingOverFinancialYear === 0) ? pcr.grantMovingOverFinancialYear : null
});

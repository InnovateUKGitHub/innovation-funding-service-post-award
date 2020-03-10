import { ProjectChangeRequestEntity, ProjectChangeRequestItemEntity } from "@framework/entities";
import {
  PCRDto,
  PCRItemForAccountNameChangeDto,
  PCRItemForPartnerAdditionDto,
  PCRItemForPartnerWithdrawalDto,
  PCRItemForProjectSuspensionDto,
  PCRItemForProjectTerminationDto,
  PCRItemForScopeChangeDto,
  PCRItemForTimeExtensionDto,
  PCRItemTypeDto,
  PCRStandardItemDto,
  ProjectChangeRequestStandardItemTypes
} from "@framework/dtos";
import { PCRItemType, PCRPartnerType, PCRProjectRole } from "@framework/constants";
import { PCRRecordTypeMetaValues } from "@server/features/pcrs/getItemTypesQuery";

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
  shortName: pcr.shortName,
});

const mapStandardItem = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: ProjectChangeRequestStandardItemTypes): PCRStandardItemDto => ({
  ...mapBaseItem(pcr, typeName, type),
  type
});

const mapItemForTermination = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: PCRItemType.ProjectTermination): PCRItemForProjectTerminationDto => ({
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
  withdrawalDate: pcr.withdrawalDate || null,
  partnerId: pcr.partnerId || null,
  partnerNameSnapshot: pcr.partnerNameSnapshot || null,
  type
});

const mapItemForPartnerAddition = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: PCRItemType.PartnerAddition): PCRItemForPartnerAdditionDto => ({
  ...mapBaseItem(pcr, typeName, type),
  projectRole: pcr.projectRole || PCRProjectRole.Unknown,
  partnerType: pcr.partnerType || PCRPartnerType.Unknown,
  type
});

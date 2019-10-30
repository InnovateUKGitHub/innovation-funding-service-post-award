import {
  ProjectChangeRequestEntity,
  ProjectChangeRequestItemEntity
} from "@framework/entities";
import {
  PCRDto,
  PCRItemForAccountNameChangeDto,
  PCRItemForProjectSuspensionDto,
  PCRItemForProjectTerminationDto,
  PCRItemForScopeChangeDto,
  PCRItemForTimeExtensionDto,
  PCRItemTypeDto,
  PCRStandardItemDto, ProjectChangeRequestStandardItemTypes
} from "@framework/dtos";
import { PCRItemType } from "@framework/constants";

export const mapToPcrDto = (pcr: ProjectChangeRequestEntity, itemTypes: PCRItemTypeDto[]): PCRDto => ({
  id: pcr.id,
  guidance: pcr.guidance,
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
    case PCRItemType.MultiplePartnerFinancialVirement:
    case PCRItemType.PartnerAddition:
    case PCRItemType.PartnerWithdrawal:
    case PCRItemType.SinglePartnerFinancialVirement:
      return mapStandardItem(pcr, itemType.displayName, itemType.type);
    default:
      throw new Error("Type not handled");
  }
};

const mapBaseItem = (pcr: ProjectChangeRequestItemEntity, typeName: string) => ({
  id: pcr.id,
  guidance: pcr.guidance,
  typeName,
  status: pcr.status,
  statusName: pcr.statusName
});

const mapStandardItem = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: ProjectChangeRequestStandardItemTypes): PCRStandardItemDto => ({
  ...mapBaseItem(pcr, typeName),
  type
});

const mapItemForTermination = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: PCRItemType.ProjectTermination): PCRItemForProjectTerminationDto => ({
  ...mapBaseItem(pcr, typeName),
  type
});

const mapItemForTimeExtension = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: PCRItemType.TimeExtension): PCRItemForTimeExtensionDto => ({
  ...mapBaseItem(pcr, typeName),
  projectDuration: pcr.projectDuration || null,
  projectDurationSnapshot: pcr.projectDurationSnapshot || null,
  type
});

const mapItemForScopeChange = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: PCRItemType.ScopeChange): PCRItemForScopeChangeDto => ({
  ...mapBaseItem(pcr, typeName),
  projectSummary: pcr.projectSummary || null,
  publicDescription: pcr.publicDescription || null,
  projectSummarySnapshot: pcr.projectSummarySnapshot || null,
  publicDescriptionSnapshot: pcr.publicDescriptionSnapshot || null,
  type
});

const mapItemForProjectSuspension = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: PCRItemType.ProjectSuspension): PCRItemForProjectSuspensionDto => ({
  ...mapBaseItem(pcr, typeName),
  suspensionStartDate: pcr.suspensionStartDate || null,
  suspensionEndDate: pcr.suspensionEndDate || null,
  type
});

const mapItemForAccountNameChange = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: PCRItemType.AccountNameChange): PCRItemForAccountNameChangeDto => ({
  ...mapBaseItem(pcr, typeName),
  accountName: pcr.accountName || null,
  partnerId: pcr.partnerId || null,
  partnerNameSnapshot: pcr.partnerNameSnapshot || null,
  type
});

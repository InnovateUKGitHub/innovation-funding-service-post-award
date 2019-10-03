import {
  ProjectChangeRequestEntity,
  ProjectChangeRequestItemEntity,
  ProjectChangeRequestItemTypeEntity,
  ProjectChangeRequestStandardItemTypes
} from "@framework/entities";
import {
  PCRDto,
  PCRItemDto,
  PCRItemForScopeChangeDto,
  PCRItemForTimeExtensionDto,
  PCRItemTypeDto,
  PCRStandardItemDto
} from "@framework/dtos";

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
    case ProjectChangeRequestItemTypeEntity.TimeExtension:
      return mapItemForTimeExtension(pcr, itemType.displayName, itemType.type);
    case ProjectChangeRequestItemTypeEntity.ScopeChange:
      return mapItemForScopeChange(pcr, itemType.displayName, itemType.type);
    case ProjectChangeRequestItemTypeEntity.AccountNameChange:
    case ProjectChangeRequestItemTypeEntity.MultiplePartnerFinancialVirement:
    case ProjectChangeRequestItemTypeEntity.PartnerAddition:
    case ProjectChangeRequestItemTypeEntity.PartnerWithdrawal:
    case ProjectChangeRequestItemTypeEntity.ProjectSuspension:
    case ProjectChangeRequestItemTypeEntity.ProjectTermination:
    case ProjectChangeRequestItemTypeEntity.SinglePartnerFinancialVirement:
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

const mapItemForTimeExtension = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: ProjectChangeRequestItemTypeEntity.TimeExtension): PCRItemForTimeExtensionDto => ({
  ...mapBaseItem(pcr, typeName),
  projectEndDate: pcr.projectEndDate,
  type
});

const mapItemForScopeChange = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: ProjectChangeRequestItemTypeEntity.ScopeChange): PCRItemForScopeChangeDto => ({
  ...mapBaseItem(pcr, typeName),
  projectSummary: pcr.projectSummary,
  publicDescription: pcr.publicDescription,
  type
});

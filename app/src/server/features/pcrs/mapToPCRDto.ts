import {
  ProjectChangeRequestEntity,
  ProjectChangeRequestItemEntity,
  ProjectChangeRequestItemTypeEntity,
  ProjectChangeRequestStandardItemTypes
} from "@framework/entities";
import {
  PCRDto,
  PCRItemForAccountNameChangeDto,
  PCRItemForProjectSuspensionDto,
  PCRItemForProjectTerminationDto,
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
    case ProjectChangeRequestItemTypeEntity.ProjectSuspension:
      return mapItemForProjectSuspension(pcr, itemType.displayName, itemType.type);
    case ProjectChangeRequestItemTypeEntity.ProjectTermination:
      return mapItemForTermination(pcr, itemType.displayName, itemType.type);
    case ProjectChangeRequestItemTypeEntity.AccountNameChange:
      return mapItemForAccountNameChange(pcr, itemType.displayName, itemType.type);
    case ProjectChangeRequestItemTypeEntity.MultiplePartnerFinancialVirement:
    case ProjectChangeRequestItemTypeEntity.PartnerAddition:
    case ProjectChangeRequestItemTypeEntity.PartnerWithdrawal:
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

const mapItemForTermination = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: ProjectChangeRequestItemTypeEntity.ProjectTermination): PCRItemForProjectTerminationDto => ({
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

const mapItemForProjectSuspension = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: ProjectChangeRequestItemTypeEntity.ProjectSuspension): PCRItemForProjectSuspensionDto => ({
  ...mapBaseItem(pcr, typeName),
  suspensionStartDate: pcr.suspensionStartDate,
  suspensionEndDate: pcr.suspensionEndDate,
  type
});

const mapItemForAccountNameChange = (pcr: ProjectChangeRequestItemEntity, typeName: string, type: ProjectChangeRequestItemTypeEntity.AccountNameChange): PCRItemForAccountNameChangeDto => ({
  ...mapBaseItem(pcr, typeName),
  accountName: pcr.accountName,
  partnerId: pcr.partnerId,
  type
});

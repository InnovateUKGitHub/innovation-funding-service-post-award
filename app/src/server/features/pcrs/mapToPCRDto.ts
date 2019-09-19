import { ProjectChangeRequestEntity, ProjectChangeRequestItemEntity } from "@framework/entities";
import { PCRDto, PCRItemDto, PCRItemTypeDto } from "@framework/dtos";

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

const mapItems = (pcrs: ProjectChangeRequestItemEntity[], itemTypes: PCRItemTypeDto[]): PCRItemDto[] => {
  const filtered = itemTypes.filter(itemType => pcrs.some(x => x.recordTypeId === itemType.recordTypeId));
  return filtered.map(itemType => mapItem(pcrs.find(x => x.recordTypeId === itemType.recordTypeId)!, itemType));
};

const mapItem = (pcr: ProjectChangeRequestItemEntity, itemType: PCRItemTypeDto): PCRItemDto => ({
  id: pcr.id,
  guidance: pcr.guidance,
  type: itemType.type,
  typeName: itemType.displayName,
  status: pcr.status,
  statusName: pcr.statusName
});

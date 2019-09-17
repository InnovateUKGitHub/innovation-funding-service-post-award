import { PCR, PCRItem } from "@framework/entities";
import { PCRDto, PCRItemDto, PCRItemTypeDto } from "@framework/dtos";

export const mapToPcrDto = (pcr: PCR, itemTypes: PCRItemTypeDto[]): PCRDto => ({
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

const mapItems = (pcrs: PCRItem[], itemTypes: PCRItemTypeDto[]): PCRItemDto[] => {
  const filtered = itemTypes.filter(itemType => pcrs.some(x => x.recordTypeId === itemType.recordTypeId));
  return filtered.map(itemType => mapItem(pcrs.find(x => x.recordTypeId === itemType.recordTypeId)!, itemType));
};

const mapItem = (pcr: PCRItem, itemType: PCRItemTypeDto): PCRItemDto => ({
  id: pcr.id,
  type: itemType.type,
  typeName: itemType.displayName,
  status: pcr.status,
  statusName: pcr.statusName
});

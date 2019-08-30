import { QueryBase } from "../common";
import { PCRDto, PCRItemDto, PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { PCR, PCRItem, PCRItemStatus } from "@framework/entities";
import { GetPCRItemTypesQuery } from "./getItemTypesQuery";

export class GetPCRByIdQuery extends QueryBase<PCRDto> {
  constructor(private projectId: string, private id: string) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.pcrsEnabled && auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  protected async Run(context: IContext): Promise<PCRDto> {
    const itemTypes = await context.runQuery(new GetPCRItemTypesQuery());
    const item = await context.repositories.pcrs.getById(this.projectId, this.id);
    return this.map(item, itemTypes);
  }

  private map(item: PCR, itemTypes: PCRItemTypeDto[]): PCRDto {
    return {
      id: item.id,
      requestNumber: item.number,
      started: item.started,
      lastUpdated: item.updated,
      status: item.status,
      statusName: item.statusName,
      comments: item.comments,
      reasoningStatus: item.reasoningStatus,
      reasoningStatusName: item.reasoningStatusName,
      reasoningComments: item.reasoning,
      projectId: item.projectId,
      items: this.mapItems(item.items, itemTypes)
    };
  }

  private mapItems(items: PCRItem[], itemTypes: PCRItemTypeDto[]): PCRItemDto[] {
    const filtered = itemTypes.filter(itemType => items.some(x => x.recordTypeId === itemType.recordTypeId));
    return filtered.map(itemType => this.mapItem(items.find(x => x.recordTypeId === itemType.recordTypeId)!, itemType));
  }

  private mapItem(item: PCRItem, itemType: PCRItemTypeDto): PCRItemDto {
    return {
      id: item.id,
      type: itemType.id,
      typeName: itemType.displayName,
      status: item.status,
      statusName: item.statusName
    };
  }
}

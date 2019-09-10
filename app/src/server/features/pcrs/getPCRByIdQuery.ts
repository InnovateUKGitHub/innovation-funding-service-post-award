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

  private map(pcr: PCR, itemTypes: PCRItemTypeDto[]): PCRDto {
    return {
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
      items: this.mapItems(pcr.items, itemTypes)
    };
  }

  private mapItems(pcrs: PCRItem[], itemTypes: PCRItemTypeDto[]): PCRItemDto[] {
    const filtered = itemTypes.filter(itemType => pcrs.some(x => x.recordTypeId === itemType.recordTypeId));
    return filtered.map(itemType => this.mapItem(pcrs.find(x => x.recordTypeId === itemType.recordTypeId)!, itemType));
  }

  private mapItem(pcr: PCRItem, itemType: PCRItemTypeDto): PCRItemDto {
    return {
      id: pcr.id,
      type: itemType.type,
      recordTypeId: itemType.recordTypeId,
      typeName: itemType.displayName,
      status: pcr.status,
      statusName: pcr.statusName
    };
  }
}

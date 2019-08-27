import { QueryBase } from "../common";
import { PCRDto, PCRItemDto } from "@framework/dtos/pcrDtos";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { PCR, PCRItem } from "@framework/entities";

export class GetPCRByIdQuery extends QueryBase<PCRDto> {
  constructor(private projectId: string, private id: string) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.pcrsEnabled && auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  protected async Run(context: IContext): Promise<PCRDto> {
    const item = await context.repositories.pcrs.getById(this.projectId, this.id);
    const children: PCRItem[] = await context.repositories.pcrItems.getAllItemsByPcrId(this.id);
    return this.map(item, children);
  }

  private map(item: PCR, items: PCRItem[]): PCRDto {
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
      items: items.map<PCRItemDto>(x => ({
        id: x.id,
        type: x.itemType,
        typeName: x.itemTypeName,
        status: x.status,
        statusName: x.statusName
      }))
    };
  }
}

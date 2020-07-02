import { QueryBase } from "../common";
import { PCRItemDto, PCRItemTypeDto, PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { numberComparator } from "@framework/util";
import { ProjectChangeRequestEntity } from "@framework/entities";
import { GetPCRItemTypesQuery } from "./getItemTypesQuery";

export class GetAllPCRsQuery extends QueryBase<PCRSummaryDto[]> {
  constructor(private readonly projectId: string) {
    super();
  }

  accessControl(auth: Authorisation, context: IContext) {
    const canRun = context.config.features.pcrsEnabled && auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager, ProjectRole.FinancialContact);
    return Promise.resolve(canRun);
  }

  protected async Run(context: IContext): Promise<PCRSummaryDto[]> {
    const pcrItemTypes = await context.runQuery(new GetPCRItemTypesQuery());
    const data = await context.repositories.projectChangeRequests.getAllByProjectId(this.projectId);
    data.sort((a,b) => numberComparator(a.number,b.number) * -1);
    return data.map(x => this.map(x, pcrItemTypes));
  }

  private map(pcr: ProjectChangeRequestEntity, pcrItemTypes: PCRItemTypeDto[]): PCRSummaryDto {
    // find the item types to inculde
    const filteredItemTypes = pcrItemTypes
      .map(pcrItemType => ({ itemType: pcrItemType, item: pcr.items.find((x => x.recordTypeId === pcrItemType.recordTypeId))}))
      .filter(x => !!x.item)
      .map(x => ({itemType : x.itemType, item : x.item!}));

    return {
      id: pcr.id,
      requestNumber: pcr.number,
      started: pcr.started,
      lastUpdated: pcr.updated,
      status: pcr.status,
      statusName: pcr.statusName,
      projectId: pcr.projectId,
      items: filteredItemTypes.map(x => ({
        type: x.itemType.type,
        typeName: x.itemType.displayName,
        shortName: x.item.shortName || x.itemType.displayName
      }))
    };
  }
}

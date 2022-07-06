import { PCRItemTypeDto, PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { numberComparator } from "@framework/util";
import { ProjectChangeRequestEntity } from "@framework/entities";
import { QueryBase } from "../common";
import { GetPCRItemTypesQuery } from "./getItemTypesQuery";

export class GetAllPCRsQuery extends QueryBase<PCRSummaryDto[]> {
  constructor(private readonly projectId: string) {
    super();
  }

  public async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  protected async run(context: IContext): Promise<PCRSummaryDto[]> {
    const pcrItemTypes = await context.runQuery(new GetPCRItemTypesQuery(this.projectId));
    const data = await context.repositories.projectChangeRequests.getAllByProjectId(this.projectId);
    data.sort((a,b) => numberComparator(a.number,b.number) * -1);
    return data.map(x => this.map(x, pcrItemTypes));
  }

  private map(pcr: ProjectChangeRequestEntity, pcrItemTypes: PCRItemTypeDto[]): PCRSummaryDto {
    // find the item types to include
    const filteredItemTypes = pcrItemTypes
      .map(pcrItemType => ({ itemType: pcrItemType, item: pcr.items.find((x => x.recordTypeId === pcrItemType.recordTypeId))}))
      .filter(x => !!x.item)
      .map(x => ({itemType : x.itemType, item : x.item}));

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
        shortName: x.item?.shortName || x.itemType.displayName
      }))
    };
  }
}

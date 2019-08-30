import { QueryBase } from "../common";
import { PCRItemDto, PCRItemTypeDto, PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { numberComparator } from "@framework/util";
import { PCR, PCRStatus, PCRSummary } from "@framework/entities";
import { GetPCRItemTypesQuery } from "./getItemTypesQuery";

export class GetAllPCRsQuery extends QueryBase<PCRSummaryDto[]> {
  constructor(private projectId: string) {
    super();
  }

  accessControl(auth: Authorisation, context: IContext) {
    const canRun = context.config.features.pcrsEnabled && auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager, ProjectRole.FinancialContact);
    return Promise.resolve(canRun);
  }

  protected async Run(context: IContext): Promise<PCRSummaryDto[]> {
    const pcrItemTypes = await context.runQuery(new GetPCRItemTypesQuery());
    const data = await context.repositories.pcrs.getAllByProjectId(this.projectId);
    data.sort((a,b) => numberComparator(a.number,b.number) * -1);
    return data.map(x => this.map(x, pcrItemTypes));
  }

  private map(item: PCRSummary, pcrItemTypes: PCRItemTypeDto[]): PCRSummaryDto {
    // find the item types to inculde
    const filteredItemTypes = pcrItemTypes.filter(pcrItemType => item.items.some(x => x.recordTypeId === pcrItemType.recordTypeId));

    return {
      id: item.id,
      requestNumber: item.number,
      started: item.started,
      lastUpdated: item.updated,
      status: item.status,
      statusName: item.statusName,
      projectId: item.projectId,
      items: filteredItemTypes.map(x => ({
        type: x.id,
        typeName: x.displayName
      }))
    };
  }
}

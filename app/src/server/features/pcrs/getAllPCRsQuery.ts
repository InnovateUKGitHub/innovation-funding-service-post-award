import { QueryBase } from "../common";
import { PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { numberComparator } from "@framework/util";
import { PCR, PCRStatus } from "@framework/entities";

export class GetAllPCRsQuery extends QueryBase<PCRSummaryDto[]> {
  constructor(private projectId: string) {
    super();
  }

  accessControl(auth: Authorisation, context: IContext) {
    const canRun = context.config.features.pcrsEnabled && auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager, ProjectRole.FinancialContact);
    return Promise.resolve(canRun);
  }

  protected async Run(context: IContext): Promise<PCRSummaryDto[]> {
    const data = await context.repositories.pcrs.getAllByProjectId(this.projectId);
    data.sort((a,b) => numberComparator(a.number,b.number) * -1);
    return data.map(y => this.map(y));
  }

  private map(item: PCR): PCRSummaryDto {
    return {
      id: item.id,
      requestNumber: item.number,
      started: item.started,
      lastUpdated: item.updated,
      status: item.status,
      statusName: item.statusName,
      items: item.items.map(x => ({
        type: x.itemType,
        typeName: x.itemTypeName
      }))
    };
  }
}

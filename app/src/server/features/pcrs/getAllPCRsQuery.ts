import { PCRItemTypeDto, PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { Authorisation, IContext, PCRStatus, ProjectRole } from "@framework/types";
import { numberComparator } from "@framework/util";
import { ProjectChangeRequestEntity } from "@framework/entities";
import { QueryBase } from "../common";
import { GetPCRItemTypesQuery } from "./getItemTypesQuery";
import { GetAllProjectRolesForUser } from "../projects";

export class GetAllPCRsQuery extends QueryBase<PCRSummaryDto[]> {
  constructor(private readonly projectId: ProjectId) {
    super();
  }

  public async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  protected async run(context: IContext): Promise<PCRSummaryDto[]> {
    const roles = await context.runQuery(new GetAllProjectRolesForUser());
    const pcrItemTypes = await context.runQuery(new GetPCRItemTypesQuery(this.projectId));

    const isPmOrFc = roles
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.FinancialContact);

    return (await context.repositories.projectChangeRequests.getAllByProjectId(this.projectId))
      .sort((a, b) => numberComparator(b.number, a.number))
      .filter(x => (isPmOrFc ? true : x.status !== PCRStatus.Draft)) // If we are an MO, hide any draft PCRs.
      .map(x => this.map(x, pcrItemTypes));
  }

  private map(pcr: ProjectChangeRequestEntity, pcrItemTypes: PCRItemTypeDto[]): PCRSummaryDto {
    // find the item types to include
    const filteredItemTypes = pcrItemTypes
      .map(pcrItemType => ({
        itemType: pcrItemType,
        item: pcr.items.find(x => x.recordTypeId === pcrItemType.recordTypeId),
      }))
      .filter(x => !!x.item)
      .map(x => ({ itemType: x.itemType, item: x.item }));

    return {
      id: pcr.id as PcrId,
      requestNumber: pcr.number,
      started: pcr.started,
      lastUpdated: pcr.updated,
      status: pcr.status,
      statusName: pcr.statusName,
      projectId: pcr.projectId,
      items: filteredItemTypes.map(x => ({
        type: x.itemType.type,
        typeName: x.itemType.displayName,
        shortName: x.item?.shortName || x.itemType.displayName,
      })),
    };
  }
}

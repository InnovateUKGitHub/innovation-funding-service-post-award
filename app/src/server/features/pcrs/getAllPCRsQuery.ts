import { PCRStatus } from "@framework/constants/pcrConstants";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PCRItemTypeDto, PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { ProjectChangeRequestEntity } from "@framework/entities/projectChangeRequest";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { numberComparator } from "@framework/util/comparator";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";
import { GetAllProjectRolesForUser } from "../projects/getAllProjectRolesForUser";
import { GetAllPCRItemTypesQuery } from "./getAllItemTypesQuery";

export class GetAllPCRsQuery extends AuthorisedAsyncQueryBase<PCRSummaryDto[]> {
  public readonly runnableName: string = "GetAllPCRsQuery";
  constructor(private readonly projectId: ProjectId) {
    super();
  }

  public async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(
        ProjectRolePermissionBits.MonitoringOfficer,
        ProjectRolePermissionBits.ProjectManager,
        ProjectRolePermissionBits.FinancialContact,
      );
  }

  protected async run(context: IContext): Promise<PCRSummaryDto[]> {
    const roles = await context.runQuery(new GetAllProjectRolesForUser());
    const pcrItemTypes = await context.runQuery(new GetAllPCRItemTypesQuery(this.projectId));

    const isPmOrFc = roles
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.FinancialContact);

    return (await context.repositories.projectChangeRequests.getAllByProjectId(this.projectId))
      .sort((a, b) => numberComparator(b.number, a.number))
      .filter(x => (isPmOrFc ? true : x.status !== PCRStatus.DraftWithProjectManager)) // If we are an MO, hide any draft PCRs.
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
        shortName: x.item?.shortName || x.itemType.displayName,
      })),
    };
  }
}

import { PCRItemType } from "@framework/constants/pcrConstants";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PCRDto, PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";
import { mapToPcrDto } from "./mapToPCRDto";
import { GetAllPCRItemTypesQuery } from "./getAllItemTypesQuery";

export class GetPCRByIdQuery extends AuthorisedAsyncQueryBase<PCRDto> {
  public readonly runnableName: string = "GetPCRByIdQuery";

  constructor(
    private readonly projectId: ProjectId,
    private readonly id: PcrId | PcrItemId,
  ) {
    super();
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRolePermissionBits.MonitoringOfficer, ProjectRolePermissionBits.ProjectManager);
  }

  async run(context: IContext): Promise<PCRDto> {
    const itemTypes = await context.runQuery(new GetAllPCRItemTypesQuery(this.projectId));
    const item = await context.repositories.projectChangeRequests.getById(this.projectId, this.id);
    const pcrDto = mapToPcrDto(item, itemTypes);

    const addPartnerItems = pcrDto.items.filter(x => x.type === PCRItemType.PartnerAddition);
    for (const addPartnerItem of addPartnerItems) {
      const spendProfile = await context.runQuery(new GetPcrSpendProfilesQuery(this.projectId, addPartnerItem.id));
      (addPartnerItem as PCRItemForPartnerAdditionDto).spendProfile = spendProfile;
    }

    return pcrDto;
  }
}

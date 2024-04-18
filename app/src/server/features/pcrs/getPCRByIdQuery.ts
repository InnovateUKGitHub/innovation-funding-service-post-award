import { PCRItemType } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { PCRDto, PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";
import { QueryBase } from "../common/queryBase";
import { mapToPcrDto } from "./mapToPCRDto";
import { GetAllPCRItemTypesQuery } from "./getAllItemTypesQuery";

export class GetPCRByIdQuery extends QueryBase<PCRDto> {
  constructor(private readonly projectId: ProjectId, private readonly id: PcrId | PcrItemId) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  protected async run(context: IContext): Promise<PCRDto> {
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

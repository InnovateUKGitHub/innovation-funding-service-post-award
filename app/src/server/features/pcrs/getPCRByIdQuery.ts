import { QueryBase } from "../common";
import { PCRDto, PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { Authorisation, IContext, PCRItemType, ProjectRole } from "@framework/types";
import { GetPCRItemTypesQuery } from "./getItemTypesQuery";
import { mapToPcrDto } from "./mapToPCRDto";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";

export class GetPCRByIdQuery extends QueryBase<PCRDto> {
  constructor(private readonly projectId: string, private readonly id: string) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  protected async Run(context: IContext): Promise<PCRDto> {
    const itemTypes = await context.runQuery(new GetPCRItemTypesQuery());
    const item = await context.repositories.projectChangeRequests.getById(this.projectId, this.id);
    const pcrDto = mapToPcrDto(item, itemTypes);
    const addPartnerItem = pcrDto.items.find(x => x.type === PCRItemType.PartnerAddition);
    if (!!addPartnerItem) {
      const spendProfile = await context.runQuery(new GetPcrSpendProfilesQuery(addPartnerItem.id));
      (addPartnerItem as PCRItemForPartnerAdditionDto).spendProfile = spendProfile;
    }
    return pcrDto;
  }
}

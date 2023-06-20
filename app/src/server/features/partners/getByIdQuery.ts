import { PartnerDto } from "@framework/dtos/partnerDto";
import { IContext } from "@framework/types/IContext";
import { QueryBase } from "../common/queryBase";
import { GetAllProjectRolesForUser } from "../projects/getAllProjectRolesForUser";
import { MapToPartnerDtoCommand } from "./mapToPartnerDto";

export class GetByIdQuery extends QueryBase<PartnerDto> {
  constructor(private readonly partnerId: PartnerId) {
    super();
  }

  async run(context: IContext) {
    const partner = await context.repositories.partners.getById(this.partnerId);
    const roles = await context.runQuery(new GetAllProjectRolesForUser());
    const projectRoleInfo = roles.forProject(partner.projectId).getRoles();
    const partnerRoleInfo = roles.forPartner(partner.projectId, partner.id).getRoles();
    return context.runSyncCommand(new MapToPartnerDtoCommand(partner, partnerRoleInfo, projectRoleInfo));
  }
}

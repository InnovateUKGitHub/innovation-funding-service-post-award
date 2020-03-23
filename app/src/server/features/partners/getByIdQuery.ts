import { QueryBase } from "../common";
import { MapToPartnerDtoCommand } from "./mapToPartnerDto";
import { GetAllProjectRolesForUser } from "../projects/getAllProjectRolesForUser";
import { IContext, PartnerDto } from "@framework/types";

export class GetByIdQuery extends QueryBase<PartnerDto> {
  constructor(private readonly partnerId: string) {
    super();
  }

  async Run(context: IContext) {
      const result = await context.repositories.partners.getById(this.partnerId);
      const roles = await context.runQuery(new GetAllProjectRolesForUser());
      const projectRoleInfo = roles.forProject(result.projectId).getRoles();
      const partnerRoleInfo = roles.forPartner(result.projectId, result.id).getRoles();
      return context.runSyncCommand(new MapToPartnerDtoCommand(result, partnerRoleInfo, projectRoleInfo));
  }
}

import { IContext, PartnerDto } from "@framework/types";
import { QueryBase } from "../common";
import { GetAllProjectRolesForUser } from "../projects/getAllProjectRolesForUser";
import { MapToPartnerDtoCommand } from "./mapToPartnerDto";

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

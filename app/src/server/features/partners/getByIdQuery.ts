import { QueryBase } from "../common";
import { MapToPartnerDtoCommand } from "./mapToPartnerDto";
import { GetAllProjectRolesForUser } from "../projects/getAllProjectRolesForUser";
import { IContext, PartnerDto } from "../../../types";

export class GetByIdQuery extends QueryBase<PartnerDto> {
  constructor(private readonly partnerId: string) {
    super();
  }

  async Run(context: IContext) {
      const result = await context.repositories.partners.getById(this.partnerId);
      const roles = await context.runQuery(new GetAllProjectRolesForUser());
      const projectRoleInfo = roles.for(result.Acc_ProjectId__c).getRoles();
      const partnerRoleInfo = roles.for(result.Acc_ProjectId__c, result.Id).getRoles();
      return context.runSyncCommand(new MapToPartnerDtoCommand(result, partnerRoleInfo, projectRoleInfo));
  }
}

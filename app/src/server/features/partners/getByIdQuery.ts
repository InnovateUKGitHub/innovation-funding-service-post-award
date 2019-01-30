import { QueryBase } from "../common/queryBase";
import { MapToPartnerDtoCommand } from "./mapToPartnerDto";
import { PartnerDto } from "../../../types";
import { GetAllProjectRolesForUser } from "../projects/getAllProjectRolesForUser";
import { IContext } from "../../../types/IContext";

export class GetByIdQuery extends QueryBase<PartnerDto> {
  constructor(readonly id: string) {
    super();
  }

  async Run(context: IContext) {
      const result = await context.repositories.partners.getById(this.id);
      const roles = await context.runQuery(new GetAllProjectRolesForUser());
      const projectRoleInfo = roles.for(result.Acc_ProjectId__c).getRoles();
      const partnerRoleInfo = roles.for(result.Acc_ProjectId__c, result.Id).getRoles();
      return context.runSyncCommand(new MapToPartnerDtoCommand(result, partnerRoleInfo, projectRoleInfo));
  }
}

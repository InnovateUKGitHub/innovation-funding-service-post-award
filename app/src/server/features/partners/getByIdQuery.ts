import { IContext, QueryBase } from "../common/context";
import {MapToPartnerDtoCommand} from "./mapToPartnerDto";
import { PartnerDto, ProjectRole } from "../../../types";
import { GetAllProjectRolesForUser, getEmptyRoleInfo } from "../projects/getAllProjectRolesForUser";

export class GetByIdQuery extends QueryBase<PartnerDto> {
  constructor(readonly id: string) {
    super();
  }

  async Run(context: IContext) {
      const result = await context.repositories.partners.getById(this.id);
      const roles = await context.runQuery(new GetAllProjectRolesForUser());
      const roleInfo = roles.getPartnerRoles(result.Acc_ProjectId__c, result.Id);
      return await context.runCommand(new MapToPartnerDtoCommand(result, roleInfo));
  }
}

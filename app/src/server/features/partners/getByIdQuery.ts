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
      const roleInfo = roles[result.Acc_ProjectId__c] || getEmptyRoleInfo();
      const partnerRoles = roleInfo.partnerRoles[result.Id] || ProjectRole.Unknown;
      return await context.runCommand(new MapToPartnerDtoCommand(result, partnerRoles));
  }
}

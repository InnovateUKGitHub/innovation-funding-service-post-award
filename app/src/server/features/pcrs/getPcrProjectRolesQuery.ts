import { IContext, PCRProjectRole } from "@framework/types";
import { PcrProjectRoleMapper } from "@server/repositories/mappers/projectChangeRequestMapper";
import { OptionsQueryBase } from "../common/optionsQueryBase";

export class GetPcrProjectRolesQuery extends OptionsQueryBase<PCRProjectRole> {
  constructor() {
    super("PCRProjectRoles");
  }

  protected getPickListValues(context: IContext) {
    return context.repositories.projectChangeRequests.getProjectRoles();
  }

  protected mapToEnumValue(value: string) {
    return new PcrProjectRoleMapper().mapFromSalesforcePCRProjectRole(value);
  }
}

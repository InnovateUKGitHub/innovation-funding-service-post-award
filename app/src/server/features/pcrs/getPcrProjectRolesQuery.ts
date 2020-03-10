import { IContext, PCRProjectRole } from "@framework/types";
import { OptionsQueryBase } from "../common/optionsQueryBase";
import { PcrProjectRoleMapper } from "@server/repositories/mappers/projectChangeRequestMapper";

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

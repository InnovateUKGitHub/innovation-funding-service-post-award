import { BadRequestError, QueryBase } from "../common";
import { IContext } from "@framework/types";
import { PermissionGroupIdenfifier } from "@framework/types/permisionGroupIndentifier";
import { PermissionGroup } from "@framework/entities/permissionGroup";

export class GetPermissionGroupQuery extends QueryBase<PermissionGroup> {

  constructor(private readonly identifier: PermissionGroupIdenfifier) {
    super();
  }

  protected async Run(context: IContext): Promise<PermissionGroup> {

    const all = await context.caches.permissionGroups.fetchAsync("all", () => this.getData(context));

    const result = all.find(y => y.identifier === this.identifier);

    if (!result || this.identifier === PermissionGroupIdenfifier.Unknown) {
      throw new BadRequestError(`Unable to load permission group for identifier ${PermissionGroupIdenfifier[this.identifier]}`);
    }

    return result;
  }

  private getData(context: IContext) {
    return context.asSystemUser().repositories.permissionGroups.getAll();
  }
}

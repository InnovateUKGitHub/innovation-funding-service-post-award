import { PermissionGroupIdentifier } from "@framework/constants/enums";
import { PermissionGroup } from "@framework/entities/permissionGroup";
import { IContext } from "@framework/types/IContext";
import { BadRequestError } from "../common/appError";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";

export class GetPermissionGroupQuery extends AuthorisedAsyncQueryBase<PermissionGroup> {
  public readonly runnableName: string = "GetPermissionGroupQuery";
  constructor(private readonly identifier: PermissionGroupIdentifier) {
    super();
  }

  protected async run(context: IContext): Promise<PermissionGroup> {
    const all = await context.caches.permissionGroups.fetchAsync("all", () => this.getData(context));

    const result = all.find(y => y.identifier === this.identifier);

    if (!result || this.identifier === PermissionGroupIdentifier.Unknown) {
      throw new BadRequestError(
        `Unable to load permission group for identifier ${PermissionGroupIdentifier[this.identifier]}`,
      );
    }

    return result;
  }

  private getData(context: IContext) {
    return context.asSystemUser().repositories.permissionGroups.getAll();
  }
}

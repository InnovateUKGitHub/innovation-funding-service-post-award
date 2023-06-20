import { PermissionGroupIdentifier } from "@framework/constants/enums";
import { PermissionGroup } from "@framework/entities/permissionGroup";
import { ISalesforcePermissionGroup } from "../permissionGroupsRepository";
import { SalesforceBaseMapper } from "./salesforceMapperBase";

export class SalesforcePermissionGroupMapper extends SalesforceBaseMapper<ISalesforcePermissionGroup, PermissionGroup> {
  // permission groups lookup - maps salesforce permission group to an identifying enum
  constructor(private readonly salesforcePermissionGroups: { [key: string]: PermissionGroupIdentifier }) {
    super();
  }

  public map(item: ISalesforcePermissionGroup) {
    const identifier = this.salesforcePermissionGroups[item.DeveloperName] || PermissionGroupIdentifier.Unknown;
    return {
      id: item.Id,
      identifier,
      name: PermissionGroupIdentifier[identifier],
    };
  }
}

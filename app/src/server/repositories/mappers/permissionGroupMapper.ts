import { PermissionGroupIdenfifier } from "@framework/constants";
import { PermissionGroup } from "@framework/entities/permissionGroup";
import { ISalesforcePermissionGroup } from "../permissionGroupsRepository";
import { SalesforceBaseMapper } from "./saleforceMapperBase";

export class SalesforcePermissionGroupMapper extends SalesforceBaseMapper<ISalesforcePermissionGroup, PermissionGroup> {

  // permission groups lookup - maps salesforce permission group to an identifing enum
  constructor(private readonly salesforcePermisionGroups: { [key: string]: PermissionGroupIdenfifier }) {
    super();
  }

  public map(item: ISalesforcePermissionGroup) {

    const identifier = this.salesforcePermisionGroups[item.DeveloperName] || PermissionGroupIdenfifier.Unknown;
    return {
      id: item.Id,
      identifier,
      name: PermissionGroupIdenfifier[identifier]
    };
  }
}

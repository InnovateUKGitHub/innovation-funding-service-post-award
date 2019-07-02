import { SalesforceBaseMapper } from "./saleforceMapperBase";
import { ISalesforcePermissionGroup } from "../permissionGroupsRepository";
import { PermissionGroup } from "@framework/entities/permissionGroup";
import { PermissionGroupIdenfifier } from "@framework/types/permisionGroupIndentifier";

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

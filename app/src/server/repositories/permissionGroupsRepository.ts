import { SalesforceRepositoryBaseWithMapping } from "./salesforceRepositoryBase";
import { PermissionGroupIdenfifier } from "@framework/types/permisionGroupIndentifier";
import { PermissionGroup } from "@framework/entities/permissionGroup";
import { SalesforcePermissionGroupMapper } from "./mappers/permissionGroupMapper";
import { ILogger } from "@server/features/common";
import { Connection } from "jsforce";

export interface ISalesforcePermissionGroup {
  Id: string;
  DeveloperName: string;
}

export interface IPermissionGroupRepository {
  getAll(): Promise<PermissionGroup[]>;
}

// used to filter the requested permission groups and map them to the relevant identifier
// this key is the DeveloperName field in salesforce
const SalesforcePermisionGroups: {[key: string]: PermissionGroupIdenfifier} = {
  Acc_Claims_Team_Lead_Pending_Assignment: PermissionGroupIdenfifier.ClaimsTeam
};

/**
 * Gets the permission groups ids that objects can be assigned to...
 * @todo Remove this...no longer needed
 */
export class PermissionGroupRepository extends SalesforceRepositoryBaseWithMapping<ISalesforcePermissionGroup, PermissionGroup> implements IPermissionGroupRepository {

  constructor(getSalesforceConnection: () => Promise<Connection>, logger: ILogger) {
    super(getSalesforceConnection, logger);
  }

  protected salesforceObjectName: string = "Group";

  protected salesforceFieldNames: string[] = ["Id", "DeveloperName"];

  protected mapper = new SalesforcePermissionGroupMapper(SalesforcePermisionGroups);

  public getAll() {
    return super.where(`DeveloperName IN ('${Object.keys(SalesforcePermisionGroups).join("', '")}')`);
  }
}

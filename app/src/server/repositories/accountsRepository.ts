import { sss } from "@server/util/salesforce-string-helpers";
import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceAccount {
  Id: string;
  Name: string;
  JES_Organisation__c: string;
}

export type IAccountsRepository = Pick<AccountsRepository, "getAllByJesName">;

export class AccountsRepository extends SalesforceRepositoryBase<ISalesforceAccount> {
  private jesEnabled = "Yes";

  protected readonly salesforceObjectName = "Account";
  protected readonly salesforceFieldNames = ["Id", "Name", "JES_Organisation__c"];

  getAllByJesName(searchString?: string): Promise<ISalesforceAccount[]> {
    const jesFilter = `JES_Organisation__c = '${sss(this.jesEnabled)}'`;
    const jesQuery = searchString ? `${jesFilter} AND Name LIKE '%${sss(searchString)}%'` : jesFilter;

    return super.where(jesQuery);
  }
}

import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceAccount {
  Name: string;
}

export interface IAccountsRepository {
  getAccounts(): Promise<ISalesforceAccount[]>;
}

export class AccountsRepository extends SalesforceRepositoryBase<ISalesforceAccount> implements IAccountsRepository {

  protected readonly salesforceObjectName = "Account";

  protected readonly salesforceFieldNames = [
    "Name"
  ];

  getAccounts(): Promise<ISalesforceAccount[]> {
    // TODO: Once available, this will need to be updated to only return accounts where the account is listed as registered with Je-S
    return super.all();
  }
}

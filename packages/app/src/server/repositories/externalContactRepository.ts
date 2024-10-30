import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceExternalContact {
  Id: ContactId;
  FirstName: string;
  LastName: string;
}

export interface IExternalContactsRepository {
  update(contact: ISalesforceExternalContact): Promise<boolean>;
}

/**
 * Project Contacts are the roles users are assigned to on the project
 *
 * Stored in Acc_ProjectContactLink__c and the role is a pick list Acc_Role__c
 */
export class ExternalContactsRepository
  extends SalesforceRepositoryBase<ISalesforceExternalContact>
  implements IExternalContactsRepository
{
  protected readonly salesforceObjectName = "Contact";

  protected readonly salesforceFieldNames = ["Id", "FirstName", "LastName"];

  public async update(contact: ISalesforceExternalContact): Promise<boolean> {
    return super.updateItem(contact);
  }
}

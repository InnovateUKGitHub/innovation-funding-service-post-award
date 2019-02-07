import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceContact {
  Id: string;
  Salutation: string;
  LastName: string;
  FirstName: string;
  Email: string;
  MailingStreet: string;
  MailingCity: string;
  MailingState: string;
  MailingPostalCode: string;
}

export interface IContactsRepository {
  getById(id: string): Promise<ISalesforceContact | null>;
  getAll(): Promise<ISalesforceContact[]>;
}

export class ContactsRepository extends SalesforceRepositoryBase<ISalesforceContact> implements IContactsRepository {

  protected readonly salesforceObjectName = "Contact";

  protected readonly salesforceFieldNames = [
    "Id",
    "Salutation",
    "LastName",
    "FirstName",
    "Email",
    "MailingStreet",
    "MailingCity",
    "MailingState",
    "MailingPostalCode"
  ];

  getById(id: string) {
    return super.retrieve(id);
  }

  getAll() {
    return super.all();
  }
}

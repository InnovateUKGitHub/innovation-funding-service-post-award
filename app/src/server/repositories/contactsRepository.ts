import SalesforceBase from "./salesforceBase";

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
  getById(id: string): Promise<ISalesforceContact>;
  getAll(): Promise<ISalesforceContact[]>;
}

export class ContactsRepository extends SalesforceBase<ISalesforceContact> implements IContactsRepository {
  constructor() {
    super("Contact", ["Id", "Salutation", "LastName", "FirstName", "Email", "MailingStreet", "MailingCity", "MailingState", "MailingPostalCode"]);
  }

  getById(id: string) {
    return super.retrieve(id);
  }

  getAll() {
    return super.all();
  }
}

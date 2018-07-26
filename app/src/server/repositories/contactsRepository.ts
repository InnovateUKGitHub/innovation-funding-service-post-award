import salesforceBase from "./salesforceBase";

export interface SalesforceContact {
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
    getById(id: String): Promise<SalesforceContact>;
    getAll(): Promise<SalesforceContact[]>;
}

export default class extends salesforceBase<SalesforceContact> implements IContactsRepository {
    constructor() {
        super("Contact", ["Id", "Salutation", "LastName", "FirstName", "Email", "MailingStreet", "MailingCity", "MailingState", "MailingPostalCode"]);
    }

    public getById(id: string) {
        return super.retrieve(id);
    }

    public getAll() {
        return super.all();
    }
}
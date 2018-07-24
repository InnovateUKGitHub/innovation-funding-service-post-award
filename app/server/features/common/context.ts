import { runInContext } from "vm";

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
    getById: (id: string) => Promise<SalesforceContact>;
    getAll: () => Promise<SalesforceContact[]>;
};

export interface IQuery<T> {
    Run: (context: IContext) => Promise<T>;
}


export interface ICommand extends ICommandWithResult<void> {

}

export interface ICommandWithResult<T> {
    Run: (context: IContext) => Promise<T>;

}

export interface IContext {

    runQuery<TResult>(cmd: IQuery<TResult>): Promise<TResult>;
    runCommand<TResult>(cmd: ICommandWithResult<TResult>): Promise<TResult>;

    repositories: {
        contacts: IContactsRepository
    }
}
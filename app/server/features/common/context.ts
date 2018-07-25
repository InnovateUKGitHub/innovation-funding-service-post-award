import { IContactsRepository } from "../../repositories/contactsRepository";

export interface IQuery<T> {
    Run: (context: IContext) => Promise<T>;
}

export interface ICommand<T> {
    Run: (context: IContext) => Promise<T>;

}

export interface IRepositories{
    contacts: IContactsRepository
}

export interface IContext {

    runQuery<TResult>(cmd: IQuery<TResult>): Promise<TResult>;
    runCommand<TResult>(cmd: ICommand<TResult>): Promise<TResult>;
    repositories: IRepositories;
}
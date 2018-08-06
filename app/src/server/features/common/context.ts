import { ContactsRepository, IContactsRepository } from "../../repositories/contactsRepository";

export interface IQuery<T> {
  Run: (context: IContext) => Promise<T>;
}

export interface ICommand<T> {
  Run: (context: IContext) => Promise<T>;
}

export interface IRepositories {
  contacts: IContactsRepository;
}

export interface IContext {
  repositories: IRepositories;
  runQuery<TResult>(cmd: IQuery<TResult>): Promise<TResult>;
  runCommand<TResult>(cmd: ICommand<TResult>): Promise<TResult>;
}

export class Context implements IContext {
  repositories = {
    contacts: new ContactsRepository()
  };

  runQuery<TResult>(query: IQuery<TResult>): Promise<TResult> {
    return query.Run(this);
  }

  runCommand<TResult>(query: ICommand<TResult>): Promise<TResult> {
    return query.Run(this);
  }
}

import { ContactsRepository, IContactsRepository } from "../../repositories/contactsRepository";
import { IProjectRepository, ProjectRepository } from "../../repositories/projectsRepository";

export interface IQuery<T> {
  Run: (context: IContext) => Promise<T>;
}

export interface ICommand<T> {
  Run: (context: IContext) => Promise<T>;
}

export interface IRepositories {
  contacts: IContactsRepository;
  projects: IProjectRepository;
}

export interface IContext {
  repositories: IRepositories;
  runQuery<TResult>(cmd: IQuery<TResult>): Promise<TResult>;
  runCommand<TResult>(cmd: ICommand<TResult>): Promise<TResult>;
}

export class Context implements IContext {
  repositories = {
    contacts: new ContactsRepository(),
    projects: new ProjectRepository()
  };

  runQuery<TResult>(query: IQuery<TResult>): Promise<TResult> {
    return query.Run(this);
  }

  runCommand<TResult>(query: ICommand<TResult>): Promise<TResult> {
    return query.Run(this);
  }
}

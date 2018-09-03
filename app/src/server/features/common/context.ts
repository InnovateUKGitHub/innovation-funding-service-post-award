import { ContactsRepository, IContactsRepository } from "../../repositories/contactsRepository";
import { IProjectRepository, ProjectRepository } from "../../repositories/projectsRepository";
import { IPartnerRepository, PartnerRepository } from "../../repositories/partnersRepository";
import { IProjectContactsRepository, ProjectContactsRepository } from "../../repositories/projectContactsRepository";
import { Configuration, IConfig } from "./config";
import { Clock, IClock } from "./clock";

export interface IQuery<T> {
  Run: (context: IContext) => Promise<T>;
}

export interface ICommand<T> {
  Run: (context: IContext) => Promise<T>;
}

export interface IRepositories {
  contacts: Readonly<IContactsRepository>;
  projects: Readonly<IProjectRepository>;
  partners: Readonly<IPartnerRepository>;
  projectContacts: Readonly<IProjectContactsRepository>;
}

export interface IContext {
  repositories: IRepositories;
  config: IConfig;
  runQuery<TResult>(cmd: IQuery<TResult>): Promise<TResult>;
  runCommand<TResult>(cmd: ICommand<TResult>): Promise<TResult>;
  clock(): IClock;
}

export class Context implements IContext {
  public repositories = {
    contacts: new ContactsRepository(),
    projects: new ProjectRepository(),
    partners: new PartnerRepository(),
    projectContacts: new ProjectContactsRepository()
  };

  public config = Configuration;

  public runQuery<TResult>(query: IQuery<TResult>): Promise<TResult> {
    console.log("Running query", query.constructor && query.constructor.name, query);
    return query.Run(this);
  }

  public runCommand<TResult>(query: ICommand<TResult>): Promise<TResult> {
    return query.Run(this);
  }

  public clock(): IClock {
    return new Clock();
  }
}

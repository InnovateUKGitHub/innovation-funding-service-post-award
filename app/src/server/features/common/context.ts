import * as Repsoitories from "../../repositories";
import { Configuration, IConfig } from "./config";
import { Clock, IClock } from "./clock";
import { ILogger, Logger } from "./logger";

export interface IQuery<T> {
  Run: (context: IContext) => Promise<T>;
}

export interface ICommand<T> {
  Run: (context: IContext) => Promise<T>;
}

export interface IRepositories {
  claimCosts: Readonly<Repsoitories.IClaimCostRepository>;
  contacts: Readonly<Repsoitories.IContactsRepository>;
  costCategories: Readonly<Repsoitories.ICostCategoryRepository>;
  projects: Readonly<Repsoitories.IProjectRepository>;
  partners: Readonly<Repsoitories.IPartnerRepository>;
  projectContacts: Readonly<Repsoitories.IProjectContactsRepository>;
}

export interface IContext {
  repositories: IRepositories;
  config: IConfig;
  runQuery<TResult>(cmd: IQuery<TResult>): Promise<TResult>;
  runCommand<TResult>(cmd: ICommand<TResult>): Promise<TResult>;
  clock(): IClock;
  logger: ILogger;
}

export class Context implements IContext {
  public repositories = {
    claimCosts: new Repsoitories.ClaimCostRepository(),
    contacts: new Repsoitories.ContactsRepository(),
    costCategories: new Repsoitories.CostCategoryRepository(),
    projects: new Repsoitories.ProjectRepository(),
    partners: new Repsoitories.PartnerRepository(),
    projectContacts: new Repsoitories.ProjectContactsRepository()
  };

  public config = Configuration;
  public logger = new Logger();

  public runQuery<TResult>(query: IQuery<TResult>): Promise<TResult> {
      this.logger.log("Running query", query);

      return query.Run(this).catch(e => {
        this.logger.log("Failed query", query);
        throw e;
      });
  }

  public runCommand<TResult>(query: ICommand<TResult>): Promise<TResult> {
      this.logger.log("Running command", query);

      return query.Run(this).catch(e => {
        this.logger.log("Failed command", query, e);
        throw e;
    });
  }

  public clock(): IClock {
    return new Clock();
  }
}

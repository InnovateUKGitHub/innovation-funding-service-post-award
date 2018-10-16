import * as Repositories from "../../repositories";
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
  claims: Readonly<Repositories.IClaimRepository>;
  claimDetails: Readonly<Repositories.IClaimDetailsRepository>;
  contacts: Readonly<Repositories.IContactsRepository>;
  costCategories: Readonly<Repositories.ICostCategoryRepository>;
  profileDetails: Readonly<Repositories.IProfileDetailsRepository>;
  profileTotalPeriod: Readonly<Repositories.IProfileTotalPeriodRepository>;
  profileTotalCostCategory: Readonly<Repositories.IProfileTotalCostCategoryRepository>;
  projects: Readonly<Repositories.IProjectRepository>;
  partners: Readonly<Repositories.IPartnerRepository>;
  projectContacts: Readonly<Repositories.IProjectContactsRepository>;
  claimLineItems: Readonly<Repositories.IClaimLineItemRepository>;
  claimTotalCostCategory: Readonly<Repositories.IClaimTotalCostCategoryRepository>;
}

export interface IContext {
  repositories: IRepositories;
  config: IConfig;
  runQuery<TResult>(cmd: IQuery<TResult>): Promise<TResult>;
  runCommand<TResult>(cmd: ICommand<TResult>): Promise<TResult>;
  clock: IClock;
  logger: ILogger;
}

export class Context implements IContext {
  public repositories = {
    claims: new Repositories.ClaimRepository(),
    claimDetails: new Repositories.ClaimDetailsRepository(),
    claimTotalCostCategory: new Repositories.ClaimTotalCostCategoryRepository(),
    claimCosts: new Repositories.ClaimCostRepository(),
    contacts: new Repositories.ContactsRepository(),
    costCategories: new Repositories.CostCategoryRepository(),
    profileDetails: new Repositories.ProfileDetailsRepository(),
    profileTotalPeriod: new Repositories.ProfileTotalPeriodRepository(),
    profileTotalCostCategory: new Repositories.ProfileTotalCostCategoryRepository(),
    projects: new Repositories.ProjectRepository(),
    partners: new Repositories.PartnerRepository(),
    projectContacts: new Repositories.ProjectContactsRepository(),
    claimLineItems: new Repositories.ClaimLineItemRepository()
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

  public clock = new Clock();
}

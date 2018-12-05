import * as Repositories from "../../repositories";
import { Configuration, IConfig } from "./config";
import { Clock, IClock } from "./clock";
import { ILogger, Logger } from "./logger";
import { ISalesforceConnectionDetails, salesforceConnection, salesforceConnectionWithToken } from "../../repositories/salesforceConnection";
import { Cache } from "./cache";

export interface IRunnable<T> {
  Run: (context: IContext) => Promise<T>;
}

export interface ISyncRunnable<T> {
  Run: (context: IContext) => T;
}

export abstract class QueryBase<T> {
  protected abstract Run(context: IContext): Promise<T>;
}

export abstract class SyncQueryBase<T> {
  protected abstract Run(context: IContext): T;
}

export abstract class CommandBase<T> {
  protected abstract Run(context: IContext): Promise<T>;
}

export abstract class SyncCommandBase<T> {
  protected abstract Run(context: IContext): T;
}

export interface IRepositories {
  claims: Readonly<Repositories.IClaimRepository>;
  claimDetails: Readonly<Repositories.IClaimDetailsRepository>;
  contacts: Readonly<Repositories.IContactsRepository>;
  costCategories: Readonly<Repositories.ICostCategoryRepository>;
  contentDocument: Readonly<Repositories.ContentDocumentRepository>;
  contentDocumentLinks: Readonly<Repositories.ContentDocumentLinkRepository>;
  contentVersions: Readonly<Repositories.ContentVersionRepository>;
  profileDetails: Readonly<Repositories.IProfileDetailsRepository>;
  profileTotalPeriod: Readonly<Repositories.IProfileTotalPeriodRepository>;
  profileTotalCostCategory: Readonly<Repositories.IProfileTotalCostCategoryRepository>;
  projects: Readonly<Repositories.IProjectRepository>;
  partners: Readonly<Repositories.IPartnerRepository>;
  projectContacts: Readonly<Repositories.IProjectContactsRepository>;
  claimLineItems: Readonly<Repositories.IClaimLineItemRepository>;
  claimTotalCostCategory: Readonly<Repositories.IClaimTotalCostCategoryRepository>;
}

export interface ICaches {
  costCategories: Readonly<Cache<CostCategoryDto[]>>;
}

export interface IContext {
  repositories: IRepositories;
  caches: ICaches;
  config: IConfig;
  runQuery<TResult>(cmd: QueryBase<TResult>): Promise<TResult>;
  runSyncQuery<TResult>(cmd: SyncQueryBase<TResult>): TResult;
  runCommand<TResult>(cmd: CommandBase<TResult>): Promise<TResult>;
  runSyncCommand<TResult>(cmd: SyncCommandBase<TResult>): TResult;
  clock: IClock;
  logger: ILogger;
}

const cachesImplimentation: ICaches = {
  costCategories: new Cache<CostCategoryDto[]>(60 * 12)
};

export class Context implements IContext {

  constructor(public readonly user: IUser) {

    this.config = Configuration;

    this.salesforceConnectionDetails = {
      username: this.user.email,
      password: this.config.salesforcePassword,
      token: this.config.salesforceToken,
      connectionUrl: this.config.salesforceConnectionUrl,
      clientId: this.config.salesforceClientId
    };
  }

  // the connection details hane been left as delegates untill details of JWT Access token confirmed
  public repositories = {
    claims: new Repositories.ClaimRepository(() => this.getSalesforceConnection()),
    claimDetails: new Repositories.ClaimDetailsRepository(() => this.getSalesforceConnection()),
    claimTotalCostCategory: new Repositories.ClaimTotalCostCategoryRepository(() => this.getSalesforceConnection()),
    contacts: new Repositories.ContactsRepository(() => this.getSalesforceConnection()),
    costCategories: new Repositories.CostCategoryRepository(() => this.getSalesforceConnection()),
    contentDocument: new Repositories.ContentDocumentRepository(() => this.getSalesforceConnection()),
    contentDocumentLinks: new Repositories.ContentDocumentLinkRepository(() => this.getSalesforceConnection()),
    contentVersions: new Repositories.ContentVersionRepository(() => this.getSalesforceConnection()),
    profileDetails: new Repositories.ProfileDetailsRepository(() => this.getSalesforceConnection()),
    profileTotalPeriod: new Repositories.ProfileTotalPeriodRepository(() => this.getSalesforceConnection()),
    profileTotalCostCategory: new Repositories.ProfileTotalCostCategoryRepository(() => this.getSalesforceConnection()),
    projects: new Repositories.ProjectRepository(() => this.getSalesforceConnection()),
    partners: new Repositories.PartnerRepository(() => this.getSalesforceConnection()),
    projectContacts: new Repositories.ProjectContactsRepository(() => this.getSalesforceConnection()),
    claimLineItems: new Repositories.ClaimLineItemRepository(() => this.getSalesforceConnection())
  };

  public caches = cachesImplimentation;

  private salesforceConnectionDetails: ISalesforceConnectionDetails;

  private getSalesforceConnection() {
    if (this.config.salesforceUseJwtToken) {
      return salesforceConnectionWithToken(this.salesforceConnectionDetails);
    }
    else {
      return salesforceConnection(this.salesforceConnectionDetails);
    }
  }

  public config: Readonly<IConfig>;
  public logger = new Logger();

  public runQuery<TResult>(query: QueryBase<TResult>): Promise<TResult> {
    this.logger.log("Running query", query);

    const runnable = (query as any) as IRunnable<TResult>;

    return runnable.Run(this)
      .catch(e => {
        this.logger.log("Failed query", query, e);
        throw e;
      });
  }

  public runSyncQuery<TResult>(query: SyncQueryBase<TResult>): TResult {
    this.logger.log("Running sync query", query);

    const runnable = (query as any) as ISyncRunnable<TResult>;

    return runnable.Run(this);
  }

  public runCommand<TResult>(command: CommandBase<TResult>): Promise<TResult> {
    this.logger.log("Running command", command);

    const runnable = (command as any) as IRunnable<TResult>;

    return runnable.Run(this).catch(e => {
      this.logger.log("Failed command", command, e);
      throw e;
    });
  }

  public runSyncCommand<TResult>(command: SyncCommandBase<TResult>): TResult {
    this.logger.log("Running sync command", command);

    const runnable = (command as any) as ISyncRunnable<TResult>;

    return runnable.Run(this);
  }

  public clock = new Clock();
}

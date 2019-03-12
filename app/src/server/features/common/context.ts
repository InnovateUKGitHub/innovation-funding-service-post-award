import * as Repositories from "../../repositories";
import { Cache, Clock, Configuration, IConfig, Logger } from "./";
import { AppError, BadRequestError, ForbiddenError, NotFoundError, ValidationError } from "./appError";
import * as Salesforce from "../../repositories/salesforceConnection";
import { SalesforceInvalidFilterError } from "../../repositories/salesforceRepositoryBase";
import { GetAllProjectRolesForUser, IRoleInfo } from "../projects/getAllProjectRolesForUser";
import { ErrorCode, ICaches, IContext, IRunnable, ISyncRunnable, IUser } from "../../../types";
import { QueryBase, SyncQueryBase } from "./queryBase";
import { CommandBase, SyncCommandBase } from "./commandBase";

const cachesImplementation: ICaches = {
  costCategories: new Cache<CostCategoryDto[]>(Configuration.timeouts.costCategories),
  projectRoles: new Cache<{ [key: string]: IRoleInfo }>(Configuration.timeouts.projectRoles),
};

const constructErrorResponse = <E extends Error>(error: E): AppError => {
  if (error instanceof ValidationError || error instanceof ForbiddenError || error instanceof BadRequestError) {
    return error;
  }

  if (error instanceof Salesforce.SalesforceTokenError) {
    return new AppError(ErrorCode.SECURITY_ERROR, error.message, error);
  }

  if (error instanceof SalesforceInvalidFilterError) {
    return new NotFoundError(undefined, error);
  }

  return new AppError(ErrorCode.UNKNOWN_ERROR, error.message, error);
};

export class Context implements IContext {
  constructor(public readonly user: IUser) {
    this.config = Configuration;

    const salesforceConfig = {
      clientId: this.config.salesforce.clientId,
      connectionUrl: this.config.salesforce.connectionUrl,
      servicePassword: this.config.salesforce.serivcePassword,
      serviceUsername: this.config.salesforce.serivceUsername,
      serviceToken: this.config.salesforce.serivceToken,
    };

    this.salesforceConnectionDetails = Object.assign(salesforceConfig, { currentUsername: this.user && this.user.email });
    this.logger = new Logger(user);
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

  public readonly logger: Logger;
  public readonly config: Readonly<IConfig>;
  public readonly clock = new Clock();
  public readonly caches = cachesImplementation;

  private readonly salesforceConnectionDetails: Salesforce.ISalesforceConnectionDetails;

  private getSalesforceConnection() {
      return Salesforce.salesforceConnectionWithToken(this.salesforceConnectionDetails);
  }

  private async runAsync<TResult>(runnable: IRunnable<TResult>): Promise<TResult> {
    try {
      const auth = await new GetAllProjectRolesForUser().Run(this);
      if (!(await runnable.accessControl(auth, this))) throw new ForbiddenError();
      return await runnable.Run(this);
    }
    catch (e) {
      this.logger.warn("Failed query", runnable.LogMessage(), e);
      throw constructErrorResponse(e);
    }
  }

  private runSync<TResult>(runnable: ISyncRunnable<TResult>): TResult {
    try {
      return runnable.Run(this);
    }
    catch (e) {
      this.logger.warn("Failed query", runnable.LogMessage(), e);
      throw constructErrorResponse(e);
    }
  }

  public runQuery<TResult>(query: QueryBase<TResult>): Promise<TResult> {
    const runnable = (query as any) as IRunnable<TResult>;
    this.logger.info("Running async query", runnable.LogMessage());

    return this.runAsync(runnable);
  }

  public runSyncQuery<TResult>(query: SyncQueryBase<TResult>): TResult {
    const runnable = (query as any) as ISyncRunnable<TResult>;
    this.logger.info("Running sync query", runnable.LogMessage());

    return this.runSync(runnable);
  }

  public runCommand<TResult>(command: CommandBase<TResult>): Promise<TResult> {
    const runnable = (command as any) as IRunnable<TResult>;
    this.logger.info("Running async command", runnable.LogMessage());

    return this.runAsync(runnable);
  }

  public runSyncCommand<TResult>(command: SyncCommandBase<TResult>): TResult {
    const runnable = (command as any) as ISyncRunnable<TResult>;
    this.logger.info("Running sync command", runnable.LogMessage());

    return this.runSync(runnable);
  }
}

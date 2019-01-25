import * as Repositories from "../../repositories";
import { Configuration, IConfig } from "./config";
import { Clock } from "./clock";
import { Logger } from "./logger";
import {
  ISalesforceConnectionDetails,
  salesforceConnection,
  salesforceConnectionWithToken,
  SalesforceTokenError
} from "../../repositories/salesforceConnection";
import { Cache } from "./cache";
import { SalesforceInvalidFilterError } from "../../repositories/salesforceBase";
import { AppError, BadRequestError, ForbiddenError, NotFoundError, ValidationError } from "./appError";
import { ErrorCode, IUser } from "../../../types";
import { GetAllProjectRolesForUser, IRoleInfo } from "../projects/getAllProjectRolesForUser";
import { ICaches, IContext, IRunnable, ISyncRunnable } from "../../../types/IContext";
import { QueryBase, SyncQueryBase } from "./queryBase";
import { CommandBase, SyncCommandBase } from "./commandBase";

const cachesImplementation: ICaches = {
  costCategories: new Cache<CostCategoryDto[]>(60 * 12),
  projectRoles: new Cache<{ [key: string]: IRoleInfo}>(60 * 12),
};

const constructErrorResponse = <E extends Error>(error: E): AppError => {
  if (error instanceof ValidationError) {
    return error;
  }
  if (error instanceof ForbiddenError) {
    return error;
  }
  if (error instanceof BadRequestError) {
    return error;
  }
  if (error instanceof SalesforceTokenError) {
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

  public caches = cachesImplementation;

  private salesforceConnectionDetails: ISalesforceConnectionDetails;

  private getSalesforceConnection() {
    // if the standard user then connect using salesforceConnection other wise use the token
    if (this.user.email === this.config.salesforceUsername) {
      // todo: remove
      return salesforceConnection(this.salesforceConnectionDetails);
    }
    else {
      return salesforceConnectionWithToken(this.salesforceConnectionDetails);
    }
  }

  public config: Readonly<IConfig>;
  public logger = new Logger();

  private async runAsync<TResult>(runnable: IRunnable<TResult>): Promise<TResult> {
    try {
      const auth = await new GetAllProjectRolesForUser().Run(this);
      if (!(await runnable.accessControl(auth, this))) throw new ForbiddenError();
      return await runnable.Run(this);
    }
    catch(e) {
      this.logger.log("Failed query", runnable, e);
      throw constructErrorResponse(e);
    }
  }

  private runSync<TResult>(runnable: ISyncRunnable<TResult>): TResult {
    try {
      return runnable.Run(this);
    }
    catch (e) {
      this.logger.log("Failed query", runnable, e);
      throw constructErrorResponse(e);
    }
  }

  public runQuery<TResult>(query: QueryBase<TResult>): Promise<TResult> {
    const runnable = (query as any) as IRunnable<TResult>;

    this.logger.log("Running async query", runnable.LogMessage());

    return this.runAsync(runnable);
  }

  public runSyncQuery<TResult>(query: SyncQueryBase<TResult>): TResult {
    const runnable = (query as any) as ISyncRunnable<TResult>;

    this.logger.log("Running sync query", runnable.LogMessage());

    return this.runSync(runnable);
  }

  public runCommand<TResult>(command: CommandBase<TResult>): Promise<TResult> {
    const runnable = (command as any) as IRunnable<TResult>;

    this.logger.log("Running async command", runnable.LogMessage());

    return this.runAsync(runnable);
  }

  public runSyncCommand<TResult>(command: SyncCommandBase<TResult>): TResult {
    const runnable = (command as any) as ISyncRunnable<TResult>;

    this.logger.log("Running sync command", runnable.LogMessage());

    return this.runSync(runnable);
  }

  public clock = new Clock();
}

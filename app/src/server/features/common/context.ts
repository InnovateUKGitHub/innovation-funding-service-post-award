import { GetAllProjectRolesForUser, IRoleInfo } from "../projects/getAllProjectRolesForUser";
import * as Repositories from "../../repositories";
import { AppError, BadRequestError, ForbiddenError, NotFoundError, ValidationError } from "./appError";
import * as Salesforce from "../../repositories/salesforceConnection";
import * as Common from "@server/features/common";
import * as Framework from "@framework/types";
import * as Entities from "@framework/entities";

// obvs needs to be singleton
const cachesImplementation: Framework.ICaches = {
  costCategories: new Common.Cache<CostCategoryDto[]>(Common.Configuration.timeouts.costCategories),
  optionsLookup: new Common.Cache<Map<any, Framework.Option>>(Common.Configuration.timeouts.optionsLookup),
  projectRoles: new Common.Cache<{ [key: string]: IRoleInfo }>(Common.Configuration.timeouts.projectRoles),
  permissionGroups: new Common.Cache<Entities.PermissionGroup[]>(0 /* permanant cache */),
  recordTypes: new Common.Cache<Entities.RecordType[]>(Common.Configuration.timeouts.recordTypes),
};

const constructErrorResponse = <E extends Error>(error: E): AppError => {
  if (error instanceof ValidationError || error instanceof ForbiddenError || error instanceof BadRequestError || error instanceof NotFoundError) {
    return error;
  }

  if (error instanceof Repositories.SalesforceTokenError) {
    return new AppError(Framework.ErrorCode.SECURITY_ERROR, error.message, error);
  }

  if (error instanceof Repositories.SalesforceInvalidFilterError) {
    return new NotFoundError(undefined, error);
  }

  return new AppError(Framework.ErrorCode.UNKNOWN_ERROR, error.message, error);
};

export class Context implements Framework.IContext {
  constructor(public readonly user: Framework.ISessionUser) {
    this.config = Common.Configuration;

    const salesforceConfig = {
      clientId: this.config.salesforce.clientId,
      connectionUrl: this.config.salesforce.connectionUrl,
      servicePassword: this.config.salesforce.serivcePassword,
      serviceUsername: this.config.salesforce.serivceUsername,
      serviceToken: this.config.salesforce.serivceToken,
    };

    this.salesforceConnectionDetails = Object.assign(salesforceConfig, { currentUsername: this.user && this.user.email });

    this.logger = new Common.Logger(user && user.email);

    this.caches = cachesImplementation;

    // use fat arrow so this is bound - extracted to shorten line length
    const connectionCallback = () => this.getSalesforceConnection();
    const recordTypeCallback = (objectName: string, recordType: string) => this.getRecordTypeId(objectName, recordType);

    this.repositories = {
      claims: new Repositories.ClaimRepository(connectionCallback, this.logger),
      claimDetails: new Repositories.ClaimDetailsRepository(recordTypeCallback, connectionCallback, this.logger),
      claimStatusChanges: new Repositories.ClaimStatusChangeRepository(connectionCallback, this.logger),
      claimTotalCostCategory: new Repositories.ClaimTotalCostCategoryRepository(connectionCallback, this.logger),
      claimLineItems: new Repositories.ClaimLineItemRepository(recordTypeCallback, connectionCallback, this.logger),
      costCategories: new Repositories.CostCategoryRepository(connectionCallback, this.logger),
      documents: new Repositories.DocumentsRepository(connectionCallback, this.logger),
      financialVirements: new Repositories.FinancialVirementRepository(connectionCallback, this.logger),
      monitoringReportResponse: new Repositories.MonitoringReportResponseRepository(recordTypeCallback, connectionCallback, this.logger),
      monitoringReportHeader: new Repositories.MonitoringReportHeaderRepository(recordTypeCallback, connectionCallback, this.logger),
      monitoringReportQuestions: new Repositories.MonitoringReportQuestionsRepository(connectionCallback, this.logger),
      monitoringReportStatusChange: new Repositories.MonitoringReportStatusChangeRepository(connectionCallback, this.logger),
      projectChangeRequests: new Repositories.ProjectChangeRequestRepository(recordTypeCallback, connectionCallback, this.logger),
      profileDetails: new Repositories.ProfileDetailsRepository(connectionCallback, this.logger),
      profileTotalPeriod: new Repositories.ProfileTotalPeriodRepository(connectionCallback, this.logger),
      profileTotalCostCategory: new Repositories.ProfileTotalCostCategoryRepository(connectionCallback, this.logger),
      projects: new Repositories.ProjectRepository(connectionCallback, this.logger),
      partners: new Repositories.PartnerRepository(connectionCallback, this.logger),
      projectChangeRequestStatusChange: new Repositories.ProjectChangeRequestStatusChangeRepository(connectionCallback, this.logger),
      projectContacts: new Repositories.ProjectContactsRepository(connectionCallback, this.logger),
      permissionGroups: new Repositories.PermissionGroupRepository(connectionCallback, this.logger),
      recordTypes: new Repositories.RecordTypeRepository(connectionCallback, this.logger)
    };

  }

  public readonly repositories: Framework.IRepositories;
  public readonly logger: Common.ILogger;
  public readonly config: Common.IConfig;
  public readonly clock: Common.IClock = new Common.Clock();
  public readonly caches: Framework.ICaches;

  private readonly salesforceConnectionDetails: Salesforce.ISalesforceConnectionDetails;

  private getSalesforceConnection() {
    return Salesforce.salesforceConnectionWithToken(this.salesforceConnectionDetails);
  }

  public startTimer(message: string) {
    return new Common.Timer(this.logger, message);
  }

  private authorisation: Framework.Authorisation | null = null;

  private getAuthorisation() {
    if (this.authorisation) {
      return Promise.resolve(this.authorisation);
    }
    return new GetAllProjectRolesForUser().Run(this).then(x => {
      this.authorisation = x;
      return x;
    });
  }

  private async runAsync<TResult>(runnable: Framework.IAsyncRunnable<TResult>): Promise<TResult> {
    const timer = this.startTimer(runnable.constructor.name);
    try {
      const authorisation = await this.getAuthorisation();
      if (!(await runnable.accessControl(authorisation, this))) throw new ForbiddenError();
      // await the run because of the finally
      return await runnable.Run(this);
    }
    catch (e) {
      this.logger.warn("Failed query", runnable.LogMessage(), e);
      if (e instanceof ValidationError) {
        this.logger.debug("Validation Error", e.results && e.results.log());
      }
      throw constructErrorResponse(e);
    }
    finally {
      timer.finish();
    }
  }

  private runSync<TResult>(runnable: Framework.ISyncRunnable<TResult>): TResult {
    const timer = this.startTimer(runnable.constructor.name);
    try {
      return runnable.Run(this);
    }
    catch (e) {
      this.logger.warn("Failed query", runnable.LogMessage(), e);
      throw constructErrorResponse(e);
    }
    finally {
      timer.finish();
    }
  }

  public runQuery<TResult>(query: Common.QueryBase<TResult>): Promise<TResult> {
    const runnable = (query as any) as Framework.IAsyncRunnable<TResult>;
    this.logger.info("Running async query", runnable.LogMessage());
    return this.runAsync(runnable);
  }

  public runSyncQuery<TResult>(query: Common.SyncQueryBase<TResult>): TResult {
    const runnable = (query as any) as Framework.ISyncRunnable<TResult>;
    this.logger.info("Running sync query", runnable.LogMessage());
    return this.runSync(runnable);
  }

  public runCommand<TResult>(command: Common.CommandBase<TResult>): Promise<TResult> {
    const runnable = (command as any) as Framework.IAsyncRunnable<TResult>;
    this.logger.info("Running async command", runnable.LogMessage());
    return this.runAsync(runnable);
  }

  public runSyncCommand<TResult>(command: Common.SyncCommandBase<TResult>): TResult {
    const runnable = (command as any) as Framework.ISyncRunnable<TResult>;
    this.logger.info("Running sync command", runnable.LogMessage());
    return this.runSync(runnable);
  }

  // allows context to be esculated to the system user
  // use with discression!!!
  public asSystemUser(): Framework.IContext {
    const serviceUser = this.config.salesforce.serivceUsername;
    if (this.user.email !== serviceUser) {
      this.logger.info("Escalating to service user", this.user.email, serviceUser);
      return new Context({ email: serviceUser });
    }
    return this;
  }

  // helper function for repositories that need record type ids
  private async getRecordTypeId(objectName: string, recordType: string): Promise<string> {
    // Needs to dynamically import otherwise can be a circular reference
    const queryImport = await import("../general/getRecordTypeQuery");
    const query = new queryImport.GetRecordTypeQuery(objectName, recordType);
    return this.runQuery(query).then(x => x.id);
  }
}

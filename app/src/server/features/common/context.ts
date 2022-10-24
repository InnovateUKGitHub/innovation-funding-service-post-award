import i18next from "i18next";
import * as Common from "@server/features/common";
import * as Framework from "@framework/types";
import * as Entities from "@framework/entities";
import { IInternationalisation } from "@framework/types";
import { CustomContentStore } from "@server/resources/customContentStore";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { BankCheckService } from "@server/resources/bankCheckService";
import { CompaniesHouseBase } from "@server/resources/companiesHouse";
import * as Salesforce from "../../repositories/salesforceConnection";
import * as Repositories from "../../repositories";
import { GetAllProjectRolesForUser, IRoleInfo } from "../projects/getAllProjectRolesForUser";
import { GetRecordTypeQuery } from "../general/getRecordTypeQuery";
import { AppError, BadRequestError, ForbiddenError, NotFoundError, ValidationError } from "./appError";
import { ILogger, Logger } from "@shared/developmentLogger";

// obviously needs to be singleton
const cachesImplementation: Framework.ICaches = {
  costCategories: new Common.Cache<CostCategoryDto[]>(Common.configuration.timeouts.costCategories),
  optionsLookup: new Common.Cache<Framework.Option<unknown>[]>(Common.configuration.timeouts.optionsLookup),
  projectRoles: new Common.Cache<{ [key: string]: IRoleInfo }>(Common.configuration.timeouts.projectRoles),
  permissionGroups: new Common.Cache<Entities.PermissionGroup[]>(0 /* permanent cache */),
  recordTypes: new Common.Cache<Entities.RecordType[]>(Common.configuration.timeouts.recordTypes),
  contentStoreLastUpdated: null,
};

export const constructErrorResponse = (error: unknown): AppError => {
  if (
    error instanceof ValidationError ||
    error instanceof ForbiddenError ||
    error instanceof BadRequestError ||
    error instanceof NotFoundError
  ) {
    return error;
  }

  if (error instanceof Repositories.SalesforceTokenError) {
    return new AppError(Framework.ErrorCode.SECURITY_ERROR, error.message, error);
  }

  if (error instanceof Repositories.SalesforceInvalidFilterError) {
    return new NotFoundError(undefined, error);
  }

  if (error instanceof Repositories.FileTypeNotAllowedError) {
    return new AppError(Framework.ErrorCode.BAD_REQUEST_ERROR, error.message, error);
  }

  if (error instanceof Error) {
    // TODO capture stack trace for logs
    return new AppError(Framework.ErrorCode.UNKNOWN_ERROR, error.message, error);
  }

  if (typeof error === "string") {
    return new AppError(Framework.ErrorCode.UNKNOWN_ERROR, error);
  }

  // We don't really know what type the error is, so force it into a string.
  return new AppError(Framework.ErrorCode.UNKNOWN_ERROR, JSON.stringify(error));
};

export class Context implements Framework.IContext {
  constructor(public readonly user: Framework.ISessionUser) {
    this.config = Common.configuration;

    const salesforceConfig = {
      clientId: this.config.salesforceServiceUser.clientId,
      connectionUrl: this.config.salesforceServiceUser.connectionUrl,
      serviceUsername: this.config.salesforceServiceUser.serviceUsername,
    };

    this.salesforceConnectionDetails = {
      ...salesforceConfig,
      currentUsername: this.user?.email,
    };

    this.logger = new Logger("Context", {
      prefixLines: [user && user.email],
    });

    this.caches = cachesImplementation;

    // use fat arrow so this is bound - extracted to shorten line length
    const connectionCallback = () => this.getSalesforceConnection();
    const recordTypeCallback = (objectName: string, recordType: string) => this.getRecordTypeId(objectName, recordType);

    this.repositories = {
      accounts: new Repositories.AccountsRepository(connectionCallback, this.logger),
      broadcast: new Repositories.BroadcastRepository(connectionCallback, this.logger),
      claims: new Repositories.ClaimRepository(connectionCallback, this.logger),
      claimDetails: new Repositories.ClaimDetailsRepository(recordTypeCallback, connectionCallback, this.logger),
      claimStatusChanges: new Repositories.ClaimStatusChangeRepository(connectionCallback, this.logger),
      companies: new Repositories.CompaniesHouse(),
      claimTotalCostCategory: new Repositories.ClaimTotalCostCategoryRepository(connectionCallback, this.logger),
      claimLineItems: new Repositories.ClaimLineItemRepository(recordTypeCallback, connectionCallback, this.logger),
      costCategories: new Repositories.CostCategoryRepository(connectionCallback, this.logger),
      documents: new Repositories.DocumentsRepository(connectionCallback, this.logger),
      financialVirements: new Repositories.FinancialVirementRepository(
        recordTypeCallback,
        connectionCallback,
        this.logger,
      ),
      financialLoanVirements: new Repositories.FinancialLoanVirementRepository(
        recordTypeCallback,
        connectionCallback,
        this.logger,
      ),
      pcrSpendProfile: new Repositories.PcrSpendProfileRepository(recordTypeCallback, connectionCallback, this.logger),
      monitoringReportResponse: new Repositories.MonitoringReportResponseRepository(
        recordTypeCallback,
        connectionCallback,
        this.logger,
      ),
      monitoringReportHeader: new Repositories.MonitoringReportHeaderRepository(
        recordTypeCallback,
        connectionCallback,
        this.logger,
      ),
      monitoringReportQuestions: new Repositories.MonitoringReportQuestionsRepository(connectionCallback, this.logger),
      loans: new Repositories.LoanRepository(connectionCallback, this.logger),
      monitoringReportStatusChange: new Repositories.MonitoringReportStatusChangeRepository(
        connectionCallback,
        this.logger,
      ),
      projectChangeRequests: new Repositories.ProjectChangeRequestRepository(
        recordTypeCallback,
        connectionCallback,
        this.logger,
      ),
      profileDetails: new Repositories.ProfileDetailsRepository(connectionCallback, this.logger),
      profileTotalPeriod: new Repositories.ProfileTotalPeriodRepository(connectionCallback, this.logger),
      profileTotalCostCategory: new Repositories.ProfileTotalCostCategoryRepository(connectionCallback, this.logger),
      projects: new Repositories.ProjectRepository(connectionCallback, this.logger),
      partners: new Repositories.PartnerRepository(connectionCallback, this.logger),
      projectChangeRequestStatusChange: new Repositories.ProjectChangeRequestStatusChangeRepository(
        connectionCallback,
        this.logger,
      ),
      projectContacts: new Repositories.ProjectContactsRepository(connectionCallback, this.logger),
      permissionGroups: new Repositories.PermissionGroupRepository(connectionCallback, this.logger),
      recordTypes: new Repositories.RecordTypeRepository(connectionCallback, this.logger),
    };

    this.resources = {
      bankCheckService: new BankCheckService(),
      companiesHouse: new CompaniesHouseBase(),
      customContent: new CustomContentStore(),
    };
  }

  public readonly repositories: Framework.IRepositories;
  public readonly logger: ILogger;
  public readonly config: Common.IConfig;
  public readonly clock: Common.IClock = new Common.Clock();
  public readonly caches: Framework.ICaches;
  public readonly resources: Framework.IResources;

  public readonly internationalisation: IInternationalisation = {
    addResourceBundle: (content, namespace) => i18next.addResourceBundle("en-GB", namespace, content, true, true),
  };

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
    return new GetAllProjectRolesForUser().run(this).then(x => {
      this.authorisation = x;
      return x;
    });
  }

  private async runAsync<TResult>(runnable: Framework.IAsyncRunnable<TResult>): Promise<TResult> {
    const timer = this.startTimer(runnable.constructor.name);
    try {
      if (runnable.accessControl) {
        const authorisation = await this.getAuthorisation();
        if (!(await runnable.accessControl(authorisation, this))) throw new ForbiddenError();
      }
      // await the run because of the finally
      return await runnable.run(this);
    } catch (e: unknown) {
      this.logger.warn("Failed query", runnable.logMessage(), e);
      if (e instanceof ValidationError) {
        this.logger.debug("Validation Error", e.results && e.results.log());
      }
      if (runnable.handleRepositoryError) runnable.handleRepositoryError(this, e);
      throw constructErrorResponse(e);
    } finally {
      timer.finish();
    }
  }

  private runSync<TResult>(runnable: Framework.ISyncRunnable<TResult>): TResult {
    const timer = this.startTimer(runnable.constructor.name);
    try {
      return runnable.run(this);
    } catch (e: any) {
      this.logger.warn("Failed query", runnable.logMessage(), e);
      throw constructErrorResponse(e);
    } finally {
      timer.finish();
    }
  }

  public runQuery<TResult>(query: Common.QueryBase<TResult>): Promise<TResult> {
    const runnable = query as any as Framework.IAsyncRunnable<TResult>;
    this.logger.info("Running async query", runnable.logMessage());
    return this.runAsync(runnable);
  }

  public runSyncQuery<TResult>(query: Common.SyncQueryBase<TResult>): TResult {
    const runnable = query as any as Framework.ISyncRunnable<TResult>;
    this.logger.info("Running sync query", runnable.logMessage());
    return this.runSync(runnable);
  }

  public runCommand<TResult>(
    command: Common.CommandBase<TResult> | Common.NonAuthorisedCommandBase<TResult>,
  ): Promise<TResult> {
    const runnable = command as any as Framework.IAsyncRunnable<TResult>;
    this.logger.info("Running async command", ...runnable.logMessage());
    return this.runAsync(runnable);
  }

  public runSyncCommand<TResult>(command: Common.SyncCommandBase<TResult>): TResult {
    const runnable = command as any as Framework.ISyncRunnable<TResult>;
    this.logger.info("Running sync command", runnable.logMessage());
    return this.runSync(runnable);
  }

  /**
   * Elevate a user context to a different user context.
   *
   * @param user The Salesforce user e-mail address
   * @returns An elevated IContext as the passed in user
   * @author Leondro Lio <leondro.lio@iuk.ukri.org>
   */
  private elevateUserAs(user: string): Framework.IContext {
    if (this.user.email !== user) {
      return new Context({ email: user });
    }
    return this;
  }

  /**
   * Elevate a user context to the system user context
   *
   * @returns An elevated IContext as the system user
   */
  public asSystemUser(): Framework.IContext {
    const serviceUser = this.config.salesforceServiceUser.serviceUsername;
    this.logger.info(`Escalating from ${this.user.email} to system user ${serviceUser}`);
    return this.elevateUserAs(serviceUser);
  }

  /**
   * Elevate a user context to the bank details validation user context.
   *
   * @returns An elevated IContext as the bank details validation user
   */
  public asBankDetailsValidationUser(): Framework.IContext {
    const serviceUser = this.config.bankDetailsValidationUser.serviceUsername;
    this.logger.info(`Escalating from ${this.user.email} to banking user ${serviceUser}`);
    return this.elevateUserAs(serviceUser);
  }

  // helper function for repositories that need record type ids
  private async getRecordTypeId(objectName: string, recordType: string): Promise<string> {
    const query = new GetRecordTypeQuery(objectName, recordType);
    return this.runQuery(query).then(x => x.id);
  }
}

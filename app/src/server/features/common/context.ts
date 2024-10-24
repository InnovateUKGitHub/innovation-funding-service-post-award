import i18next from "i18next";
import { CustomContentStore } from "@server/resources/customContentStore";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { BankCheckService } from "@server/resources/bankCheckService";
import { GetAllProjectRolesForUser, IRoleInfo } from "../projects/getAllProjectRolesForUser";
import { GetRecordTypeQuery } from "../general/getRecordTypeQuery";
import { SfdcServerError, AppError, BadRequestError, ForbiddenError, NotFoundError, ValidationError } from "./appError";
import { Logger } from "@shared/developmentLogger";
import { ILogger } from "@shared/logger";
import { ErrorCode } from "@framework/constants/enums";
import { Authorisation } from "@framework/types/authorisation";
import { ICaches, IContext, IRepositories, IResources, IInternationalisation } from "@framework/types/IContext";
import { ISessionUser } from "@framework/types/IUser";
import { IClock, Clock } from "@framework/util/clock";
import { AccountsRepository } from "@server/repositories/accountsRepository";
import { ClaimDetailsRepository } from "@server/repositories/claimDetailsRepository";
import { ClaimLineItemRepository } from "@server/repositories/claimLineItemRepository";
import { ClaimRepository } from "@server/repositories/claimsRepository";
import { ClaimStatusChangeRepository } from "@server/repositories/claimStatusChangeRepository";
import { ClaimTotalCostCategoryRepository } from "@server/repositories/claimTotalCostCategoryRepository";
import { CompaniesHouse } from "@server/repositories/companiesRepository";
import { CostCategoryRepository } from "@server/repositories/costCategoriesRepository";
import { DocumentsRepository } from "@server/repositories/documentsRepository";
import {
  SalesforceTokenError,
  SalesforceInvalidFilterError,
  FileTypeNotAllowedError,
  SalesforceDetailedErrorResponse,
} from "@server/repositories/errors";
import { FinancialLoanVirementRepository } from "@server/repositories/financialLoanVirementRepository";
import { FinancialVirementRepository } from "@server/repositories/financialVirementRepository";
import { LoanRepository } from "@server/repositories/loanRepository";
import { MonitoringReportHeaderRepository } from "@server/repositories/monitoringReportHeaderRepository";
import { MonitoringReportQuestionsRepository } from "@server/repositories/monitoringReportQuestionsRepository";
import { MonitoringReportResponseRepository } from "@server/repositories/monitoringReportResponseRepository";
import { MonitoringReportStatusChangeRepository } from "@server/repositories/monitoringReportStatusChangeRepository";
import { PartnerRepository } from "@server/repositories/partnersRepository";
import { PcrSpendProfileRepository } from "@server/repositories/pcrSpendProfileRepository";
import { PermissionGroupRepository } from "@server/repositories/permissionGroupsRepository";
import { ProfileDetailsRepository } from "@server/repositories/profileDetailsRepository";
import { ProfileTotalPeriodRepository } from "@server/repositories/profilePeriodTotalRepository";
import { ProfileTotalCostCategoryRepository } from "@server/repositories/profileTotalCostCategoryRepository";
import { ProjectChangeRequestRepository } from "@server/repositories/projectChangeRequestRepository";
import { ProjectChangeRequestStatusChangeRepository } from "@server/repositories/projectChangeRequestStatusChangeRepository";
import { ProjectContactsRepository } from "@server/repositories/projectContactsRepository";
import { ProjectRepository } from "@server/repositories/projectsRepository";
import { RecordTypeRepository } from "@server/repositories/recordTypeRepository";
import { AuthorisedAsyncCommandBase, AsyncCommandBase, SyncCommandBase } from "./commandBase";
import { configuration } from "./config";
import { IConfig } from "@framework/types/IConfig";
import { AsyncQueryBase, AuthorisedAsyncQueryBase, SyncQueryBase } from "./queryBase";
import { Timer } from "./timer";
import { Option } from "@framework/dtos/option";
import { Cache } from "./cache";
import { PermissionGroup } from "@framework/entities/permissionGroup";
import { RecordType } from "@framework/entities/recordType";
import { TsforceConnection } from "@server/tsforce/TsforceConnection";
import { ExternalContactsRepository } from "@server/repositories/externalContactRepository";

// obviously needs to be singleton
const cachesImplementation: ICaches = {
  costCategories: new Cache<CostCategoryDto[]>(configuration.timeouts.costCategories),
  optionsLookup: new Cache<Option<unknown>[]>(configuration.timeouts.optionsLookup),
  projectRoles: new Cache<{ [key: string]: IRoleInfo }>(configuration.timeouts.projectRoles),
  permissionGroups: new Cache<PermissionGroup[]>(0 /* permanent cache */),
  recordTypes: new Cache<RecordType[]>(configuration.timeouts.recordTypes),
  contentStoreLastUpdated: null,
};

export const constructErrorResponse = (error: unknown): AppError => {
  if (
    error instanceof ValidationError ||
    error instanceof ForbiddenError ||
    error instanceof BadRequestError ||
    error instanceof NotFoundError ||
    error instanceof SfdcServerError
  ) {
    return error;
  }

  if (error instanceof SalesforceTokenError) {
    return new AppError(ErrorCode.SECURITY_ERROR, error.message, error);
  }

  if (error instanceof SalesforceInvalidFilterError) {
    return new NotFoundError(undefined, error);
  }

  if (error instanceof SalesforceDetailedErrorResponse) {
    return new SfdcServerError(error.message, error.details, error);
  }

  if (error instanceof FileTypeNotAllowedError) {
    return new AppError(ErrorCode.BAD_REQUEST_ERROR, error.message, error);
  }

  if (error instanceof Error) {
    // TODO capture stack trace for logs
    return new AppError(ErrorCode.UNKNOWN_ERROR, error.message, error);
  }

  if (typeof error === "string") {
    return new AppError(ErrorCode.UNKNOWN_ERROR, error);
  }

  // We don't really know what type the error is, so force it into a string.
  return new AppError(ErrorCode.UNKNOWN_ERROR, JSON.stringify(error));
};

export class Context implements IContext {
  public readonly user: ISessionUser;
  public readonly traceId: string;
  private readonly connection: TsforceConnection;
  private readonly systemConnection: TsforceConnection;
  private readonly bankConnection: TsforceConnection;

  constructor({
    user,
    traceId,
    connection,
    systemConnection,
    bankConnection,
  }: {
    user: ISessionUser;
    traceId: string;
    connection: TsforceConnection;
    systemConnection: TsforceConnection;
    bankConnection: TsforceConnection;
  }) {
    this.user = user;
    this.traceId = traceId;
    this.connection = connection;
    this.systemConnection = systemConnection;
    this.bankConnection = bankConnection;

    this.config = configuration;

    this.logger = new Logger("Context", {
      prefixLines: [{ user, traceId }],
    });

    this.caches = cachesImplementation;

    // use fat arrow so this is bound - extracted to shorten line length
    const connectionCallback = () => this.connection;
    const asSystemUserConnectionCallback = () => this.systemConnection;
    const recordTypeCallback = (objectName: string, recordType: string) => this.getRecordTypeId(objectName, recordType);

    this.repositories = {
      accounts: new AccountsRepository(connectionCallback, this.logger),
      claims: new ClaimRepository(connectionCallback, this.logger),
      claimDetails: new ClaimDetailsRepository(recordTypeCallback, connectionCallback, this.logger),
      claimStatusChanges: new ClaimStatusChangeRepository(connectionCallback, this.logger),
      companies: new CompaniesHouse(),
      claimTotalCostCategory: new ClaimTotalCostCategoryRepository(connectionCallback, this.logger),
      claimLineItems: new ClaimLineItemRepository(recordTypeCallback, connectionCallback, this.logger),
      costCategories: new CostCategoryRepository(connectionCallback, this.logger),
      documents: new DocumentsRepository(connectionCallback, asSystemUserConnectionCallback, this.logger),
      financialVirements: new FinancialVirementRepository(recordTypeCallback, connectionCallback, this.logger),
      financialLoanVirements: new FinancialLoanVirementRepository(recordTypeCallback, connectionCallback, this.logger),
      pcrSpendProfile: new PcrSpendProfileRepository(recordTypeCallback, connectionCallback, this.logger),
      monitoringReportResponse: new MonitoringReportResponseRepository(
        recordTypeCallback,
        connectionCallback,
        this.logger,
      ),
      monitoringReportHeader: new MonitoringReportHeaderRepository(recordTypeCallback, connectionCallback, this.logger),
      monitoringReportQuestions: new MonitoringReportQuestionsRepository(connectionCallback, this.logger),
      loans: new LoanRepository(connectionCallback, this.logger),
      monitoringReportStatusChange: new MonitoringReportStatusChangeRepository(connectionCallback, this.logger),
      projectChangeRequests: new ProjectChangeRequestRepository(recordTypeCallback, connectionCallback, this.logger),
      profileDetails: new ProfileDetailsRepository(connectionCallback, this.logger),
      profileTotalPeriod: new ProfileTotalPeriodRepository(connectionCallback, this.logger),
      profileTotalCostCategory: new ProfileTotalCostCategoryRepository(connectionCallback, this.logger),
      projects: new ProjectRepository(connectionCallback, this.logger),
      partners: new PartnerRepository(connectionCallback, this.logger),
      projectChangeRequestStatusChange: new ProjectChangeRequestStatusChangeRepository(connectionCallback, this.logger),
      projectContacts: new ProjectContactsRepository(connectionCallback, this.logger),
      externalContacts: new ExternalContactsRepository(connectionCallback, this.logger),
      permissionGroups: new PermissionGroupRepository(connectionCallback, this.logger),
      recordTypes: new RecordTypeRepository(connectionCallback, this.logger),
    };

    this.resources = {
      bankCheckService: new BankCheckService(),
      customContent: new CustomContentStore(),
    };
  }

  public readonly repositories: IRepositories;
  public readonly logger: ILogger;
  public readonly config: IConfig;
  public readonly clock: IClock = new Clock();
  public readonly caches: ICaches;
  public readonly resources: IResources;

  public readonly internationalisation: IInternationalisation = {
    addResourceBundle: (content, namespace) => i18next.addResourceBundle("en-GB", namespace, content, true, true),
  };

  public startTimer(message: string) {
    return new Timer(this.logger, message);
  }

  private authorisation: Authorisation | null = null;

  private async getAuthorisation() {
    if (!this.authorisation) this.authorisation = await new GetAllProjectRolesForUser().execute(this);
    return this.authorisation;
  }

  private async runAsync<TResult>(
    runnable:
      | AuthorisedAsyncQueryBase<TResult>
      | AuthorisedAsyncCommandBase<TResult>
      | AsyncQueryBase<TResult>
      | AsyncCommandBase<TResult>,
  ): Promise<TResult> {
    const timer = this.startTimer(runnable.constructor.name);
    try {
      if (runnable instanceof AuthorisedAsyncQueryBase || runnable instanceof AuthorisedAsyncCommandBase) {
        const authorisation = await this.getAuthorisation();
        const accessible = await runnable.accessControl(authorisation, this);
        if (!accessible) throw new ForbiddenError();
      }

      // await the run because of the finally
      return await runnable.execute(this);
    } catch (e: unknown) {
      this.logger.warn(`Failed to run async ${runnable.runnableName}`, runnable.logMessage(), e);
      if (e instanceof ValidationError) {
        this.logger.debug("Validation Error", e.results && e.results.log());
      }
      if (runnable instanceof AuthorisedAsyncCommandBase) {
        const error = runnable.handleRepositoryError(this, e);
        if (error) return Promise.reject(error);
      }
      return Promise.reject(constructErrorResponse(e));
    } finally {
      timer.finish();
    }
  }

  private runSync<TResult>(runnable: SyncQueryBase<TResult> | SyncCommandBase<TResult>): TResult {
    const timer = this.startTimer(runnable.constructor.name);
    try {
      return runnable.execute(this);
    } catch (e: unknown) {
      this.logger.warn(`Failed to run sync ${runnable.runnableName}`, runnable.logMessage(), e);
      throw constructErrorResponse(e);
    } finally {
      timer.finish();
    }
  }

  public runQuery<TResult>(query: AsyncQueryBase<TResult> | AuthorisedAsyncQueryBase<TResult>): Promise<TResult> {
    this.logger.info(`Running async ${query.runnableName}`, query.logMessage());
    return this.runAsync(query);
  }

  public runSyncQuery<TResult>(query: SyncQueryBase<TResult>): TResult {
    this.logger.info(`Running sync ${query.runnableName}`, query.logMessage());
    return this.runSync(query);
  }

  public runCommand<TResult>(
    command: AuthorisedAsyncCommandBase<TResult> | AsyncCommandBase<TResult>,
  ): Promise<TResult> {
    this.logger.info(`Running async ${command.runnableName}`, command.logMessage());
    return this.runAsync(command);
  }

  public runSyncCommand<TResult>(command: SyncCommandBase<TResult>): TResult {
    this.logger.info("Running sync command", command.logMessage());
    return this.runSync(command);
  }

  /**
   * Elevate a user context to a different user context.
   *
   * @param connection The TsforceConnection for the user
   * @returns An elevated IContext as the passed in user
   */
  private elevateUserAs(connection: TsforceConnection): IContext {
    if (this.user.email !== connection.email) {
      return new Context({
        user: { email: connection.email },
        traceId: this.traceId,
        connection,
        systemConnection: this.systemConnection,
        bankConnection: this.bankConnection,
      });
    }
    return this;
  }

  /**
   * Elevate a user context to the system user context
   *
   * @returns An elevated IContext as the system user
   */
  public asSystemUser(): IContext {
    this.logger.info(`Escalating from ${this.connection.email} to system user ${this.systemConnection.email}`);
    return this.elevateUserAs(this.systemConnection);
  }

  /**
   * Elevate a user context to the bank details validation user context.
   *
   * @returns An elevated IContext as the bank details validation user
   */
  public asBankDetailsValidationUser(): IContext {
    this.logger.info(`Escalating from ${this.connection.email} to banking user ${this.bankConnection.email}`);
    return this.elevateUserAs(this.bankConnection);
  }

  // helper function for repositories that need record type ids
  private async getRecordTypeId(objectName: string, recordType: string): Promise<string> {
    const query = new GetRecordTypeQuery(objectName, recordType);
    return this.runQuery(query).then(x => x.id);
  }
}

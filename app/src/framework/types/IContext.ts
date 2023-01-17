import * as Repositories from "@server/repositories";
import { IRoleInfo } from "@server/features/projects/getAllProjectRolesForUser";
import { QueryBase, SyncQueryBase } from "@server/features/common/queryBase";
import { CommandBase, NonAuthorisedCommandBase, SyncCommandBase } from "@server/features/common/commandBase";
import { Cache, IClock, IConfig } from "@server/features/common";
import { PermissionGroup } from "@framework/entities/permissionGroup";
import { RecordType } from "@framework/entities/recordType";
import { Option } from "@framework/types";
import { ICustomContentStore } from "@server/resources/customContentStore";
import { ICompaniesHouseBase } from "@server/resources/companiesHouse";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { IBankCheckService } from "@server/resources/bankCheckService";
import { ISessionUser } from "./IUser";
import { Authorisation } from "./authorisation";
import { ILogger } from "@shared/developmentLogger";
import { Connection } from "jsforce";

export interface IRepositories {
  readonly accounts: Repositories.IAccountsRepository;
  readonly broadcast: Repositories.IBroadcastRepository;
  readonly claims: Repositories.IClaimRepository;
  readonly claimStatusChanges: Repositories.IClaimStatusChangeRepository;
  readonly claimDetails: Repositories.IClaimDetailsRepository;
  readonly companies: Repositories.ICompaniesHouse;
  readonly costCategories: Repositories.ICostCategoryRepository;
  readonly documents: Repositories.IDocumentsRepository;
  readonly financialVirements: Repositories.IFinancialVirementRepository;
  readonly financialLoanVirements: Repositories.IFinancialLoanVirementRepository;
  readonly monitoringReportResponse: Repositories.IMonitoringReportResponseRepository;
  readonly monitoringReportHeader: Repositories.IMonitoringReportHeaderRepository;
  readonly monitoringReportQuestions: Repositories.IMonitoringReportQuestionsRepository;
  readonly loans: Repositories.ILoanRepository;
  readonly monitoringReportStatusChange: Repositories.IMonitoringReportStatusChangeRepository;
  readonly pcrSpendProfile: Repositories.IPcrSpendProfileRepository;
  readonly projectChangeRequests: Repositories.IProjectChangeRequestRepository;
  readonly projectChangeRequestStatusChange: Repositories.IProjectChangeRequestStatusChangeRepository;
  readonly profileDetails: Repositories.IProfileDetailsRepository;
  readonly profileTotalPeriod: Repositories.IProfileTotalPeriodRepository;
  readonly profileTotalCostCategory: Repositories.IProfileTotalCostCategoryRepository;
  readonly projects: Repositories.IProjectRepository;
  readonly partners: Repositories.IPartnerRepository;
  readonly projectContacts: Repositories.IProjectContactsRepository;
  readonly claimLineItems: Repositories.IClaimLineItemRepository;
  readonly claimTotalCostCategory: Repositories.IClaimTotalCostCategoryRepository;
  readonly permissionGroups: Repositories.IPermissionGroupRepository;
  readonly recordTypes: Repositories.IRecordTypeRepository;
}

export interface IResources {
  readonly customContent: ICustomContentStore;
  readonly companiesHouse: ICompaniesHouseBase;
  readonly bankCheckService: IBankCheckService;
}

export interface IInternationalisation {
  addResourceBundle(content: ContentJson, namespace: string): void;
}

export interface IContext {
  repositories: IRepositories;
  resources: IResources;
  caches: ICaches;
  config: IConfig;
  runQuery<TResult>(cmd: QueryBase<TResult>): Promise<TResult>;
  runSyncQuery<TResult>(cmd: SyncQueryBase<TResult>): TResult;
  runCommand<TResult>(cmd: CommandBase<TResult> | NonAuthorisedCommandBase<TResult>): Promise<TResult>;
  runSyncCommand<TResult>(cmd: SyncCommandBase<TResult>): TResult;
  clock: IClock;
  logger: ILogger;
  user: ISessionUser;
  startTimer: (message: string) => ITimer;
  asSystemUser: () => IContext;
  asBankDetailsValidationUser: () => IContext;
  getSalesforceConnection: () => Promise<Connection>;
  internationalisation: IInternationalisation;
}

export interface ITimer {
  finish(): void;
}

export interface ICaches {
  readonly costCategories: Cache<CostCategoryDto[]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly optionsLookup: Cache<Option<any>[]>;
  readonly permissionGroups: Cache<PermissionGroup[]>;
  readonly projectRoles: Cache<{ [key: string]: IRoleInfo }>;
  readonly recordTypes: Cache<RecordType[]>;
  contentStoreLastUpdated: Date | null;
}

export interface IAsyncRunnable<T> {
  run: (context: IContext) => Promise<T>;
  logMessage: () => unknown[];
  handleRepositoryError?: (context: IContext, error: unknown) => void;
  accessControl?: (auth: Authorisation, context: IContext) => Promise<boolean>;
}

export interface ISyncRunnable<T> {
  run: (context: IContext) => T;
  logMessage: () => unknown[];
}

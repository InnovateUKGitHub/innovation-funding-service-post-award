import * as Repositories from "@server/repositories";
import { Cache, IClock, IConfig, ILogger } from "@server/features/common";
import { IRoleInfo } from "@server/features/projects/getAllProjectRolesForUser";
import { QueryBase, SyncQueryBase } from "@server/features/common/queryBase";
import { CommandBase, SyncCommandBase } from "@server/features/common/commandBase";
import { ISessionUser } from "./IUser";
import { Authorisation } from "./authorisation";
import { PermissionGroup } from "@framework/entities/permissionGroup";
import { RecordType } from "@framework/entities/recordType";

export interface IRepositories {
  readonly claims: Repositories.IClaimRepository;
  readonly claimStatusChanges: Repositories.IClaimStatusChangeRepository;
  readonly claimDetails: Repositories.IClaimDetailsRepository;
  readonly costCategories: Repositories.ICostCategoryRepository;
  readonly documents: Repositories.IDocumentsRepository;
  readonly financialVirements: Repositories.IFinancialVirementRepository;
  readonly monitoringReportResponse: Repositories.IMonitoringReportResponseRepository;
  readonly monitoringReportHeader: Repositories.IMonitoringReportHeaderRepository;
  readonly monitoringReportQuestions: Repositories.IMonitoringReportQuestionsRepository;
  readonly monitoringReportStatusChange: Repositories.IMonitoringReportStatusChangeRepository;
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
  user: ISessionUser;
  startTimer: (message: string) => ITimer;
  asSystemUser: () => IContext;
}

export interface ITimer {
  finish(): void;
}

export interface ICaches {
  readonly costCategories: Cache<CostCategoryDto[]>;
  readonly permissionGroups: Cache<PermissionGroup[]>;
  readonly projectRoles: Cache<{ [key: string]: IRoleInfo }>;
  readonly recordTypes: Cache<RecordType[]>;
}

export interface IAsyncRunnable<T> {
  Run: (context: IContext) => Promise<T>;
  LogMessage: () => any[];
  accessControl: (auth: Authorisation, context: IContext) => Promise<boolean>;
}

export interface ISyncRunnable<T> {
  Run: (context: IContext) => T;
  LogMessage: () => any[];
}

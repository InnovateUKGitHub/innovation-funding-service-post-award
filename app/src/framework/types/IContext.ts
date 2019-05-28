import * as Repositories from "@server/repositories";
import { Cache, IClock, IConfig, ILogger } from "@server/features/common";
import { IRoleInfo } from "@server/features/projects/getAllProjectRolesForUser";
import { QueryBase, SyncQueryBase } from "@server/features/common/queryBase";
import { CommandBase, SyncCommandBase } from "@server/features/common/commandBase";
import { ISalesforceRecordType } from "@server/repositories";
import { ISessionUser } from "./IUser";
import { Authorisation } from "./authorisation";

export interface IRepositories {
  claims: Readonly<Repositories.IClaimRepository>;
  claimStatusChanges: Readonly<Repositories.IClaimStatusChangeRepository>;
  claimDetails: Readonly<Repositories.IClaimDetailsRepository>;
  costCategories: Readonly<Repositories.ICostCategoryRepository>;
  documents: Readonly<Repositories.IDocumentsRepository>;
  monitoringReportResponse: Readonly<Repositories.IMonitoringReportResponseRepository>;
  monitoringReportHeader: Readonly<Repositories.IMonitoringReportHeaderRepository>;
  monitoringReportQuestions: Readonly<Repositories.IMonitoringReportQuestionsRepository>;
  monitoringReportStatusChange: Readonly<Repositories.IMonitoringReportStatusChangeRepository>;
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
}

export interface ITimer {
  finish(): void;
}

export interface ICaches {
  readonly costCategories: Cache<CostCategoryDto[]>;
  readonly projectRoles: Cache<{ [key: string]: IRoleInfo }>;
  readonly recordTypes: Cache<ISalesforceRecordType[]>;
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

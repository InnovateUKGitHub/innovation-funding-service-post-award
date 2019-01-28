import { IConfig } from "../server/features/common/config";
import { IClock } from "../server/features/common/clock";
import { ILogger } from "../server/features/common/logger";
import { IUser } from "./IUser";
import { QueryBase } from "../server/features/common/queryBase";
import { Cache } from "../server/features/common/cache";
import { IRoleInfo } from "../server/features/projects/getAllProjectRolesForUser";
import { Authorisation } from "./authorisation";
import * as Repositories from "../server/repositories";
import { SyncQueryBase } from "../server/features/common/queryBase";
import { CommandBase, SyncCommandBase } from "../server/features/common/commandBase";

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
  user: IUser;
}

export interface ICaches {
  costCategories: Readonly<Cache<CostCategoryDto[]>>;
  projectRoles: Readonly<Cache<{ [key: string]: IRoleInfo }>>;
}

export interface IRunnable<T> {
  Run: (context: IContext) => Promise<T>;
  LogMessage: () => any[];
  accessControl: (auth: Authorisation, context: IContext) => Promise<boolean>;
}

export interface ISyncRunnable<T> {
  Run: (context: IContext) => T;
  LogMessage: () => any[];
}

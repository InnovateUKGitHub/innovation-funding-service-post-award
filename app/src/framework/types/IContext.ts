import { IRoleInfo } from "@server/features/projects/getAllProjectRolesForUser";
import { AuthorisedAsyncQueryBase, SyncQueryBase } from "@server/features/common/queryBase";
import { AuthorisedAsyncCommandBase, AsyncCommandBase, SyncCommandBase } from "@server/features/common/commandBase";
import { IClock } from "@framework/util/clock";
import { PermissionGroup } from "@framework/entities/permissionGroup";
import { RecordType } from "@framework/entities/recordType";
import { ICustomContentStore } from "@server/resources/customContentStore";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { IBankCheckService } from "@server/resources/bankCheckService";
import { ISessionUser } from "./IUser";
import { Authorisation } from "./authorisation";
import { ILogger } from "@shared/logger";
import { IConfig } from "@framework/types/IConfig";
import { IAccountsRepository } from "@server/repositories/accountsRepository";
import { IClaimDetailsRepository } from "@server/repositories/claimDetailsRepository";
import { IClaimLineItemRepository } from "@server/repositories/claimLineItemRepository";
import { IClaimRepository } from "@server/repositories/claimsRepository";
import { IClaimStatusChangeRepository } from "@server/repositories/claimStatusChangeRepository";
import { IClaimTotalCostCategoryRepository } from "@server/repositories/claimTotalCostCategoryRepository";
import { ICompaniesHouse } from "@server/repositories/companiesRepository";
import { ICostCategoryRepository } from "@server/repositories/costCategoriesRepository";
import { IDocumentsRepository } from "@server/repositories/documentsRepository";
import { IFinancialLoanVirementRepository } from "@server/repositories/financialLoanVirementRepository";
import { IFinancialVirementRepository } from "@server/repositories/financialVirementRepository";
import { ILoanRepository } from "@server/repositories/loanRepository";
import { IMonitoringReportHeaderRepository } from "@server/repositories/monitoringReportHeaderRepository";
import { IMonitoringReportQuestionsRepository } from "@server/repositories/monitoringReportQuestionsRepository";
import { IMonitoringReportResponseRepository } from "@server/repositories/monitoringReportResponseRepository";
import { IMonitoringReportStatusChangeRepository } from "@server/repositories/monitoringReportStatusChangeRepository";
import { IPartnerRepository } from "@server/repositories/partnersRepository";
import { IPcrSpendProfileRepository } from "@server/repositories/pcrSpendProfileRepository";
import { IPermissionGroupRepository } from "@server/repositories/permissionGroupsRepository";
import { IProfileDetailsRepository } from "@server/repositories/profileDetailsRepository";
import { IProfileTotalPeriodRepository } from "@server/repositories/profilePeriodTotalRepository";
import { IProfileTotalCostCategoryRepository } from "@server/repositories/profileTotalCostCategoryRepository";
import { IProjectChangeRequestRepository } from "@server/repositories/projectChangeRequestRepository";
import { IProjectChangeRequestStatusChangeRepository } from "@server/repositories/projectChangeRequestStatusChangeRepository";
import { IProjectContactsRepository } from "@server/repositories/projectContactsRepository";
import { IProjectRepository } from "@server/repositories/projectsRepository";
import { IRecordTypeRepository } from "@server/repositories/recordTypeRepository";
import { Cache } from "@server/features/common/cache";
import { Option } from "@framework/dtos/option";
import { TsforceConnection } from "@server/tsforce/TsforceConnection";

export interface IRepositories {
  readonly accounts: IAccountsRepository;
  readonly claims: IClaimRepository;
  readonly claimStatusChanges: IClaimStatusChangeRepository;
  readonly claimDetails: IClaimDetailsRepository;
  readonly companies: ICompaniesHouse;
  readonly costCategories: ICostCategoryRepository;
  readonly documents: IDocumentsRepository;
  readonly financialVirements: IFinancialVirementRepository;
  readonly financialLoanVirements: IFinancialLoanVirementRepository;
  readonly monitoringReportResponse: IMonitoringReportResponseRepository;
  readonly monitoringReportHeader: IMonitoringReportHeaderRepository;
  readonly monitoringReportQuestions: IMonitoringReportQuestionsRepository;
  readonly loans: ILoanRepository;
  readonly monitoringReportStatusChange: IMonitoringReportStatusChangeRepository;
  readonly pcrSpendProfile: IPcrSpendProfileRepository;
  readonly projectChangeRequests: IProjectChangeRequestRepository;
  readonly projectChangeRequestStatusChange: IProjectChangeRequestStatusChangeRepository;
  readonly profileDetails: IProfileDetailsRepository;
  readonly profileTotalPeriod: IProfileTotalPeriodRepository;
  readonly profileTotalCostCategory: IProfileTotalCostCategoryRepository;
  readonly projects: IProjectRepository;
  readonly partners: IPartnerRepository;
  readonly projectContacts: IProjectContactsRepository;
  readonly claimLineItems: IClaimLineItemRepository;
  readonly claimTotalCostCategory: IClaimTotalCostCategoryRepository;
  readonly permissionGroups: IPermissionGroupRepository;
  readonly recordTypes: IRecordTypeRepository;
}

export interface IResources {
  readonly customContent: ICustomContentStore;
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
  runQuery<TResult>(cmd: AuthorisedAsyncQueryBase<TResult>): Promise<TResult>;
  runSyncQuery<TResult>(cmd: SyncQueryBase<TResult>): TResult;
  runCommand<TResult>(cmd: AuthorisedAsyncCommandBase<TResult> | AsyncCommandBase<TResult>): Promise<TResult>;
  runSyncCommand<TResult>(cmd: SyncCommandBase<TResult>): TResult;
  clock: IClock;
  logger: ILogger;
  user: ISessionUser;
  startTimer: (message: string) => ITimer;
  asSystemUser: () => IContext;
  asBankDetailsValidationUser: () => IContext;
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

export interface ISyncRunnable<T> {
  runnableName: string;
  execute: (context: IContext) => T;
  logMessage: () => unknown;
}

export interface IAsyncRunnable<T> extends ISyncRunnable<Promise<T>> {
  handleRepositoryError?: (context: IContext, error: unknown) => void;
  accessControl?: (auth: Authorisation, context: IContext) => Promise<boolean>;
}

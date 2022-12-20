import { Authorisation, IAsyncRunnable, IContext, ISyncRunnable } from "@framework/types";
import { ValidationError } from "@server/features/common";
import { CommandBase, NonAuthorisedCommandBase, SyncCommandBase } from "@server/features/common/commandBase";
import { QueryBase, SyncQueryBase } from "@server/features/common/queryBase";
import { Logger } from "@shared/developmentLogger";
import { Connection } from "jsforce";
import { TestCaches } from "./testCaches";
import { TestClock } from "./testClock";
import { TestConfig } from "./testConfig";
import { TestData } from "./testData";
import { TestInternationalisation } from "./testInternationalisation";
import { createTestRepositories, ITestRepositories } from "./testRepositories";
import { TestResources } from "./testResources";
import { TestStore } from "./testStore";
import { TestUser } from "./testUser";

export class TestContext implements IContext {
  constructor() {
    this.repositories = createTestRepositories();
    this.testData = new TestData(this.repositories, () => this.user);
    this.testStore = new TestStore(this);
  }

  public clock = new TestClock();
  public logger = new Logger("Test Logger");
  public repositories: ITestRepositories;
  public user = new TestUser();
  public testData: TestData;
  public testStore: TestStore;

  public internationalisation = new TestInternationalisation();

  public resources = new TestResources();

  public startTimer = () => {
    return {
      finish: () => {
        return;
      },
    };
  };

  public config = new TestConfig();

  public caches = new TestCaches();

  public runQuery<TResult>(query: QueryBase<TResult>): Promise<TResult> {
    return (query as unknown as IAsyncRunnable<TResult>).run(this);
  }

  public runCommand<TResult>(command: CommandBase<TResult> | NonAuthorisedCommandBase<TResult>): Promise<TResult> {
    const runnable = command as unknown as IAsyncRunnable<TResult>;
    return runnable.run(this).catch(e => {
      if (e instanceof ValidationError) {
        this.logger.debug("Validation ERROR", [e.results]);
      }
      if (runnable.handleRepositoryError) runnable.handleRepositoryError(this, e);
      throw e;
    });
  }

  public runSyncQuery<TResult>(query: SyncQueryBase<TResult>): TResult {
    return (query as unknown as ISyncRunnable<TResult>).run(this);
  }

  public runSyncCommand<TResult>(command: SyncCommandBase<TResult>): TResult {
    return (command as unknown as ISyncRunnable<TResult>).run(this);
  }

  // handle access control separate to running the commands to keep tests focused on single areas
  public runAccessControl(auth: Authorisation, runnable: QueryBase<unknown> | CommandBase<unknown>): Promise<boolean> {
    const runnableQuery = runnable as unknown as IAsyncRunnable<unknown>;
    if (typeof runnableQuery?.accessControl === "function") {
      return runnableQuery.accessControl(auth, this);
    }
    return Promise.reject();
  }

  public asSystemUser() {
    return this;
  }

  public asBankDetailsValidationUser() {
    return this;
  }

  public getSalesforceConnection(): Promise<Connection> {
    throw new Error("noop");
  }
}

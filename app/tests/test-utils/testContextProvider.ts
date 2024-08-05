import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { AuthorisedAsyncCommandBase, AsyncCommandBase, SyncCommandBase } from "@server/features/common/commandBase";
import { AuthorisedAsyncQueryBase, SyncQueryBase } from "@server/features/common/queryBase";
import { ValidationError } from "@shared/appError";
import { Logger } from "@shared/developmentLogger";
import { Connection } from "jsforce";
import { TestCaches } from "./testCaches";
import { TestClock } from "./testClock";
import { TestConfig } from "./testConfig";
import { TestData } from "./testData";
import { TestInternationalisation } from "./testInternationalisation";
import { createTestRepositories, ITestRepositories } from "./testRepositories";
import { TestResources } from "./testResources";
import { TestUser } from "./testUser";

export class TestContext implements IContext {
  constructor() {
    this.repositories = createTestRepositories();
    this.testData = new TestData(this.repositories, () => this.user);
  }

  public clock = new TestClock();
  public logger = new Logger("Test Logger");
  public repositories: ITestRepositories;
  public user = new TestUser();
  public testData: TestData;

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

  public runQuery<TResult>(query: AuthorisedAsyncQueryBase<TResult>): Promise<TResult> {
    return query.execute(this);
  }

  public runCommand<TResult>(
    command: AuthorisedAsyncCommandBase<TResult> | AsyncCommandBase<TResult>,
  ): Promise<TResult> {
    return command.execute(this).catch(e => {
      if (e instanceof ValidationError) {
        this.logger.debug("Validation ERROR", [e.results]);
      }
      if ("handleRepositoryError" in command) command.handleRepositoryError(this, e);
      throw e;
    });
  }

  public runSyncQuery<TResult>(query: SyncQueryBase<TResult>): TResult {
    return query.execute(this);
  }

  public runSyncCommand<TResult>(command: SyncCommandBase<TResult>): TResult {
    return command.execute(this);
  }

  // handle access control separate to running the commands to keep tests focused on single areas
  public runAccessControl(
    auth: Authorisation,
    runnable: AuthorisedAsyncQueryBase<unknown> | AuthorisedAsyncCommandBase<unknown>,
  ): Promise<boolean> {
    if ("accessControl" in runnable) {
      return runnable.accessControl(auth, this);
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

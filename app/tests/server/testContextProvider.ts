import { createTestRepositories, ITestRepositories } from "./testRepositories";
import { QueryBase } from "@server/features/common/queryBase";
import { SyncQueryBase } from "@server/features/common/queryBase";
import { CommandBase, SyncCommandBase } from "@server/features/common/commandBase";
import { Authorisation, IAsyncRunnable, IContext, ISyncRunnable } from "@framework/types";
import { TestData } from "./testData";
import { TestClock } from "./testClock";
import { TestLogger } from "./testLogger";
import { TestUser } from "./testUser";
import { TestConfig } from "./testConfig";
import { ValidationError } from "@server/features/common";
import { TestStore } from "./testStore";
import { TestCaches } from "./testCaches";

export class TestContext implements IContext {
    constructor() {
        this.repositories = createTestRepositories();
        this.testData = new TestData(this.repositories, () => this.user);
        this.testStore = new TestStore(this);
    }

    public clock = new TestClock();
    public logger = new TestLogger();
    public repositories: ITestRepositories;
    public user = new TestUser();
    public testData: TestData;
    public testStore: TestStore;

    public startTimer = (message: string) => {
        return {
            finish: () => { return; }
        };
    }

    public config = new TestConfig();

    public caches = new TestCaches();

    public runQuery<TResult>(query: QueryBase<TResult>): Promise<TResult> {
        return ((query as any) as IAsyncRunnable<TResult>)
            .Run(this)
            ;
    }

    public runCommand<TResult>(command: CommandBase<TResult>): Promise<TResult> {
        return ((command as any) as IAsyncRunnable<TResult>)
            .Run(this)
            .catch(e => {
                if (e instanceof ValidationError) {
                    this.logger.debug("Validation ERROR", [e.results]);
                }
                throw e;
            });
    }

    public runSyncQuery<TResult>(query: SyncQueryBase<TResult>): TResult {
        return ((query as any) as ISyncRunnable<TResult>).Run(this);
    }

    public runSyncCommand<TResult>(command: SyncCommandBase<TResult>): TResult {
        return ((command as any) as ISyncRunnable<TResult>).Run(this);
    }

    // handle access control separate to running the commands to keep tests focused on single areas
    public runAccessControl(auth: Authorisation, runnable: QueryBase<any> | CommandBase<any>): Promise<boolean> {
        return (runnable as any as IAsyncRunnable<any>).accessControl(auth, this);
    }

    public asSystemUser() {
        return this;
    }
}

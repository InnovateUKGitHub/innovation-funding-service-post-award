import { QueryBase } from "@server/features/common/queryBase";
import { IRoleInfo } from "@server/features/projects/getAllProjectRolesForUser";
import { SyncQueryBase } from "@server/features/common/queryBase";
import { CommandBase, SyncCommandBase } from "@server/features/common/commandBase";
import { Cache } from "@server/features/common/cache";
import { Authorisation, ICaches, IContext, IRunnable, ISyncRunnable } from "@framework/types";
import { createTestRepositories, ITestRepositories } from "./testRepositories";
import { TestData } from "./testData";
import { TestClock } from "./testClock";
import { TestLogger } from "./testLogger";
import { TestUser } from "./testUser";
import { ISalesforceRecordType } from "@server/repositories";
import { TestConfig } from "./testConfig";

export class TestContext implements IContext {
    constructor() {
        this.repositories = createTestRepositories();
        this.testData = new TestData(this.repositories, () => this.user);
    }

    public clock = new TestClock();
    public logger = new TestLogger();
    public repositories: ITestRepositories;
    public user = new TestUser();
    public testData: TestData;

    public startTimer = (message: string) => {
        return {
            finish: () => { return; }
        };
    }

    public config = new TestConfig();

    public caches: ICaches = {
        costCategories: new Cache<CostCategoryDto[]>(1),
        projectRoles: new Cache<{ [key: string]: IRoleInfo }>(1),
        recordTypes: new Cache<ISalesforceRecordType[]>(1),
    };

    public runQuery<TResult>(query: QueryBase<TResult>): Promise<TResult> {
        return ((query as any) as IRunnable<TResult>).Run(this);
    }

    public runCommand<TResult>(command: CommandBase<TResult>): Promise<TResult> {
        return ((command as any) as IRunnable<TResult>).Run(this);
    }

    public runSyncQuery<TResult>(query: SyncQueryBase<TResult>): TResult {
        return ((query as any) as ISyncRunnable<TResult>).Run(this);
    }

    public runSyncCommand<TResult>(command: SyncCommandBase<TResult>): TResult {
        return ((command as any) as ISyncRunnable<TResult>).Run(this);
    }

    // handle access control seperate to running the commands to keep tests focused on single areas
    public runAccessControl(auth: Authorisation, runnable: QueryBase<any> | CommandBase<any>): Promise<boolean> {
      return (runnable as any as IRunnable<any>).accessControl(auth, this);
    }
}

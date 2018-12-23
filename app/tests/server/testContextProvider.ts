import { CommandBase, ICaches, IContext, IRunnable, ISyncRunnable, QueryBase, SyncCommandBase, SyncQueryBase } from "../../src/server/features/common/context";
import { createTestRepositories, ITestRepositories } from "./testRepositories";
import { TestData } from "./testData";
import { TestClock } from "./testClock";
import { TestLogger } from "./testLogger";
import { IConfig } from "../../src/server/features/common/config";
import { Cache } from "../../src/server/features/common/cache";
import { TestUser } from "./testUser";
import { ProjectRole } from "../../src/types";

export class TestContext implements IContext {
    constructor() {
        this.repositories = createTestRepositories();
        this.testData = new TestData(this.repositories);
    }

    public clock = new TestClock();
    public logger = new TestLogger();
    public repositories: ITestRepositories;
    public user = new TestUser();
    public testData: TestData;

    public config: IConfig = {
        ifsApplicationUrl: "",
        ifsGrantLetterUrl: "",
        salesforcePassword: "",
        salesforceToken: "",
        salesforceClientId: "",
        salesforceConnectionUrl: "",
        salesforceUsername: "",
        useSSO: false,
        serverUrl: "http://localhost:8080",
        ssoProviderUrl: "https://shibboleth.com"
    };

    public caches: ICaches = {
        costCategories: new Cache<CostCategoryDto[]>(1),
        projectRoles: new Cache<{ [key: string]: ProjectRole }>(1),
    }

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
}

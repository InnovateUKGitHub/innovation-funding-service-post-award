import { QueryBase } from "../../src/server/features/common/queryBase";
import { createTestRepositories, ITestRepositories } from "./testRepositories";
import { TestData } from "./testData";
import { TestClock } from "./testClock";
import { TestLogger } from "./testLogger";
import { IConfig } from "../../src/server/features/common/config";
import { Cache } from "../../src/server/features/common/cache";
import { TestUser } from "./testUser";
import { IRoleInfo } from "../../src/server/features/projects/getAllProjectRolesForUser";
import { ICaches, IContext, IRunnable, ISyncRunnable } from "../../src/types/IContext";
import { SyncQueryBase } from "../../src/server/features/common/queryBase";
import { CommandBase, SyncCommandBase } from "../../src/server/features/common/commandBase";
import { LogLevel } from "../../src/types/logLevel";

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
        build: `test${Date.now()}`,
        timeouts: {
            costCategories: 720,
            projectRoles: 720,
            cookie: 1,
            token: 1
        },
        certificates: {
            salesforce: "./salesforce.cert",
            shibboleth: "./shibboleth.cert",
        },
        logLevel: LogLevel.DEBUG,
        salesforce: {
            serivcePassword: "",
            serivceToken: "",
            clientId: "",
            connectionUrl: "",
            serivceUsername: "",
        },
        serverUrl: "http://localhost:8080",
        sso: {
            enabled: false,
            providerUrl: "https://shibboleth.com",
            signoutUrl: "https://shibboleth.com/Logout",
        },
        urls: {
            ifsRoot: "",
            ifsApplicationUrl: "",
            ifsGrantLetterUrl: "",
        }
    };

    public caches: ICaches = {
        costCategories: new Cache<CostCategoryDto[]>(1),
        projectRoles: new Cache<{ [key: string]: IRoleInfo }>(1),
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
}

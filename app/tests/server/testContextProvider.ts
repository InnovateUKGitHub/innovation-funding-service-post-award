import { QueryBase } from "@server/features/common/queryBase";
import { IRoleInfo } from "@server/features/projects/getAllProjectRolesForUser";
import { SyncQueryBase } from "@server/features/common/queryBase";
import { CommandBase, SyncCommandBase } from "@server/features/common/commandBase";
import { IConfig } from "@server/features/common/config";
import { Cache } from "@server/features/common/cache";
import { LogLevel } from "@framework/types/logLevel";
import { Authorisation,ICaches, IContext, IRunnable, ISyncRunnable } from "@framework/types";
import { createTestRepositories, ITestRepositories } from "./testRepositories";
import { TestData } from "./testData";
import { TestClock } from "./testClock";
import { TestLogger } from "./testLogger";
import { TestUser } from "./testUser";

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

    public startTimer = (message: string) => {
        return {
            finish: () => { return; }
        };
    }

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
        features: {
            monitoringReports: true,
            projectDocuments: true,
        },
        logLevel: LogLevel.DEBUG,
        prettyLogs: false,
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
        },
        cookieKey: "thekey",
        standardOverheadRate: 20,
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

    // handle access control seperate to running the commands to keep tests focused on single areas
    public runAccessControl(auth: Authorisation, runnable: QueryBase<any> | CommandBase<any>): Promise<boolean> {
      return (runnable as any as IRunnable<any>).accessControl(auth, this);
    }
}

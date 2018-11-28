import { IContext, ICaches, IRunnable, QueryBase, CommandBase } from "../../src/server/features/common/context";
import { createTestRepositories, ITestRepositories } from "./testRepositories";
import { TestData } from "./testData";
import { TestClock } from "./testClock";
import { TestLogger } from "./testLogger";
import { IConfig } from "../../src/server/features/common/config";
import { Cache } from "../../src/server/features/common/cache";

export class TestContext implements IContext {
    constructor() {
        this.repositories = createTestRepositories();
        this.testData = new TestData(this.repositories);
    }

    public clock = new TestClock();
    public logger = new TestLogger();
    public repositories: ITestRepositories;

    public testData: TestData;

    public config: IConfig = {
        ifsApplicationUrl: "",
        ifsGrantLetterUrl: "",
        salesforcePassword: "",
        salesforceToken: "",
        salesforceClientId: "",
        salesforceUseJwtToken: false,
        salesforceConnectionUrl: "",
        salesforceUsername: "",
        useSSO: false,
        serverUrl: "http://localhost:8080",
        ssoProviderUrl: "https://shibboleth.com"
    };

    public caches: ICaches = {
        costCategories: new Cache<CostCategoryDto[]>(1)
    }

    public runQuery<TResult>(query: QueryBase<TResult>): Promise<TResult> {
        return ((query as any) as IRunnable<TResult>).Run(this);
    }

    public runCommand<TResult>(command: CommandBase<TResult>): Promise<TResult> {
        return ((command as any) as IRunnable<TResult>).Run(this);
    }
}

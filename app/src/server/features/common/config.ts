const defaultCacheTimeout: number = 720;

export interface IConfig {
    ifsApplicationUrl: Readonly<string>;
    ifsGrantLetterUrl: Readonly<string>;

    serverUrl: string;
    ssoProviderUrl: string;
    ssoSignoutUrl: string;

    salesforceClientId: Readonly<string>;
    salesforceConnectionUrl: Readonly<string>;
    // ToDo: Remove
    salesforcePassword: Readonly<string>;
    // ToDo: Remove
    salesforceToken: Readonly<string>;
    // ToDo: Remove
    salesforceUsername: string;
    // ToDo: Remove
    useSSO: boolean;

    build: string;
    logLevel: "VERBOSE" | "DEBUG" | "INFO" | "WARN" | "ERROR";
    cacheTimeouts: {
      costCategories: number;
      projectRoles: number;
    };
}

const cacheTimeouts = {
    costCategories: parseInt(process.env.COST_CAT_TIMEOUT_MINUTES!, 10) || defaultCacheTimeout,
    projectRoles: parseInt(process.env.PROJ_ROLES_TIMEOUT_MINUTES!, 10) || defaultCacheTimeout
};

const secrets = {
    serverUrl: process.env.SERVER_URL!,
    ssoProviderUrl: process.env.SSO_PROVIDER_URL!,
    ssoSignoutUrl: process.env.SSO_SIGNOUT_URL!,
    salesforceClientId: process.env.SALESFORCE_CLIENT_ID!,
    salesforceConnectionUrl: process.env.SALESFORCE_CONNECTION_URL!,
    salesforcePassword: process.env.SALESFORCEPASSWORD!,
    salesforceToken: process.env.SALESFORCETOKEN!,
    salesforceUsername: process.env.SALESFORCEUSERNAME!,
    build: process.env.BUILD || `${Date.now()}`,
    logLevel: process.env.LOGLEVEL || "ERROR" as any,
    useSSO: process.env.USE_SSO === "true",
    cacheTimeouts
};

export const Configuration: IConfig = {
    ifsApplicationUrl: "https://application-for-innovation-funding.service.gov.uk/management/competition/<<Acc_CompetitionId__c>>/application/<<Acc_IFSApplicationId__c>>",
    ifsGrantLetterUrl: "https://application-for-innovation-funding.service.gov.uk/management/competition/<<Acc_CompetitionId__c>>/project/<<Acc_IFSApplicationId__c>>",
    ...secrets
};

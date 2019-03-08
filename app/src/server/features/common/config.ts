import { LogLevel, parseLogLevel } from "../../../types/logLevel";

const defaultCacheTimeout: number = 720;

export interface IConfig {

    build: Readonly<string>;

    cacheTimeouts: {
        costCategories: Readonly<number>;
        projectRoles: Readonly<number>;
    };

    certificates: {
        salesforce: Readonly<string>;
        shibboleth: Readonly<string>;
    };

    logLevel: Readonly<LogLevel>;

    salesforce: {
        clientId: Readonly<string>;
        connectionUrl: Readonly<string>;
        // ToDo: Remove
        serivcePassword: Readonly<string>;
        // ToDo: Remove
        serivceToken: Readonly<string>;
        // ToDo: Remove
        serivceUsername: Readonly<string>;
    };

    serverUrl: Readonly<string>;

    sso: {
        enabled: Readonly<boolean>;
        providerUrl: Readonly<string>;
        signoutUrl: Readonly<string>;
    };

    urls: {
        ifsRoot: Readonly<string>;
        ifsApplicationUrl: Readonly<string>;
        ifsGrantLetterUrl: Readonly<string>;
    };
}

const build = process.env.BUILD || `${Date.now()}`;

const cacheTimeouts = {
    costCategories: parseInt(process.env.COST_CAT_TIMEOUT_MINUTES!, 10) || defaultCacheTimeout,
    projectRoles: parseInt(process.env.PROJ_ROLES_TIMEOUT_MINUTES!, 10) || defaultCacheTimeout
};

const certificates = {
    salesforce: process.env.SALESFORCE_CERTIFICATE || "./security/AccPrivateKey.key",
    shibboleth: process.env.SHIBBOLETH_CERTIFICATE || "./security/AccPrivateKey.key",
};

const logLevel = parseLogLevel(process.env.LOG_LEVEL! || process.env.LOGLEVEL!);

const salesforce = {
    clientId: process.env.SALESFORCE_CLIENT_ID!,
    connectionUrl: process.env.SALESFORCE_CONNECTION_URL!,
    serivcePassword: process.env.SALESFORCE_PASSWORD! || process.env.SALESFORCEPASSWORD!,
    serivceToken: process.env.SALESFORCE_TOKEN! || process.env.SALESFORCETOKEN!,
    serivceUsername: process.env.SALESFORCE_USERNAME! || process.env.SALESFORCEUSERNAME!,
};

const serverUrl = process.env.SERVER_URL!;

const sso = {
    enabled: process.env.USE_SSO === "true",
    providerUrl: process.env.SSO_PROVIDER_URL!,
    signoutUrl: process.env.SSO_SIGNOUT_URL!,
};

const urls = {
    ifsRoot: process.env.IFS_ROOT || "https://apply-for-innovation-funding.service.gov.uk",
    ifsApplicationUrl: "https://application-for-innovation-funding.service.gov.uk/management/competition/<<Acc_CompetitionId__c>>/application/<<Acc_IFSApplicationId__c>>",
    ifsGrantLetterUrl: "https://application-for-innovation-funding.service.gov.uk/management/competition/<<Acc_CompetitionId__c>>/project/<<Acc_IFSApplicationId__c>>",
};

export const Configuration: IConfig = {
    build,
    cacheTimeouts,
    certificates,
    logLevel,
    salesforce,
    serverUrl,
    sso,
    urls,
};

import { LogLevel, parseLogLevel } from "@framework/types/logLevel";

const defaultCacheTimeout: number = 720;

export interface IConfig {

    readonly build: string;

    readonly timeouts: {
        readonly costCategories: number;
        readonly projectRoles: number;
        readonly recordTypes: number;
        readonly token: number;
        readonly cookie: number;
    };

    readonly certificates: {
        salesforce: string;
        shibboleth: string;
    };

    readonly features: IFeatureFlags;

    readonly logLevel: LogLevel;
    readonly prettyLogs: boolean;

    readonly salesforce: {
        readonly clientId: string;
        readonly connectionUrl: string;
        // ToDo: Remove
        readonly serivcePassword: string;
        // ToDo: Remove
        readonly serivceToken: string;
        // ToDo: Remove
        readonly serivceUsername: string;
    };

    readonly serverUrl: string;

    readonly sso: {
        readonly enabled: boolean;
        readonly providerUrl: string;
        readonly signoutUrl: string;
    };

    readonly urls: {
        readonly ifsRoot: string;
        readonly ifsApplicationUrl: string;
        readonly ifsGrantLetterUrl: string;
    };

    readonly cookieKey: string;

    readonly standardOverheadRate: number;
}

const build = process.env.BUILD || `${Date.now()}`;

const timeouts = {
    costCategories: parseFloat(process.env.COST_CAT_TIMEOUT_MINUTES!) || defaultCacheTimeout,
    projectRoles: parseFloat(process.env.PROJ_ROLES_TIMEOUT_MINUTES!) || defaultCacheTimeout,
    recordTypes: parseFloat(process.env.RECORD_TYPES_TIMEOUT_MINUTES!) || defaultCacheTimeout,
    token: parseFloat(process.env.TOKEN_TIMEOUT_MINUTES!) || 10,
    cookie: parseFloat(process.env.COOKIE_TIMEOUT_MINUTES!) || 10,
};

const certificates = {
    salesforce: process.env.SALESFORCE_PRIVATE_KEY_FILE || "/etc/pki/AccPrivateKey.key",
    shibboleth: process.env.SHIBBOLETH_PRIVATE_KEY_FILE || "/etc/pki/AccPrivateKey.key",
};

const features: IFeatureFlags = {
    monitoringReports: process.env.FEATURE_MONITORING_REPORTS === "true",
    projectDocuments: process.env.FEATURE_PROJECT_DOCUMENTS === "true",
    projectFiltering: process.env.FEATURE_PROJECT_FILTERING === "true",
};

const logLevel = parseLogLevel(process.env.LOG_LEVEL! || process.env.LOGLEVEL!);
const prettyLogs = process.env.PRETTY_LOGS === "true";

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

const cookieKey = process.env.COOKIE_KEY!;

const standardOverheadRate = parseFloat(process.env.STANDARD_OVERHEAD_RATE!) || 20;

export const Configuration: IConfig = {
    build,
    cookieKey,
    timeouts,
    certificates,
    features,
    logLevel,
    prettyLogs,
    salesforce,
    serverUrl,
    standardOverheadRate,
    sso,
    urls,
};

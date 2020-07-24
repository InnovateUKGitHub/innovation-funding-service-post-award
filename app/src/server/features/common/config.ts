import { LogLevel, parseLogLevel } from "@framework/types/logLevel";

const defaultCacheTimeout: number = 720;

export interface IConfig {

    readonly build: string;

    readonly timeouts: {
        readonly costCategories: number;
        readonly optionsLookup: number;
        readonly projectRoles: number;
        readonly recordTypes: number;
        readonly token: number;
        readonly cookie: number;
        readonly contentRefreshSeconds: number;
    };

    readonly certificates: {
        salesforce: string;
        shibboleth: string;
    };

    readonly features: IFeatureFlags;

    readonly logLevel: LogLevel;

    readonly maxFileSize: number;
    readonly maxUploadFileCount: number;
    readonly permittedFileTypes: string[];

    readonly prettyLogs: boolean;

    readonly salesforce: {
        readonly clientId: string;
        readonly connectionUrl: string;
        // @TODO: Remove
        readonly serivcePassword: string;
        // @TODO: Remove
        readonly serivceToken: string;
        // @TODO: Remove
        readonly serivceUsername: string;
    };

    readonly serverUrl: string;

    readonly sso: {
        readonly enabled: boolean;
        readonly providerUrl: string;
        readonly signoutUrl: string;
    };

    readonly sil: {
      bankCheckValidateUrl: string,
      bankCheckVerifyUrl: string,
      companiesHouseSearchUrl: string,
      username: string,
      password: string,
    };

    readonly urls: {
        readonly ifsRoot: string;
        readonly ifsApplicationUrl: string;
        readonly ifsGrantLetterUrl: string;
    };

    readonly cookieKey: string;

    readonly standardOverheadRate: number;

    readonly googleTagManagerCode: string;

    readonly s3Account: {
        accessKeyId: string,
        secretAccessKey: string,
        contentBucket: string,
        customContentPath: string,
    };

}

const build = process.env.BUILD || `${Date.now()}`;

const timeouts = {
    costCategories: parseFloat(process.env.COST_CAT_TIMEOUT_MINUTES!) || defaultCacheTimeout,
    projectRoles: parseFloat(process.env.PROJ_ROLES_TIMEOUT_MINUTES!) || defaultCacheTimeout,
    recordTypes: parseFloat(process.env.RECORD_TYPES_TIMEOUT_MINUTES!) || defaultCacheTimeout,
    optionsLookup: parseFloat(process.env.OPTIONS_LOOKUP_TIMEOUT_MINUTES!) || defaultCacheTimeout,
    token: parseFloat(process.env.TOKEN_TIMEOUT_MINUTES!) || 10,
    cookie: parseFloat(process.env.COOKIE_TIMEOUT_MINUTES!) || 10,
    contentRefreshSeconds: parseFloat(process.env.CONTENT_REFRESH_TIMEOUT_SECONDS!) || 0
};

const certificates = {
    salesforce: process.env.SALESFORCE_PRIVATE_KEY_FILE || "/etc/pki/AccPrivateKey.key",
    shibboleth: process.env.SHIBBOLETH_PRIVATE_KEY_FILE || "/etc/pki/AccPrivateKey.key",
};

const getFeatureFlagValue = (value: string | null | undefined, defaultValue: boolean) => {
    if (value === undefined || value === null) {
        return defaultValue;
    }
    return value === "true";
};

const defaultFeatureFlag = getFeatureFlagValue(process.env.FEATURE_DEFAULT, false);

const features: IFeatureFlags = {
    addPartnerWorkflow: getFeatureFlagValue(process.env.FEATURE_ADD_PARTNER, defaultFeatureFlag),
    changePeriodLengthWorkflow: getFeatureFlagValue(process.env.FEATURE_CHANGE_PERIOD_LENGTH, false),
    financialVirements: getFeatureFlagValue(process.env.FEATURE_FINANCIAL_VIREMENTS, defaultFeatureFlag),
    pcrsEnabled: getFeatureFlagValue(process.env.FEATURE_PCRS_ENABLED, defaultFeatureFlag),
    contentHint: getFeatureFlagValue(process.env.FEATURE_CONTENT_HINT, false),
    customContent: getFeatureFlagValue(process.env.FEATURE_CUSTOM_CONTENT, false),
    numberOfProjectsToSearch: parseInt(process.env.FEATURE_SEARCH_NUMBER_PROJECTS!, 10) || 3,
    editPartnerPostcode: getFeatureFlagValue(process.env.FEATURE_EDIT_PARTNER_POSTCODE, defaultFeatureFlag),
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

const maxFileSize = parseInt(process.env.MAX_FILE_SIZE_IN_BYTES!, 10) || 10485760; // 10MB
const maxUploadFileCount = parseInt(process.env.MAX_UPLOAD_FILE_COUNT!, 10) || 10;

let permittedFileTypes = process.env.PERMITTED_FILE_TYPES && process.env.PERMITTED_FILE_TYPES
    .split(",")
    .map(x => x.trim())
    .filter(x => !!x);

if (!permittedFileTypes || !permittedFileTypes.length) {
    permittedFileTypes = ["pdf", "xps", "doc", "docx", "rdf", "txt", "csv", "odt", "ppt", "pptx", "odp", "xls", "xlsx", "ods", "jpg", "jpeg", "png"];
}
const googleTagManagerCode = process.env.GOOGLE_TAG_MANAGER_CODE!;

const s3Account = {
    accessKeyId: process.env.S3_Access_Key!,
    secretAccessKey: process.env.S3_Secret!,
    contentBucket: process.env.S3_Content_Bucket!,
    customContentPath: process.env.S3_Content_File!,
};

const sil = {
    bankCheckValidateUrl: process.env.SIL_EXPERIAN_VALIDATE_URL!,
    bankCheckVerifyUrl: process.env.SIL_EXPERIAN_VERIFY_URL!,
    companiesHouseSearchUrl: process.env.SIL_COMPANIES_HOUSE_SEARCH_URL!,
    username: process.env.SIL_USERNAME!,
    password: process.env.SIL_PASSWORD!,
};

export const Configuration: IConfig = {
    build,
    cookieKey,
    timeouts,
    certificates,
    features,
    logLevel,
    maxFileSize,
    maxUploadFileCount,
    permittedFileTypes,
    prettyLogs,
    salesforce,
    serverUrl,
    standardOverheadRate,
    sil,
    sso,
    urls,
    googleTagManagerCode,
    s3Account,
};

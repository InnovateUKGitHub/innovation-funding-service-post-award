import { parseLogLevel } from "@framework/types/logLevel";
import { IAppOptions } from "@framework/types/IAppOptions";
import { isNumber } from "@framework/util";
import { IFeatureFlags, LogLevel } from "@framework/types";

const defaultCacheTimeout = 720;

export interface IConfig {
  readonly build: string;

  /**
   * @returns 195
   * @description The "Real limit" is 200 but there appears to be socket issues with SalesForce :(
   */
  readonly salesforceQueryLimit: number;

  readonly disableCsp: boolean;

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

  readonly options: IAppOptions;

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
    bankCheckUrl: string;
    bankCheckPort: number | undefined;
    companiesHouseSearchUrl: string;
    username: string;
    password: string;
  };

  readonly urls: {
    readonly ifsRoot: string;
    readonly ifsApplicationUrl: string;
    readonly ifsGrantLetterUrl: string;
  };

  readonly cookieKey: string;

  readonly googleTagManagerCode: string;

  readonly s3Account: {
    accessKeyId: string;
    secretAccessKey: string;
    contentBucket: string;
    customContentPath: string;
  };
}

const build = process.env.BUILD || `${Date.now()}`;

const salesforceQueryLimit: Readonly<number> = 195;

const timeouts = {
  costCategories: parseFloat(process.env.COST_CAT_TIMEOUT_MINUTES!) || defaultCacheTimeout,
  projectRoles: parseFloat(process.env.PROJ_ROLES_TIMEOUT_MINUTES!) || defaultCacheTimeout,
  recordTypes: parseFloat(process.env.RECORD_TYPES_TIMEOUT_MINUTES!) || defaultCacheTimeout,
  optionsLookup: parseFloat(process.env.OPTIONS_LOOKUP_TIMEOUT_MINUTES!) || defaultCacheTimeout,
  token: parseFloat(process.env.TOKEN_TIMEOUT_MINUTES!) || 10,
  cookie: parseFloat(process.env.COOKIE_TIMEOUT_MINUTES!) || 10,
  contentRefreshSeconds: parseFloat(process.env.CONTENT_REFRESH_TIMEOUT_SECONDS!) || 0,
};

const certificates = {
  salesforce: process.env.SALESFORCE_PRIVATE_KEY_FILE || "/etc/pki/AccPrivateKey.key",
  shibboleth: process.env.SHIBBOLETH_PRIVATE_KEY_FILE || "/etc/pki/AccPrivateKey.key",
};

const getFeatureFlagValue = (value: string | undefined, defaultValue: boolean) => {
  return value === "true" ?? defaultValue;
};

const disableCsp = getFeatureFlagValue(process.env.DISABLE_CSP, false);

const features: IFeatureFlags = {
  changePeriodLengthWorkflow: getFeatureFlagValue(process.env.FEATURE_CHANGE_PERIOD_LENGTH, false),
  contentHint: getFeatureFlagValue(process.env.FEATURE_CONTENT_HINT, false),
  customContent: getFeatureFlagValue(process.env.FEATURE_CUSTOM_CONTENT, false),
  displayOtherContacts: getFeatureFlagValue(process.env.FEATURE_OTHER_CONTACTS, false),
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
  ifsApplicationUrl:
    "https://application-for-innovation-funding.service.gov.uk/management/competition/<<Acc_CompetitionId__c>>/application/<<Acc_IFSApplicationId__c>>",
  ifsGrantLetterUrl:
    "https://application-for-innovation-funding.service.gov.uk/management/competition/<<Acc_CompetitionId__c>>/project/<<Acc_IFSApplicationId__c>>",
};

const cookieKey = process.env.COOKIE_KEY!;

let permittedFileTypes: IAppOptions["permittedFileTypes"] = process.env.PERMITTED_FILE_TYPES
  ? process.env.PERMITTED_FILE_TYPES.split(",")
      .map(x => x.trim())
      .filter(x => !!x)
  : [];

const pdfTypes = ["pdf", "xps"];
const textTypes = ["doc", "docx", "rdf", "txt", "csv", "odt"];
const presentationTypes = ["ppt", "pptx", "odp"];
const spreadsheetTypes = ["xls", "xlsx", "ods"];
const imageTypes = ["jpg", "jpeg", "png", "odg"];

if (!permittedFileTypes.length) {
  permittedFileTypes = [...pdfTypes, ...textTypes, ...presentationTypes, ...spreadsheetTypes, ...imageTypes];
}

const parsedBankCheckValidationRetries = parseInt(process.env.BANK_CHECK_VALIDATION_RETRIES!, 10);
const options: IAppOptions = {
  bankCheckAddressScorePass: parseInt(process.env.BANK_CHECK_ADDRESS_SCORE_PASS!, 10) || 6,
  bankCheckValidationRetries: isNumber(parsedBankCheckValidationRetries) ? parsedBankCheckValidationRetries : 1,
  bankCheckCompanyNameScorePass: parseInt(process.env.BANK_CHECK_COMPANY_NAME_SCORE_PASS!, 10) || 6,
  permittedFileTypes,
  permittedTypes: {
    pdfTypes,
    textTypes,
    presentationTypes,
    spreadsheetTypes,
    imageTypes,
  },
  maxUploadFileCount: parseInt(process.env.MAX_UPLOAD_FILE_COUNT!, 10) || 10,
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE_IN_BYTES!, 10) || 10485760, // 10MB
  standardOverheadRate: parseFloat(process.env.STANDARD_OVERHEAD_RATE!) || 20,
  numberOfProjectsToSearch: parseInt(process.env.FEATURE_SEARCH_NUMBER_PROJECTS!, 10) || 3,
};

const googleTagManagerCode = process.env.GOOGLE_TAG_MANAGER_CODE!;

const s3Account = {
  accessKeyId: process.env.S3_Access_Key!,
  secretAccessKey: process.env.S3_Secret!,
  contentBucket: process.env.S3_Content_Bucket!,
  customContentPath: process.env.S3_Content_File!,
};

const sil = {
  bankCheckUrl: process.env.SIL_EXPERIAN_URL!,
  bankCheckPort: process.env.SIL_EXPERIAN_PORT ? parseInt(process.env.SIL_EXPERIAN_PORT, 10) || undefined : undefined,
  companiesHouseSearchUrl: process.env.SIL_COMPANIES_HOUSE_SEARCH_URL!,
  username: process.env.SIL_USERNAME!,
  password: process.env.SIL_PASSWORD!,
};

export const configuration: IConfig = {
  build,
  salesforceQueryLimit,
  disableCsp,
  cookieKey,
  timeouts,
  certificates,
  features,
  logLevel,
  options,
  prettyLogs,
  salesforce,
  serverUrl,
  sil,
  sso,
  urls,
  googleTagManagerCode,
  s3Account,
};

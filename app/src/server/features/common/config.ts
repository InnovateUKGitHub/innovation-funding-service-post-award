import bytes from "bytes";
import { parseLogLevel } from "@framework/types/logLevel";
import { IAppOptions } from "@framework/types/IAppOptions";
import { IFeatureFlags } from "@framework/types/IFeaturesFlags";
import { LogLevel } from "@framework/constants/enums";

const defaultCacheTimeout = 720;

const getFeatureFlagValue = (value: string | undefined, defaultValue: boolean) => {
  return value === "true" ?? defaultValue;
};

interface SalesforceUserConfig {
  readonly clientId: string;
  readonly connectionUrl: string;
  readonly serviceUsername: string;
}

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

  readonly salesforceServiceUser: SalesforceUserConfig;
  readonly bankDetailsValidationUser: SalesforceUserConfig;

  readonly serverUrl: string;

  readonly sso: {
    readonly enabled: boolean;
    readonly providerUrl: string;
    readonly signoutUrl: string;
  };

  readonly companiesHouse: {
    endpoint: string;
    accessToken: string;
  };

  readonly sil: {
    bankCheckUrl: string;
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

  readonly basicAuth: {
    credentials: string[];
  };
}

const build = process.env.BUILD || `${Date.now()}`;

const salesforceQueryLimit: Readonly<number> = 195;

const timeouts = {
  costCategories: parseFloat(process.env.COST_CAT_TIMEOUT_MINUTES ?? "") || defaultCacheTimeout,
  projectRoles: parseFloat(process.env.PROJ_ROLES_TIMEOUT_MINUTES ?? "") || defaultCacheTimeout,
  recordTypes: parseFloat(process.env.RECORD_TYPES_TIMEOUT_MINUTES ?? "") || defaultCacheTimeout,
  optionsLookup: parseFloat(process.env.OPTIONS_LOOKUP_TIMEOUT_MINUTES ?? "") || defaultCacheTimeout,
  token: parseFloat(process.env.TOKEN_TIMEOUT_MINUTES ?? "") || 10,
  cookie: parseFloat(process.env.COOKIE_TIMEOUT_MINUTES ?? "") || 10,
  contentRefreshSeconds: parseFloat(process.env.CONTENT_REFRESH_TIMEOUT_SECONDS ?? "") || 0,
};

const certificates = {
  salesforce: process.env.SALESFORCE_PRIVATE_KEY_FILE || "/etc/pki/AccPrivateKey.key",
  shibboleth: process.env.SHIBBOLETH_PRIVATE_KEY_FILE || "/etc/pki/AccPrivateKey.key",
};

const disableCsp = getFeatureFlagValue(process.env.DISABLE_CSP, false);

const features: IFeatureFlags = {
  changePeriodLengthWorkflow: getFeatureFlagValue(process.env.FEATURE_CHANGE_PERIOD_LENGTH, false),
  customContent: getFeatureFlagValue(process.env.FEATURE_CUSTOM_CONTENT, false),
  searchDocsMinThreshold: Number(process.env.SEARCH_DOCS_MIN_THRESHOLD) || 5,
  futureTimeExtensionInYears: Number(process.env.FUTURE_TIME_EXTENSION_IN_YEARS) || 5,
};

const logLevel = parseLogLevel((process.env.LOG_LEVEL || process.env.LOGLEVEL) ?? "ERROR");
const prettyLogs = process.env.PRETTY_LOGS === "true";

const salesforceServiceUser = {
  clientId: process.env.SALESFORCE_CLIENT_ID ?? "",
  connectionUrl: process.env.SALESFORCE_CONNECTION_URL ?? "",
  serviceUsername: (process.env.SALESFORCE_USERNAME || process.env.SALESFORCEUSERNAME) ?? "",
};

const bankDetailsValidationUser = {
  ...salesforceServiceUser,
  serviceUsername: process.env.SALESFORCE_BANK_DETAILS_VALIDATION_USERNAME ?? "",
};

const serverUrl = process.env.SERVER_URL ?? "";

const sso = {
  enabled: process.env.USE_SSO === "true",
  providerUrl: process.env.SSO_PROVIDER_URL ?? "",
  signoutUrl: process.env.SSO_SIGNOUT_URL ?? "",
};

const credentials: string[] = (process.env.BASIC_AUTH || "")
  .trim()
  .split(/[\|\n]/)
  .map(x => x.trim())
  .filter(x => x);

const basicAuth = { credentials };

const urls = {
  ifsRoot: process.env.IFS_ROOT || "https://apply-for-innovation-funding.service.gov.uk",
  ifsApplicationUrl:
    "https://application-for-innovation-funding.service.gov.uk/management/competition/<<Acc_CompetitionId__c>>/application/<<Acc_IFSApplicationId__c>>",
  ifsGrantLetterUrl:
    "https://application-for-innovation-funding.service.gov.uk/management/competition/<<Acc_CompetitionId__c>>/project/<<Acc_IFSApplicationId__c>>",
};

const cookieKey = process.env.COOKIE_KEY ?? "";

let permittedFileTypes: IAppOptions["permittedFileTypes"] = process.env.PERMITTED_FILE_TYPES
  ? process.env.PERMITTED_FILE_TYPES.split(",")
      .map(x => x.trim())
      .filter(x => !!x)
  : [];

const pdfTypes = ["pdf", "xps"];
const textTypes = ["doc", "docx", "rtf", "txt", "csv", "odt"];
const presentationTypes = ["ppt", "pptx", "odp"];
const spreadsheetTypes = ["xls", "xlsx", "ods"];
const imageTypes = ["jpg", "jpeg", "png", "odg"];

if (!permittedFileTypes.length) {
  permittedFileTypes = [...pdfTypes, ...textTypes, ...presentationTypes, ...spreadsheetTypes, ...imageTypes];
}

const maxClaimLineItems = () => {
  const maxNumber = process.env.FEATURE_MAX_CLAIM_LINE_ITEMS;
  const parsedMaxNumber = (maxNumber && Math.abs(Number(maxNumber))) || 120;

  if (parsedMaxNumber > 120) {
    throw Error(`FEATURE_MAX_CLAIM_LINE_ITEMS = ${parsedMaxNumber}, please enter a value below 120`);
  }

  return parsedMaxNumber;
};

const options: IAppOptions = {
  bankCheckAddressScorePass: parseInt(process.env.BANK_CHECK_ADDRESS_SCORE_PASS ?? "", 10) || 6,
  bankCheckValidationRetries: Number(process.env.BANK_CHECK_VALIDATION_RETRIES) || 3,
  bankCheckCompanyNameScorePass: parseInt(process.env.BANK_CHECK_COMPANY_NAME_SCORE_PASS ?? "", 10) || 6,
  permittedFileTypes,
  permittedTypes: {
    pdfTypes,
    textTypes,
    presentationTypes,
    spreadsheetTypes,
    imageTypes,
  },
  maxUploadFileCount: parseInt(process.env.MAX_UPLOAD_FILE_COUNT ?? "", 10) || 10,
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE_IN_BYTES ?? "", 10) || bytes("32MB"),
  standardOverheadRate: parseFloat(process.env.STANDARD_OVERHEAD_RATE ?? "") || 20,
  numberOfProjectsToSearch: parseInt(process.env.FEATURE_SEARCH_NUMBER_PROJECTS ?? "", 10) || 3,
  maxClaimLineItems: maxClaimLineItems(),
  nonJsMaxClaimLineItems: parseInt(process.env.NON_JS_FEATURE_MAX_CLAIM_LINE_ITEMS ?? "", 10) || 10,
};

const googleTagManagerCode = process.env.GOOGLE_TAG_MANAGER_CODE ?? "";

const s3Account = {
  accessKeyId: process.env.S3_Access_Key ?? "",
  secretAccessKey: process.env.S3_Secret ?? "",
  contentBucket: process.env.S3_Content_Bucket ?? "",
  customContentPath: process.env.S3_Content_File ?? "",
};

const sil = {
  bankCheckUrl: process.env.SIL_EXPERIAN_URL ?? "",
};

const companiesHouse = {
  endpoint: process.env.COMPANIES_HOUSE_ENDPOINT ?? "",
  accessToken: process.env.COMPANIES_HOUSE_ACCESS_TOKEN ?? "",
};

export const configuration: IConfig = {
  build,
  salesforceQueryLimit,
  disableCsp,
  cookieKey,
  timeouts,
  certificates,
  basicAuth,
  features,
  logLevel,
  options,
  prettyLogs,
  salesforceServiceUser,
  bankDetailsValidationUser,
  serverUrl,
  companiesHouse,
  sil,
  sso,
  urls,
  googleTagManagerCode,
  s3Account,
};

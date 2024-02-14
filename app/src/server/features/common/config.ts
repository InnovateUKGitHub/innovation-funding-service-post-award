import bytes from "bytes";
import { parseLogLevel } from "@framework/types/logLevel";
import { parseAccEnvironment } from "@framework/types/accEnvironment";
import { IConfig } from "@framework/types/IConfig";
import { AccEnvironment, LogLevel } from "@framework/constants/enums";
import {
  getBooleanEnv as boolEnv,
  getCertificateEnv as certEnv,
  getCommaSepStringArray as csvEnv,
  getEnv as env,
  getFloatEnv as floatEnv,
  getIntegerEnv as intEnv,
  getPipeSepStringArray as psvEnv,
  getStringEnv as strEnv,
} from "@framework/util/envHelpers";

const configuration: Readonly<IConfig> = {
  build: strEnv("BUILD", String(Date.now())),
  salesforceQueryLimit: intEnv("SALESFORCE_QUERY_LIMIT", 195),
  disableCsp: boolEnv("DISABLE_CSP", false),
  cookie: {
    secret: strEnv("COOKIE_KEY"),
    secure: boolEnv("COOKIE_SECURE", true),
  },
  timeouts: {
    costCategories: floatEnv("COST_CAT_TIMEOUT_MINUTES", 720),
    projectRoles: floatEnv("PROJ_ROLES_TIMEOUT_MINUTES", 720),
    recordTypes: floatEnv("RECORD_TYPES_TIMEOUT_MINUTES", 720),
    optionsLookup: floatEnv("OPTIONS_LOOKUP_TIMEOUT_MINUTES", 720),
    token: floatEnv("TOKEN_TIMEOUT_MINUTES", 10),
    cookie: floatEnv("COOKIE_TIMEOUT_MINUTES", 30),
    contentRefreshSeconds: floatEnv("CONTENT_REFRESH_TIMEOUT_SECONDS", 0),
  },
  certificates: {
    salesforce: certEnv("SALESFORCE_PRIVATE_KEY"),
    saml: {
      idp: {
        public: certEnv("SHIBBOLETH_IDP_PUBLIC_KEY", ""),
      },
      spSigning: {
        public: certEnv("SHIBBOLETH_SP_SIGNING_PUBLIC_KEY", ""),
        private: certEnv("SHIBBOLETH_SP_SIGNING_PRIVATE_KEY", ""),
      },
      spDecryption: {
        public: certEnv("SHIBBOLETH_SP_DECRYPTION_PUBLIC_KEY", ""),
        private: certEnv("SHIBBOLETH_SP_DECRYPTION_PRIVATE_KEY", ""),
      },
    },
  },
  basicAuth: {
    credentials: psvEnv("BASIC_AUTH", []),
  },
  features: {
    changePeriodLengthWorkflow: boolEnv("FEATURE_CHANGE_PERIOD_LENGTH", false),
    customContent: boolEnv("FEATURE_CUSTOM_CONTENT", false),
    searchDocsMinThreshold: intEnv("SEARCH_DOCS_MIN_THRESHOLD", 5),
    futureTimeExtensionInYears: intEnv("FUTURE_TIME_EXTENSION_IN_YEARS", 5),
    approveNewSubcontractor: boolEnv("FEATURE_APPROVE_NEW_SUBCONTRACTOR", false),
  },
  logLevel: env("LOG_LEVEL", LogLevel.ERROR, parseLogLevel),
  options: {
    bankCheckAddressScorePass: intEnv("BANK_CHECK_ADDRESS_SCORE_PASS", 6),
    bankCheckValidationRetries: intEnv("BANK_CHECK_VALIDATION_RETRIES", 3),
    bankCheckCompanyNameScorePass: intEnv("BANK_CHECK_COMPANY_NAME_SCORE_PASS", 6),
    permittedTypes: {
      pdfTypes: csvEnv("PERMITTED_DOCUMENT_FILE_TYPES", ["pdf", "xps"]),
      textTypes: csvEnv("PERMITTED_WORD_PROCESSING_FILE_TYPES", ["doc", "docx", "rtf", "txt", "odt"]),
      presentationTypes: csvEnv("PERMITTED_PRESENTATION_FILE_TYPES", ["ppt", "pptx", "odp"]),
      spreadsheetTypes: csvEnv("PERMITTED_SPREADSHEET_FILE_TYPES", ["csv", "xls", "xlsx", "ods"]),
      imageTypes: csvEnv("PERMITTED_IMAGE_FILE_TYPES", ["jpg", "jpeg", "png", "odg"]),
    },
    maxUploadFileCount: intEnv("MAX_UPLOAD_FILE_COUNT", 10),
    maxFileSize: intEnv("MAX_FILE_SIZE_IN_BYTES", bytes("32MB")),
    maxTotalFileSize: intEnv("MAX_TOTAL_FILE_SIZE_IN_BYTES", bytes("32MB")),
    maxFileBasenameLength: intEnv("MAX_FILE_BASENAME_LENGTH", 80),
    standardOverheadRate: floatEnv("STANDARD_OVERHEAD_RATE", 20),
    numberOfProjectsToSearch: intEnv("FEATURE_SEARCH_NUMBER_PROJECTS", 3),
    maxClaimLineItems: intEnv("FEATURE_MAX_CLAIM_LINE_ITEMS", 120),
    nonJsMaxClaimLineItems: intEnv("NON_JS_FEATURE_MAX_CLAIM_LINE_ITEMS", 120),
  },
  salesforceServiceUser: {
    clientId: strEnv("SALESFORCE_CLIENT_ID"),
    connectionUrl: strEnv("SALESFORCE_CONNECTION_URL"),
    serviceUsername: strEnv("SALESFORCE_USERNAME"),
  },
  bankDetailsValidationUser: {
    clientId: strEnv("SALESFORCE_CLIENT_ID"),
    connectionUrl: strEnv("SALESFORCE_CONNECTION_URL"),
    serviceUsername: strEnv("SALESFORCE_BANK_DETAILS_VALIDATION_USERNAME"),
  },
  companiesHouse: {
    endpoint: strEnv("COMPANIES_HOUSE_ENDPOINT", ""),
    accessToken: strEnv("COMPANIES_HOUSE_ACCESS_TOKEN", ""),
  },
  sil: {
    url: strEnv("SIL_HYDRA_URL", ""),
  },
  sso: {
    enabled: boolEnv("USE_SSO", false),
    providerUrl: strEnv("SSO_PROVIDER_URL", ""),
    signoutUrl: strEnv("SSO_SIGNOUT_URL", ""),
  },
  urls: {
    ifsRoot: strEnv("IFS_ROOT", "https://apply-for-innovation-funding.service.gov.uk"),
    ifsApplicationUrl: strEnv(
      "IFS_APPLICATION_URL",
      "https://application-for-innovation-funding.service.gov.uk/management/competition/<<Acc_CompetitionId__c>>/application/<<Acc_IFSApplicationId__c>>",
    ),
    ifsGrantLetterUrl: strEnv(
      "IFS_GRANT_LETTER_URL",
      "https://application-for-innovation-funding.service.gov.uk/management/competition/<<Acc_CompetitionId__c>>/project/<<Acc_IFSApplicationId__c>>",
    ),
  },
  googleTagManagerCode: strEnv("GOOGLE_TAG_MANAGER_CODE", ""),
  s3Account: {
    accessKeyId: strEnv("AWS_S3_ACCESS_KEY_ID", ""),
    secretAccessKey: strEnv("AWS_S3_ACCESS_SECRET", ""),
    contentBucket: strEnv("AWS_S3_CONTENT_BUCKET", ""),
    customContentPath: strEnv("AWS_S3_CONTENT_CUSTOM_PATH", ""),
  },
  accEnvironment: env("ACC_ENVIRONMENT", AccEnvironment.UNKNOWN, parseAccEnvironment),
  newRelic: {
    enabled: boolEnv("NEW_RELIC_ENABLED", false),
    eventsUrl: strEnv("NEW_RELIC_EVENTS_URL", ""),
    apiKey: strEnv("NEW_RELIC_API_KEY", ""),
    appName: strEnv("NEW_RELIC_APP_NAME", ""),
  },
  webserver: {
    port: strEnv("PORT", "8080"),
    url: strEnv("SERVER_URL"),
  },
  developer: {
    writeGraphQL: boolEnv("DEVELOPER_WRITE_GRAPHQL", false),
  },
};

export { configuration };

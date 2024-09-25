import { AccEnvironment, LogLevel } from "@framework/constants/enums";
import { IFeatureFlags } from "./IFeaturesFlags";
import { IAppOptions } from "./IAppOptions";

interface ISalesforceUserConfig {
  readonly clientId: string;
  readonly connectionUrl: string;
  readonly serviceUsername: string;
}

export interface IConfig {
  /**
   * Build information
   * @default Date.now()
   */
  readonly build: string;
  readonly accEnvironment: AccEnvironment;

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
    saml: {
      idp: {
        public: string;
      };
      spSigning: {
        public: string;
        private: string;
      };
      spDecryption: {
        public: string;
        private: string;
      };
    };
    hydraMtls: {
      certificationAuthority: string;
      public: string;
      private: string;
      passphrase: string;
      serverName: string;
      rejectUnauthorised: boolean;
    };
  };

  readonly features: IFeatureFlags;

  readonly logLevel: LogLevel;

  readonly options: IAppOptions;

  readonly salesforceServiceUser: ISalesforceUserConfig;
  readonly bankDetailsValidationUser: ISalesforceUserConfig;

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
    url: string;
  };

  readonly urls: {
    readonly ifsRoot: string;
    readonly ifsApplicationUrl: string;
    readonly ifsGrantLetterUrl: string;
  };

  readonly cookie: {
    secret: string;
    secure: boolean;
  };

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

  readonly newRelic: {
    enabled: boolean;
    apiKey: string;
    eventsUrl: string;
    appName: string;
  };

  readonly webserver: {
    port: string;
    url: string;
  };

  readonly developer: {
    writeGraphQL: boolean;
    colourfulLogging: boolean;
    oidc: {
      enabled: boolean;
      issuer: string;
      clientId: string;
      clientSecret: string;
    };
  };
}

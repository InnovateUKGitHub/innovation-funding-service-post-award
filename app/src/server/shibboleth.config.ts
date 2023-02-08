import fs from "fs";
import { Strategy } from "@node-saml/passport-saml";
import { configuration } from "@server/features/common/config";
import { User } from "@node-saml/passport-saml/lib/types";
import { Logger } from "@shared/developmentLogger";

// Note: SAML IDP will post back to this route with credentials
export const successfulValidationRoute = "/auth/success";

// definitions for URNs: https://commons.lbl.gov/display/IDMgmt/Attribute+Definitions
const samlConfig = {
  urnUid: "urn:oid:0.9.2342.19200300.100.1.1",
  urnEmail: "urn:oid:0.9.2342.19200300.100.1.3",
};

type expectedUrnResponse = Record<keyof typeof samlConfig, string>;

// Note: Parse serialized SAML response
export const getEmailFromAuthPayload = (x: Record<string, string>) => x[samlConfig.urnEmail];

export type ShibbolethPayload = expectedUrnResponse & {
  issuer: string;
  sessionIndex: string;
  nameID: string;
  nameIDFormat: string;
  nameQualifier: string;
  spNameQualifier: string;
  mail: string;
  email: string;
};

const privateKey = fs.readFileSync(configuration.certificates.shibboleth, "utf-8") || "stub shibboleth private key";
const cert = fs.readFileSync(configuration.certificates.shibbolethPublic, "utf-8") || "stub shibboleth public key";
const logger = new Logger("shibboleth");
logger.warn("privateKey", privateKey);
logger.warn("cert", cert);

export const shibbolethStrategy = new Strategy(
  {
    entryPoint: configuration.sso.providerUrl,
    issuer: configuration.serverUrl,
    callbackUrl: configuration.serverUrl + successfulValidationRoute,
    identifierFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:persistent",
    disableRequestedAuthnContext: true,
    acceptedClockSkewMs: -1,
    privateKey,
    cert,
  },
  function (req, profile, done) {
    done(null, profile as User, {});
  },
  function (req, profile, done) {
    done(null, profile as User, {});
  },
);

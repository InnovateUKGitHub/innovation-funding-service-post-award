import { Strategy, VerifiedCallback } from "@node-saml/passport-saml";
import { configuration } from "@server/features/common/config";
import { Logger } from "@shared/developmentLogger";
import { stripPkcsKey } from "./util/stripPkcsKey";
const logger = new Logger("passport-saml");

/**
 * ⛔️ Stop before you edit ⛔️
 *
 * Please refer to the following Confluence document before proceeding (section "External UI")
 * https://ukri.atlassian.net/wiki/spaces/ACC/pages/430702660
 *
 * (or you can ignore this, it's just a comment in a file...)
 */

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

export type PassportSamlPayload = expectedUrnResponse & {
  issuer: string;
  sessionIndex: string;
  nameID: string;
  nameIDFormat: string;
  nameQualifier: string;
  spNameQualifier: string;
  mail: string;
  email: string;
};

export const getPassportSamlStrategy = () => {
  const strategy = new Strategy(
    {
      cert: stripPkcsKey(configuration.certificates.saml.idp.public),
      privateKey: configuration.certificates.saml.spSigning.private,
      decryptionPvk: configuration.certificates.saml.spDecryption.private,
      signatureAlgorithm: "sha512",
      digestAlgorithm: "sha512",

      entryPoint: configuration.sso.providerUrl,
      issuer: configuration.webserver.url,
      callbackUrl: configuration.webserver.url + successfulValidationRoute,

      identifierFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:persistent",
      wantAuthnResponseSigned: false,

      acceptedClockSkewMs: -1,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (payload: any, onSuccess: VerifiedCallback) => onSuccess(null, payload, {}),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (payload: any, onSuccess: VerifiedCallback) => onSuccess(null, payload, {}),
  );

  logger.info(
    "Passport SAML XML Metadata",
    strategy.generateServiceProviderMetadata(
      configuration.certificates.saml.spDecryption.public,
      configuration.certificates.saml.spSigning.public,
    ),
  );

  return strategy;
};

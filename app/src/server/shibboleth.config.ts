import { SamlConfig, Strategy, VerifiedCallback } from "@node-saml/passport-saml";

import { configuration } from "@server/features/common/config";

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

const shibbolethConfig: SamlConfig = {
  callbackUrl: configuration.serverUrl + successfulValidationRoute,
  entryPoint: configuration.sso.providerUrl,
  issuer: configuration.serverUrl,
  privateKey: configuration.certificates.shibboleth.decryptionPvk,
  cert: configuration.certificates.shibboleth.cert,
  decryptionPvk: configuration.certificates.shibboleth.decryptionPvk,
  identifierFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:persistent",
  authnRequestBinding: "HTTP-REDIRECT",
  signatureAlgorithm: "sha512",
  disableRequestedAuthnContext: true,
  acceptedClockSkewMs: -1,
};

// Note: Configure passport to use shibboleth configured saml
export const shibbolethStrategy = new Strategy(
  shibbolethConfig,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (payload: any, onSuccess: VerifiedCallback) => onSuccess(null, payload, {}),

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (payload: any, onSuccess: VerifiedCallback) => onSuccess(null, payload, {}),
);

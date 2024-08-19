import jwt, { SignOptions } from "jsonwebtoken";
import { SalesforceTokenError } from "@server/repositories/errors";
import { Cache } from "@server/features/common/cache";
import { configuration } from "@server/features/common/config";
import { TsforceConnection } from "@server/tsforce/TsforceConnection";

interface ISalesforceTokenPayload {
  access_token: string;
  sfdc_community_url: string;
  sfdc_community_id: string;
  scope: string;
  instance_url: string;
  id: string;
  token_type: "Bearer";
}

interface ISalesforceTokenError {
  error: string;
  error_description: string;
}

export type ISalesforceTokenQuery = ISalesforceTokenPayload | ISalesforceTokenError;

export interface ISalesforceTokenDetails {
  currentUsername: string;
  connectionUrl: string;
  clientId: string;
}

export interface ISalesforceConnectionDetails extends ISalesforceTokenDetails {
  serviceUsername: string;
}

export interface ITokenInfo {
  accessToken: string;
  url: string;
}

export const tokenCache = new Cache<ITokenInfo>(configuration.timeouts.token);

export const getSalesforceAccessToken = async (config: ISalesforceTokenDetails): Promise<ITokenInfo> => {
  const privateKey = configuration.certificates.salesforce;
  const jwtPayload = { prn: config.currentUsername };
  const jwtOptions: SignOptions = {
    issuer: config.clientId,
    audience: config.connectionUrl,
    expiresIn: 10,
    algorithm: "RS256",
  };

  const jwtToken = jwt.sign(jwtPayload, privateKey, jwtOptions);

  // Create URLSearchParams for a "Content-Type: application/x-www-form-urlencoded"
  const body = new URLSearchParams();
  body.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  body.append("assertion", jwtToken);

  const request = await fetch(`${config.connectionUrl}/services/oauth2/token`, { method: "POST", body });
  const tokenQuery: ISalesforceTokenQuery = await request.json();

  if ("error" in tokenQuery) {
    throw new SalesforceTokenError({ message: tokenQuery.error });
  }
  if (!request.ok) {
    throw new SalesforceTokenError({ message: `Request failed with status ${request.status} - ${tokenQuery}` });
  }

  return {
    url: tokenQuery.sfdc_community_url,
    accessToken: tokenQuery.access_token,
  };
};

export const getCachedSalesforceAccessToken = async (
  salesforceDetails: ISalesforceConnectionDetails,
): Promise<ITokenInfo> => {
  const fetchToken = async () => await getSalesforceAccessToken(salesforceDetails);
  const signedToken = await tokenCache.fetchAsync(salesforceDetails.currentUsername, fetchToken);

  return signedToken;
};

export const salesforceConnectionWithToken = async (
  salesforceDetails: ISalesforceTokenDetails,
): Promise<TsforceConnection> => {
  const fetchToken = async () => await getSalesforceAccessToken(salesforceDetails);
  const signedToken = await tokenCache.fetchAsync(salesforceDetails.currentUsername, fetchToken);

  return new TsforceConnection({
    accessToken: signedToken.accessToken,
    instanceUrl: signedToken.url,
    email: salesforceDetails.currentUsername,
  });
};

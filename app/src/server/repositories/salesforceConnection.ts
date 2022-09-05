import jsforce from "jsforce";
import jwt, {Algorithm} from "jsonwebtoken";

import { SalesforceTokenError } from "@server/repositories/errors";
import { Cache } from "@server/features/common/cache";
import { configuration } from "@server/features/common";
import { readFile } from "@framework/util/fileSystemHelper";

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
  const privateKey = readFile(configuration.certificates.salesforce);
  const jwtPayload = { prn: config.currentUsername };
  const jwtOptions = {
    issuer: config.clientId,
    audience: config.connectionUrl,
    expiresIn: 10,
    algorithm: "RS256" as Algorithm,
  };

  const jwtToken = jwt.sign(jwtPayload, privateKey, jwtOptions);

  const body = new FormData();
  body.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  body.append("assertion", jwtToken);

  const request = await fetch(`${config.connectionUrl}/services/oauth2/token`, { method: "POST", body });
  const tokenQuery: ISalesforceTokenQuery = await request.json();

  if ("error" in tokenQuery) throw new SalesforceTokenError(tokenQuery);
  if (!request.ok) throw new SalesforceTokenError(request.status);

  return {
    url: tokenQuery.sfdc_community_url,
    accessToken: tokenQuery.access_token,
  };
};

export const salesforceConnectionWithToken = async (
  salesforceDetails: ISalesforceTokenDetails,
): Promise<jsforce.Connection> => {
  const fetchToken = async () => await getSalesforceAccessToken(salesforceDetails);
  const signedToken = await tokenCache.fetchAsync(salesforceDetails.currentUsername, fetchToken);

  const jsforceConfig = {
    accessToken: signedToken.accessToken,
    serverUrl: signedToken.url,
  };

  return new jsforce.Connection(jsforceConfig);
};

import fs from "fs";
import jsforce from "jsforce";
import jwt from "jsonwebtoken";

import { SalesforceTokenError } from "@server/repositories/errors";
import { Cache } from "@server/features/common/cache";
import { configuration } from "@server/features/common";

interface ISalesforceTokenPayload {
  access_token: string;
  sfdc_community_url: string;
  sfdc_community_id: string;
  scope: string;
  instance_url: string;
  id: string;
  token_type: "Bearer";
}

export interface ISalesforceTokenDetails {
  currentUsername: string;
  connectionUrl: string;
  clientId: string;
}

export interface ISalesforceConnectionDetails extends ISalesforceTokenDetails {
  serviceUsername: string;
}

interface ITokenInfo {
  accessToken: string;
  url: string;
}

const tokenCache = new Cache<ITokenInfo>(configuration.timeouts.token);

export const getSalesforceAccessToken = async ({ currentUsername, clientId, connectionUrl }: ISalesforceTokenDetails): Promise<ITokenInfo> => {
  const privateKey = fs.readFileSync(configuration.certificates.salesforce, "utf8");
  const jwtPayload = { prn: currentUsername };
  const jwtOptions = {
    issuer: clientId,
    audience: connectionUrl,
    expiresIn: 10,
    algorithm: "RS256",
  };

  const jwtToken = jwt.sign(jwtPayload, privateKey, jwtOptions);

  const body = new FormData();
  body.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  body.append("assertion", jwtToken);

  const request = await fetch(`${connectionUrl}/services/oauth2/token`, { method: "POST", body });

  if (!request.ok) throw new SalesforceTokenError(request.status);

  const payload: ISalesforceTokenPayload = await request.json();

  return {
    url: payload.sfdc_community_url,
    accessToken: payload.access_token,
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

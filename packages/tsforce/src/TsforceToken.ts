import jwt, { SignOptions } from "jsonwebtoken";
import { TsforceInvalidUsernameException } from "./exceptions/TsforceInvalidUsernameException";
import { TsforceTokenException } from "./exceptions/TsforceTokenException";
import { ITsforceHttpClient } from "./types/ITsforceHttpClient";
import { TsforceHttpClient } from "./TsforceHttpClient";

interface TsforceSalesforceTokenSuccessResponse {
  access_token: string;
  sfdc_community_url: string;
  sfdc_community_id: string;
  scope: string;
  instance_url: string;
  id: string;
  token_type: "Bearer";
}

interface TsforceSalesforceTokenExceptionResponse {
  error: string;
  error_description: string;
}

export type TsforceSalesforceTokenResponse =
  | TsforceSalesforceTokenSuccessResponse
  | TsforceSalesforceTokenExceptionResponse;

export interface TsforceSalesforceAccessTokenProps {
  currentUsername: string;
  connectionUrl: string;
  clientId: string;
  privateKey: string;
  httpClient?: ITsforceHttpClient;
}

export interface TsforceTokenInfo {
  accessToken: string;
  url: string;
}

export const getSalesforceAccessToken = async ({
  privateKey,
  currentUsername,
  clientId,
  connectionUrl,
  httpClient: defaultHttpClient,
}: TsforceSalesforceAccessTokenProps): Promise<TsforceTokenInfo> => {
  const httpClient = defaultHttpClient ?? new TsforceHttpClient({ instanceUrl: connectionUrl });
  const jwtPayload = { prn: currentUsername };
  const jwtOptions: SignOptions = {
    issuer: clientId,
    audience: connectionUrl,
    expiresIn: 10,
    algorithm: "RS256",
  };

  const jwtToken = jwt.sign(jwtPayload, privateKey, jwtOptions);

  // Create URLSearchParams for a "Content-Type: application/x-www-form-urlencoded"
  const body = new URLSearchParams();
  body.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  body.append("assertion", jwtToken);

  const tokenBody = await httpClient.fetchText("/services/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  try {
    // Detect a "bad username" Salesforce response
    if (tokenBody.includes("<title>Down For Maintenance</title>")) {
      return Promise.reject(new TsforceInvalidUsernameException());
    }
    const tokenQuery: TsforceSalesforceTokenResponse = JSON.parse(tokenBody);

    if ("error" in tokenQuery) return Promise.reject(new TsforceTokenException({ message: tokenQuery.error }));

    return {
      url: tokenQuery.sfdc_community_url,
      accessToken: tokenQuery.access_token,
    };
  } catch (e) {
    return Promise.reject(new TsforceTokenException({ message: tokenBody, cause: e }));
  }
};

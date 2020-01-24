import jsforce from "jsforce";
import fs from "fs";
import jwt from "jsonwebtoken";
import { Cache } from "../features/common/cache";
import { Configuration } from "../features/common";
import { LogLevel } from "@framework/types/logLevel";
import { SalesforceTokenError } from "./errors";

export interface ISalesforceTokenDetails {
  currentUsername: string;
  connectionUrl: string;
  clientId: string;
}

export interface ISalesforceConnectionDetails extends ISalesforceTokenDetails {
  serviceUsername: string;
  servicePassword: string;
  serviceToken: string;
}

interface ITokenInfo {
  accessToken: string;
  url: string;
}

const tokenCache = new Cache<ITokenInfo>(Configuration.timeouts.token);

export const salesforceConnectionWithUsernameAndPassword = (connectionDetails: ISalesforceConnectionDetails) => {
  const connection = new jsforce.Connection({
    loginUrl: "https://test.salesforce.com",
    logLevel: Configuration.logLevel === LogLevel.VERBOSE ? "DEBUG" : undefined
  });

  return new Promise<jsforce.Connection>((resolve, reject) => {
    if (!connectionDetails.serviceUsername || !connectionDetails.servicePassword || !connectionDetails.serviceToken) {
      throw new Error(`Invalid connection details username:${connectionDetails.serviceUsername}, password:${connectionDetails.servicePassword}, token:${connectionDetails.serviceToken}`);
    }
    connection.login(connectionDetails.serviceUsername, connectionDetails.servicePassword + connectionDetails.serviceToken, (err, conn) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(connection);
      }
    });
  });
};

const getToken = (username: string, clientId: string, connectionUrl: string): Promise<ITokenInfo> => {
  const privateKey = fs.readFileSync(Configuration.certificates.salesforce, "utf8");

  const claimSet = {
    prn: username
  };

  const options = {
    issuer: clientId,
    audience: connectionUrl,
    expiresIn: 10,
    algorithm: "RS256"
  };

  const signedToken = jwt.sign(claimSet, privateKey, options);

  const body = new FormData();
  body.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  body.append("assertion", signedToken);

  return fetch(connectionUrl + "/services/oauth2/token", { method: "POST", body })
    .then(r => {
      if (r.ok) {
        return r.json();
      }
      else {
        return r.text().then(x => {
          throw new SalesforceTokenError(`Unable to get token or json error: url- ${r.url}: status: -${r.status} originalUrl- ${connectionUrl}: ${x}`, r.status);
        });
      }
    })
    .then<ITokenInfo>((token: ISalesforceTokenPayload) => ({ url: token.sfdc_community_url, accessToken: token.access_token }))
    ;

};

export const salesforceConnectionWithToken = async ({ currentUsername, clientId, connectionUrl }: ISalesforceTokenDetails): Promise<jsforce.Connection> => {
  const token = await tokenCache.fetchAsync(currentUsername, () => getToken(currentUsername, clientId, connectionUrl));

  return new jsforce.Connection({
    accessToken: token.accessToken,
    serverUrl: token.url
  });
};

interface ISalesforceTokenPayload {
  access_token: string;
  sfdc_community_url: string;
  sfdc_community_id: string;
  scope: string;
  instance_url: string;
  id: string;
  token_type: "Bearer";
}

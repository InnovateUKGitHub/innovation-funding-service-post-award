import jsforce from "jsforce";
import fs from "fs";
import jwt from "jsonwebtoken";
import { Cache } from "../features/common/cache";

// This will need revisting once SSO with Salesforce has been resolved
export interface ISalesforceConnectionDetails {
  username: string;
  password: string;
  token: string;
  connectionUrl: string;
  clientId: string;

}

interface ITokenInfo {
  accessToken: string;
  url: string;
}

const tokenCache = new Cache<ITokenInfo>(5);

export const salesforceConnection = ({ username, password, token }: ISalesforceConnectionDetails) => {
  const connection = new jsforce.Connection({
    loginUrl: "https://test.salesforce.com"
  });

  return new Promise<jsforce.Connection>((resolve, reject) => {
    if (!username || !password || !token) {
      throw new Error(`Invalid connection details username:${username}, password:${password}, token:${token}`);
    }
    connection.login(username, password + token, (err, conn) => {
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
  const privateKey = fs.readFileSync("./security/AccPrivateKey.key", "utf8");

  const claimSet = {
    prn: username
  };

  const options = {
    issuer: clientId,
    audience: connectionUrl,
    expiresIn: 1,
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
      else if (r.headers.get("content-type") === "application/json") {
        return r.json().then(x => {
          throw new SalesforceTokenError("Unable to get token: url- " + r.url + ": originalUrl-" + connectionUrl + ": " + x.error + "\n" + x.error_description, r.status);
        });
      }
      else {
        return r.text().then(x => {
          throw new SalesforceTokenError("Unable to get token or json error: url- " + r.url + ": originalUrl-" + connectionUrl + ": " + x, r.status);
        });
      }
    })
    .then<ITokenInfo>((token: ISalesforceTokenPayload) => ({ url: token.instance_url, accessToken: token.access_token }))
    ;

};

export const salesforceConnectionWithToken = async ({ username, clientId, connectionUrl }: ISalesforceConnectionDetails): Promise<jsforce.Connection> => {
  const token = await tokenCache.fetchAsync(username, () => getToken(username, clientId, connectionUrl));

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

export class SalesforceTokenError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

import jwt, { SignOptions } from "jsonwebtoken";
import fs from "fs";
import path from "path";

const systemUsername = process.env.SALESFORCE_USERNAME as string;
const clientId = process.env.SALESFORCE_CLIENT_ID as string;
const connectionUrl = process.env.SALESFORCE_CONNECTION_URL as string;
let privateKey: string;

if (process.env.SALESFORCE_PRIVATE_KEY) {
  privateKey = process.env.SALESFORCE_PRIVATE_KEY;
} else if (process.env.SALESFORCE_PRIVATE_KEY_FILE) {
  privateKey =
    process.env.SALESFORCE_PRIVATE_KEY ??
    fs.readFileSync(
      path.join(__dirname, process.env.SALESFORCE_PRIVATE_KEY_FILE),
      {
        encoding: "utf-8",
      }
    );
} else {
  throw new Error("Private key not set");
}

const getSalesforceAccessToken = async (
  username: string = systemUsername
): Promise<{
  serverUrl: string;
  accessToken: string;
}> => {
  const jwtPayload = { prn: username };
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

  const request = await fetch(`${connectionUrl}/services/oauth2/token`, {
    method: "POST",
    body,
  });
  const tokenQuery = await request.json();

  if ("error" in tokenQuery) throw new Error(JSON.stringify(tokenQuery));
  if (!request.ok) throw new Error(JSON.stringify(tokenQuery));

  return {
    serverUrl: tokenQuery.sfdc_community_url,
    accessToken: tokenQuery.access_token,
  };
};

export { getSalesforceAccessToken };

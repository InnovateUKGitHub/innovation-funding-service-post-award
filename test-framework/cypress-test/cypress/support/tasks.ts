import { Envman } from "envman";
import jwt, { SignOptions } from "jsonwebtoken";
import jsforce, { Connection } from "jsforce";
import { ExecuteAnonymousResult } from "jsforce/lib/api/tooling";

const accCache = new Map<string, string>();

let salesforceAccessToken: string | null = null;
let jsforceConnection: Connection | null = null;

interface SirtestalotTaskProps {
  cyEnv: Record<string, any>;
}

const tasks = {
  setCyCache({ key, value }: { key: string; value: string }): null {
    accCache.set(key, value);
    return null;
  },

  getCyCache({ key }: { key: string }): string | null {
    return accCache.get(key) ?? null;
  },

  getSecret({ cyEnv, key }: { key: string } & SirtestalotTaskProps): string | null {
    const envman = new Envman(cyEnv.SALESFORCE_ENVIRONMENT);

    return envman.getEnv(key) ?? null;
  },

  async runApex({ cyEnv, apex }: { apex: string } & SirtestalotTaskProps): Promise<ExecuteAnonymousResult> {
    const envman = new Envman(cyEnv.SALESFORCE_ENVIRONMENT);

    const getSalesforceAccessToken = async () => {
      const privateKey = envman.getEnv("SALESFORCE_PRIVATE_KEY");
      const jwtPayload = { prn: envman.getEnv("SALESFORCE_USERNAME") };
      const jwtOptions = {
        issuer: envman.getEnv("SALESFORCE_CLIENT_ID"),
        audience: envman.getEnv("SALESFORCE_CONNECTION_URL"),
        expiresIn: 10,
        algorithm: "RS256",
      };

      const jwtToken = jwt.sign(jwtPayload, privateKey, jwtOptions);

      // Create URLSearchParams for a "Content-Type: application/x-www-form-urlencoded"
      const body = new URLSearchParams();
      body.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
      body.append("assertion", jwtToken);

      const request = await fetch(`${envman.getEnv("SALESFORCE_CONNECTION_URL")}/services/oauth2/token`, {
        method: "POST",
        body,
      });
      const tokenQuery = await request.json();

      return tokenQuery.access_token;
    };

    if (!salesforceAccessToken) {
      salesforceAccessToken = await getSalesforceAccessToken();
      accCache.set("SALESFORCE_ACCESS_TOKEN", salesforceAccessToken);
    }
    if (!jsforceConnection) {
      jsforceConnection = new Connection({
        accessToken: salesforceAccessToken,
        serverUrl: envman.getEnv("SALESFORCE_CONNECTION_URL"),
      });
    }

    const res = await jsforceConnection.tooling.executeAnonymous(apex);

    if (res.compiled && res.success) return res;

    if (!res.compiled) {
      throw new Error(
        `accTask failed to compile the apex because of a compilation error at line ${res.line} column ${res.column}\n\n${res.compileProblem}`,
      );
    }

    const errorMessage = res.exceptionMessage + "\n\n" + res.exceptionStackTrace;
    console.log(errorMessage);
    throw new Error(errorMessage);
  },
};

type SirtestalotTasks = typeof tasks;

export { tasks, SirtestalotTasks, SirtestalotTaskProps };

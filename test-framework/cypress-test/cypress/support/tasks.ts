import { Envman } from "envman";
import jwt from "jsonwebtoken";

const accCache = new Map<string, string>();
let salesforceAccessToken: string | null = null;

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

  async runApex({ cyEnv, apex }: { apex: string } & SirtestalotTaskProps): Promise<unknown> {
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

    const url = new URL("/services/data/v59.0/tooling/executeAnonymous", envman.getEnv("SALESFORCE_CONNECTION_URL"));
    url.searchParams.append("anonymousApex", apex);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${salesforceAccessToken}`,
      },
    });

    if (res.status === 200) {
      return null;
    } else {
      const text = await res.text();
      throw new Error(text);
    }
  },
};

type SirtestalotTasks = typeof tasks;

export { SirtestalotTaskProps, SirtestalotTasks, tasks };

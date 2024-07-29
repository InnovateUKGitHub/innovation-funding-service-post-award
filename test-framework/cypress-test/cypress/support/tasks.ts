import { EnvironmentManager } from "@innovateuk/environment-manager";
import jwt from "jsonwebtoken";
import { xml } from "./helpers/xml";

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
    const envman = new EnvironmentManager(cyEnv.SALESFORCE_SANDBOX);

    return envman.getEnv(key) ?? null;
  },

  async runApex({ cyEnv, apex }: { apex: string } & SirtestalotTaskProps): Promise<unknown> {
    const envman = new EnvironmentManager(cyEnv.SALESFORCE_SANDBOX);
    const privateKey = envman.getEnv("SALESFORCE_PRIVATE_KEY");
    const username = envman.getEnv("SALESFORCE_USERNAME");
    const clientId = envman.getEnv("SALESFORCE_CLIENT_ID");
    const mySiteConnectionUrl = envman.getEnv("SALESFORCE_CONNECTION_URL");

    const getSalesforceAccessToken = async () => {
      const jwtPayload = { prn: username };
      const jwtOptions = {
        issuer: clientId,
        audience: mySiteConnectionUrl,
        expiresIn: 10,
        algorithm: "RS256",
      };

      const jwtToken = jwt.sign(jwtPayload, privateKey, jwtOptions);

      // Create URLSearchParams for a "Content-Type: application/x-www-form-urlencoded"
      const body = new URLSearchParams();
      body.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
      body.append("assertion", jwtToken);

      const request = await fetch(`${mySiteConnectionUrl}/services/oauth2/token`, {
        method: "POST",
        body,
      });
      const tokenQuery = await request.json();

      return tokenQuery.access_token;
    };

    if (!salesforceAccessToken) {
      salesforceAccessToken = await getSalesforceAccessToken();
    }

    const res = await fetch(mySiteConnectionUrl + "/services/Soap/T/61.0", {
      method: "POST",
      headers: {
        Accept: "text/xml",
        "Content-Type": "text/xml",
        SOAPAction: "blargh",
      },
      body: xml`
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:tns="urn:tooling.soap.sforce.com"
>
  <soap:Header>
    <tns:DebuggingHeader>
      <tns:categories>
        <tns:category>apex_code</tns:category>
        <tns:level>FINEST</tns:level>
      </tns:categories>
      <tns:debugLevel>DETAIL</tns:debugLevel>
    </tns:DebuggingHeader>
    <tns:SessionHeader>
      <tns:sessionId>${salesforceAccessToken}</tns:sessionId>
    </tns:SessionHeader>
  </soap:Header>
  <soap:Body>
    <tns:executeAnonymous>
      <tns:String>${apex}</tns:String>
    </tns:executeAnonymous>
  </soap:Body>
</soap:Envelope>
      `,
    });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(text);
    }
    console.error(text);

    return "";
  },
};

type SirtestalotTasks = typeof tasks;

export { SirtestalotTaskProps, SirtestalotTasks, tasks };

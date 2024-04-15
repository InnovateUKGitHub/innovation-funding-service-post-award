import { Envman } from "envman";
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

    const res = await fetch(envman.getEnv("SALESFORCE_CONNECTION_URL") + "/services/Soap/s/59.0", {
      method: "POST",
      body: xml`
        <?xml version="1.0" encoding="UTF-8"?>
        <env:Envelope
          xmlns:env="http://schemas.xmlsoap.org/soap/envelope/"
          xmlns:xsd="http://www.w3.org/2001/XMLSchema"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        >
          <env:Header>
            <DebuggingHeader xmlns="http://soap.sforce.com/2006/08/apex">
              <categories>
                <category>Apex_code</category>
                <level>FINEST</level>
              </categories>
              <debugLevel>DEBUGONLY</debugLevel>
            </DebuggingHeader>
            <SessionHeader xmlns="http://soap.sforce.com/2006/08/apex">
              <sessionId>${salesforceAccessToken}</sessionId>
            </SessionHeader>
          </env:Header>
          <env:Body>
            <executeAnonymous xmlns="http://soap.sforce.com/2006/08/apex">
              <String>${apex}</String>
            </executeAnonymous>
          </env:Body>
        </env:Envelope>
      `,
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: '""',
      },
    });

    throw new Error(await res.text());
  },
};

type SirtestalotTasks = typeof tasks;

export { SirtestalotTaskProps, SirtestalotTasks, tasks };

import { EnvironmentManager } from "@innovateuk/environment-manager";
import jwt from "jsonwebtoken";
import { Fixture } from "playwright-bdd/decorators";
import { xml } from "../../helpers/xml";

interface SfdcApiProps {
  playwright: typeof import("playwright-core");
}

interface SalesforceTokenInfo {
  access_token: string;
  sfdc_community_url: string;
  sfdc_community_id: string;
  scope: string;
  instance_url: string;
  id: string;
  token_type: string;
}

export
@Fixture("sfdcApi")
class SfdcApi {
  private readonly playwright: typeof import("playwright-core");
  private readonly envman: EnvironmentManager;
  private salesforceAccessToken: Map<string, SalesforceTokenInfo> = new Map();

  public static async create({ playwright }: SfdcApiProps, use: (x: SfdcApi) => Promise<void>) {
    use(new SfdcApi({ playwright }));
  }

  constructor({ playwright }: SfdcApiProps) {
    this.playwright = playwright;
    this.envman = new EnvironmentManager(process.env.TEST_SALESFORCE_SANDBOX);
  }

  private async getRequestContext(baseURL: string) {
    return await this.playwright.request.newContext({
      baseURL,
    });
  }

  /**
   * Get salesforce login information about the system user, or any other specific username.
   * @param overrideUsername Username to log in as - Leave empty to log into the System User
   * @returns Salesforce information, including token, community urls and instance url
   */
  public async getSalesforceToken(overrideUsername?: string): Promise<SalesforceTokenInfo> {
    const username = overrideUsername ?? this.envman.getEnv("SALESFORCE_USERNAME");
    const existingToken = this.salesforceAccessToken.get(username);
    if (existingToken) return existingToken;

    const privateKey = this.envman.getEnv("SALESFORCE_PRIVATE_KEY");
    const clientId = this.envman.getEnv("SALESFORCE_CLIENT_ID");
    const connectionUrl = this.envman.getEnv("SALESFORCE_CONNECTION_URL");
    const reqCtx = await this.getRequestContext(connectionUrl);

    const jwtToken = jwt.sign({ prn: username }, privateKey, {
      issuer: clientId,
      audience: connectionUrl,
      expiresIn: 10,
      algorithm: "RS256",
    });

    const request = await reqCtx.post(`${connectionUrl}/services/oauth2/token`, {
      form: {
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwtToken,
      },
    });

    if (!request.ok()) {
      throw new Error(await request.text());
    }

    const tokenQuery = await request.json();
    this.salesforceAccessToken.set(username, tokenQuery);
    return tokenQuery;
  }

  public async runApex(apex: string): Promise<void> {
    const connectionUrl = this.envman.getEnv("SALESFORCE_CONNECTION_URL");
    const reqCtx = await this.getRequestContext(connectionUrl);
    const salesforceAccessToken = await this.getSalesforceToken();

    const res = await reqCtx.post(connectionUrl + "/services/Soap/T/61.0", {
      headers: {
        Accept: "text/xml",
        "Content-Type": "text/xml",
        SOAPAction: "blargh", // any string is ok here
      },
      data: xml`
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
      <tns:sessionId>${salesforceAccessToken.access_token}</tns:sessionId>
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
  }
}

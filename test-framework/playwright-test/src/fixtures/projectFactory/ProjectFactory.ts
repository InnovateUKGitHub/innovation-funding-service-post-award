import { Page } from "@playwright/test";
import { EnvironmentManager } from "environment-manager";
import jwt from "jsonwebtoken";
import { CreateProjectProps, buildApex } from "project-factory";
import { xml } from "../../helpers/xml";
import { AccNavigation } from "../AccNavigation";
import { ProjectState } from "./ProjectState";

export abstract class ProjectFactory {
  private readonly playwright: typeof import("playwright-core");
  private readonly envman: EnvironmentManager;
  private salesforceAccessToken: string | null = null;
  protected readonly page: Page;
  protected prefix: string | null = null;
  private readonly projectState: ProjectState;

  constructor({
    page,
    playwright,
    projectState,
  }: {
    page: Page;
    playwright: typeof import("playwright-core");
    projectState: ProjectState;
  }) {
    this.page = page;
    this.playwright = playwright;
    this.envman = new EnvironmentManager(process.env.TEST_SALESFORCE_SANDBOX);
    this.projectState = projectState;
  }

  private async getRequestContext(baseURL: string) {
    return await this.playwright.request.newContext({
      baseURL,
    });
  }

  private async getSalesforceToken(): Promise<string> {
    if (this.salesforceAccessToken) return this.salesforceAccessToken;

    const privateKey = this.envman.getEnv("SALESFORCE_PRIVATE_KEY");
    const username = this.envman.getEnv("SALESFORCE_USERNAME");
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
    const tokenQuery = await request.json();

    this.salesforceAccessToken = tokenQuery.access_token;
    return this.salesforceAccessToken;
  }

  protected async runApex(apex: string): Promise<void> {
    const connectionUrl = this.envman.getEnv("SALESFORCE_CONNECTION_URL");
    const reqCtx = await this.getRequestContext(connectionUrl);
    const salesforceAccessToken = await this.getSalesforceToken();

    const res = await reqCtx.post(connectionUrl + "/services/Soap/T/61.0", {
      headers: {
        Accept: "text/xml",
        "Content-Type": "text/xml",
        SOAPAction: "blargh",
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
  }

  protected abstract getProject(): CreateProjectProps;

  protected async createProject() {
    const data = this.getProject();
    const prefix = Math.floor(Date.now() / 1000).toString() + ".";
    const apex = buildApex({
      instances: [
        data.project,
        data.projectParticipant,
        ...data.pcrs.headers,
        ...data.pcrs.removePartner,
        ...data.logins.map(x => [x.account, x.contact, x.pcl, x.user]),
        data.competition,
        data.profiles.projectFactoryHelper,
        ...data.profiles.details,
        ...data.profiles.totalCostCategories,
      ].flat(),
      options: {
        prefix,
      },
    });

    this.prefix = prefix;
    this.projectState.prefix = prefix;
    this.projectState.project = {
      number: data.project.getField("Acc_ProjectNumber__c"),
      title: data.project.getField("Acc_ProjectTitle__c"),
    };
    return this.runApex(apex);
  }
}

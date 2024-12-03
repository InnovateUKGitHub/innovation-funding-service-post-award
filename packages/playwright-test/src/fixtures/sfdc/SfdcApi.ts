import { EnvironmentManager } from "@innovateuk/environment-manager";
import { TsforceConnection } from "@innovateuk/tsforce/TsforceConnection";
import { getSalesforceAccessToken } from "@innovateuk/tsforce/TsforceToken";
import { Fixture } from "playwright-bdd/decorators";
import { PlaywrightTsforceHttpClient } from "./PlaywrightTsforceHttpClient";
import { Environment } from "../Environment";

interface SfdcApiProps {
  playwright: typeof import("playwright-core");
  environment: Environment;
}

interface SalesforceTokenInfo {
  accessToken: string;
  url: string;
}

export
@Fixture("sfdcApi")
class SfdcApi {
  private readonly envman: EnvironmentManager;
  private readonly playwright: typeof import("playwright-core");
  private connectionMap: Map<string, SalesforceTokenInfo> = new Map();

  public static async create({ playwright, environment }: SfdcApiProps, use: (x: SfdcApi) => Promise<void>) {
    use(new SfdcApi({ playwright, environment }));
  }

  constructor({ playwright, environment }: SfdcApiProps) {
    this.envman = environment.envman;
    this.playwright = playwright;
  }

  /**
   * Get salesforce login information about the system user, or any other specific username.
   * @param overrideUsername Username to log in as - Leave empty to log into the System User
   * @returns Salesforce information, including token, community urls and instance url
   */
  public async getSalesforceToken(overrideUsername?: string): Promise<SalesforceTokenInfo> {
    const username = overrideUsername ?? this.envman.getEnv("SALESFORCE_USERNAME");
    const existingToken = this.connectionMap.get(username);
    if (existingToken) return existingToken;

    const privateKey = this.envman.getEnv("SALESFORCE_PRIVATE_KEY");
    const clientId = this.envman.getEnv("SALESFORCE_CLIENT_ID");
    const connectionUrl = this.envman.getEnv("SALESFORCE_CONNECTION_URL");

    const httpClient = new PlaywrightTsforceHttpClient({
      accessToken: undefined,
      instanceUrl: connectionUrl,
      apiRequestContext: await this.playwright.request.newContext(),
    });

    return getSalesforceAccessToken({
      clientId,
      connectionUrl,
      currentUsername: username,
      privateKey,
      httpClient,
    });
  }

  public async getTsforceConnection(overrideUsername?: string): Promise<TsforceConnection> {
    const username = overrideUsername ?? this.envman.getEnv("SALESFORCE_USERNAME");
    const { accessToken, url } = await this.getSalesforceToken(overrideUsername);

    const httpClient = new PlaywrightTsforceHttpClient({
      accessToken,
      instanceUrl: url,
      apiRequestContext: await this.playwright.request.newContext(),
    });

    return new TsforceConnection({
      instanceUrl: url,
      accessToken,
      email: username,
      traceId: "project-factory-two",
      httpClient,
    });
  }
}

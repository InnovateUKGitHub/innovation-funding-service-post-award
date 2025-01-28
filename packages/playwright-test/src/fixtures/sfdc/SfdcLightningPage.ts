import { BrowserContext, Page } from "@playwright/test";
import { Fixture } from "playwright-bdd/decorators";
import { SfdcApi } from "./SfdcApi";
import { error } from "console";

export
@Fixture("sfdcLightningPage")
class SfdcLightningPage {
  public readonly context: BrowserContext;
  public readonly page: Page;
  private readonly sfdcApi: SfdcApi;

  public static async create(
    {
      page,
      context,
      sfdcApi,
    }: {
      page: Page;
      context: BrowserContext;
      sfdcApi: SfdcApi;
    },
    use: (x: SfdcLightningPage) => Promise<void>,
  ) {
    use(new SfdcLightningPage({ page, context, sfdcApi }));
  }

  public static async createNewTab(
    {
      context,
      sfdcApi,
    }: {
      context: BrowserContext;
      sfdcApi: SfdcApi;
    },
    use: (x: SfdcLightningPage) => Promise<void>,
  ) {
    const page = await context.newPage();
    use(new SfdcLightningPage({ page, context, sfdcApi }));
  }

  constructor({ page, context, sfdcApi }: { page: Page; context: BrowserContext; sfdcApi: SfdcApi }) {
    this.page = page;
    this.context = context;
    this.sfdcApi = sfdcApi;
  }

  public async goto(path: string) {
    const tokenInfo = await this.sfdcApi.getSalesforceToken();
    let match = /https:\/\/([a-z-]+)\.sandbox/.exec(tokenInfo.url);
    if (match) {
      const sandbox = match[1];
      return this.page.goto(`https://${sandbox}.sandbox.lightning.force.com${path}`);
    }
    throw new Error("Sandbox does not match sandbox URL format.");
  }

  public async loginAndGoto(path: string) {
    const tokenInfo = await this.sfdcApi.getSalesforceToken();
    await this.goto(`/secur/frontdoor.jsp?sid=${tokenInfo.accessToken}&retURL=${encodeURIComponent(path)}`);
    await this.goto(path);
  }
}

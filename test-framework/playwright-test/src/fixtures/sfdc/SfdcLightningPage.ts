import { BrowserContext, Page } from "@playwright/test";
import { Fixture } from "playwright-bdd/decorators";
import { SfdcApi } from "./SfdcApi";

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
    return this.page.goto(`${tokenInfo.instance_url}${path}`);
  }

  public async loginAndGoto(path: string) {
    const tokenInfo = await this.sfdcApi.getSalesforceToken();
    return this.goto(`/secur/frontdoor.jsp?sid=${tokenInfo.access_token}&retUrl=${encodeURIComponent(path)}`);
  }
}

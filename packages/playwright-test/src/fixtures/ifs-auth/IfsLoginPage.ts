import { EnvironmentManager } from "@innovateuk/environment-manager";
import { Page } from "@playwright/test";
import { Fixture } from "playwright-bdd/decorators";
import { Environment } from "../Environment";

export
@Fixture("ifsLoginPage")
class IfsLoginPage {
  private readonly page: Page;
  private readonly envman: EnvironmentManager;

  static async create(
    {
      page,
      environment,
    }: {
      page: Page;
      environment: Environment;
    },
    use: (x: IfsLoginPage) => Promise<void>,
  ) {
    use(new IfsLoginPage({ page, environment }));
  }

  constructor({ page, environment }: { page: Page; environment: Environment }) {
    this.page = page;
    this.envman = environment.envman;
  }

  async goto() {
    return this.page.goto(this.envman.getEnv("IFS_ROOT"));
  }

  async login(username: string, password: string) {
    await this.page.locator("#username").fill(username);
    await this.page.locator("#password").fill(password);
    await this.page.locator("#sign-in-cta").click();

    await this.page.waitForLoadState("networkidle");
    if ((await this.page.locator("#dashboard-link-LIVE_PROJECTS_USER").count()) > 0) {
      await this.page.locator("#dashboard-link-LIVE_PROJECTS_USER").click();
    }
  }
}

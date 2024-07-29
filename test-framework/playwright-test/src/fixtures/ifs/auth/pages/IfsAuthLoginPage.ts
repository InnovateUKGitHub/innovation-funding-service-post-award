import { Page } from "@playwright/test";
import { Fixture, Given } from "playwright-bdd/decorators";
import { IfsAuthInputBox } from "../../../../components/ifs/auth/IfsAuthInputBox";
import { EnvironmentManager } from "@innovateuk/environment-manager";
import { IfsAuthSignInButton } from "../../../../components/ifs/auth/IfsAuthSignInButton";

export
@Fixture("ifsAuthLoginPage")
class IfsAuthLoginPage {
  protected readonly page: Page;
  protected readonly username: IfsAuthInputBox;
  protected readonly password: IfsAuthInputBox;
  protected readonly signInButton: IfsAuthSignInButton;
  private readonly envman: EnvironmentManager;

  constructor({ page }: { page: Page }) {
    this.page = page;
    this.username = IfsAuthInputBox.username(page);
    this.password = IfsAuthInputBox.password(page);
    this.signInButton = IfsAuthSignInButton.create(page);
    this.envman = new EnvironmentManager(process.env.TEST_SALESFORCE_SANDBOX);
  }

  public static create({ page }: { page }, use: (x: IfsAuthLoginPage) => Promise<void>) {
    use(new IfsAuthLoginPage({ page }));
  }

  @Given("the user is on the IFS login page")
  async goto() {
    await this.page.goto(this.envman.getEnv("SSO_PROVIDER_URL"));
  }

  async login(username: string, password: string) {
    await this.goto();
    await this.username.get().fill(username);
    await this.password.get().fill(password);
    await this.signInButton.click();
  }
}

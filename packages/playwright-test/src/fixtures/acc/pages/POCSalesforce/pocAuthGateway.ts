import { expect, Locator, Page } from "@playwright/test";
import { Fixture, When } from "playwright-bdd/decorators";
import { Commands } from "../../../Commands";
import { DataTable } from "playwright-bdd";

export
@Fixture("pocAuthGateway")
class PocAuthGateway {
  protected readonly page: Page;
  protected readonly commands: Commands;

  private readonly appLauncher: Locator;
  private readonly appLauncherSearch: Locator;
  private readonly authGatewayHeading: Locator;

  constructor({ page, commands }: { page: Page; commands: Commands }) {
    this.page = page;
    this.commands = commands;

    this.appLauncher = this.page.getByLabel("App");
    this.appLauncherSearch = this.page.getByLabel("Search apps and items...");
    this.authGatewayHeading = this.page.getByRole("heading").filter({ hasText: "Authorisation Gateway" });
  }

  @When("the user navigates to Authorisation Gateway")
  async navToAuthGateway() {
    await this.appLauncher.click();
    await this.appLauncher.getByRole("button").filter({ hasText: "View All" }).click();
    await this.page.getByRole("dialog").getByLabel("Search apps or items...").fill("Authorisation Gateway");
    await this.page.waitForTimeout(3000);
    await this.getByDataName("Authorisation Gateway").first().click();
    await expect(this.authGatewayHeading).toBeVisible();
  }

  /**
   * METHODS
   */

  //Tools to locate elements using a SF-specific id.
  getByDataName(label: string) {
    return this.page.locator(`[data-name="${label}"]`);
  }

  getByFieldID(label: string) {
    return this.page.locator(`[data-field-id="${label}"]`);
  }

  getByDataComponentID(id: string) {
    return this.page.locator(`[data-component-id="${id}"]`);
  }

  async checkNavBar(table: DataTable) {
    const data = table.hashes();
    for (const row of data) {
      await expect(this.page.getByTitle(row["tab"]).filter({ hasText: row["tab"] })).toBeVisible();
    }
  }

  getTab(tabName: string) {
    return this.page.getByRole("tablist").getByRole("tab").filter({ hasText: tabName });
  }

  async getProjectTabData(apiName: string, label: string) {
    let fieldId = `Record${apiName}Field`;
    await expect(this.getByFieldID(fieldId).getByRole("listitem").filter({ hasText: label })).toBeVisible();
  }
}

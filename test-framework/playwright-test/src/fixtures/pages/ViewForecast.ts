import { Page, expect } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";
import { PageHeading } from "../../components/PageHeading";
import { Commands } from "../Commands";

export
@Fixture("viewForecast")
class ViewForecast {
  protected readonly page: Page;
  protected readonly commands: Commands;

  private readonly pageTitle: PageHeading;

  constructor({ page, commands }: { page: Page; commands: Commands }) {
    this.page = page;
    this.commands = commands;
    this.pageTitle = PageHeading.fromTitle(page, "Forecast");
  }

  @Then("the user sees the project forecast for {string}")
  async isPage(partnerName: string) {
    await expect(this.pageTitle.get()).toBeVisible();
    await expect(this.page.locator("h2,h3,h4,h5,h6").filter({ hasText: partnerName })).toBeVisible();
  }
}

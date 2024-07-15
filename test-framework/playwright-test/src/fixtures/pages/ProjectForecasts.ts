import { Page, expect } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";
import { PageHeading } from "../../components/PageHeading";
import { Commands } from "../Commands";

export
@Fixture("projectForecasts")
class ProjectForecasts {
  protected readonly page: Page;
  protected readonly commands: Commands;

  private readonly pageTitle: PageHeading;

  constructor({ page, commands }: { page: Page; commands: Commands }) {
    this.page = page;
    this.commands = commands;
    this.pageTitle = PageHeading.fromTitle(page, "Forecasts");
  }

  @Then("the user sees the project forecasts")
  async isPage() {
    await expect(this.pageTitle.get()).toBeVisible();
  }

  @When("the user selects the project forecast for {string}")
  async viewForecastForPartner(partnerName: string) {
    await this.commands.getLinkInRow(partnerName, "View forecast").click();
  }
}

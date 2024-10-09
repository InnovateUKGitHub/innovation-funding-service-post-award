import { Page, expect } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";
import { PageHeading } from "../../../components/PageHeading";
import { Commands } from "../../Commands";
import { Table } from "../../../components/Table";

export
@Fixture("projectForecasts")
class ProjectForecasts {
  protected readonly page: Page;
  protected readonly commands: Commands;

  private readonly pageTitle: PageHeading;
  private readonly forecastTable: Table<
    "Partner" | "Total eligible costs" | "Forecasts and costs" | "Underspend" | "Date of last update"
  >;

  constructor({ page, commands }: { page: Page; commands: Commands }) {
    this.page = page;
    this.commands = commands;
    this.pageTitle = PageHeading.fromTitle(page, "Forecasts");
    this.forecastTable = Table.fromCaption(page, "Forecast summary for project");
  }

  @Then("the user sees the project forecasts")
  async isPage() {
    await expect(this.pageTitle.get()).toBeVisible();
    await expect(this.forecastTable.get()).toBeVisible();
  }

  @When("the user selects the project forecast for {string}")
  async viewForecastForPartner(partnerName: string) {
    await this.commands.getLinkInRow(partnerName, "View forecast").click();
  }
}

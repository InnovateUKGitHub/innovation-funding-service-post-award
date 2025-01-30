import { Locator, Page, expect } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";
import { PageHeading } from "../../../components/PageHeading";
import { Commands } from "../../Commands";
import { Table } from "../../../components/Table";
import { AccNavigation } from "../AccNavigation";

export
@Fixture("projectForecasts")
class ProjectForecasts {
  protected readonly page: Page;
  protected readonly commands: Commands;
  protected readonly accNavigation: AccNavigation;

  private readonly pageTitle: PageHeading;
  private readonly forecastTable: Table<
    "Partner" | "Total eligible costs" | "Forecasts and costs" | "Underspend" | "Date of last update"
  >;
  private readonly editForecastButton: Locator;
  private readonly xlsDownloadLink: Locator;
  private readonly csvDownloadLink: Locator;

  constructor({ page, commands, accNavigation }: { page: Page; commands: Commands; accNavigation: AccNavigation }) {
    this.page = page;
    this.commands = commands;
    this.accNavigation = accNavigation;
    this.pageTitle = PageHeading.fromTitle(page, "Forecasts");
    this.forecastTable = Table.fromCaption(page, "Forecast summary for project");
    this.editForecastButton = this.page.getByRole("button").filter({ hasText: "Edit forecast" });
    this.xlsDownloadLink = this.page.getByRole("link").filter({ hasText: "Download forecast (.xlsx" });
    this.csvDownloadLink = this.page.getByRole("link").filter({ hasText: "Download forecast (.csv)" });
  }

  @When("the user accesses the Forecast page")
  async accessForcastTile() {
    await this.accNavigation.gotoProjectForecasts();
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

  @When("the user clicks Edit forecast button")
  async clickEditForecastButton() {
    await this.editForecastButton.click();
    await expect(this.xlsDownloadLink).not.toBeVisible();
    await expect(this.csvDownloadLink).not.toBeVisible();
  }
}

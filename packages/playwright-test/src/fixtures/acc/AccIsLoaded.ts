import { Page } from "@playwright/test";
import { Fixture } from "playwright-bdd/decorators";
import { DevTools } from "../../components/DevTools";
import { Commands } from "../Commands";
import { DashboardTile } from "../../components/DashboardTile";

export
@Fixture("accIsLoaded")
class AccIsLoaded {
  private readonly page: Page;
  private readonly commands: Commands;
  private readonly devtools: DevTools;

  constructor({ page, commands }: { page: Page; commands: Commands }) {
    this.page = page;
    this.commands = commands;
    this.devtools = new DevTools({ page });
  }

  async devToolsLoaded() {
    await this.devtools.isLoaded();
  }

  async projectDashboardLoaded() {
    await this.commands.heading("Dashboard");
  }

  async projectOverviewLoaded() {
    await this.commands.heading("Project overview");
  }

  async claimsLoaded() {
    await this.commands.heading("Claims");
  }

  async forecastsLoaded() {
    await this.commands.heading("Forecasts");
  }

  async financeSummaryLoaded() {
    await this.commands.heading("Finance summary");
  }

  async moReportLoaded() {
    await this.commands.heading("Monitoring reports");
  }

  async projectOnHoldLoaded() {
    await this.commands.heading("Project change request");
  }

  async projectDetailsLoaded() {
    await this.commands.heading("Project details");
  }

  async projectDocumentsLoaded() {
    await this.commands.heading("Project documents");
  }

  async claimsPageIsLoaded() {
    await this.commands.heading("Claims");
  }

  async navToPartnerDetails(name: string) {
    await this.page.getByRole("link").filter({ hasText: name }).click();
    await this.page.getByRole("link").filter({ hasText: "Edit" }).click();
  }

  async selectProjectTile() {
    await DashboardTile.fromTitle(this.page, "Projects").click();
  }
}

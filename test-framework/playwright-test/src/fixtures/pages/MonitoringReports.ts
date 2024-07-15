import { Page, expect } from "@playwright/test";
import { Fixture, Then } from "playwright-bdd/decorators";
import { PageHeading } from "../../components/PageHeading";

export
@Fixture("monitoringReports")
class MonitoringReports {
  protected readonly page: Page;

  private readonly pageTitle: PageHeading;

  constructor({ page }: { page: Page }) {
    this.page = page;
    this.pageTitle = PageHeading.fromTitle(page, "Monitoring reports");
  }

  @Then("the user sees the Monitoring Reports page")
  async isPage() {
    await expect(this.pageTitle.get()).toBeVisible();
  }
}

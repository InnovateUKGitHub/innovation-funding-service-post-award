import { Page, expect } from "@playwright/test";
import { Fixture, Then, When } from "playwright-bdd/decorators";
import { DashboardTile } from "../../components/DashboardTile";
import { PageHeading } from "../../components/PageHeading";

export
@Fixture("developerHomepage")
class DeveloperHomepage {
  protected readonly page: Page;
  private readonly pageTitle: PageHeading;
  private readonly projectsTile: DashboardTile;
  private readonly contentSolutionTile: DashboardTile;

  constructor({ page }: { page: Page }) {
    this.page = page;
    this.pageTitle = PageHeading.fromTitle(this.page, "Home");
    this.projectsTile = DashboardTile.fromTitle(this.page, "Projects");
    this.contentSolutionTile = DashboardTile.fromTitle(this.page, "Content solution");
  }

  @When("the user selects the projects tile")
  async selectProjectTile() {
    await this.projectsTile.click();
  }

  @When("the user selects the content solution tile")
  async selectContentSolutionTile() {
    await this.contentSolutionTile.click();
  }

  @Then("the user sees the developer homepage")
  async isPage() {
    await expect(this.pageTitle.get()).toBeVisible();
  }
}
